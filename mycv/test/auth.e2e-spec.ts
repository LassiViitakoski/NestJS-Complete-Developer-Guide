import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a sign up request', async () => {
    const email = 'fakeEmail12@gmail.com';

    const { body } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'mypassword' })
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'fakeEma22il12@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'mypassword' })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', res.get('Set-Cookie'))
      .send()
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });
});
