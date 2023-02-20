import { randomUUID } from 'crypto';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('employments', (table) => {
		table.uuid('id').primary().defaultTo(randomUUID());
		table.string('cpf').notNullable();
		table.string('enrollment').notNullable();
		table
			.uuid('file_id')
			.index()
			.references('id')
			.inTable('files')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('employments');
}
