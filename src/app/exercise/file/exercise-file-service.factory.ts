import { ElectronService } from "ngx-electron";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";
import { ExerciseDialogService } from "../dialogs/exercise-dialog.service";
import { ExerciseService } from "../exercise.service";
import { ExerciseFileLocalService } from "./exercise-file-local.service";
import { ExerciseFileService } from "./exercise-file.service";

export const exerciseFileServiceFactory = (
    electron: ElectronService,
    exerciseService: ExerciseService,
    messageService: MessageService,
    exerciseDialogService: ExerciseDialogService
) => {
    return !environment.desktop ? new ExerciseFileService : new ExerciseFileLocalService(electron, messageService, exerciseDialogService);
};