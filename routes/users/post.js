import UserSchema from "../../models/test.js"

export default async (_req, res) => {
    const users = await UserSchema.create({
        name: "Loan",
        email: "loan2gmail.com" 
    })

    return res.send(users)
}