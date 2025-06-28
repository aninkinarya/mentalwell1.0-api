const administratorsRoutes = require('./administratorsRoutes');
const authRoutes = require('./public-routes/authRoutes');
const patientRoutes = require('./patientsRoutes');
const psychologistRoutes = require('./psychologistsRoutes');
const articleRoutes = require('./public-routes/articlesRoutes');
const psychologistsListRoutes = require('./public-routes/psychologistsListRoutes');

const routes = [
  ...authRoutes,
  ...articleRoutes,
  ...psychologistsListRoutes,
  ...administratorsRoutes,
  ...patientRoutes,
  ...psychologistRoutes,
];

module.exports = routes;
