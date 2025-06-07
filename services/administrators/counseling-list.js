const { supabase } = require('../../config/database')
const { NotFoundError, ConflictError } = require('../../utils/errors')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const viewAllUsersCounselings = async () => {
    const { data: counselings, error: counsError } = await supabase
      .from('counselings')
      .select(`*,
        psychologists(
          users(name, profile_image)
        ),
        patients(
          users(name, profile_image)
        )`);
  
    if (counsError) {
      throw new Error('Terjadi kesalahan: ' + counsError.message);
    }
  
    const allCounselings = counselings.map(counseling => {
      const start = counseling.start_time ? counseling.start_time.slice(0, 5) : null;
      const end = counseling.end_time ? counseling.end_time.slice(0, 5) : null;
      const scheduleTime = (start && end) ? `${start}-${end}` : '-';
  
      return {
        id: counseling.id,
        patient_id: counseling.patient_id,
        patient_name: counseling.patients?.users?.name || '-',
        patient_profpic: counseling.patients?.users?.profile_image || null,
        psychologist_id: counseling.psychologist_id,
        psychologist_name: counseling.psychologists?.users?.name || '-',
        psychologist_profpic: counseling.psychologists?.users?.profile_image || null,
        schedule_date: counseling.schedule_date || '-',
        start_time: counseling.start_time,
        end_time: counseling.end_time,
        schedule_time: scheduleTime,
        status: counseling.status,
        payment_status: counseling.payment_status,
        access_type: counseling.access_type,
        created_at: counseling.created_at
      };
    });
  
    // Skoring prioritas
    const getPriorityScore = (c) => {
      if (c.access_type === 'on_demand' && c.payment_status === 'waiting') return 0;
      if (c.access_type === 'scheduled' && c.payment_status === 'waiting') return 1;
      return 2;
    };
  
    allCounselings.sort((a, b) => {
      const scoreA = getPriorityScore(a);
      const scoreB = getPriorityScore(b);
      if (scoreA !== scoreB) return scoreA - scoreB;
  
      const aTime = a.schedule_date && a.start_time
        ? dayjs.tz(`${a.schedule_date}T${a.start_time}`, 'Asia/Jakarta')
        : dayjs.tz(a.created_at, 'Asia/Jakarta');
  
      const bTime = b.schedule_date && b.start_time
        ? dayjs.tz(`${b.schedule_date}T${b.start_time}`, 'Asia/Jakarta')
        : dayjs.tz(b.created_at, 'Asia/Jakarta');
  
      return aTime.valueOf() - bTime.valueOf();
    });
  
    return allCounselings;
  };


const viewCounselingsById = async (id, type) => {
    const column = type === 'psychologist' ? 'psychologist_id' : 'patient_id';
    const { data: counselings, error: counsError } = await supabase
    .from('counselings')
    .select(`*,
        psychologists(
          users(name, profile_image)
        ),
        patients(
          users(name, profile_image)
        )`)
    .eq(column, id);
  
    if (counsError) {
      throw new Error('Terjadi kesalahan: ' + counsError.message);
    }
  
    const allCounselings = counselings.map(counseling => {
      const start = counseling.start_time ? counseling.start_time.slice(0, 5) : null;
      const end = counseling.end_time ? counseling.end_time.slice(0, 5) : null;
      const scheduleTime = (start && end) ? `${start}-${end}` : '-';
  
      return {
        id: counseling.id,
        patient_id: counseling.patient_id,
        patient_name: counseling.patients?.users?.name || '-',
        patient_profpic: counseling.patients?.users?.profile_image || null,
        psychologist_id: counseling.psychologist_id,
        psychologist_name: counseling.psychologists?.users?.name || '-',
        psychologist_profpic: counseling.psychologists?.users?.profile_image || null,
        schedule_date: counseling.schedule_date || '-',
        start_time: counseling.start_time,
        end_time: counseling.end_time,
        schedule_time: scheduleTime,
        status: counseling.status,
        payment_status: counseling.payment_status,
        access_type: counseling.access_type,
        created_at: counseling.created_at
      };
    });
  
    // Skoring prioritas
    const getPriorityScore = (c) => {
      if (c.access_type === 'on_demand' && c.payment_status === 'waiting') return 0;
      if (c.access_type === 'scheduled' && c.payment_status === 'waiting') return 1;
      return 2;
    };
  
    allCounselings.sort((a, b) => {
      const scoreA = getPriorityScore(a);
      const scoreB = getPriorityScore(b);
      if (scoreA !== scoreB) return scoreA - scoreB;
  
      const aTime = a.schedule_date && a.start_time
        ? dayjs.tz(`${a.schedule_date}T${a.start_time}`, 'Asia/Jakarta')
        : dayjs.tz(a.created_at, 'Asia/Jakarta');
  
      const bTime = b.schedule_date && b.start_time
        ? dayjs.tz(`${b.schedule_date}T${b.start_time}`, 'Asia/Jakarta')
        : dayjs.tz(b.created_at, 'Asia/Jakarta');
  
      return aTime.valueOf() - bTime.valueOf();
    });
  
    return allCounselings;
  };
  

  module.exports = {
    viewAllUsersCounselings, viewCounselingsById
  };
  