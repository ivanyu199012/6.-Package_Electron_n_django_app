/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const fs = require('fs-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = function afterExtract(extractPath, electronVersion, platform, arch, done) {
  console.log({ extractPath });
  fs.copy('./python/dist/edtwExample', path.join(extractPath, 'python'), () => {
    console.log('Finished Copy Python Folder');
    done();
  });
};
