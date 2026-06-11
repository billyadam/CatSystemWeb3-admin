export type User = {
	id: string;
	wallet?: string;
	name?: string;
	username?: string;
	email?: string;
	role?: string;
	user_data?: Record<string, unknown> | null;
	bio?: string;
	created_at?: string;
	updated_at?: string;
};

export type CreateUserRequest = {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
	role: string;
};

export type UpdateUserRequest = {
	id?: string;
	name?: string;
	email?: string;
	username?: string;
	password?: string;
	role?: string;
};

export type WithToken = {
	token: string;
};
