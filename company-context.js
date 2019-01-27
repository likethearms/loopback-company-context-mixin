module.exports = (Model, options) => {
  Model.beforeRemote('*', (ctx, _, next) => {
    const writeMethodNames = [
      'create',
      'replaceOrCreate',
      'patchOrCreate',
    ];

    if (options.debug) {
      console.log(`METHOD_NAME: ${ctx.method.name}`);
      console.log('CTX.ARGS:', ctx.args);
      console.log('CTX.ARGS.OPTIONS:', ctx.args.options);
    }
    if (writeMethodNames.includes(ctx.method.name)) return next();
    if (options
      && 'ignore' in options
      && options.ignore.includes(ctx.method.name)) return next();
    if (!ctx.args.filter) ctx.args.filter = {};
    if (!ctx.args.where) ctx.args.where = {};
    if (!ctx.args.filter.where) ctx.args.filter.where = {};
    const { userId } = ctx.args.options.accessToken;
    return Model.app.models.Member.findById(userId, (err, user) => {
      ctx.args.filter.where.companyId = user.companyId;
      ctx.args.where.companyId = user.companyId;
      next();
    });
  });
};
