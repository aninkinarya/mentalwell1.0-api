const bcrypt = require('bcryptjs');

// Fungsi untuk hashing password
const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
};

// Fungsi untuk verifikasi password
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, verifyPassword };