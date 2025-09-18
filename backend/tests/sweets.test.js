import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';
import Sweet from '../src/models/Sweet.js';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
dotenv.config({ path: '.env' });

let userToken = '';
let adminToken = '';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)

    // clear DB before running tests
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // create a user for authentication
    const user = await request(app).post('/api/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        password: 'password123'
    });
    userToken = user.body.token

    // create admin user for authentication(if needed in future)
    const admin = await request(app).post('/api/auth/register').send({
        firstName: 'admin',
        lastName: 'user',
        email: 'admin@user.com',
        password: 'password123',
        role: 'admin'
    });
    adminToken = admin.body.token

    // seed sweets
    await Sweet.create([
        { name: "Lassi", category: "other", price: 15.99, quantity: 10 },
        { name: "Gulab Jamun", category: "candy", price: 5.0, quantity: 20 },
        { name: "Ladoo", category: "candy", price: 10.0, quantity: 30 },
    ]);
});

// Clean up sweets after each test to ensure test isolation
afterEach(async () => {
    await Sweet.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({}); // delete users after each test to avoid conflicts
    await mongoose.connection.close();
});

// test for sweets endpoint
describe('Test for Sweets', () => {

    // adding a new sweet
    it('should create a new sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                name: 'Chocolate Cake',
                category: 'cake',
                price: 15.99,
                quantity: 10
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.sweet).toHaveProperty("_id");
    });

    // adding a sweet with existing name
    it("should not create a sweet with existing name", async () => {
        const sweetData = {
            name: 'Vanilla Cake',
            category: 'cake',
            price: 15.99,
            quantity: 10
        };

        // first create a sweet
        await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${userToken}`)
            .send(sweetData);

        // try creating the sweet again with the same name
        const res = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${userToken}`)
            .send(sweetData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Sweet with this name already exists");
    });

    // getting all sweets
    it("should get all sweets", async () => {
        // first create a sweet
        await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                name: 'Strawberry Cake',
                category: 'cake',
                price: 15.99,
                quantity: 10
            });

        const res = await request(app)
            .get('/api/sweets')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBe(1);
        expect(res.body.sweets[0]).toHaveProperty("_id");
    })

    // searching sweets by name
    it("should search sweets by name", async () => {
        const res = await request(app)
            .get('/api/sweets/search?search=gulab')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBeGreaterThan(0);
        expect(res.body.sweets[0].name).toBe("Gulab Jamun");
    })

    // searching sweets by category
    it("should filter sweets by category", async () => {
        const res = await request(app)
            .get('/api/sweets/search?category=sweet')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBe(2); // Gulab Jamun and Ladoo
    })

    // searching sweet by price range
    it("should filter sweets by price range", async () => {
        const res = await request(app)
            .get('/api/sweets/search?minPrice=6&maxPrice=20')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBe(2); // Lassi and Ladoo
    })
});