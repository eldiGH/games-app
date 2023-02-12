import type { Prisma } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { db } from '../db';
import {
	EmailAlreadyInUse,
	EmailAndNicknameAlreadyInUse,
	EmailOrPasswordNotValid,
	NicknameAlreadyInUse
} from '../errors';
import type { ValidateNicknameAndEmail } from '../types/ValidateNicknameAndEmail';
import type { LoginRequest } from '@shared/schemas';
import type { JwtPayload } from '@shared/types';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET NOT FOUND');

const validateNicknameAndEmail = async (data: ValidateNicknameAndEmail) => {
	const existingUser = await db.player.findFirst({
		where: { OR: [{ email: data.email }, { nickname: data.nickname }] }
	});
	if (!existingUser) return;

	if (existingUser.email === data.email && existingUser.nickname === data.nickname)
		throw EmailAndNicknameAlreadyInUse(data.email, data.nickname);
	if (existingUser.email === data.email) throw EmailAlreadyInUse(data.email);
	if (existingUser.nickname === data.nickname) throw NicknameAlreadyInUse(data.nickname);
};

const register = async (playerData: Prisma.PlayerCreateInput) => {
	await validateNicknameAndEmail(playerData);

	const password = await hash(playerData.password, 10);
	await db.player.create({ data: { ...playerData, password } });
};

const login = async (data: LoginRequest): Promise<string> => {
	const player = await db.player.findFirst({ where: { email: data.email } });
	if (!player) throw EmailOrPasswordNotValid();

	const isPasswordValid = await compare(data.password, player.password);
	if (!isPasswordValid) throw EmailOrPasswordNotValid();

	const payload: JwtPayload = { id: player.id };

	const token = sign(payload, jwtSecret, { expiresIn: '1h' });

	return token;
};

export const AuthService = { register, login };
