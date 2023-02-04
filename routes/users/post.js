import UserSchema from "../../models/users.js"

export default async (_req, res) => {
    const users = await UserSchema.create({
        name: "Loan",
        email: "loan2gmail.com" 
    })

    return res.send(users)
}