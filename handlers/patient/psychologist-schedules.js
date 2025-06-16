const { psychologistSchedules, checkScheduleAvailability } = require('../../services/patients/psychologist-schedule');
const { ClientError, ValidationError } = require('../../utils/errors');

const getPsychologistSchedules = async (request, h) => {
    try{
        const psychologistId = request.params.id;

        const result = await psychologistSchedules(psychologistId);

        return h.response({
            status: 'success',
            message: 'Berhasil mendapatkan jadwal psikolog',
            result
        }).code(200);

    } catch (err) {
        console.error('❌ psychologistSchedule error:', err.message);
        const statusCode = err.statusCode || 500;
        return h.response({
            status: 'fail',
            message: err.message || 'Terjadi kesalahan server'
        }).code(statusCode);

    }
}


const getScheduleAvailability = async (request, h) => {
  try {
    const psychologistId = request.params.id;
    const { date, time } = request.query;

    console.log('Checking availability for psychologist:', psychologistId, 'on date:', date, 'at time:', time);


    if (!date || !time) {
      throw new ValidationError('Parameter `date` dan `time` harus disediakan');
    }

    const result = await checkScheduleAvailability(psychologistId, date, time);

    const response = {
      psychologist_id: result.psychologist_id,
      date: result.date,
      requested_time: time,
      is_available: result.is_available,
      conflict_id: result.conflict_id,
      conflict_range: result.conflict_range,
      note: result.is_available
        ? 'Jadwal tersedia. Anda dapat melakukan booking pada waktu ini.'
        : 'Jadwal tidak tersedia. Silakan pilih waktu lain yang belum dibooking.'
    };

    return h.response({
      status: 'success',
      message: 'Pengecekan ketersediaan jadwal berhasil',
      result: response
    }).code(200);
  } catch (err) {
    console.error('❌ checkScheduleAvailability error:', err.message);
    const statusCode = err.statusCode || 500;
    return h.response({
      status: 'fail',
      message: err.message || 'Terjadi kesalahan server'
    }).code(statusCode);
  }
};

module.exports = { getPsychologistSchedules, getScheduleAvailability };
