const { selectCounseling, changePaymentStatus } = require('../../services/administrators/counseling')
const { ClientError, ValidationError } = require('../../utils/errors')
const { updatePaymentStatusSchema } = require('../../utils/validation')

const getSelectedCounseling = async (request, h) => {
    try{
        const counselingId = request.params.id
        const counseling = await selectCounseling(counselingId)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat detail konseling',
            counseling
        }).code(200)
    } catch ( err ){
        console.log('selectCounseling error: ' + err.message)
        const statusCode = err.statusCode || 500;
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}

const updatePaymentStatus = async (request, h) => {


    try{
        const counselingId = request.params.id
        const { error } = updatePaymentStatusSchema.validate(request.payload)
        if (error) {
            throw new ValidationError(error)
        }
        
        const { payment_status, note } = request.payload
        const counseling = await changePaymentStatus(counselingId, payment_status, note)

        return h.response({
            status: 'success',
            message: 'Berhasil memperbarui status pembayaran menjadi ' + counseling.payment_status,
            counseling
        }).code(201)
    } catch (err) {
        console.log('changePaymentStatus error: ' + err.message)
        const statusCode = err.statusCode || 500
        const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan sever'
        return h.response({
            status: 'fail',
            message
        }).code(statusCode)
    }
}
module.exports = { getSelectedCounseling, updatePaymentStatus }