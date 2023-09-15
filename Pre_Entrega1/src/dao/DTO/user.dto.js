export default class UserDTO {

    constructor(user){
        this.firts_name = user?.firts_names 
        this.last_name= user?.last_name
        this.age = user.age;
        this.email = user.email;
        this.cartId = user.cartId;
        this.role = user?.role ?? 'user'
    }
}