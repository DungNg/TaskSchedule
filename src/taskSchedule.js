const { Notification, BrowserWindow } = require("electron");
const path = require("path");

let invisibleWindow = null;
let setTimeoutId = null;
let [title, body] = ["", ""];

const createInvisibleWindow = () => {
  if (invisibleWindow) {
    return;
  }
  invisibleWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: 400,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  invisibleWindow.loadFile(path.join(__dirname, "invisible.html"));
  invisibleWindow.on("closed", (event) => {
    invisibleWindow = null;
  });
  // Open the DevTools.
  // invisibleWindow.webContents.openDevTools();
};

function getInputFromUser(_title, _body) {
  title = _title;
  body = _body;
}

function notify(title, body) {
  new Notification({
    title: title,
    body: body,
    urgency: "normal",
  }).show();
}

const calculateTimeToMinutes = () => {
  let halfHour = 1;
  let fullHour = 2;
  let oneMinutes = 1000 * 60;
  let oneSeconds = 1000;
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  if (currentMinutes > halfHour && currentMinutes < fullHour) {
    return (
      (fullHour - currentMinutes) * oneMinutes - currentSeconds * oneSeconds
    );
  }

  if (currentMinutes > 0 && currentMinutes < halfHour) {
    return (
      (halfHour - currentMinutes) * oneMinutes - currentSeconds * oneSeconds
    );
  }
  return halfHour * oneMinutes - currentSeconds * oneSeconds;
};

function playAudio() {
  createInvisibleWindow();
}

function stopAudio() {
  if (invisibleWindow) {
    invisibleWindow.close();
    invisibleWindow = null;
  }
}

function scheduleTask() {
  setTimeoutId = setTimeout(() => {
    notify(title || "Information", body || "Stand up and exercise");
    playAudio();
    scheduleTask();
  }, calculateTimeToMinutes());
}

function isScheduledTask() {
  return setTimeoutId != null ? true : false;
}

function isAlertRingging() {
  return invisibleWindow != null ? true : false;
}

function stopScheduledTask() {
  clearTimeout(setTimeoutId);
  setTimeoutId = null;
  stopAudio();
}

module.exports = {
  scheduleTask,
  stopScheduledTask,
  isScheduledTask,
  isAlertRingging,
  calculateTimeToMinutes,
  stopAudio,
  getInputFromUser,
};
