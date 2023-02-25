import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse
} from '@shared/schemas';
import { getClient } from './client';

const authClient = getClient('auth');

export const loginRequest = (payload: LoginRequest) =>
	authClient.post<LoginResponse>('login', payload);

export const registerRequest = (payload: RegisterRequest) =>
	authClient.post<RegisterResponse>('register', payload);
