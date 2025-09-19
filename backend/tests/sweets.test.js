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
    await User.deleteMany({ role: 'user' }); // delete only users with role 'user'
    await Sweet.deleteMany({});

    // create a user for authentication
    const user = await request(app).post('/api/auth/register').send({
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        password: 'password123'
    });
    userToken = user.body.token

    // check if admin user already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
        // create admin user
        const adminUser = new User({
            firstName: 'test',
            lastName: 'admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });
        // save admin user to db
        await adminUser.save();
    }

    // login admin user for admin operations
    const admin = await request(app).post('/api/auth/login').send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    });
    
    adminToken = admin.body.token
});

// Clean up sweets after each test to ensure test isolation
afterEach(async () => {
    await Sweet.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({ role: 'user' }); // delete users after each test to avoid conflicts
    await mongoose.connection.close();
});

// creating sweets for search tests 
beforeEach(async () => {
    await request(app)
        .post('/api/sweets')
        .set("Authorization", `Bearer ${adminToken}`) // only admin can add sweets
        .send({
            name: 'Gulab Jamun',
            category: 'candy',
            price: 5.0,
            quantity: 20
        });

    await request(app)
        .post('/api/sweets')
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: 'Ladoo',
            category: 'candy',
            price: 10.0,
            quantity: 30
        });

    await request(app)
        .post('/api/sweets')
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: 'Lassi',
            category: 'other',
            price: 15.99,
            quantity: 10
        });
});

// test for sweets endpoint
describe('Test for Sweets', () => {

    // adding a new sweet
    it('should create a new sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`) // only admin can add sweets
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
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sweetData);

        // try creating the sweet again with the same name
        const res = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sweetData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Sweet with this name already exists");
    });

    // getting all sweets
    it("should get all sweets", async () => {
        const res = await request(app)
            .get('/api/sweets')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBeGreaterThanOrEqual(3);
        expect(res.body.sweets[0]).toHaveProperty("_id");
    });

    // searching sweets by name
    it("should search sweets by name", async () => {
        const res = await request(app)
            .get('/api/sweets/search?search=gulab')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBeGreaterThan(0);
        expect(res.body.sweets[0].name).toBe("Gulab Jamun");
    });

    // searching sweets by category
    it("should filter sweets by category", async () => {
        const res = await request(app)
            .get('/api/sweets/search?category=candy')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBe(2); // Gulab Jamun and Ladoo
    });

    // searching sweet by price range
    it("should filter sweets by price range", async () => {
        const res = await request(app)
            .get('/api/sweets/search?minPrice=6&maxPrice=20')
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweets.length).toBe(2); // Lassi and Ladoo
    });

    // updating sweet details with admin role
    it("should update sweet details", async () => {
        // first create a sweet to update
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Strawberry Cake',
                category: 'cake',
                price: 20.0,
                quantity: 5
            });
        const sweetId = sweetRes.body.sweet._id;

        // now update the sweet
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`) // only admin can update
            .send({
                price: 18.0,
                name: "Strawberry Delight",
                category: "other"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.sweet.price).toBe(18.0);
        expect(res.body.sweet.name).toBe("Strawberry Delight");
        expect(res.body.sweet.category).toBe("other");
    })

    // updating sweet details with user role
    it("should not update sweet details with user role", async () => {
        // first create a sweet to update
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Strawberry Cake',
                category: 'cake',
                price: 20.0,
                quantity: 5
            });
        const sweetId = sweetRes.body.sweet._id;

        // now update the sweet
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${userToken}`) // user role
            .send({
                price: 18.0,
                name: "Strawberry Delight",
                category: "other"
            });
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("You do not have permission to perform this action");
    })

    it("should not update quantity", async () => {
        // first create a sweet to update
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Blueberry Cake',
                category: 'cake',
                price: 22.0,
                quantity: 7
            });
        const sweetId = sweetRes.body.sweet._id;

        // now try to update the quantity 
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`) // only admin can update
            .send({
                quantity: 50 // should not be allowed
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    })

    // deleting a sweet with admin role
    it("should delete a sweet", async () => {
        // first create a sweet to delete
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Mango Bar',
                category: 'other',
                price: 12.0,
                quantity: 15
            });
        const sweetId = sweetRes.body.sweet._id;

        // now delete the sweet
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`); // only admin can delete
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Sweet deleted successfully");
    })

    // deleting a sweet with user role
    it("should not delete a sweet with user role", async () => {
        // first create a sweet to delete
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Mango Bar',
                category: 'other',
                price: 12.0,
                quantity: 15
            });
        const sweetId = sweetRes.body.sweet._id;

        // now try to delete the sweet with user role
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${userToken}`); // user role
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("You do not have permission to perform this action");
    })

    // purchasing a sweet
    it("should purchase a sweet", async () => {
        // first create a sweet to purchase
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Orange Candy',
                category: 'candy',
                price: 8.0,
                quantity: 50
            });
        const sweetId = sweetRes.body.sweet._id;

        // now purchase the sweet
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                quantity: 5
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Purchase successful");
        expect(res.body.sweet.quantity).toBe(45); // 50 - 5 = 45
    })

    // purchasing a sweet with insufficient stock
    it("should not purchase a sweet with insufficient stock", async () => {
        // first create a sweet to purchase
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Orange Candy',
                category: 'candy',
                price: 8.0,
                quantity: 10
            });
        const sweetId = sweetRes.body.sweet._id;

        // now try to purchase more than available stock
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                quantity: 15
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Insufficient stock");
    })

    // restocking a sweet 
    it("should restock a sweet", async () => {
        // first create a sweet to restock
        const res = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Pineapple Candy',
                category: 'candy',
                price: 9.0,
                quantity: 10
            });
        const sweetId = res.body.sweet._id;

        // now restock the sweet
        const restockRes = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 20
            });
        expect(restockRes.statusCode).toEqual(200);
        expect(restockRes.body.success).toBe(true);
        expect(restockRes.body.message).toBe("Sweet restocked successfully");
        expect(restockRes.body.sweet.quantity).toBe(30); // 10 + 20 = 30
    })

    it("should not restock a sweet with user role", async () => {
        // first create a sweet to restock
        const res = await request(app)
            .post('/api/sweets')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: 'Pineapple Candy',
                category: 'candy',
                price: 9.0,
                quantity: 10
            });
        const sweetId = res.body.sweet._id;

        // now try to restock the sweet with user role
        const restockRes = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set("Authorization", `Bearer ${userToken}`) // user role
            .send({
                quantity: 20
            });
        expect(restockRes.statusCode).toEqual(403);
        expect(restockRes.body.message).toBe("You do not have permission to perform this action");
    })
});