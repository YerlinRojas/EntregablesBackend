import mongoose from "mongoose";


const userCollection = 'users'

const userSchema = new mongoose.Schema({
    firts_name : String,
    last_name : String,
    age: String,
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
    },
    documents : 
    [{
        name: String,
        reference: String,
    }],
    last_connection: {
        type: Date,
        default: Date.now
      }
})




const userModel = new mongoose.model(userCollection, userSchema)

export default userModel 

