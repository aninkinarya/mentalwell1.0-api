const { userProfile } = require('../../services/patients/profile');

const getPatientProfile = async (request, h) => {
    try {
        const userId = request.parmas.id;

        const profile = await userProfile(userId);

        return h.response({
            status: 'success',
            message: 'Berhasil mendapatkan profil pengguna',
            profile
        }).code(200);
    } catch (err) {
        console.error('❌ getUserProfile error:', err.message);
        const statusCode = err.statusCode || 500;
        return h.response({
            status: 'fail',
            message: err.message || 'Terjadi kesalahan server'
        }).code(statusCode);
    }
}

module.exports = {
    getPatientProfile
};