import mongoose from "mongoose";


const userCollection = 'users'

const userSchema = new mongoose.Schema({
    firts_name : String,
    last_name : String,
    age: Number,
    email : {
        type: String,
        unique: true
    },
    password: String,
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'], 
        default: 'user', 
    }
})

const userModel = new mongoose.model(userCollection, userSchema)

export default userModel

