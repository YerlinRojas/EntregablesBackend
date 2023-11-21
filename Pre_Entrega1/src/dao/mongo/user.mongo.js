import { createHash } from '../../utils.js';
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
    userByEmail = async(email)=>{
        return await UserModel.findOne({email:email})
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

    updateLastConnection = async (uid) => {
      try {
          const user = await UserModel.findOne({ _id: uid });
  
          if (!user) {
              console.error("Usuario no encontrado");
              return null;
          }
  
          user.last_connection = new Date();
          await user.save();
  
          console.log("Hora de entrada actualizada:", user.last_connection);
          return user;
      } catch (error) {
          console.error("Error al actualizar la hora de entrada:", error);
          return null;
      }
  };

  findByIdAndUpdate= async(userId, documents) =>{
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { documents: { name:`documents`, reference: `../../uploads/documents/${userId}`} } },
      { new: true }
    );
  }

    updatedPass = async (userId, password) => {
     await UserModel.findByIdAndUpdate(
        userId,
        {password:createHash(password)},
        { new: true }
      );
    }

    newRole = async (userId,newRole) => {
      
     
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { role: newRole },
        { new: true } 
      );
      console.log("userId user controller", userId);
      if (!updatedUser) {
        console.log('Usuario no encontrado en la base de datos');
      } else {
        console.log('Usuario actualizado:', updatedUser);
      }
        return updatedUser
    }

}
