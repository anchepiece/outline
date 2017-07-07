// @flow
import type { Model, Context } from '../types';

export default function cachedPresenter(presenter: Function) {
  return async function(ctx: Context, model: Model, options: ?Object) {
    console.log('getting cache', model.id);
    return await ctx.cache.get(model.id, async () => {
      const output = await presenter(ctx, model, options);
      console.log('output', model);
      return output;
    });
  };
}
