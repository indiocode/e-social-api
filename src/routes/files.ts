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

			const users = await knex('users').where('session_id', sessionId).select();

			return { users };
		},
	);

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (request) => {
			const getUsersParamsSchema = z.object({
				id: z.string().uuid(),
			});

			const { id } = getUsersParamsSchema.parse(request.params);

			const { sessionId } = request.cookies;

			const user = await knex('users')
				.where({
					id,
					session_id: sessionId,
				})
				.first();

			return { user };
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
				// id: randomUUID(),
				name,
				session_id: sessionId,
			},
			['id'],
		);

		console.log('file: ', {
			// id: randomUUID(),
			name,
			session_id: sessionId,
		});

		await knex('doctors').insert({
			cpf: doctor.cpf,
			crm: doctor.crm,
			name: doctor.name,
			uf: doctor.uf,
			file_id: file.id,
		});

		console.log('doctor: ', {
			cpf: doctor.cpf,
			crm: doctor.crm,
			name: doctor.name,
			uf: doctor.uf,
			file_id: file.id,
		});

		await knex('employments').insert({
			cpf: employment.cpf,
			enrollment: employment.enrollment,
			file_id: file.id,
		});

		console.log('employment: ', {
			cpf: employment.cpf,
			enrollment: employment.enrollment,
			file_id: file.id,
		});

		await Promise.all(
			exams.map(async (exam) => {
				console.log('exam: ', {
					date: new Date(exam.date),
					description: exam.description,
					proceeding: exam.proceeding,
					file_id: file.id,
				});

				return await knex('exams').insert({
					id: randomUUID(),
					date: new Date(exam.date),
					description: exam.description,
					proceeding: exam.proceeding,
					file_id: file.id,
				});
			}),
		);

		return reply.status(201).send();
	});
}
