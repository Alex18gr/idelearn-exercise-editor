import { app, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { watch } from 'fs';
import * as AdmZip from 'adm-zip';
import * as uuid from 'uuid';
import { fileURLToPath } from 'url';
const ExerciseHandlers = require('./handlers/exercise.handler');
const menus = require('./menus');

export let win: BrowserWindow;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 650,
    minHeight: 450,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  // on application close event
  mainWindow.on('close', (e: Electron.Event) => {
    const choice = dialog.showMessageBoxSync(
      mainWindow,
      {
        type: 'question',
        buttons: ['Close', 'Cancel'],
        title: 'Confirm Exit',
        message: 'Do you really want to close the application?'
      }
    );
    console.log('CHOICE: ', choice);
    if (choice > 0) e.preventDefault();
  })
  win = mainWindow;
}

app.whenReady().then(() => {
  createWindow();
  watch('./Dist/Client/', (eventType, filename) => { win.reload(); })
});



