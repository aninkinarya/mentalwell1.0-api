const { allPsychologists, deleteAPsychologist } = require('../../services/administrators/psychologists-list');
const { ClientError } = require('../../utils/errors');

const getPsychologistList = async (request, h) => {
  try {
    const psychologists = await allPsychologists();

    return h.response({
      status: 'success',
      message: 'Berhasil mengambil data semua psikolog',
      data: psychologists
    }).code(200);

  } catch (err) {
    console.error('❌ getAllPsychologists error:', err.message);
    const statusCode = err.statusCode || 500;
    return h.response({
      status: 'fail',
      message: err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
    }).code(statusCode);
  }
};

const deletePsychologist = async (request, h) => {
  try {
    const psychologistId = request.params.id;
    const result = await deleteAPsychologist(psychologistId);

    return h.response({
      status: 'success',
      message: result.message
    }).code(200);
  } catch (err) {
    console.error('❌ deletePsychologist error:', err.message);
    const statusCode = err.statusCode || 500;
    return h.response({
      status: 'fail',
      message: err instanceof ClientError ? err.message : 'Terjadi kesalahan server'
    }).code(statusCode);
  }
}; 



module.exports = { getPsychologistList, deletePsychologist };
