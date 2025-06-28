const { registerUser, loginUser, getCurrentUser, postRequestPasswordReset, postResetPassword } = require('../../handlers/userHandler');

const { requireAuth } = require('../../config/auth');
  
const authRoutes = [
    { // tested
      // register for patient n admin
      method: 'POST',
      path: '/register',
      handler: registerUser,
    },

    {
      method: 'POST',
      path: '/login',
      handler: loginUser,
    },
    

    { // tested
      method: 'POST',
      path: '/forgot-password',
      handler: postRequestPasswordReset
    },

    {
      method: 'POST',
      path: '/reset-password',
      handler: postResetPassword
    },
    

    {
      method: 'GET',
      path: '/me',
      options: {
        pre: [{ method: requireAuth }],
      },
      handler: getCurrentUser,
    },
    
  ];
  
  module.exports = authRoutes;
  