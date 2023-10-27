import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import {faker} from '@faker-js/faker'


const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Test e-commerce Users', () => {
    let cookie
        const newUser = {
                firts_name: 'Test name',
                last_name: 'Test lastname',
                age: 26,
                email: faker.internet.email(),
                password: '123',
                cartId: new mongoose.Types.ObjectId(),
                role: 'premium'

            }


    describe('createUser', () => {
        it('should return a new user', async function () {
            this.timeout(5000)

            const response = await requester.post('/api/session/register').send(newUser);
            expect(response.status).to.equal(302);
            const redirectUrl = response.headers.location;
            const followUpResponse = await requester.get(redirectUrl);
            expect(followUpResponse.status).to.equal(200);
        })
  
        it('should return a login user', async function(){
            this.timeout(8000)
            const response = await requester.post('/api/session/login').send({
                email: newUser.email,
                password: newUser.password
            })
     
            expect(response.status).to.equal(302);
            const redirectUrl = response.headers.location;
            const followUpResponse = await requester.get(redirectUrl);
            expect(followUpResponse.status).to.equal(200);
      
        })
  })
})