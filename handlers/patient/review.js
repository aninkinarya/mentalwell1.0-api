const { addReview } = require('../../services/patients/review');
const { ClientError } = require('../../utils/errors');

const postReview = async (request, h) => {
    try {
        const counselingId = request.params.id;
        const { review } = request.payload;

        if (!review) {
            throw new ClientError('Ulasan tidak boleh kosong');
        }

        const newReview = await addReview(counselingId, review);

        return h.response({
            status: 'success',
            message: 'Ulasan berhasil ditambahkan',
            newReview
        }).code(201);
    } catch (err) {
        console.error('❌ postReview error:', err.message);
        const statusCode = err.statusCode || 500;
        return h.response({
            status: 'fail',
            message: err.message || 'Terjadi kesalahan server'
        }).code(statusCode);
    }
}

module.exports = {
    postReview
};