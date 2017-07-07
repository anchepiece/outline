// @flow
import debug from 'debug';

const debugCache = debug('cache');

export default function cache() {
  return function cacheMiddleware(ctx: Object, next: Function) {
    ctx.cache = {};

    ctx.cache.set = (id, value) => {
      ctx.cache[id] = value;
    };

    ctx.cache.get = async (id, def) => {
      if (ctx.cache[id]) {
        debugCache(`hit: ${id}`);
      } else {
        debugCache(`miss: ${id}`);
        const result = await def();
        debugCache(`setting: ${id}`, result);
        await ctx.cache.set(id, result);
      }
      return ctx.cache[id];
    };
    return next();
  };
}
