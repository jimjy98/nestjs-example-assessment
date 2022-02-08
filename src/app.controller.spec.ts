import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import data from './test-data.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        CacheModule.register({
          ttl: 0,
          max: 100,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('ping', () => {
    it('should return { success: true }', () => {
      expect(appController.ping()).toEqual({ success: true });
    });
  });

  describe('posts', () => {
    it('should return list of posts', () => {
      return appController
        .getPosts({ tags: 'history,tech', sortBy: 'likes', direction: 'desc' })
        .then((res) => {
          expect(res).toEqual(data);
        });
    });
  });
});
