const axios = require('axios');
require('dotenv').config();

const sendWhatsAppCounselingNotification = async (toNumber, psychologistName, patientName, scheduleDate, scheduleTime) => {
    const message = 
        `Hai, ${psychologistName}! 👋\n` +
        `Kamu mendapatkan sesi konseling baru!\n\n` +
        `👤 Pasien: ${patientName}\n📅 Tanggal: ${scheduleDate}\n⏰ Waktu: ${scheduleTime}\n\n` +
        `Jangan lupa siapkan dirimu dengan semangat! 🌟`;

    const url = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`;
    
    try {
        const response = await axios.post(url, {
            token: process.env.ULTRAMSG_TOKEN,
            to: toNumber, // Format: 6281234567890 (tanpa '+')
            body: message
        });

        console.log('✅ WhatsApp berhasil dikirim ke:', toNumber);
        console.log('📨 Response:', response.data);
    } catch (err) {
        console.error('❌ Gagal kirim WhatsApp:', err.response?.data || err.message);
    }
};

const sendWhatsappRealtimeConseling = async (toNumber, psychologistName, patientName) => {
    const message = 
        `Halo ${psychologistName}! 👋\n` +
        `Ada pasien yang sedang menunggu sesi *konseling real-time* bersama Anda!\n\n` +
        `👤 Pasien: ${patientName}\n⏳ Durasi: ±1 jam\n\n` +
        `Silakan segera masuk ke aplikasi untuk memulai sesi percakapan bersama pasienmu.\n\n` +
        `💡 Semangat ya! Semoga sesi ini berjalan hangat dan membawa dampak positif. 🌿✨`;


    const url = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`;
    
    try {
        const response = await axios.post(url, {
            token: process.env.ULTRAMSG_TOKEN,
            to: toNumber, // Format: 6281234567890 (tanpa '+')
            body: message
        });

        console.log('✅ WhatsApp real-time berhasil dikirim ke:', toNumber);
        console.log('📨 Response:', response.data);
    } catch (err) {
        console.error('❌ Gagal kirim WhatsApp real-time:', err.response?.data || err.message);
    }
};

module.exports = { sendWhatsAppCounselingNotification, sendWhatsappRealtimeConseling };
