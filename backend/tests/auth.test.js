import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

// test for registration endpoint
describe('Test for Registration', () => {

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@user.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty("token")
    });

    it('should not register a user with existing email', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@user.com',
                password: 'password123'
            });
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@user.com',
                password: 'password1234'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});
