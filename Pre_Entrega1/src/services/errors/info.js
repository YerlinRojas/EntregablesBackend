export const generateUserErrorInfo = (user) => {
    return `
    
        One or more properties are incomplete or invalid.
        List of required properties:
        - first_name: Must be a string (${user?.first_name})
        - last_name: Must be a string (${user?.last_name})
        - email: Must be a string (${user?.email})
    `;
};

export const generateCartErrorInfo = (cart) => {
    return `
    -cart no found by Id
    -cart Id invalid : (${cart.id})
    `;
};

export const generateProductErrorInfo = (newProduct) => {
    return `
    
One or more properties are incomplete or invalid.
List of required properties:
    - title : Must be a string (${newProduct?.title})
    -description : Must be a string (${newProduct?.description})
    -price: Must be a number (${newProduct?.price})
    -category: Must be a string (${newProduct?.category})
    -thumbnail:Must be a string (${newProduct?.thumbnail})
    -code: Must be a number (${newProduct?.code})
    -stock: Must be a number (${newProduct?.stock})
    `;
};
