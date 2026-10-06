import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany();
  await Product.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const createAdminAndLogin = async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
  });
  await User.updateOne({ email: 'admin@test.com' }, { role: 'admin' });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: 'password123',
  });
  return loginRes.body.token;
};

const sampleProduct = {
  name: 'Test Product',
  description: 'A great test product',
  brand: 'TestBrand',
  category: 'Electronics',
  price: 99.99,
  stock: 10,
  images: ['https://placehold.co/400'],
};

describe('Product Endpoints', () => {
  test('should return an empty product list initially', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toEqual([]);
  });

  test('should allow admin to create a product', async () => {
    const token = await createAdminAndLogin();

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe('Test Product');
  });

  test('should reject product creation from non-admin user', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Regular User',
      email: 'user@test.com',
      password: 'password123',
    });
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'user@test.com',
      password: 'password123',
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleProduct);

    expect(res.statusCode).toBe(403);
  });

  test('should get a single product by id', async () => {
    const token = await createAdminAndLogin();
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleProduct);

    const productId = createRes.body.product._id;

    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.product._id).toBe(productId);
  });

  test('should return 404 for non-existent product id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
