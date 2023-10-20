let btnStart = document.getElementById("btn-start");
let btnStop = document.getElementById("btn-stop");
let btnStopAudio = document.getElementById("btn-stop-audio");
let countdownTimer = document.getElementById("countdown");

const getInputFromUser = () => {
  let title = document.getElementById("title").value;
  let body = document.getElementById("body").value;
  return { title, body };
};

let MODE = {
  STOPPED: "stopped",
  STARTED: "started",
  ALERT: "alert",
  SNOOZED: "snoozed",
};
let CURRENT_MODE = null;
const AppStatus = (mode) => {
  const result = {
    [MODE.STOPPED]: () => {
      countdownTimer.innerHTML = "00:00:00";
      btnStart.disabled = false;
      btnStop.disabled = true;
      btnStopAudio.disabled = true;
      CURRENT_MODE = MODE.STOPPED;
    },
    [MODE.STARTED]: () => {
      btnStart.disabled = true;
      btnStop.disabled = false;
      CURRENT_MODE = MODE.STARTED;
    },
    [MODE.ALERT]: () => {
      btnStart.disabled = true;
      btnStop.disabled = false;
      btnStopAudio.disabled = false;
      CURRENT_MODE = MODE.ALERT;
    },
    [MODE.SNOOZED]: () => {
      btnStart.disabled = true;
      btnStop.disabled = false;
      btnStopAudio.disabled = true;
      CURRENT_MODE = MODE.SNOOZED;
    },
  };
  return result[mode]();
};

const stopAudio = async () => {
  await window.bridge.stopAudio();
  AppStatus(MODE.SNOOZED);
};

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return (hrs || "00") + ":" + (mins || "00") + ":" + secs;
}

let setIntervalId = null;
const countdown = () => {
  setIntervalId = setInterval(async () => {
    let countdownTime = await bridge.calculateTimeToMinutes();
    countdownTime = countdownTime - 1000;
    document.getElementById("countdown").innerHTML = msToTime(countdownTime);
    if (countdownTime <= 0) {
      if ((await isScheduledTask()) === false) {
        clearInterval(setIntervalId);
      }
    }
  }, 1000);
};

const main = async () => {
  let { title, body } = getInputFromUser();
  await bridge.getInputFromUser(title, body);
  await bridge.scheduleTask();
  countdown();
  AppStatus(MODE.STARTED);
};

const stop = async () => {
  clearInterval(setIntervalId);
  await bridge.stopScheduledTask();
  AppStatus(MODE.STOPPED);
};

btnStart.addEventListener("click", () => {
  main();
});
btnStop.addEventListener("click", () => {
  stop();
});
btnStopAudio.addEventListener("click", () => {
  stopAudio();
});

let isScheduledTask = async () => {
  return await bridge.isScheduledTask();
};

let isAlertRingging = async () => {
  return await bridge.isAlertRingging();
};

let resumeCountdown = async () => {
  if (CURRENT_MODE != null) {
    return;
  }
  if ((await isScheduledTask()) === true) {
    countdown();
    AppStatus(MODE.STARTED);
  }
};

let enableSnoozeIfAlertIsRingging = async () => {
  if (CURRENT_MODE === MODE.ALERT) {
    return;
  }
  if ((await isAlertRingging()) === true) {
    AppStatus(MODE.ALERT);
  }
};

setInterval(async () => {
  await resumeCountdown();
  await enableSnoozeIfAlertIsRingging();
}, 0);
