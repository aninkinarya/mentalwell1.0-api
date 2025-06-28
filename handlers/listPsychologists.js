const { allPsychologists, listDetailedPsychologits, searchPsychologists, selectPsychologist } = require('../services/listPsychologists');

const getPsychologists = async (request, h) => {
    try {
        const data = await allPsychologists();
        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar psikolog',
            data
        }).code(200);
    } catch (err) {
        console.error('❌ getPsychologists error:', err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server.'
        }).code(500);
    }
};

const getDetailedPsychologists = async (request, h) => {
    try {
        const data = await listDetailedPsychologits();
        return h.response({
            status: 'success',
            message: 'Berhasil memuat daftar psikolog',
            data
        }).code(200);
    } catch (err) {
        console.error('❌ getDetailedPsychologists error:', err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server.'
        }).code(500);
    }
};

const getSearchedPsychologists = async (request, h) => {
    try {
        const { name, topics } = request.query;

        const topicArray = Array.isArray(topics)
            ? topics.map(Number)
            : topics
            ? [Number(topics)]
            : [];

        const result = await searchPsychologists({ name, topics: topicArray });

        return h.response({
            status: 'success',
            message: 'Berhasil memuat hasil pencarian',
            result
        }).code(200);
    } catch (err) {
        console.error('❌ getSearchedPsychologists error:', err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan saat mencari psikolog.'
        }).code(500);
    }
};

const getSelectedPsychologist = async (request, h) => {
    try {
        const { id } = request.params;
        const data = await selectPsychologist(id);
        return h.response(data).code(200);
    } catch (err) {
        console.error('❌ getSelectedPsychologist error:', err);
        return h.response({
            status: 'fail',
            message: 'Psikolog tidak ditemukan.'
        }).code(404);
    }
};

module.exports = { getPsychologists, getDetailedPsychologists, getSearchedPsychologists, getSelectedPsychologist };
