export default class UserDTO {

    constructor(user){
        this.firts_name = user?.firts_name 
        this.last_name= user?.last_name
        this.age = user.age;
        this.email = user.email;
        this.password = user.password;
        this.cartId = user.cartId;
        this.role = user?.role ?? 'user'
        this.last_connection = user?.last_connection
    }
}