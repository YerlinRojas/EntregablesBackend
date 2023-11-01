import chai from 'chai'
import supertest from 'supertest'
import mongoose from 'mongoose'

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Test e-commerce Products', () => {
    describe('createProduct', () => {
        it('should return a new product and return it /api/products/create and delete product it /api/products/delete/:pid', async function () {
            const newProduct = {
                title: 'Test Product',
                description: 'This is a test product',
                price: 19.99,
                category: 'Test Category',
                code: 885,
                stock: 10,
                owner: new mongoose.Types.ObjectId(),
            };
            const response = await requester.post('/api/products/create').send(newProduct)

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('title', 'Test Product');
            expect(response.body).to.have.property('description', 'This is a test product');

            const createdProductId = response.body._id;

            const deleteResponse = await requester.get(`/api/products/delete/${createdProductId}`);
            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body).to.be.an('object');
        })
    })

    describe('getList', () => {
        it('should return a list of products /api/products', async function () {
            const response = await requester.get('/api/products')

            expect(response.status).to.equal(200);

            expect(response.body).to.be.an('array');
            expect(response.body).to.not.be.empty;
            expect(response.body[0]).to.have.property('title');
            expect(response.body[0]).to.have.property('price');
            expect(response.body[0]).to.have.property('description');
            expect(response.body[0].price).to.be.a('number').to.be.at.least(0);
            expect(response.body[0].stock).to.be.a('number').to.satisfy(Number.isInteger).to.be.at.least(0);

            expect(response.headers).to.have.property('content-type');

        })
    })

})
