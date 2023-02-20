import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('exams', (table) => {
		table.uuid('id').primary();
		table.date('date').notNullable();
		table.string('description').notNullable();
		table.integer('proceeding').notNullable();
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
	await knex.schema.dropTable('exams');
}
