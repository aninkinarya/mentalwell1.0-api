const { sendMessage } = require('./wa');

const sendWhatsAppCounselingNotification = async (to, psychologistName, patientName, scheduleDate, scheduleTime) => {
  const message = 
    `Hai, ${psychologistName}! 👋\n` +
    `Kamu mendapatkan sesi konseling baru!\n\n` +
    `👤 Pasien: ${patientName}\n📅 Tanggal: ${scheduleDate}\n⏰ Waktu: ${scheduleTime}\n\n` +
    `Jangan lupa siapkan dirimu dengan semangat! 🌟`;

  await sendMessage(to, message);
};

const sendWhatsappRealtimeConseling = async (to, psychologistName, patientName) => {
  const message = 
    `Halo ${psychologistName}! 👋\n` +
    `Ada pasien yang sedang menunggu sesi *konseling real-time* bersama Anda!\n\n` +
    `👤 Pasien: ${patientName}\n⏳ Durasi: ±1 jam\n\n` +
    `Silakan segera masuk ke aplikasi untuk memulai sesi percakapan bersama pasienmu.\n\n` +
    `💡 Semangat ya! Semoga sesi ini berjalan hangat dan membawa dampak positif. 🌿✨`;

  await sendMessage(to, message);
};

module.exports = {
  sendWhatsAppCounselingNotification,
  sendWhatsappRealtimeConseling
};
