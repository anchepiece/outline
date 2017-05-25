import TestServer from 'fetch-test-server';
import app from '..';

import { flushdb, seed, sequelize } from '../test/support';

const server = new TestServer(app.callback());

beforeEach(flushdb);
afterAll(() => server.close());
afterAll(() => sequelize.close());

describe('#document.star', async () => {
  it('should star document', async () => {
    const { user, document } = await seed();
    const res = await server.post('/api/documents.star', {
      body: { id: document.id, token: user.getJwtToken() },
    });
    const body = await res.json();

    expect(res.status).toEqual(200);
    expect(body).toMatchSnapshot();
  });
});
