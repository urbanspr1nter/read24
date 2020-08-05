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

export function errorStatusToHttpCode(status: string) {
    switch(status) {
        case 'not_found':
            return 404;
        default:
            return 400;
    }
}

export function isValue(val: any) {
    return val !== undefined && val !== null;
}