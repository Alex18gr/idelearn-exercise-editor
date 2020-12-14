import { dialog, ipcMain,  } from 'electron';
import * as fs from 'fs';
import { win } from '../main';

ipcMain.handle('openExerciseFile', () => {
    // const result = fs.readFileSync(__dirname + '/assets/pirates.json');
    // return JSON.parse(result.toString());

    const dialogSelection: string[] | undefined = dialog.showOpenDialogSync(win);
    console.log(dialogSelection);
    return dialogSelection;
});