var merge = require('./merge'),
  load = require('./load'),
  path = require('path'),
  fs = require('fs');

module.exports = function( /* Object */ options) {

  if (typeof arguments[0] === 'string') {

    basePath = arguments[0];
    alwaysRequireEnv = arguments[0];

  } else {

    options = options || {};

    basePath = options.basePath;
    alwaysRequireEnv = options.alwaysRequireEnv;
    parser = options.parser;

  }

  basePath = path.normalize(basePath);
  var domains = {};
  var env = process.env.NODE_ENV || 'development';
  var files = fs.readdirSync(basePath);

  var get = function(domain, requireEnv) {
    var config;

    // default to global expectation unless specifically overridden.
    if (requireEnv !== false && alwaysRequireEnv === true) {
      requireEnv = true;
    }

    if (domains.hasOwnProperty(domain)) {
      return domains[domain];
    }

    config = merge(
      load(path.join(basePath, domain + defaultExtension), domain, true),
      load(path.join(basePath, domain + '.' + env + defaultExtension), domain + "." + env, !! (requireEnv === true)), parser);

    domains[domain] = config;

    return config;
  };

  get.all = function() {
    files.forEach(function(file) {
      if (file.match(/^\./)) return;
      if (!file.match(/\.json$/i)) return;
      var domain = file.match(/^(.*?)\./i)[1];
      if (domains.hasOwnProperty(domain)) return;
      domains[domain] = merge(
        load(path.join(basePath, domain + defaultExtension), domain, true), load(path.join(basePath, domain + '.' + env + defaultExtension), domain, false)
      );
    });

    return domains;
  };

  return get;
};