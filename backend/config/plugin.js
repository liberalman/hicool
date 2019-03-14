'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  passport: {
    enable: true,
    package: 'egg-passport'
  },
  oAuth2Server: {
    enable: true,
    package: 'egg-oauth2-server',
  },
  graphql: {
    enable: true,
    package: 'egg-graphql'
  },
  routerPlus: {
    enable: true,
    package: 'egg-router-plus'
  }
};
