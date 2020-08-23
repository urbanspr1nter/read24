import { IRouter } from "express";
import { User } from "../models/user";

export function mountUser(app: IRouter) {
    app.get ('/user/available', async (req, res) => {
        const users = await User.listUsersWhoAreAvailable();

        return res.status(200).json(users.map(u => ({
            username: u.username,
            id: u.id
        })));
    });

    app.post('/user', async (req, res) => {
        const {
            username,
            password
        } = req.body;

        if(await User.findByUsername(username))
        return res.status(409).json({status: 'conflict', message: 'A user already exists with this username.'});

        const user = await User.create(username, password);

        return res.status(200).json({
            id: user.id,
            username: user.username
        });
    });
}
