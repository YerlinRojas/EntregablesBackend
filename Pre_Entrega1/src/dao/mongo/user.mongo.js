import UserModel from '../mongo/models/user.model.js'

export default class User {
    getUser = async (email) => {
        try {
          const user = await UserModel.findOne({email});
          return user;
        } catch (error) {
          throw error;
        }
      };
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
