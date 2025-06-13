const { editPsychologistProfile, psychologistProfile, changeAvailability } = require('../../services/psychologists/profile');
const { editPsychologistProfileSchema, changeAvailabilitySchema } = require('../../utils/validation');

const getPsychologistProfile = async (request, h) => {
  try {

      const psychologistId = request.auth.credentials.id;
      console.log('🔍 psychologistId:', psychologistId);
      const result = await psychologistProfile(psychologistId);
      return h.response({
          status: "success",
          data: result
      }).code(200);
  } catch (err) {
      return h.response({
          status: "fail",
          message: err.message
      }).code(404);
  }
};

const updatePsychologist = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const payload = { ...request.payload };

    console.log('📦 raw payload:', request.payload);
    console.log('📷 file preview:', request.payload.profile_image);

    const file = payload.profile_image?._data ? payload.profile_image : null;

    const topics = Array.isArray(payload.topics) ? 
    payload.topics.map(Number).filter(item => !isNaN(item) && item > 0) : 
    [];

    const data = {
      name: payload.name,
      nickname: payload.nickname,
      email: payload.email,
      phone_number: payload.phone_number,
      birthdate: payload.birthdate,
      gender: payload.gender,
      bio: payload.bio,
      experience: payload.experience,
      topics,
    };

    const { error } = editPsychologistProfileSchema.validate(data);
    if (error) {
      return h.response({
        status: 'fail',
        message: error.details[0].message
      }).code(400);
    }

    const updatedProfile = await editPsychologistProfile(userId, data, file);

    return h.response({
      status: 'success',
      message: 'Profil psikolog berhasil diperbarui',
      data: updatedProfile
    }).code(200);
  } catch (err) {
    console.error('❌ updatePsychologist error:', err);
    return h.response({ 
      status: 'fail',
      message: 'Gagal update profil psikolog'
    }).code(500);
  }
};

const updateAvailability = async (request, h) => {
  try{
    const userId = request.auth.credentials.id;
    const { availability } = request.payload;

    const { error } = changeAvailabilitySchema.validate({ availability });
    if (error) {
      return h.response({
      status: 'fail',
      message: error.details[0].message
      }).code(400);
    }

    console.log('🔄 Updating availability for user:', userId, 'to', availability);

    const data = await changeAvailability(userId, availability);

    return h.response({
      status: 'success',
      message: 'Ketersediaan berhasil diperbarui',
      data
    }).code(200);

  } catch (err){
    console.error('❌ Error:', err.message);
    const statusCode = err.statusCode || 500;
    return h.response({
      status: 'fail',
      message: err.message
    }).code(statusCode);
  }
}

module.exports = { updatePsychologist, getPsychologistProfile, updateAvailability };
