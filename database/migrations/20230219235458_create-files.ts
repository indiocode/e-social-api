import { randomUUID } from 'crypto';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('files', (table) => {
		table.uuid('id').primary().defaultTo(randomUUID());
		table.string('name').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('files');
}
