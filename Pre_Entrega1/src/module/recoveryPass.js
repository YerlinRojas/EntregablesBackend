import { recoveryService, userService } from "../services/index.js";


export  function isValidPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber
}

export function getUserFromToken(token) {
    try {
        const decoded = jwt.verify(token, config.PRIVATE_KEY);
        return decoded.user;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

export async function updateUserPassword(userId, newPassword) {
    try {
        // Actualiza la contraseña del usuario en la base de datos
        const updatedUser = await userService.updateUser({ _id: userId }, { password: newPassword });

        if (updatedUser) {
            console.log(`Contraseña actualizada para el usuario con ID ${userId}`);
        } else {
            console.log(`No se pudo actualizar la contraseña para el usuario con ID ${userId}`);
        }
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
    }
}

export async function saveRecoveryTokenToDatabase(userId, token, expiration) {
    try {
      const newRecovery = new recoveryService.createRecovery({
        userId:userId,
        token:token,
        expiration:expiration,
      });
  
      await newRecovery.save();
      console.log('Token de recuperación guardado en la base de datos.');
    } catch (error) {
      console.error('Error al guardar el token de recuperación en la base de datos:', error);
    }
  }
  

  
  
  
  


