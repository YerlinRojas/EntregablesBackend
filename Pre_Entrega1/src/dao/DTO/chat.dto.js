export default class ChatDTO {
    constructor(chat) {
        this.user = chat.user || 'Usuario no especificado';
        this.message = chat.message || 'Mensaje vacío';
    }
}