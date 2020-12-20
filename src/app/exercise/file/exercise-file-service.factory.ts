import { ElectronService } from "ngx-electron";
import { environment } from "src/environments/environment";
import { ExerciseFileLocalService } from "./exercise-file-local.service";
import { ExerciseFileService } from "./exercise-file.service";

export const exerciseFileServiceFactory = (electron: ElectronService) => {
    return !environment.desktop ? new ExerciseFileService : new ExerciseFileLocalService(electron);
};