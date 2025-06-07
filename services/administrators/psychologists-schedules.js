const { supabase } = require('../../config/database');
const { ValidationError } = require('../../utils/errors');

const addPsychologistWeeklyAvailability = async (psychologistId, day, time) => {
    const { data: existing, error: existingError } = await supabase
        .from('psychologist_weekly_availabilities')
        .select('id')
        .eq('psychologist_id', psychologistId)
        .eq('day', day)
        .lte('start_time', time.end)
        .gt('end_time', time.start)
        .maybeSingle();

    if (existingError) {
        throw new Error('Gagal memeriksa jadwal yang bentrok: ' + existingError.message);
    }

    if (existing) {
        throw new ValidationError('Sudah ada jadwal yang bentrok pada hari dan jam ini.');
    }

    const { data, error } = await supabase
        .from('psychologist_weekly_availabilities')
        .insert({
            psychologist_id: psychologistId,
            day: day,
            start_time: time.start,
            end_time: time.end
        })
        .select('*')
        .single();

    if (error) {
        throw new Error('Gagal menambahkan jadwal mingguan: ' + error.message);
    }

    return data;
};

const addPsychologistSchedule = async (psychologistId, date, time) => {
    const { data: existing } = await supabase
        .from('psychologist_schedules')
        .select('id')
        .eq('psychologist_id', psychologistId)
        .eq('date', date)
        .lte('start_time', time.end)
        .gt('end_time', time.start)
        .maybeSingle();

    if (existing) {
        throw new ValidationError('Sudah ada jadwal yang bentrok pada tanggal dan jam ini.');
    }

    const { data, error } = await supabase
        .from('psychologist_schedules')
        .insert({
            psychologist_id: psychologistId,
            date: date,
            start_time: time.start,
            end_time: time.end
        })
        .select('*')
        .single();

    if (error) {
        throw new Error('Gagal menambahkan jadwal psikolog (per tanggal): ' + error.message);
    }

    return data;
};
const editPsychologistSchedule = async (scheduleId, updatedFields) => {
    if (!scheduleId || typeof scheduleId !== 'string') {
        throw new Error('ID tidak valid: harus berupa string yang diawali dengan A atau B');
    }

    if (updatedFields.time) {
        const [start_time, end_time] = updatedFields.time.split('-').map(t => t.trim());
        updatedFields.start_time = start_time;
        updatedFields.end_time = end_time;
        delete updatedFields.time;
    }

    const tableName = scheduleId.startsWith('A')
        ? 'psychologist_schedules'
        : scheduleId.startsWith('B')
        ? 'psychologist_weekly_availabilities'
        : null;

    if (!tableName) {
        throw new Error('ID tidak valid: harus diawali dengan A atau B');
    }

    const cleanFields = Object.fromEntries(
        Object.entries(updatedFields).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(cleanFields).length === 0) {
        throw new ValidationError('Tidak ada field yang diubah');
    }

    const { data, error } = await supabase
        .from(tableName)
        .update(cleanFields)
        .eq('id', scheduleId)
        .select('*')
        .single();

    if (error) {
        throw new Error(`Gagal mengupdate: ${error.message}`);
    }

    return data;
};
  




const deletePsychologistSchedule = async (scheduleId) => {
    const tableName = scheduleId.startsWith('A')
        ? 'psychologist_schedules'
        : scheduleId.startsWith('B')
        ? 'psychologist_weekly_availabilities'
        : null;

    if (!tableName) {
      throw new Error('ID tidak valid: harus diawali dengan A atau B');
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', scheduleId);
  
    if (error) {
      throw new Error('Gagal menghapus jadwal: ' + error.message);
    }
  
    return { message: 'Jadwal berhasil dihapus' };
  };
  
  module.exports = {
    addPsychologistWeeklyAvailability,
    addPsychologistSchedule,
    editPsychologistSchedule,
    deletePsychologistSchedule
  };