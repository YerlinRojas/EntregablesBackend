
import mongoose from 'mongoose'
import {config} from 'dotenv'
config()



const configMongo = ( ) => {
    //conexion mongoose seteo
//mongoose.set('strictQuery', false)
const PERSISTENCE = process.env.PERSISTENCE
const PORT = process.env.PORT
const URL = process.env.URL
const dbName =process.env.dbName
}

export default configMongo



