import 'knex/';

declare module 'knex/types/tables' {
	export interface Tables {
		files: {
			id: string;
			name: string;
			created_at: string;
			session_id?: string;
		};
		exams: {
			date: Date;
			description: string;
			proceeding: number;
			file_id: string;
		};
		doctors: {
			name: string;
			crm: number;
			uf: string;
			cpf: string;
			file_id: string;
		};
		employments: {
			cpf: string;
			enrollment: string;
			file_id: string;
		};
	}
}
