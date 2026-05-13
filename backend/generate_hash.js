import bcrypt from 'bcryptjs';

const password = 'password123';
const saltRounds = 12;

bcrypt.hash(password, saltRounds).then(hash => {
    console.log('Hashed Password:', hash);
}).catch(err => {
    console.error(err);
});
