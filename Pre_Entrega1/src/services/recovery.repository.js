import RecoveryDTO from '../dao/DTO/recovery.dto.js' 

export default class RecoveryRepository{
    constructor(dao){
        this.dao= dao
    }

    getList = async () => { 
        return await this.dao.getList() }


    createRecovery = async(newRecovery) => {
        const recoveryInsert = new RecoveryDTO(
            newRecovery.userId,
            newRecovery.token,
            newRecovery.expiration
            )
        return await this.dao.createRecovery(recoveryInsert)
    }

    findRecoveryByToken = async (recoveryToken) => {
        return await this.dao.findRecoveryByToken(recoveryToken);
      };

      recoveryRecord = async(recoveryToken) => {
        return await this.dao.recoveryRecord({ token: recoveryToken });
    }
}