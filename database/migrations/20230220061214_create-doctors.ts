import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('doctors', (table) => {
		table.uuid('id').primary();
		table.string('name').notNullable();
		table.string('uf').notNullable();
		table.string('cpf').notNullable();
		table.integer('crm').notNullable();
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
	await knex.schema.dropTable('doctors');
}
