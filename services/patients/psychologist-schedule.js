const { supabase } = require('../../config/database')
const { NotFoundError } = require('../../utils/errors')

const psychologistSchedules = async (psychologistId) => {
    
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('psychologist_weekly_availabilities')
      .select('id, day, start_time, end_time')
      .eq('psychologist_id', psychologistId);
  
    if (weeklyError) {
      throw new Error('Gagal mengambil jadwal mingguan: ' + weeklyError.message);
    }
  
    const { data: dateData, error: dateError } = await supabase
      .from('psychologist_schedules')
      .select('id, date, start_time, end_time')
      .eq('psychologist_id', psychologistId);
  
    if (dateError) {
      throw new Error('Gagal mengambil jadwal tanggal tertentu: ' + dateError.message);
    }
  
    if ((!weeklyData || weeklyData.length === 0) && (!dateData || dateData.length === 0)) {
      throw new NotFoundError('Tidak ditemukan jadwal psikolog');
    }
  
    const mergedSchedules = [
      ...(weeklyData || []).map(item => ({
        id: item.id,
        day: item.day,
        start_time: item.start_time,
        end_time: item.end_time
      })),
      ...(dateData || []).map(item => ({
        id: item.id,
        date: item.date,
        start_time: item.start_time,
        end_time: item.end_time
      }))
    ];
  
    return mergedSchedules;
  };
  

const checkScheduleAvailability = async (psychologistId, date, time) => {
    
    const [startTime, endTime] = time.split('-').map(t => t.trim());
  
    const { data: conflict, error } = await supabase
      .from('booked_schedules')
      .select('id, start_time, end_time')
      .eq('psychologist_id', psychologistId)
      .eq('date', date)
      .lte('start_time', endTime)
      .gt('end_time', startTime)
      .maybeSingle();
  
    if (error) {
      throw new Error('Gagal mengecek jadwal: ' + error.message);
    }
  
    return {
      psychologist_id: psychologistId,
      date,
      requested_time: `${startTime} - ${endTime}`,
      is_available: !conflict,
      conflict_id: conflict?.id || null,
      conflict_range: conflict
        ? `${conflict.start_time.slice(0, 5)} - ${conflict.end_time.slice(0, 5)}`
        : null
    };
  };
  

module.exports = { psychologistSchedules, checkScheduleAvailability }
  