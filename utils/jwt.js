const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

// buat bikin token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role, name: user.name },  
        secretKey,                           
        { expiresIn: '4h' }                 
    );
};

// verifikasi token JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey); 
    } catch (error) {
        return null; 
    }
};

module.exports = { generateToken, verifyToken }