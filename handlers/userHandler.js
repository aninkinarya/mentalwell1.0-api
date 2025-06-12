const { register, login, currentUser, requestPasswordReset, resetPassword } = require('../services/user');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../utils/validation');
const { ClientError, ValidationError } = require('../utils/errors');

const registerUser = async (request, h) => {
  console.log('Register handler called');
  const { error } = registerSchema.validate(request.payload);

  if (error) {
    return h.response({
      status: "fail",
      message: error.details[0].message
    }).code(400);
  }

  try {
    const result = await register(request.payload);
    return h.response({
      status: "success",
      message: "Registrasi berhasil",
      data: result
    }).code(201);
  } catch (err) {
    console.error('❌ registerUser error:', err);
    const statusCode = err instanceof ClientError ? err.statusCode : 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server.';
    return h.response({
      status: "fail",
      message
    }).code(statusCode);
  }
};

const loginUser = async (request, h) => {
  const { error } = loginSchema.validate(request.payload);

  if (error) {
    return h.response({
      status: "fail",
      message: error.details[0].message
    }).code(400);
  }

  try {
    const result = await login(request.payload);
    return h.response({
      status: "success",
      message: "Login berhasil",
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      token: result.token
      
    }).code(200);
  } catch (err) {
    console.error('❌ loginUser error:', err);
    const statusCode = err instanceof ClientError ? err.statusCode : 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server.';
    return h.response({
      status: "fail",
      message
    }).code(statusCode);
  }
};

const getCurrentUser = async (request, h) => {
  try {
    const result = await currentUser(request.auth.credentials.id);
    return h.response({
      status: "success",
      data: result
    }).code(200);
  } catch (err) {
    console.error('❌ getCurrentUser error:', err);
    const statusCode = err instanceof ClientError ? err.statusCode : 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server.';
    return h.response({
      status: "fail",
      message
    }).code(statusCode);
  }
};

const postRequestPasswordReset = async (request, h) => {
  try {
    const { email } = request.payload;

    if (!email) {
      throw new ValidationError('Email harus diisi');
    }

    await requestPasswordReset(email);

    return h.response({
      status: 'success',
      message: 'Link reset password telah dikirim ke email Anda',
    }).code(200);
  } catch (err) {
    console.error('❌ requestPasswordReset error:', err.message);
    const statusCode = err.statusCode || 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server';
    return h.response({ status: 'fail', message }).code(statusCode);
  }
};

const postResetPassword = async (request, h) => {
  try {
    const token = request.query.token;
    const { new_password, confirm_password } = request.payload;

    const { error } = resetPasswordSchema.validate({ new_password, confirm_password });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    await resetPassword(token, new_password);

    return h.response({
      status: 'success',
      message: 'Password berhasil diperbarui. Silakan login dengan password baru Anda.'
    }).code(200);
  } catch (err) {
    console.error('❌ resetPassword error:', err.message);
    const statusCode = err.statusCode || 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server';
    return h.response({ status: 'fail', message }).code(statusCode);
  }
};

module.exports = { registerUser, loginUser, getCurrentUser, postRequestPasswordReset, postResetPassword };
