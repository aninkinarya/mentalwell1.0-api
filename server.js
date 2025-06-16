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
        credentials: true,
        additionalHeaders: ['authorization', 'content-type'],
        additionalExposedHeaders: ['authorization']
      },
    },
  });

  server.route({
    method: 'OPTIONS',
    path: '/{any*}',
    options: {
      cors: {
        origin: ['https://mentalwell-10-frontend.vercel.app'],
        credentials: true,
        additionalHeaders: ['authorization', 'content-type']
      }
    },
    handler: (request, h) => h.response().code(200)
  });

  server.route(routes);

  await server.start();
  startAutoUpdateCounselings();
  console.log(`Server berjalan pada ${server.info.uri}`);

};

 
init();