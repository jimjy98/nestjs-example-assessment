import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

import data from './../src/test-data.json';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  // Testing ping
  it('/api/ping (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/ping')
      .expect(200)
      .expect({ success: true });
  });

  // Testing posts
  it('/api/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
      .expect(200)
      .expect(data);
  });
});
