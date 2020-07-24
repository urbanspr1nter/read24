import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 7;

export function hashPassword(plainTextPassword: string) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashed = bcrypt.hashSync(plainTextPassword, salt);

    return {
        salt,
        hashed
    };
}

export function isValidHash(plainTextPassword: string, hashed: string, salt: string) {
    const testHashed = bcrypt.hashSync(plainTextPassword, salt);

    return hashed === testHashed;
}
