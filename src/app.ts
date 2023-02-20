import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastify from 'fastify';

import { filesRoutes } from './routes/files';

export const app = fastify();

app.register(cors, {});

// app.addHook('preHandler', async (request, reply) => {
// 	console.log(`[${request.method}] ${request.url}`);
// });

app.register(cookie);

app.register(filesRoutes, {
	prefix: 'files',
});

app.get('/', () => {
	return {
		message: 'Velcome to XML Multiples API',
	};
});
