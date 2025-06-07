const { addPsychologistSchedule, addPsychologistWeeklyAvailability, editPsychologistSchedule, deletePsychologistSchedule} = require('../../services/administrators/psychologists-schedules');
const { ClientError } = require('../../utils/errors');
  
const createSchedule = async (request, h) => {
    try {
      const psychologistId = request.params.id;
      const { date, day, time } = request.payload;
  
      if (!time || !time.includes('-')) {
        throw new ValidationError('Format waktu harus "start_time - end_time".');
      }
      const [start_time, end_time] = time.split('-').map(t => t.trim());
  
      let result;
  
      if (date) {
        result = await addPsychologistSchedule(psychologistId, date, { start: start_time, end: end_time });
      } else if (day) {
        result = await addPsychologistWeeklyAvailability(psychologistId, day, { start: start_time, end: end_time });
      } else {
        throw new ValidationError('Harus menyertakan "date" atau "day" dalam permintaan.');
      }
  
      return h.response({
        status: 'success',
        message: 'Jadwal berhasil ditambahkan',
        result,
      }).code(201);
  
    } catch (err) {
      console.error('❌ createSchedule error:', err.message);
      const statusCode = err.statusCode || 500;
      const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server';
      return h.response({ status: 'fail', message }).code(statusCode);
    }
  };
  
  
  const updateSchedule = async (request, h) => {
    try {
      const scheduleId = request.params.id;
      const payload = request.payload;
  
      const result = await editPsychologistSchedule(scheduleId, payload);
  
      return h.response({
        status: 'success',
        message: 'Jadwal berhasil diperbarui',
        result,
      }).code(200);
    } catch (err) {
      console.error('❌ updateSchedule error:', err.message);
      const statusCode = err.statusCode || 500;
      const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server';
      return h.response({ status: 'fail', message }).code(statusCode);
    }
  };
  
  const removeSchedule = async (request, h) => {
    try {
      const scheduleId = request.params.id;
  
      const result = await deletePsychologistSchedule(scheduleId);
  
      return h.response({
        status: 'success',
        message: result.message,
      }).code(200);
    } catch (err) {
      console.error('❌ removeSchedule error:', err.message);
      const statusCode = err.statusCode || 500;
      const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server';
      return h.response({ status: 'fail', message }).code(statusCode);
    }
  };

  
  module.exports = {
    createSchedule,
    updateSchedule,
    removeSchedule
  };
  