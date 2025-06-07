const administratorsRoutes = require('./administratorsRoutes');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientsRoutes');
const psychologistRoutes = require('./psychologistsRoutes');
const articleRoutes = require('./articlesRoutes')

const routes = [
  ...authRoutes,
  ...articleRoutes,
  ...administratorsRoutes,
  ...patientRoutes,
  ...psychologistRoutes,
];

module.exports = routes;
