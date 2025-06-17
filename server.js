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
        headers: ['Accept', 'Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization']
      },
    },
  });

  server.route({
    method: 'OPTIONS',
    path: '/{any*}',
    handler: (request, h) => {
      return h.response().code(200)
        .header('Access-Control-Allow-Origin', 'https://mentalwell-10-frontend.vercel.app')
        .header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        .header('Access-Control-Allow-Credentials', 'true');
    }
  });
  
  server.ext('onPreAuth', (request, h) => {
    if (request.method === 'options') {
      return h.continue;
    }
    return h.continue;
  });

  server.route(routes);

  await server.start();
  startAutoUpdateCounselings();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
