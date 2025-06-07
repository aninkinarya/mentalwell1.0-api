const { autoFill, createCounseling, chatNowCounseling, bookScheduleCounseling, viewCounselings, selectCounseling } = require('../../services/patients/counseling')
const { ClientError } = require('../../utils/errors')

const getAutoFill = async (request, h) => {
    try {
      const userId = request.auth.credentials.id;

      const result = await autoFill(userId);
  
      return h.response({
        status: 'success',
        result
      }).code(200);
    } catch (err) {
      console.error('❌ getAutoFill error:', err);
      return h.response({
        status: 'fail',
        message: 'Terjadi kesalahan pada server.'
      }).code(500);
    }
  };
  

const postCounseling = async (request, h) => {

    try {
        const userId = request.auth.credentials.id;
        const psychologistId = request.params.id;
        const payload = { ...request.payload};

        const paymentFile = payload.payment_proof?._data ? payload.payment_proof : null;

        const counselingData = {
            schedule_date: payload.date,
            schedule_time: payload.time,
            occupation: payload.occupation,
            problem_description: payload.problem_description,
            hope_after: payload.hope_after,
        };

        const newCounseling = await createCounseling(userId, psychologistId, counselingData, paymentFile);

        return h.response({
            status: 'success',
            message: 'Counseling berhasil dibuat, menunggu konfirmasi pembayaran',
            newCounseling,
          }).code(201);

    } catch(err) {
        console.error('❌ postCounseling error: ' + err.message);
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
          status: 'fail',
          message
        }).code(statusCode);
    }

}

const getAllCounselings = async (request, h) => {
    try {
        const userId = request.auth.credentials.id

        const counselings = await viewCounselings(userId)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar konseling',
            counselings
        }).code(200)
    } catch (err){
        console.log ('❌ getAllCounselings error: ' + err.message)
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}

const postChatNowCounseling = async (request, h) => {
    try {
        const userId = request.auth.credentials.id
        const psychologistId = request.params.id;
        const payload = { ...request.payload};

        const paymentFile = payload.payment_proof?._data ? payload.payment_proof : null;

        const counselingData = {
            occupation: payload.occupation,
            problem_description: payload.problem_description,
            hope_after: payload.hope_after,
        };

        const newCounseling = await chatNowCounseling(userId, psychologistId, counselingData, paymentFile);

        return h.response({
            status: 'success',
            message: 'Counseling berhasil dibuat, menunggu konfirmasi pembayaran',
            newCounseling,
          }).code(201);

    } catch(err) {
        console.error('❌ postChatNowCounseling error: ' + err.message);
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
          status: 'fail',
          message
        }).code(statusCode);
    }
}

const postBookScheduleCounseling = async (request, h) => {
    try {
        const userId = request.auth.credentials.id;
        const psychologistId = request.params.id;
        const payload = { ...request.payload};

        const paymentFile = payload.payment_proof?._data ? payload.payment_proof : null;

        const counselingData = {
            schedule_date: payload.date,
            schedule_time: payload.time,
            occupation: payload.occupation,
            problem_description: payload.problem_description,
            hope_after: payload.hope_after,
        };

        const newCounseling = await bookScheduleCounseling(userId, psychologistId, counselingData, paymentFile);

        return h.response({
            status: 'success',
            message: 'Counseling berhasil dibuat, menunggu konfirmasi pembayaran',
            newCounseling,
          }).code(201);

    } catch(err) {
        console.error('❌ postBookScheduleCounseling error: ' + err.message);
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
          status: 'fail',
          message
        }).code(statusCode);
    }
}

const getSelectedCounseling = async (request, h) => {
    try {
        const counselingId = request.params.id
        const counseling = await selectCounseling(counselingId)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat detail konseling',
            counseling
        }).code(200)
    } catch(err){
        console.log('❌ selectCounseling error: ' + err.message)
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}

module.exports = { getAutoFill, postCounseling, postChatNowCounseling, postBookScheduleCounseling, getAllCounselings, getSelectedCounseling }