import UserDTO from '../dao/DTO/user.dto.js'

export default class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    getUser = async (query = {}) => { 
        return await this.dao.getUser(query) } 
    
    createUser = async(newUser) => {
        const userInsert = new UserDTO(newUser)
        return await this.dao.createUser(userInsert)
    }
    userById= async(uid)=>{
        return await this.dao.userById(uid)
    }
    userByEmail= async(email)=>{
        return await this.dao.userByEmail(email)
    }
    saveUser = async (user) =>{
        return await  this.dao.saveUser(user)
    }

    deleteUser= async (uid) => {
        return await this.dao.deleteUser(uid)
    }

    updateUser = async (uid,updatedFields ) => {
        return await this.dao.updateUser(uid,updatedFields)
    }

    updatedPass= async (userId, password) => {
        return await this.dao.updatedPass(userId,password)
    }

    newRole = async(userId, newRole) => {
        return await this.dao.newRole(userId, newRole)
    }

    updateLastConnection = async (uid) => {
        return await this.dao.updateLastConnection(uid)
    }

    findByIdAndUpdate = async(userId, documents) =>{
        return await this.dao.findByIdAndUpdate(userId, documents)
    }
}