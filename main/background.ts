import { app } from 'electron';
import TrayGenerator from './helpers/TrayGenerator';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

const windowOpts = {
  width: 700,
  height: 700,
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
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    const trayGenerator: TrayGenerator = new TrayGenerator(
      mainWindow,
      '/Users/rogersiver/Workspace/pomodoro/main/IconTemplate.png'
    );
    tray = trayGenerator.tray;
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
