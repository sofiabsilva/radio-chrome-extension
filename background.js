let audio = new Audio();
audio.src = "http://europa.shoutca.st:8648/;/;stream.mp3";

// Receiving messages from popup.js to play and stop audio
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.status == "playing") {
      audio.play();
      console.log("audio is playing from background");
    } else if (message.status == "stopped") {
      audio.pause();
      console.log("the audio is paused from background")
    } else if (message.status == "loaded") {
      // Every time page loads check if audio is playing if so, send response "toggleIcon"
        if (!audio.paused) {
            sendResponse({action: "toggleIcon"});
            console.log(!audio.paused);
        }
    }
});
