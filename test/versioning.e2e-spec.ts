import {
  Controller,
  Get,
  INestApplication,
  VersioningType,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

// Isolated regression check for the URI versioning bootstrap in src/main.ts. Doesn't boot
// the real AppModule (that needs a reachable Postgres/Mongo/Redis/RabbitMQ, see
// test/jest-e2e.json), it re-applies the same app.enableVersioning(...) call from main.ts
// to two throwaway controllers and asserts the resulting route shape, so a future change
// that accidentally drops or misconfigures versioning fails a test instead of shipping
// silently.

@Controller('hello')
class VersionedDummyController {
  @Get()
  get() {
    return 'v1 hello';
  }
}

@Controller({ path: 'status', version: '2' })
class VersionTwoDummyController {
  @Get()
  get() {
    return 'v2 status';
  }
}

describe('API versioning (URI, defaultVersion 1)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VersionedDummyController, VersionTwoDummyController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves a controller with no explicit version under /v1 by default', async () => {
    await request(app.getHttpServer()).get('/v1/hello').expect(200, 'v1 hello');
  });

  it('does not serve the same route without the version prefix', async () => {
    await request(app.getHttpServer()).get('/hello').expect(404);
  });

  it('serves a controller that explicitly opts into version 2 at /v2, not /v1', async () => {
    await request(app.getHttpServer())
      .get('/v2/status')
      .expect(200, 'v2 status');
    await request(app.getHttpServer()).get('/v1/status').expect(404);
  });
});
