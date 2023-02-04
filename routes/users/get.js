import UserSchema from "../../models/users.js"

export default async (_req, res) => {
    const users = await UserSchema.find()

    return res.send(users)
}