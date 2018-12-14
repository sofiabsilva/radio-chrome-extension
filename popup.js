const player = document.querySelector(".player");
player.addEventListener("click", toggleAudio);

// Getting current songs from centovacast JSON
function currentSongs() {
  let songInfo = document.querySelector("#currentSong");
  let content;
  $.getJSON('https://europa.shoutca.st/rpc/atsueste/streaminfo.get', function(data) {
      content = `<ul>`;
          content += `<li>Song: ${data.data[0]['track']['title']}</li>`;
          console.log(JSON.stringify(data.data[0]['track']));
          content +=`<li>Artist: ${data.data[0]['track']['artist']}</li>`;
      content += `</ul>`;
      songInfo.innerHTML= content;
  });
}

// Update song info every 5 seconds
setInterval(currentSongs, 5000);

// When popup is open get current songs and when the audio is already playing change the player icon
window.onload = function() {
  currentSongs();
  chrome.runtime.sendMessage({status: "loaded"}, function(response) {
    if (response.action == "toggleIcon") {
      player.classList.toggle("fa-stop-circle");
      player.classList.toggle("fa-play-circle");
    }
  });
}

// Change the player icon and send message to background script to play stream (even when the popup is closed)
function toggleAudio() {
  if (player.classList.contains("fa-play-circle")) {
    chrome.runtime.sendMessage({status: "playing"}, function() {
      console.log("playing stream");
      player.classList.toggle("fa-stop-circle");
      player.classList.toggle("fa-play-circle");
    });
  } else if (player.classList.contains("fa-stop-circle")) {
      chrome.runtime.sendMessage({status: "stopped"}, function() {
        console.log("stopping");
        player.classList.toggle("fa-stop-circle");
        player.classList.toggle("fa-play-circle");
      });
  };
}
