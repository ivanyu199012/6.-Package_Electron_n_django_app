/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import axios from 'axios';
import './index.css';

const btnGetValFromDjango = document.getElementById('btn_get_val_from_django');

btnGetValFromDjango.onclick = async () => {
  const res = await axios.get('http://127.0.0.1:8000/edtwExampleAPI/get_val_from/', {
    params: {
      input: (document.getElementById('input_text') as HTMLInputElement).value
    }
  });

  document.getElementById('p_output').innerHTML = res.data;
};

// eslint-disable-next-line no-console
console.log('This message is being logged by "renderer.js", included via webpack');
