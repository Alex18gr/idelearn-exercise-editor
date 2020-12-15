import { app, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { watch } from 'fs';
import * as AdmZip from 'adm-zip';
import * as uuid from 'uuid';

export let win: BrowserWindow;

function createWindow() {
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
  watch('./Dist/Client/', (eventType, filename) => { win.reload(); })
});

ipcMain.handle('getPirates', () => {
  const result = fs.readFileSync(__dirname + '/assets/pirates.json');
  return JSON.parse(result.toString());
});

ipcMain.handle('createNewExercise', (event: IpcMainInvokeEvent, args: any[]) => {
  if (!args) {
    throw new Error('No args provided!');
  }

  const editExercisePath: string = path.join(app.getPath('userData'), 'edit-exercise');

  if (!fs.existsSync(editExercisePath)) {
    fs.mkdirSync(editExercisePath);
  }

  const exerciseData = args as any;
  const newUuid: string = uuid.v4();

  const exercise: any = {
    id: newUuid,
    name: exerciseData.exerciseName,
    targets: [],
    exercise_project_info: {
      title: exerciseData.projectTitle,
      starting_project: exerciseData.hasStartingProject
    },
    requirements: []
  }

  const contents: string[] = fs.readdirSync(editExercisePath);
  if (contents.length > 0) {
    for (const file of contents) {
      fs.unlink(path.join(editExercisePath, file), err => {
        if (err) throw err;
      });
    }
  }

  fs.writeFileSync(path.join(editExercisePath, 'exercise.json'), JSON.stringify(exercise));
  return exercise;
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

interface ExerciseData {
  exerciseName: string;
  projectTitle: string;
  startingProjectUrl: string;
  hasStartingProject: boolean
}
