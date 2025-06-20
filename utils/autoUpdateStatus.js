const dayjs = require('dayjs');
const { supabase } = require('../config/database.js');
const utc = require('dayjs/plugin/utc.js');
const timezone = require('dayjs/plugin/timezone.js');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter.js');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(timezone);

const updateCounselingStatuses = async () => {
  const now = dayjs().utc().tz('Asia/Jakarta');
  console.log('🔄 Checking counseling statuses at', now.format('YYYY-MM-DD HH:mm:ss'));

  const { data: counselings, error } = await supabase
    .from('counselings')
    .select('id, schedule_date, start_time, end_time, status, payment_status, patient_id, psychologist_id');

  if (error) {
    console.error('❌ Gagal mengambil data konseling:', error.message);
    return;
  }

  for (const counseling of counselings) {
    const {
      id,
      schedule_date,
      start_time,
      end_time,
      status,
      payment_status,
      patient_id,
      psychologist_id,
      access_type
    } = counseling;

    if (!schedule_date || !start_time) {
      console.warn(`⚠️ Counseling ID ${id} tidak punya jadwal lengkap, dilewati.`);
      continue;
    }

    const start = dayjs.tz(`${schedule_date}T${start_time}`, 'Asia/Jakarta');
    const end = end_time ? dayjs.tz(`${schedule_date}T${end_time}`, 'Asia/Jakarta') : null;

    if (!start.isValid() || (end_time && !end.isValid())) {
      console.warn(`⚠️ Counseling ID ${id} punya waktu tidak valid, dilewati.`);
      continue;
    }

    console.log(`\n🔎 Counseling ID ${id}`);
    console.log(`Start: ${start.format('YYYY-MM-DD HH:mm:ss')}, End: ${end ? end.format('HH:mm:ss') : '-'}`);
    console.log(`Now: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
    console.log(`Status: ${status}, Payment: ${payment_status}`);

    //  1. Auto fail kalau belum approve dan udah lewat waktu 
    if (payment_status !== 'approved' && now.isAfter(start) && access_type === 'scheduled') {
      const { error: failErr } = await supabase
        .from('counselings')
        .update({ status: 'failed' })
        .eq('id', id);

      if (failErr) {
        console.error('❌ Gagal set status failed:', failErr.message);
      } else {
        console.log(`❌ Counseling ID ${id} → status updated to 'failed'`);
      }
      continue;
    }

    if ((payment_status === 'waiting' || payment_status === 'approved') &&
      now.isAfter(start) &&
      access_type === 'on_demand'
    ) {
      const { error: failErr } = await supabase
        .from('counselings')
        .update({ status: 'failed' })
        .eq('id', id); 
      if (failErr) {
        console.error('❌ Gagal set status failed untuk on_demand:', failErr.message);
      } else {
        console.log(`❌ Counseling ID ${id} → status updated to 'failed' (on_demand)`);
      }
      continue;

    }
    
    //  2. Otomatis mulai (on_going) kalau waktunya sudah mulai dan sudah bayar 
    if (payment_status === 'approved' && status === 'waiting' && now.isSameOrAfter(start)) {
      const { error: startErr } = await supabase
        .from('counselings')
        .update({ status: 'on_going' })
        .eq('id', id);

      if (startErr) {
        console.error('❌ Gagal update ke on_going:', startErr.message);
      } else {
        console.log(`✅ Counseling ID ${id} → status updated to 'on_going'`);
      }

      // Buat conversation kalau belum ada
      const { data: convExist, error: convCheckErr } = await supabase
        .from('conversations')
        .select('id')
        .eq('patient_id', patient_id)
        .eq('psychologist_id', psychologist_id)
        .eq('status', 'active')
        .maybeSingle();

      if (convCheckErr && convCheckErr.code !== 'PGRST116') {
        console.error('❌ Gagal cek conversation:', convCheckErr.message);
        continue;
      }

      if (!convExist) {
        const { data: convId, error: convInsertErr } = await supabase
          .from('conversations')
          .insert({
            patient_id,
            psychologist_id,
            status: 'active',
          })
          .select('id')
          .single();

          await supabase
          .from('counselings')
          .update({ conversation_id: convId.id })
          .eq('id', id);

        if (convInsertErr) {
          console.error('❌ Gagal buat conversation:', convInsertErr.message);
        } else {
          console.log(`💬 Conversation dibuat untuk counseling ID ${id}`);
        }
      } else {
        console.log(`ℹ️ Conversation aktif sudah ada`);
      }
    }

    //  3. Sesi selesai → update jadi finished + akhiri conversation
    if (status === 'on_going' && end && now.isSameOrAfter(end)) {
      const { data: convId, error: finishErr } = await supabase
        .from('counselings')
        .update({ status: 'finished' })
        .eq('id', id)
        .select('conversation_id');

      if (finishErr) {
        console.error('❌ Gagal update ke finished:', finishErr.message);
      } else {
        console.log(`✅ Counseling ID ${id} → status updated to 'finished'`);

        const { error: endConvErr } = await supabase
          .from('conversations')
          .update({ status: 'closed' })
          .eq('id', convId.conversation_id)
          .eq('status', 'active');

        if (endConvErr) {
          console.error('❌ Gagal update conversation jadi ended:', endConvErr.message);
        } else {
          console.log(`💬 Conversation counseling ID ${id} diakhiri.`);
        }
      }
    }
  }
};

const startAutoUpdateCounselings = () => {
  updateCounselingStatuses();
  setInterval(updateCounselingStatuses, 60 * 1000); // tiap 1 menit
};

module.exports = { startAutoUpdateCounselings };
