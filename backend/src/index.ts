import 'dotenv/config';
import { app } from './app';
import { testDBConnection } from './db';

const port = process.env.PORT ?? 3000;

const main = async () => {
	const dbError = await testDBConnection();

	if (dbError) {
		console.error("Can't connect to the DB");
		console.error(dbError);
		return;
	}

	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};

main();
