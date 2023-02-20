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
			id: string;
			date: Date;
			description: string;
			proceeding: number;
			file_id: string;
		};
		doctors: {
			id: string;
			name: string;
			crm: number;
			uf: string;
			cpf: string;
			file_id: string;
		};
		employments: {
			id: string;
			cpf: string;
			enrollment: string;
			file_id: string;
		};
	}
}
