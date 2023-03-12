import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
	try {
		for (let i = 0; i < 10; i++) {
			const normalizedIndex = i + 1;
			await prisma.player.upsert({
				where: { id: normalizedIndex },
				update: {},
				create: {
					email: `test${normalizedIndex}@gmail.com`,
					nickname: `Test${normalizedIndex}`,
					/// password = safepassword123
					password: '$2a$10$z5cKcEputZMgTaHwNsDWe.PFyxEhuOXO/vZFjdk9zatyBGYY3lg.C'
				}
			});
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
};

main();
