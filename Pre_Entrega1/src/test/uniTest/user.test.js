import User from '../../dao/mongo/user.mongo.js'
import Assert from 'assert'
import chai from 'chai'
import mongoose from 'mongoose'
import config from '../../config/config.js'
import { faker } from '@faker-js/faker'



//modulo nativo de node para validar test
const assert = Assert.strict
//expect de chai mas utiliado en la industria
const expect = chai.expect

describe('Test user DAO', function () {

    before(function (done) {
        mongoose.connect(config.URL_DATA_TEST, {
            dbName: config.dbName_dataTest
        }).then(() => { console.log('DB conect for Testing!!'); done() })
            .catch(error => console.error("DB Failed", error))

        this.timeout(8000)
    })

    after(function () {
        //este drop elimina la DB
        mongoose.connection.collections.users.drop()
        this.timeout()
    })

    describe('Create User', function () {
        it('should create a new user', async function () {
            const userDao = new User();
            const mockUser = {
                first_name: 'John',
                last_name: 'Doe',
                age: 30,
                email: 'john.doe@example.com',
                password: 'testpassword',
            };
            const result = await userDao.createUser(mockUser);
            assert.ok(result._id);
        });
    });

    describe('Get User', function () {
        it('should get a user by email', async function () {
            const userDao = new User();
            const mockUser = {
                first_name: 'Alice',
                last_name: 'Smith',
                age: 28,
                email: 'alice.smith@example.com',
                password: 'testpassword',
            };
            await userDao.createUser(mockUser);
            const result = await userDao.userByEmail('alice.smith@example.com');
            expect(result).to.not.be.null;
            expect(result.email).to.equal('alice.smith@example.com');
        });

        it('should get a user by ID', async function () {
            const userDao = new User();
            const mockUser = {
                first_name: 'Bob',
                last_name: 'Johnson',
                age: 35,
                email: 'bob.johnson@example.com',
                password: 'testpassword',
            };
            const newUser = await userDao.createUser(mockUser);
            const result = await userDao.userById(newUser._id);
            expect(result).to.not.be.null;
            expect(result.email).to.equal('bob.johnson@example.com');
        });
    });

    describe('Updates User', function () {
        it('should update the password of a user by ID', async function () {
            const userDao = new User();
            const mockUser = {
                first_name: 'Bob',
                last_name: 'Johnson',
                age: 35,
                email: 'bob@example.com',
                password: 'oldpassword',
            };
            const newUser = await userDao.createUser(mockUser);

            const newPassword = 'newpassword';

            await userDao.updatedPass(newUser._id, newPassword);

            const updatedUser = await userDao.userById(newUser._id);

            expect(updatedUser).to.not.be.null;
            expect(updatedUser.password).to.not.equal('oldpassword');
        });
        it('should update the role of a user by ID', async function () {
            const userDao = new User();
            const mockUser = {
                first_name: 'Charlie',
                last_name: 'Brown',
                age: 25,
                email: 'charlie.brown@example.com',
                password: 'testpassword',
                role: 'user',
            };
            const newUser = await userDao.createUser(mockUser);

            const newRole = 'admin';

            const updatedUser = await userDao.newRole(newUser._id, newRole);

            expect(updatedUser).to.not.be.null;
            expect(updatedUser.role).to.equal('admin');
        });
    });
    describe('Test user DAO', function () {
        describe('Deletes User', function () {
            it('should delete a user by ID', async function () {
                const userDao = new User();
                const mockUser = {
                    first_name: 'Alice',
                    last_name: 'Smith',
                    age: 28,
                    email: 'alice@example.com',
                    password: 'testpassword',
                };
                const newUser = await userDao.createUser(mockUser);

                const result = await userDao.deleteUser(newUser._id);

                expect(result).to.not.be.null;
                expect(result.deletedCount).to.equal(1)
            });

            it('should return null if user does not exist', async function () {
                const userDao = new User();
                const nonExistentUserId = new mongoose.Types.ObjectId();

                const result = await userDao.deleteUser(nonExistentUserId);

                expect(result).to.not.be.null;
                expect(result.deletedCount).to.equal(0);
            });
        });
    })
})
