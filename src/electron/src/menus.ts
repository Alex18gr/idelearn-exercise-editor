import { shell, Menu, ipcMain, ipcRenderer, MenuItem, BrowserWindow } from "electron";

const { app } = require('electron');

const template: any = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Exercise',
                click: (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) => {
                    browserWindow?.webContents.send('newExercisePrompt', {});
                }
            },
            {
                label: 'Open Exercise',
                click: (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) => {
                    browserWindow?.webContents.send('openExercisePrompt', {});
                }
            },
            {
                label: 'Save Exercise',
                click: (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) => {
                    browserWindow?.webContents.send('exportExercisePrompt', {});
                }
            }

        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: (item: any, focusedWindow: any) => {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label: 'Toggle Full Screen',
                accelerator: (function () {
                    if (process.platform === 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                })(),
                click: (item: any, focusedWindow: any) => {
                    if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: (function () {
                    if (process.platform === 'darwin')
                        return 'Alt+Command+I';
                    else
                        return 'Ctrl+Shift+I';
                })(),
                click: (item: any, focusedWindow: any) => {
                    if (focusedWindow)
                        focusedWindow.toggleDevTools();
                }
            },
        ]
    },
    {
        label: 'Window',
        role: 'window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: function () { shell.openExternal('http://electron.atom.io') }
            },
        ]
    },
];

if (process.platform === 'darwin') {
    const { name } = app;
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Services',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function () { app.quit(); }
            },
        ]
    });
    const windowMenu = template.find((m: any) => { return m.role === 'window' })
    if (windowMenu) {
        windowMenu.submenu.push(
            {
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front'
            }
        );
    }
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);