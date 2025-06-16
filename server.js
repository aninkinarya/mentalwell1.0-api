const Hapi = require('@hapi/hapi');
const routes = require('./routes/index')
const { startAutoUpdateCounselings } = require('./utils/autoUpdateStatus')

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['https://mentalwell-10-frontend.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      },
    },
  });

  server.route(routes);

  await server.start();
  startAutoUpdateCounselings();
  console.log(`Server berjalan pada ${server.info.uri}`);

};

 
init();