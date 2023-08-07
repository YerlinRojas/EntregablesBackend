import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    firts_name : String,
    last_name : String,
    age: Number,
    email : String,
    password: String
})

const userModel = new mongoose.model(userCollection, userSchema)

export default userModel

