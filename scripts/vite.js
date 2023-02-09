import { spawn } from 'child_process';
import process from 'process';

console.clear();

const args = process.argv.slice(2);
spawn('node', ['../node_modules/vite/bin/vite.js', ...args], {
	cwd: './frontend',
	stdio: [process.stdin, process.stdout, process.stderr]
});
