'use strict';

module.exports = {
  Query: {
    article(root, { id }, ctx) {
      return ctx.connector.article.fetchById(id);
    },
  },
};
