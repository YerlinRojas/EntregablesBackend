import {faker} from '@faker-js/faker'

const getMockingProducts = async (req, res) => {
    try {
        const products = [];
        
        const generateProducts = () => {
            return {
                title: faker.commerce.productName(),
                price: faker.commerce.price(),
                category: faker.commerce.department(),
                image: faker.image.url(),
                stock: faker.number.int({ max: 100 }),
                code: faker.string.uuid(),
            };
        };
        
        for (let i = 0; i < 100; i++) {
            products.push(generateProducts());
        }

        res.send({ status: 'success', payload: products });
    } catch (error) {
        console.error('Error mocking', error);
        res.status(500).json({ error: 'internal server error' });
    }
};

export default getMockingProducts