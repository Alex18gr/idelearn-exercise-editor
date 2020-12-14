import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { watch } from 'fs';
import * as AdmZip from 'adm-zip';

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

  const dialogFileSelection: string[] | undefined = dialog.showOpenDialogSync(win);
  console.log(dialogFileSelection);
  

  if (dialogFileSelection) {
    const editExercisePath: string = path.join(app.getPath('userData'), 'edit-exercise');

    if (!fs.existsSync(editExercisePath)) {
      fs.mkdirSync(editExercisePath);
    }

    const contents: string[] = fs.readdirSync(editExercisePath);
    if (contents.length > 0) {
      for (const file of contents) {
        fs.unlink(path.join(editExercisePath, file), err => {
          if (err) throw err;
        });
      }
    }
    const exerciseZip: AdmZip = new AdmZip(dialogFileSelection[0]);
    exerciseZip.extractAllTo(editExercisePath, true);
  
    const exerciseData = JSON.parse(fs.readFileSync(path.join(editExercisePath, 'exercise.json'), 'utf8'));
    return exerciseData;
  }

  return null;
  
});
