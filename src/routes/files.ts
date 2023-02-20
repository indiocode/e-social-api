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
		const createUserBodySchema = z.object({
			name: z.string(),
			doctor: z.object({
				cpf: z.string(),
				crm: z.number(),
				name: z.string(),
				uf: z.string(),
			}),
			employment: z.object({
				cpf: z.string(),
				enrollment: z.string(),
			}),
			exams: z.array(
				z.object({
					date: z.string(), //date in database
					description: z.string(),
					proceeding: z.number(),
				}),
			),
		});

		const { name, doctor, employment, exams } = createUserBodySchema.parse(
			request.body,
		);

		let { sessionId } = request.cookies;

		if (!sessionId) {
			sessionId = randomUUID();

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			});
		}

		const [file] = await knex('files').insert(
			{
				id: randomUUID(),
				name,
				session_id: sessionId,
			},
			['id'],
		);

		await knex('doctors').insert({
			...doctor,
			id: randomUUID(),
			file_id: file.id,
		});

		await knex('employments').insert({
			...employment,
			id: randomUUID(),
			file_id: file.id,
		});

		await knex('exams').insert(
			exams.map((exam) => {
				return {
					...exam,
					date: new Date(exam.date),
					id: randomUUID(),
					file_id: file.id,
				};
			}),
		);

		return reply.status(201).send();
	});
}
