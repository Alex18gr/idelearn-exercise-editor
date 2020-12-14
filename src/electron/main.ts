import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import { watch } from 'fs';

export let win: BrowserWindow;

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
  win = mainWindow;
}

app.whenReady().then(() => {
  createWindow();
  watch('./Dist/Client/', (eventType, filename)=>{ win.reload(); })
});

ipcMain.handle('getPirates', () => {
  const result = fs.readFileSync(__dirname + '/assets/pirates.json');
  return JSON.parse(result.toString());
});

ipcMain.handle('openExerciseFile', () => {
  // const result = fs.readFileSync(__dirname + '/assets/pirates.json');
  // return JSON.parse(result.toString());

  const dialogSelection: string[] | undefined = dialog.showOpenDialogSync(win);
  console.log(dialogSelection);
  return dialogSelection;
});
