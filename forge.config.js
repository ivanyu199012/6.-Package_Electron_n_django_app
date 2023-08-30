const { serialHooks } = require('electron-packager/src/hooks');
const fs = require('fs-extra');
const path = require('path');

const projectName = 'edtwExample';

module.exports = {
  packagerConfig: {
    afterComplete: [
      serialHooks([
        // eslint-disable-next-line no-unused-vars
        async (builtPath, electronVersion, platform, arch) => {
          console.log({ builtPath: builtPath });
          if (platform === 'darwin') {
            await fs.copy(
              path.join(process.cwd(), 'python', 'dist', projectName),
              path.join(builtPath, `${projectName}.app`, 'Contents', 'Resources', 'python')
            );
          } else {
            // handle for other platforms as well
            await fs.copy(path.join(process.cwd(), 'python', 'dist', projectName), path.join(builtPath, 'python'));
          }
          console.log('New: Finished Copy Python Folder');
        }
      ])
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: projectName
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: projectName,
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
