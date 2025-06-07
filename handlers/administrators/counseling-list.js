const { viewAllUsersCounselings, viewCounselingsById } = require('../../services/administrators/counseling-list')

const getAllUsersCounselings = async (request, h) => {
    try {

        const counselings = await viewAllUsersCounselings()

        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar konseling',
            counselings
        }).code(200)
    } catch(err) {
        console.log ('viewAllUsersCounselings error ' + err.message)
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan server'
        }).code(500)
    }
}

const getAPsychologistCounselings = async (request, h) => {
    try {
        const psychologistId = request.params.id
        const type = "psychologist"

        const counselings = await viewCounselingsById(psychologistId, type)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar konseling psikolog',
            counselings
        }).code(200)
    } catch(err) {
        console.log ('viewAllUsersCounselings error ' + err.message)
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan server'
        }).code(500)
    }
}

const getAPatientCounselings = async (request, h) => {
    try {
        const patientId = request.params.id
        const type = "patient"

        const counselings = await viewCounselingsById(patientId, type)

        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar konseling pasien',
            counselings
        }).code(200)
    } catch(err) {
        console.log ('viewAllUsersCounselings error ' + err.message)
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan server'
        }).code(500)
    }
}   

module.exports = { getAllUsersCounselings, getAPsychologistCounselings, getAPatientCounselings }