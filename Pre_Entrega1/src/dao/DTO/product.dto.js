export default class ProductDTO {
    constructor(product) {
        this.title = product.title || 'Nombre no disponible';
        this.description = product.description || 'Descripción no disponible';
        this.price = product.price || 0;
        this.category = product.category || 'Categoría no especificada';
        this.code = product.code || 0;
        this.stock = product.stock || 0;
    }
}

