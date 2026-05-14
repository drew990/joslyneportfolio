import bcrypt from 'bcryptjs';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });
const password = process.argv[2] || await rl.question('Password to hash: ');
rl.close();

if (!password || password.length < 12) {
  console.error('Use a password with at least 12 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(hash);
