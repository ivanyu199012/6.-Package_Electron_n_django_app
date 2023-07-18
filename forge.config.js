// const packager = require('electron-packager');
const { serialHooks } = require('electron-packager/src/hooks');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  packagerConfig: {
    afterExtract: [
      serialHooks([
        // eslint-disable-next-line no-unused-vars
        async (extractPath, electronVersion, platform, arch) => {
          console.log({ extractPath });
          await fs.copy('./python/dist/edtwExample', path.join(extractPath, 'python'));
          console.log('New: Finished Copy Python Folder');
        }
      ])
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'edtwexample'
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'edtwexample',
        overwrite: true
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: "connect-src 'self' http://127.0.0.1:8000 'unsafe-eval'",
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              name: 'main_window',
              html: './src/index.html',
              js: './src/renderer.ts'
            }
          ]
        }
      }
    }
  ]
};
