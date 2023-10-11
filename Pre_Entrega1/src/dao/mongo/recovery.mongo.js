import recoveryModel from '../mongo/models/recovery.model.js'

export default class Recovery {
    getList = async () => { 
        return await recoveryModel.find() }

    createRecovery= async(newRecovery) => {
        return await recoveryModel.create(newRecovery)
    }
    
    findRecoveryByToken = async (recoveryToken) => {
        return await recoveryModel.findOne({ token: recoveryToken });
      };

    recoveryRecord = async(recoveryTokenObject) => {
        await recoveryModel.findOne(recoveryTokenObject);
    }
}