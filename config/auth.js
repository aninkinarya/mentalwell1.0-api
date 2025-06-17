const { verifyToken } = require('../utils/jwt')

// untuk autentikasi dan beri response (ke fitur yang harus login)
const requireAuth = (request, h) => {
  if (request.method === 'options') {
    return h.response().code(200).takeover(); // biarkan lolos
  }
  
  const origin = request.headers.origin || '*'; // fallback ke * kalau ga ada origin
  const authHeader = request.headers.authorization;

  if (!authHeader) {
      return h.response({
          status: "fail",
          code: 401,
          message: "Anda harus login untuk mengakses halaman ini."
      })
      .header('Access-Control-Allow-Origin', origin)
      .header('Access-Control-Allow-Credentials', 'true')
      .type('application/json')
      .code(401)
      .takeover();
  }

  const token = authHeader.split(' ')[1]; 
  const user = verifyToken(token);

  if (!user) {
      return h.response({
          status: "fail",
          code: 401,
          message: "Sesi Anda telah habis atau token tidak valid. Silakan login ulang."
      })
      .header('Access-Control-Allow-Origin', origin)
      .header('Access-Control-Allow-Credentials', 'true')
      .type('application/json')
      .code(401)
      .takeover();
  }

  request.auth = { credentials: user };
  return h.continue;
};

// untuk biar indo
const roleLabels = {
    patient: 'pasien',
    psychologist: 'psikolog',
    admin: 'admin',
  };

// otorisasi
const authorizeRole = (allowedRoles) => {
  return (request, h) => {
    const user = request.auth.credentials;

    if (!allowedRoles.includes(user.role)) {
      const readableRoles = allowedRoles.map(role => roleLabels[role] || role).join(' atau ');

      return h.response({
        status: 'fail',
        code: 403,
        message: `Akses ditolak, hanya ${readableRoles} yang bisa mengakses halaman ini.`,
      }).type('application/json').code(403).takeover();
    }

    return h.continue;
  };
};


module.exports = { requireAuth, authorizeRole };
