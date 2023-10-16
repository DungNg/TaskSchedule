const notify = async (title, body) => {
  if (!title) {
    title = "Thông báo";
  }
  if (!body) {
    body = "Tập thể dục đê";
  }
  await versions.notify(title, body);
};

const calculateTimeToMinutes = () => {
  let halfHour = 30;
  let fullHour = 60;
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

const getInputFromUser = () => {
  let title = document.getElementById("title").value;
  let body = document.getElementById("body").value;
  return { title, body };
};

let audioElement = null;
const playAudio = () => {
  if (audioElement == null) {
    audioElement = document.createElement("audio");
    audioElement.setAttribute("src", "../assets/mixkit-guitar.wav");
    audioElement.setAttribute("autoplay", "autoplay");
    audioElement.loop = true;
  }
  audioElement.load();
};

const stopAudio = () => {
  if (audioElement != null) {
    audioElement.pause();
  }
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

const main = async () => {
  let setTimeoutId = null;
  let setIntervalId = null;
  let { title, body } = getInputFromUser();

  setTimeoutId = setTimeout(() => {
    notify(title, body);
    playAudio();
    main();
  }, calculateTimeToMinutes());

  setIntervalId = setInterval(() => {
    let countdownTime = calculateTimeToMinutes();
    countdownTime = countdownTime - 1000;
    document.getElementById("countdown").innerHTML = msToTime(countdownTime);

    if (countdownTime <= 0) {
      clearInterval(setIntervalId);
    }
  }, 1000);
};

let btnStart = document.getElementById("btn-start");
let btnStopAudio = document.getElementById("btn-stop-audio");
btnStart.addEventListener("click", () => {
  main();
});
btnStopAudio.addEventListener("click", () => {
  stopAudio();
});
