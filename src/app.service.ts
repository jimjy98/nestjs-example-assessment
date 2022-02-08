import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  Query,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

type QueryParams = {
  tags?: string;
  sortBy?: 'id' | 'reads' | 'likes' | 'popularity';
  direction?: 'desc' | 'asc';
};

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async addToCache(key: string, post: string) {
    await this.cacheManager.set(key, post);
  }

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }

  async getPosts(@Query() query: QueryParams): Promise<any> {
    const { tags, sortBy = 'id', direction = 'asc' } = query;

    // Handle invalid parameters
    if (!tags) {
      throw new HttpException('Tags are required', 400);
    }
    if (!['id', 'reads', 'likes', 'popularity'].includes(sortBy)) {
      throw new HttpException('sortBy parameter is invalid', 400);
    }
    if (!['desc', 'asc'].includes(direction)) {
      throw new HttpException('direction parameter is invalid', 400);
    }

    // Make the request
    const requestPromises = tags.split(',').map((tag) => {
      return this.httpService
        .get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
        .toPromise();
    });

    const responses = await Promise.all(requestPromises);
    // Concat posts from different responses
    const combinedResponses = responses.reduce((acc, curr) => {
      return [...acc, ...curr.data.posts];
    }, []);
    // Remove duplicates
    const uniqueResponses = Array.from(
      new Set(combinedResponses.map((p) => p.id)),
    ).map((id) => combinedResponses.find((p) => p.id === id));
    // Sort posts based on parameters
    const sortedResponses = uniqueResponses.sort((a, b) => {
      return direction === 'asc'
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    });
    return {
      posts: sortedResponses,
    };
  }
}
