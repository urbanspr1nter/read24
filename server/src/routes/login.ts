import { IRouter } from "express";
import { Classroom } from "../models/classroom";
import { Student } from "../models/student";
import { User } from "../models/user";
import { isValidHash } from "../util/util";

export function mountLogin(app: IRouter) {
    app.post('/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.status(400).json({message: 'Must provide username, and password.'});

        const user = await User.findByUsername(username);

        if (!user)
            return res.status(404).json({message: 'Could not find user by the username.'});

        if (!isValidHash(password, user.password, user.salt))
            return res.status(401).json({message: 'Invalid password.'});

        const classroom = await new Classroom().load(
            (await Student.findByUserId(user.id)).classroomId
        );

        return res.status(200).json({message: `Welcome to ${classroom.name}`});
    });
}
