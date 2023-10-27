import Product from '../../dao/mongo/product.mongo.js'
import chai from 'chai'
import mongoose from 'mongoose'
import config from '../../config/config.js'

const expect = chai.expect

describe('Test Product DAO', function () {
    before(function (done) {
        mongoose.connect(config.URL_DATA_TEST, {
            dbName: config.dbName_dataTest
        }).then(async () => {
            console.log('DB conect for Testing!!');

            done()
        })
            .catch(error => console.error("DB Failed", error))
        this.timeout(8000)
    })

    after(function () {
        if (mongoose.connection.collections.product) {
            mongoose.connection.collections.product.drop();
        }
        this.timeout();
    })


    describe('createProduct', function () {
        it('should create a new product and return it', async function () {
            const productDao = new Product();
            const newProduct = {
                title: 'Test Product',
                description: 'This is a test product',
                price: 19.99,
                category: 'Test Category',
                code: 885,
                stock: 10,
                owner: new mongoose.Types.ObjectId(),
            };

            const createdProduct = await productDao.createProduct(newProduct);

            expect(createdProduct).to.be.an('object');


        });
    });

    describe('getList', function () {
        it('should return a list of products', async function () {
            const productDao = new Product();
            const productList = await productDao.getList();

            expect(productList).to.be.an('array');

            productList.forEach((product) => {
                expect(product).to.be.an('object');
                expect(product).to.have.property('title');
                expect(product).to.have.property('description');
                expect(product).to.have.property('price');
                expect(product.price).to.be.a('number').to.be.at.least(0);
                expect(product.stock).to.be.a('number').to.satisfy(Number.isInteger).to.be.at.least(0);

            });
        });
    });

    describe('productById', function () {
        it('should return a product by ID', async function () {
            const productDao = new Product();
            const newProduct = {
                title: 'Test Product',
                description: 'This is a test product',
                price: 19.99,
                category: 'Test Category',
                code: 8455,
                stock: 10,
                owner: new mongoose.Types.ObjectId()
            };

            const createdProduct = await productDao.createProduct(newProduct);
            const product = await productDao.productById(createdProduct._id);

            expect(product).to.be.an('object');
            expect(product.title).to.equal(newProduct.title);
            expect(product.description).to.equal(newProduct.description);
            expect(product.price).to.equal(newProduct.price);
            expect(product.category).to.equal(newProduct.category);
            expect(product.code).to.equal(newProduct.code);
            expect(product.stock).to.equal(newProduct.stock);

        });

        it('should return undefined for an invalid product ID', async function () {
            const productDao = new Product();
            const invalidProductId = 555;

            if (!mongoose.Types.ObjectId.isValid(invalidProductId)) {
                const product = await productDao.productById(invalidProductId);
                expect(product).to.be.undefined;
                }

        });
    });


})