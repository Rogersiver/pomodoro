import { app } from 'electron';
import TrayGenerator from './helpers/TrayGenerator';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import path from 'path';

const isProd: boolean = process.env.NODE_ENV === 'production';
console.log(path.join(__dirname, '../resources/IconTemplate@2x.png'));
const windowOpts = {
  width: 660,
  height: 360,
  minHeight: 650,
  minWidth: 350,
  maxWidth: 700,
  maxHeight: 700,
  resizable: true,
};

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  let tray;
  await app.whenReady();

  const mainWindow = createWindow('main', windowOpts);

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
    const trayGenerator: TrayGenerator = new TrayGenerator(
      mainWindow,
      '/Users/rogersiver/Workspace/pomodoro/resources/IconTemplate@2x.png'
    );
    tray = trayGenerator.tray;
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    const trayGenerator: TrayGenerator = new TrayGenerator(
      mainWindow,
      path.join(__dirname, '../resources/IconTemplate@2x.png')
    );
    tray = trayGenerator.tray;
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
