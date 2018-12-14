let audio = new Audio();
//audio.src = "http://europa.shoutca.st:8648/;/;stream.mp3";
console.log("current source is " + audio.src)

// Receiving messages from popup.js to play and stop audio
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.status == "playing") {
        audio.src = "http://europa.shoutca.st:8648/;/;stream.mp3";
        audio.play();
        console.log("audio is playing from background");
    } else if (message.status == "stopped") {
      audio.pause();
      audio = new Audio();
      setTimeout(function () {
        audio.load(); // This stops the stream from downloading
     });
      console.log("the audio is paused from background")
      console.log(audio.src);
    } else if (message.status == "loaded") {
      // Every time page loads check if audio is playing if so, send response "toggleIcon"
        if (!audio.paused) {
            sendResponse({action: "toggleIcon"});
        }
    }
});
