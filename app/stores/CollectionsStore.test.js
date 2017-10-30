/* eslint-disable */
import CollectionsStore from './CollectionsStore';

jest.mock('utils/ApiClient', () => ({
  client: { post: {} },
}));
jest.mock('stores', () => ({ errors: {} }));

describe('CollectionsStore', () => {
  let store;

  beforeEach(() => {
    const cache = {
      getItem: jest.fn(() => Promise.resolve()),
      setItem: jest.fn(() => {}),
    };

    store = new CollectionsStore({
      teamId: 123,
      cache,
    });
  });

  describe('#fetch', () => {
    test('should load stores', async () => {
      store.client = {
        post: jest.fn(() => ({
          data: [
            {
              name: 'New collection',
            },
          ],
        })),
      };

      await store.fetchAll();

      expect(store.client.post).toHaveBeenCalledWith('/collections.list', {
        id: 123,
      });
      expect(store.data.length).toBe(1);
      expect(store.data[0].name).toBe('New collection');
    });

    test('should report errors', async () => {
      store.client = {
        post: jest.fn(() => Promise.reject),
      };
      store.errors = {
        add: jest.fn(),
      };

      await store.fetchAll();

      expect(store.errors.add).toHaveBeenCalledWith(
        'Failed to load collections'
      );
    });
  });
});
