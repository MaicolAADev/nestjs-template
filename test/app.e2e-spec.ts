import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('AdoptionCenters (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource.query(`
      INSERT INTO "user" 
      (id, "fullName", email, "password", "role", "createdAt", address, phone, "isActive") 
      VALUES 
      (1, 'Maicol A', 'cutrepez200@gmail.com', '$2a$10$7lsLPB0EKDNS7MTyj0e6E.6lHTJFRenm5U/1vCGHT8SL3J.T6aoSK', 'admin', '2025-05-14 14:04:44.250', 'Carrera', '3019892002', true)
      ON CONFLICT (id) DO NOTHING;
    `);


    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'cutrepez200@gmail.com',
        password: 'Ma1234',
      });

    token = loginResponse.body?.body?.token;

    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

  });

  afterAll(async () => {
    await app.close();
  });

});


