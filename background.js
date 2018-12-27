let audio = new Audio();

// Option to turn off sound of extension when another tab is audible
let tabAudio;
function checkTabs() {
  chrome.storage.sync.get(['mute'], function(result) {
          if (result.mute) {
            chrome.tabs.query({audible: true}, function callback(data) {
              // when a tab is audible
              if (!audio.paused && data.length > 0) {
                  tabAudio = true;
                  stopAudio();
              } else if (tabAudio && data.length == 0) {
                  tabAudio = false;
                  playAudio();
              }
            });
          }
        });
}
setInterval(checkTabs, 1000);

function playAudio() {
  audio.src = "http://europa.shoutca.st:8648/;/;stream.mp3";
  audio.play();
}
function stopAudio() {
  audio.pause();
  audio.src = "";
  audio = new Audio();
}

// Receiving messages from popup.js to play and stop audio
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.status == "playing") {
        playAudio();
        checkTabs();
    } else if (message.status == "stopped") {
        stopAudio();
    } else if (message.status == "loaded") {
      // Every time page loads check if audio is playing if so, send response "toggleIcon"
        if (!audio.paused) {
            sendResponse({action: "toggleIcon"});
        }
    }
});
