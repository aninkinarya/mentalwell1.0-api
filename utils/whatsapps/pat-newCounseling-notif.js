const { sendMessage } = require('./wa');

const sendWhatsAppPatientConfirmedScheduled = async (toNumber, patientName, psychologistName, date, time) => {
    const message = 
      `✅ Hai ${patientName}!\n\n` +
      `Pembayaran kamu sudah *dikonfirmasi*! 🎉\n\n` +
      `📅 *Jadwal Konseling:*\n` +
      `🧠 Psikolog: ${psychologistName}\n` +
      `📆 Tanggal: ${date}\n` +
      `⏰ Waktu: ${time}\n\n` +
      `Jangan lupa hadir tepat waktu ya! Kalau ada kendala, kamu bisa hubungi kami via email: mentalwell.contact1@gmail.com\n\n` +
      `💙 Terima kasih sudah memilih MentalWell!`;
  
    await sendMessage(toNumber, message);
  };

const sendWhatsAppPatientConfirmedRealtime = async (toNumber, patientName, psychologistName) => {
    const message = 
      `🚀 Hai ${patientName}!\n\n` +
      `Pembayaran kamu sudah *dikonfirmasi* dan sesi konseling real-time siap dimulai! 🎉\n\n` +
      `🧠 Psikolog: ${psychologistName}\n\n` +
      `Silakan masuk ke aplikasi untuk memulai sesi percakapan. Kami harap sesi ini membawa kenyamanan dan semangat baru untuk kamu! 💙\n\n` +
      `Terima kasih sudah memilih MentalWell! 🌿`;
  
    await sendMessage(toNumber, message);
  };

  const sendWhatsAppPatientRejected = async (toNumber, patientName, reason) => {
    const message =
      `⚠️ Hai ${patientName},\n\n` +
      `Mohon maaf, pembayaran kamu *ditolak*.\n` +
      `📝 Alasan: ${reason}\n\n` +
      `Jika kamu merasa ini kesalahan atau sudah membayar, hubungi kami di email: mentalwell.contact1@gmail.com.\n\n` +
      `Kamu bisa menjadwalkan ulang sesi kapan saja.\n\n` +
      `💙 Terima kasih atas pengertiannya.`;
  
    await sendMessage(toNumber, message);
  };


  const sendWhatsAppPatientRefunded = async (toNumber, patientName) => {
    const message =
      `💸 Hai ${patientName}!\n\n` +
      `Pengembalian dana kamu untuk sesi konseling telah berhasil diproses. ✅\n` +
      `💰 Dana dikembalikan sesuai metode pembayaran.\n\n` +
      `Mohon maaf atas ketidaknyamanan ini. Kamu bisa menjadwalkan ulang sesi kapan saja ya 🙏\n\n` +
      `💙 Terima kasih atas kepercayaan kamu pada MentalWell.`;
  
    await sendMessage(toNumber, message);
  };
  

module.exports = {
  sendWhatsAppPatientConfirmedScheduled,
  sendWhatsAppPatientConfirmedRealtime,
  sendWhatsAppPatientRejected,
  sendWhatsAppPatientRefunded
};
  