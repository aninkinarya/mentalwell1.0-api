const { editProfile, userProfile } = require('../../services/patients/profile');
const { editProfileSchema } = require('../../utils/validation');

const updateProfile = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    console.log('📦 raw payload:', request.payload);
    const payload = { ...request.payload };

    const file = payload.profile_image?._data ? payload.profile_image : null;

    const allowedFields = ['nickname', 'name', 'email', 'phone_number', 'birthdate', 'gender'];
    const plainPayload = {};
    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        plainPayload[key] = payload[key];
      }
    }

    const { error } = editProfileSchema.validate(plainPayload);
    if (error) {
      return h.response({
        status: 'fail',
        message: error.details[0].message
      }).code(400);
    }

    const updatedProfile = await editProfile(userId, plainPayload, file);

    return h.response({
      status: 'success',
      message: 'Profil berhasil diperbarui',
      data: updatedProfile
    }).code(200);
  } catch (err) {
    console.error('❌ updateProfile error:', err);
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui profil.'
    }).code(500);
  }
};

const getUserProfile = async (request, h) => {
  try {
    const result = await userProfile(request.auth.credentials.id);
    return h.response({
      status: 'success',
      data: result
    }).code(200);
  } catch (err) {
    console.error('❌ getUserProfile error:', err);
    return h.response({
      status: 'fail',
      message: 'Profil pengguna tidak ditemukan.'
    }).code(404);
  }
};

module.exports = { updateProfile, getUserProfile };
