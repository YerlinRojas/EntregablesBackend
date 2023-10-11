import mongoose from 'mongoose'

const recoveryTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiration: { type: Date, required: true },
  });
  
  const recovery = mongoose.model('RecoveryToken', recoveryTokenSchema);
  export default recovery