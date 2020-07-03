import { IRouter } from "express";
import * as bcrypt from 'bcrypt';
import * as db from '../mockDb.json';

const classrooms = db.classrooms;
const students = db.students;
const users = db.users;

function hashPassword(plainTextPassword: string) {
    const saltRounds = 7;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashed = bcrypt.hashSync(plainTextPassword, salt);

    return {
        salt,
        hashed
    };
}

function isValidHash(plainTextPassword: string, hashed: string, salt: string) {
    const testHashed = bcrypt.hashSync(plainTextPassword, salt);

    return hashed === testHashed;
}

export function mountLogin(app: IRouter) {
    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.status(400).json({message: 'Must provide username, and password.'});

        const user = users.find(u => u.username === username);

        if (!user)
            return res.status(404).json({message: 'Could not find user by the username.'});

        if (!isValidHash(password, user.password, user.salt))
            return res.status(401).json({message: 'Invalid password.'});

        const classroom = classrooms.find(c => c.id === students.find(s => s.userId === user.id).classroomId);

        return res.status(200).json({message: `Welcome to ${classroom.name}`});
    });
}
