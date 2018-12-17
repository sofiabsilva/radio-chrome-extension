let audio = new Audio();

// Receiving messages from popup.js to play and stop audio
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.status == "playing") {
        audio.src = "http://europa.shoutca.st:8648/;/;stream.mp3";
        audio.play();
    } else if (message.status == "stopped") {
      audio.pause();
      audio.src = "";
      audio = new Audio();
      console.log(audio.src);
    } else if (message.status == "loaded") {
      // Every time page loads check if audio is playing if so, send response "toggleIcon"
        if (!audio.paused) {
            sendResponse({action: "toggleIcon"});
        }
    }
});
