


export default class CartDTO {
    
    constructor(cart) {
        this.products = cart.product?.map((productData) => ({
            id: productData.id,
            quantity: productData.quantity,
        })) || [];
    }
}
