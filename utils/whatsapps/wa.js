const axios = require('axios');
require('dotenv').config();

const waClient = axios.create({
  baseURL: `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages`,
  headers: { 'Content-Type': 'application/json' }
});

const sendMessage = async (to, body) => {
  try {
    const response = await waClient.post('/chat', {
      token: process.env.ULTRAMSG_TOKEN,
      to,
      body
    });
    console.log('✅ WhatsApp terkirim ke:', to);
    console.log('📨 Response:', response.data);
  } catch (err) {
    console.error('❌ Gagal kirim WhatsApp:', err.response?.data || err.message);
  }
};

module.exports = { sendMessage };
