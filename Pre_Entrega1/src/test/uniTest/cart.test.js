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

        done() })
            .catch(error => console.error("DB Failed", error))

        this.timeout(8000)
    })

    after(function () {
    
      if (mongoose.connection.collections.cart) {
        mongoose.connection.collections.cart.drop();
      }
      this.timeout();
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
    
      

})