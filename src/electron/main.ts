import { app, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { watch } from 'fs';
import * as AdmZip from 'adm-zip';
import * as uuid from 'uuid';
import { fileURLToPath } from 'url';

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

ipcMain.handle('exportCurrentExercise', (event: IpcMainInvokeEvent, args: any[]) => {

  const editExercisePath: string = path.join(app.getPath('userData'), 'edit-exercise');

  // Check the project file if exists
  if ((args as any).hasStartingProject && !fs.existsSync(path.join(editExercisePath, 'project.zip'))) {
    throw new Error('Starting project file error!');
  }

  saveExercise(args);

  if (!fs.existsSync(path.join(editExercisePath, 'exercise.json'))) {
    throw new Error('Project data file error!');
  }

  const saveFile = dialog.showSaveDialogSync(win, {
    title: 'Export exercise file',
    filters: [
      {
        name: 'Exercise Package File',
        extensions: [
          'exercisepackage'
        ]
      }
    ]
  });

  if (!saveFile) {
    return "CANCELED";
  }

  const extractExerciseZipFile: AdmZip = new AdmZip();
  extractExerciseZipFile.addFile('exercise.json', fs.readFileSync(path.join(editExercisePath, 'exercise.json')));
  if ((args as any).hasStartingProject) {
    extractExerciseZipFile.addFile('project.zip', fs.readFileSync(path.join(editExercisePath, 'project.zip')));
  }

  extractExerciseZipFile.writeZip(saveFile);

  return "OK";
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
    description: exerciseData.description,
    exercise_project_info: {
      title: exerciseData.projectTitle,
      starting_project: exerciseData.hasStartingProject
    },
    requirements: []
  };

  const contents: string[] = fs.readdirSync(editExercisePath);
  if (contents.length > 0) {
    for (const file of contents) {
      fs.unlink(path.join(editExercisePath, file), err => {
        if (err) throw err;
      });
    }
  }

  fs.writeFileSync(path.join(editExercisePath, 'exercise.json'), JSON.stringify(exercise));
  if (!!exerciseData.hasStartingProject && exerciseData.hasStartingProject !== '') {
    fs.copyFileSync(exerciseData.startingProjectUrl, path.join(editExercisePath, 'project.zip'));
  }

  return exercise;
});

ipcMain.handle('openExerciseFile', () => {
  // const result = fs.readFileSync(__dirname + '/assets/pirates.json');
  // return JSON.parse(result.toString());

  const dialogFileSelection: string[] | undefined = dialog.showOpenDialogSync(win, {
    title: 'Open exercise file',
    filters: [
      {
        name: 'Exercise Package File',
        extensions: [
          'exercisepackage'
        ]
      }
    ]
  });
  // console.log(dialogFileSelection);


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

ipcMain.handle('updateExerciseZipProject', (event: IpcMainInvokeEvent, args: any[]) => {
  if (!args) {
    throw new Error('No args provided!');
  }

  const exerciseFile = args as any as ExerciseFile;

  if (exerciseFile && exerciseFile.fileUrl) {


    if (!fs.existsSync(exerciseFile.fileUrl)) {
      throw new Error('File not found');
    }

    const editExerciseFilePath: string = path.join(app.getPath('userData'), 'edit-exercise', 'project.zip');

    fs.copyFileSync(exerciseFile.fileUrl, editExerciseFilePath);

    return editExerciseFilePath;

  } else {
    throw new Error('File data error');
  } 
  
});

const saveExercise = (exercise: any): void => {
  const editExercisePath: string = path.join(app.getPath('userData'), 'edit-exercise');
  fs.writeFileSync(path.join(editExercisePath, 'exercise.json'), JSON.stringify(exercise, null, 2));
};

interface ExerciseFile {
  fileUrl: string;
}

interface ExerciseData {
  exerciseName: string;
  projectTitle: string;
  startingProjectUrl: string;
  hasStartingProject: boolean
}
