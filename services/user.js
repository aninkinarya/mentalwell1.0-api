const { supabase } = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { ConflictError, ValidationError } = require('../utils/errors')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { sendPasswordResetEmail } = require('../utils/emails/resetPassword')


const register = async ({ email, password, phone_number, role }) => {
    const cleanPayload = {
        email,
        phone_number,
        password,
        role
    };

    console.log("👉 Incoming role:", cleanPayload.role);

    // cek existing user
    const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${email},phone_number.eq.${phone_number}`);

    if (userCheckError){
        throw new Error(userCheckError.message)
    };

    if (existingUser && existingUser.length > 0) {
        throw new ConflictError("Email atau nomor telepon sudah terdaftar.");
    }

    // buat objek
    const userRole = ['admin', 'psychologist'].includes(role) ? role : 'patient';
    const hashed = await hashPassword(password);
    

    const newUser = {
        email: cleanPayload.email,
        phone_number: cleanPayload.phone_number,
        password: hashed,
        role: userRole,
    };

    console.log("Register handler called");
    console.log("New user payload:", newUser);

    // insert ke tabel users
    const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([newUser])
        .select('id, name, email, phone_number, role, profile_image, created_at')
        .single();

    if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(insertError.message);
    }

    const userId = insertedUser.id;
    const userCreated = insertedUser.created_at;

    // insert ke tabel pasien or psikolog
    let roleTable = null;

    if (userRole === 'psychologist'){
        roleTable = 'psychologists';
    } else if (userRole === 'admin'){
        roleTable = 'administrators';
    }else {
        roleTable = 'patients';
    }

    const { error: roleTableError } = await supabase
        .from(roleTable)
        .insert([{ user_id: userId, created_at: userCreated }])
        .select();

    if (roleTableError) throw new Error(roleTableError.message);

    // buat token
    const token = generateToken({ id: userId, role: userRole });

    return {
        userId,
        name: insertedUser.name,
        email: insertedUser.email,
        phone_number: insertedUser.phone_number,
        role: insertedUser.role,
        profile_image: insertedUser.profile_image,
        created_at: insertedUser.created_at,
        token
    };
};


const login = async ({ email, password }) => {
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, password, role, name')
        .eq('email', email)
        .single();


    if (userError) {
        if (userError.message.includes('multiple (or no) rows returned')) {
            throw new ValidationError('Email atau password salah')
        }
        throw new Error('Gagal login: ' + (userError.message || 'Unknown error'));
    }

    if (!userData) {
        throw new ValidationError("Email atau password salah");
    }


    const validPassword = await verifyPassword(password, userData.password);
    if (!validPassword) throw new ValidationError("Email atau password salah");

    const token = generateToken({ id: userData.id, role: userData.role, name: userData.name });

    return { token, id: userData.id, role: userData.role, name: userData.name};
};

const currentUser = async (userId) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname, profile_image')
      .eq('id', userId)
      .single();
      
    if (error) {
        throw new Error(error.message)
    }
    
    if (!user) {
        throw new ValidationError('User tidak ditemukan')
    }

  return user;
};

dayjs.extend(utc);
dayjs.extend(timezone);

const requestPasswordReset = async (email) => {
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (userError) {
        throw new ValidationError('Email tidak ditemukan');
    }

    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const { error: insertError } = await supabase
        .from('password_reset_tokens')
        .insert([{ user_id: user.id, token}]);

    if (insertError) {
        throw new Error('Gagal membuat token reset password: ' + insertError.message);
    }

    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

    console.log(`Password reset link for ${email}: ${resetLink}`);

    await sendPasswordResetEmail(email, resetLink);


};

const resetPassword = async (token, newPassword) => {
    const { data: resetToken, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('user_id, expires_at')
        .eq('token', token)
        .single();

    if (tokenError || !resetToken) {
        throw new ValidationError('Token tidak valid atau sudah kadaluarsa');
    }

    const currentTime = dayjs().tz('Asia/Jakarta');
    const tokenExpiryTime = dayjs(resetToken.expires_at).tz('Asia/Jakarta');

    if (currentTime.isAfter(tokenExpiryTime)) {
        throw new ValidationError('Token sudah kadaluarsa');
    }

    const hashedPassword = await hashPassword(newPassword);

    const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', resetToken.user_id);

    if (updateError) {
        throw new Error('Gagal mengubah password: ' + updateError.message);
    }

    // Delete the used token
    await supabase
        .from('password_reset_tokens')
        .delete()
        .eq('token', token);
};

module.exports = { register, login, currentUser, requestPasswordReset, resetPassword };
