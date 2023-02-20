import { randomUUID } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '~/database';
import { checkSessionIdExists } from '~/middlewares/check-session-id-exists';

export async function filesRoutes(app: FastifyInstance): Promise<void> {
	// app.addHook('preHandler', async (request, reply) => {
	// 	console.log(`[${request.method}] ${request.url}`);
	// });

	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request) => {
			const { sessionId } = request.cookies;

			const files = await knex('files').where('session_id', sessionId).select();

			return { files };
		},
	);

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request) => {
			const getFilesParamsSchema = z.object({
				id: z.string().uuid(),
			});

			const { id } = getFilesParamsSchema.parse(request.params);

			const { sessionId } = request.cookies;

			const files = await knex('files')
				.where({
					id,
					session_id: sessionId,
				})
				.first();

			return { files };
		},
	);

	app.post('/', async (request, reply) => {
		// const createUserBodySchema = z.object({
		// 	name: z.string(),
		// });

		// const { name } = createUserBodySchema.parse(request.body);

		let { sessionId } = request.cookies;

		if (!sessionId) {
			sessionId = randomUUID();

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			});
		}

		const { name, doctor, employment, exams } = request.body;

		const [file] = await knex('files').insert(
			{
				id: randomUUID(),
				name,
				session_id: sessionId,
			},
			['id'],
		);

		await knex('doctors').insert({
			id: randomUUID(),
			cpf: doctor.cpf,
			crm: doctor.crm,
			name: doctor.name,
			uf: doctor.uf,
			file_id: file.id,
		});

		await knex('employments').insert({
			id: randomUUID(),
			cpf: employment.cpf,
			enrollment: employment.enrollment,
			file_id: file.id,
		});

		await knex('exams').insert(
			exams.map((exam) => {
				return {
					...exam,
					id: randomUUID(),
					file_id: file.id,
				};
			}),
		);

		return reply.status(201).send();
	});
}
