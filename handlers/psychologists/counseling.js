const { viewPsychologistCounselings, selectCounseling, changeCounselingStatus } = require('../../services/psychologists/counseling')
const { ClientError, ValidationError } = require('../../utils/errors')
const { updateCounselingStatusSchema } = require('../../utils/validation')

const getPatientsCounselings = async (request, h) => {
    try {
        const userId = request.auth.credentials.id

        console.log('🔍 getPatientsCounselings userId: ' + userId)

        const counselings = await viewPsychologistCounselings(userId)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar konseling',
            counselings
        }).code(200)
    } catch (err){
        console.log ('❌ viewPatientsCounselings error: ' + err.message)
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}

const getSelectedCounseling = async (request, h) => {
    try {
        const counselingId = request.params.id

        const counseling = await selectCounseling(counselingId)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar konseling',
            counseling
        }).code(200)
    } catch (err){
        console.log ('❌ selectCounseling error: ' + err.message)
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}

const updateCounselingStatus = async (request, h) => {
    try{

        const counselingId = request.params.id
        const { error } = updateCounselingStatusSchema.validate(request.payload)

        if(error){
            throw new ValidationError('Status yang diunggah tidak sesuai, status hanya bisa berupa \'finished\'')
        }

        const updatedStatus = request.payload.status
        const counseling = await changeCounselingStatus(counselingId, updatedStatus)

        return h.response({
            status: 'success',
            message: 'Berhasil mengubah status menjadi \'finished\'',
            counseling
        }).code(200)

    } catch (err) {
        console.log ('❌ changeCounselingStatus error: ' + err.message)
        const statusCode = err.statusCode || 501;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}

module.exports = { getPatientsCounselings, getSelectedCounseling, updateCounselingStatus }