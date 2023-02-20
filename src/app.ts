import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { filesRoutes } from './routes/files';

export const app = fastify();

// app.addHook('preHandler', async (request, reply) => {
// 	console.log(`[${request.method}] ${request.url}`);
// });

app.register(cookie);

app.register(filesRoutes, {
	prefix: 'files',
});
