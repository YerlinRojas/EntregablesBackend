import Cart from '../../dao/mongo/cart.mongo.js'
import chai from 'chai'
import mongoose from 'mongoose'
import config from '../../config/config.js'

const expect = chai.expect

describe('Test Cart DAO', function(){
    before(function (done) {
        mongoose.connect(config.URL_DATA_TEST, {
            dbName: config.dbName_dataTest
        }).then(async() => { console.log('DB conect for Testing!!'); 
        const newCart = await CartModel.create({});
        existingCartId = newCart._id;
        done() })
            .catch(error => console.error("DB Failed", error))

        this.timeout(8000)
    })

    after(function () {
        //este drop elimina la DB
        mongoose.connection.collections.cart.drop()
        this.timeout()
    })
    
    describe('createCart', function() {
        it('should create a new cart and return it', async function() {
            const cartDao = new Cart();
            const newCart = await cartDao.createCart();
            
            expect(newCart).to.be.an('object');
            expect(newCart._id).to.be.a('object');
        });
    });
    describe('cartList', function() {
        it('should return an array of carts', async function() {
          const cartDao = new Cart();
          const result = await cartDao.cartList();
    
          expect(result).to.be.an('array');
        });
      });
    
      describe('cartById', function() {
        it('should return a populated cart by ID', async function() {

          const existingCartId = new mongoose.Types.ObjectId();
    
          const cartDao = new Cart();
          const cart = await cartDao.cartById(existingCartId);
    
          expect(cart).to.be.an('object');
          expect(cart._id).to.equal(existingCartId);
          expect(cart.product).to.be.an('array');
          // Agrega más aserciones según la estructura de tu cart
        });
    
        it('should return undefined for an invalid cart ID', async function() {
          const invalidCartId = 'invalid_cart_id';
    
          const cartDao = new Cart();
          const cart = await cartDao.cartById(invalidCartId);
    
          expect(cart).to.be.undefined;
        });
      });
    

})