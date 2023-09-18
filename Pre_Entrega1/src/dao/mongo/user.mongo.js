import UserModel from '../mongo/models/user.model.js'

export default class User {
    getUser = async (query = {}) => {
        try {
          const user = await UserModel.findOne(query).lean().exec();
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
