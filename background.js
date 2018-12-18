let audio = new Audio();

function playAudio() {
  audio.src = "http://europa.shoutca.st:8648/;/;stream.mp3";
  audio.play();
}
function stopAudio() {
  audio.pause();
  audio.src = "";
  audio = new Audio();
  console.log(audio.src);
}

// Receiving messages from popup.js to play and stop audio
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.status == "playing") {
        playAudio();
    } else if (message.status == "stopped") {
        stopAudio();
    } else if (message.status == "loaded") {
      // Every time page loads check if audio is playing if so, send response "toggleIcon"
        if (!audio.paused) {
            sendResponse({action: "toggleIcon"});
        }
    }
});
