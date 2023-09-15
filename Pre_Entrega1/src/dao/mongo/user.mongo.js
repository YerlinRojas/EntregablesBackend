import UserModel from '../dao/mongo/models/product.model.js'

export default class User {
    getUser = async () => { 
        return await UserModel.find() }

    createUser = async(newUser) => {
        return await UserModel.create(newUser)
    }
    userById= async(uid)=>{
        return await UserModel.findOne({_id:uid})
    }
    saveUser = async (user) =>{
        return await  user.save()
    }

    deleteUser= async (uid) => {
        return await UserModel.deleteOne({_id:uid})
    }

    updateUser = async (uid,updatedFields ) => {
        return await UserModel.updateOne(uid,updatedFields)
    }

}
