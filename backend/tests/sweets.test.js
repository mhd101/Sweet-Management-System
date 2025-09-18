import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';
import Sweet from '../src/models/Sweet.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)

    // create a user for authentication
    const user = await request(app).post('/api/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        password: 'password123'
    });
    const userToken = user.body.token

    // create admin user for authentication(if needed in future)
    const admin = await request(app).post('/api/auth/register').send({
        firstName: 'admin',
        lastName: 'user',
        email: 'admin@user.com',
        password: 'password123',
        role: 'admin'
    });
    const adminToken = admin.body.token
})

afterEach(async () => {
    await Sweet.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

// test for sweets endpoint
describe('Test for Sweets', () => {

    // adding a new sweet
    it('should create a new sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .send({
                name: 'Chocolate Cake',
                description: 'Delicious chocolate cake',
                category: 'cake',
                price: 15.99,
                quantity: 10
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.sweet).toHaveProperty("_id");
    });
});