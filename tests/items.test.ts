import supertest from 'supertest'
import app from '../src/app'
import {prisma} from '../src/database'
import itemFactory from './factories/itemFactory';

beforeEach(async ()=>{
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
})

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto',async ()=>{
    const body = await itemFactory()
    const result = await supertest(app).post("/items").send(body);
        const status = result.status;
        
        expect(status).toEqual(201);

  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista',async ()=>{
    const body = await itemFactory()
    await supertest(app).post("/items").send(body)
    const result = await supertest(app).post("/items").send(body);
        const status = result.status;
        
        expect(status).toEqual(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array',async ()=>{
    const body = await itemFactory()
    await supertest(app).post("/items").send(body)
    const result = await supertest(app).get("/items").send();
        const status = result.status;
        const data = result.body
        expect(status).toEqual(200);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado',async () =>{
    const body = await itemFactory()
    await supertest(app).post("/items").send(body)
    const list = await supertest(app).get("/items").send();
    const id = list.body[0].id
    const result = await supertest(app).get(`/items/${id}`).send();
        const status = result.status;
        const data = result.body
        expect(status).toEqual(200);
        expect(data).toEqual({...body,id});
  });
  it('Deve retornar status 404 caso não exista um item com esse id',async () =>{
    const body = await itemFactory()
    await supertest(app).post("/items").send(body)
    const list = await supertest(app).get("/items").send();
    const id = list.body[0].id
    const result = await supertest(app).get(`/items/${id+1}`).send();
        const status = result.status;
        const data = result.body
        expect(status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});