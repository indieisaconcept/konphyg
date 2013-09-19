var fs = require('fs');

module.exports = function(filePath, domain, throwIfNotFound, parser) {

  parser = parser || JSON;

  var fileContents, ret;

  try {
    fileContents = fs.readFileSync(filePath)
  } catch(err) {
    if (err.code === 'EBADF' || err.code == 'ENOENT') {
      if (throwIfNotFound) {
        throw new Error('Could not find configuration file for ' + domain + ' domain: ' + filePath);
      }
      return null;
    }
    throw err;
  }
  try {
    ret = parser.parse(fileContents)
  } catch(err) {
    throw new Error('Error parsing JSON file ' + filePath);
  }
  return ret;
};