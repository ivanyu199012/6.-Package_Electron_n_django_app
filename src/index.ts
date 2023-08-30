/* eslint-disable no-console */
import { app, BrowserWindow } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import kill from 'tree-kill';
import * as path from 'path';
import { platform, cwd, env } from 'node:process';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
let DJANGO_CHILD_PROCESS: ChildProcess = null;

// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const UpsertKeyValue = (obj: Record<string, any>, keyToChange: string, value: string[]) => {
  const keyToChangeLower = keyToChange.toLowerCase();
  Object.keys(obj).forEach((key) => {
    if (key.toLowerCase() === keyToChangeLower) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = value;
    }
  });
  // eslint-disable-next-line no-param-reassign
  obj[keyToChange] = value;
};

const isDevelopmentEnv = () => {
  console.log(`NODE_ENV=${env.NODE_ENV}`);
  return env.NODE_ENV === 'development';
};

const spawnDjango = () => {
  if (isDevelopmentEnv()) {
    return spawn(
      path.join(cwd(), 'python', 'venv', 'bin', 'python'),
      [path.join('python', 'edtwExample', 'manage.py'), 'runserver', '--noreload'],
      {
        shell: true,
        stdio: [0, 'pipe', 'pipe']
      }
    );
  }
  return spawn(
    path.join(app.getAppPath(), '..', 'python', 'edtwExample'),
    ['runserver', '--settings=edtwExample.settings.prod', '--noreload'],
    {
      shell: true
    }
  );
};
const startDjangoServer = () => {
  DJANGO_CHILD_PROCESS = spawnDjango();
  DJANGO_CHILD_PROCESS.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  DJANGO_CHILD_PROCESS.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  DJANGO_CHILD_PROCESS.on('error', (error) => {
    console.error(`[ERROR] ${error.message}`);
  })
    .on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    })
    .on('message', (message) => {
      console.log(`stdout: ${message}`);
    });
  return DJANGO_CHILD_PROCESS;
};

const openDevTools = (mainWindow: BrowserWindow) => {
  if (isDevelopmentEnv()) {
    mainWindow.webContents.openDevTools();
  }
};

const createWindow = (): void => {
  startDjangoServer();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 768,
    width: 1024
  });

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const { requestHeaders } = details;
    UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
    callback({ requestHeaders });
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    callback({
      responseHeaders
    });
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  openDevTools(mainWindow);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
  kill(DJANGO_CHILD_PROCESS.pid);
});

app.on('before-quit', async () => {
  // Kill python process when the window is closed
  kill(DJANGO_CHILD_PROCESS.pid);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
