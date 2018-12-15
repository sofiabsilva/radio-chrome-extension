const player = document.querySelector(".player");
const drawer = document.querySelector(".drawer");
const drawerIcon = document.querySelector(".drawerIcon");
player.addEventListener("click", toggleAudio);
drawer.addEventListener("click", lastAired);

// Getting current songs from centovacast JSON
function currentSongs() {
  const songInfo = document.querySelector("#currentSong");
  const albumCover = document.querySelector("#cover");
  let content;
  $.getJSON('https://europa.shoutca.st/rpc/atsueste/streaminfo.get', function(data) {
      content = `<ul>
      <li>Song: ${data.data[0]['track']['title']}</li>
      <li>Artist: ${data.data[0]['track']['artist']}</li>
      </ul>`;
      albumCover.src=`${data.data[0]['track']['imageurl']}`;
      songInfo.innerHTML= content;
  });
}

// Update song info every 4 seconds
setInterval(currentSongs, 4000);

// flag to keep track if drawer is open
let open = false;
// Get the 10 last aired songs
function lastAired() {
const songsList = document.querySelector("#recentSongs");
  if (!open) {
    let content;
    if (typeof(content) == "undefined") {
    // http://www.ajaxload.info/
    recentSongs.innerHTML= "<img class='loading' alt='loading' src='images/ajax-loader.gif'/>";
    }
    $.getJSON('https://europa.shoutca.st/recentfeed/atsueste/json/', function(data) {
      content = `<ul id ="airedList">`
      let lastFive = Object.entries(data.items).slice(1,6);
      console.log(lastFive);
        for (let i = 0; i < lastFive.length; i++) {
          content += `<li>
          <img src="${lastFive[i][1]['enclosure']['url']}" alt="${lastFive[i][1]['description']}">
          ${lastFive[i][1]['title']}</li>`;
        }
      content +=`</ul>`;
      recentSongs.innerHTML= content;
    })
    open = true;
    drawerIcon.classList.toggle("fa-angle-down");
    drawerIcon.classList.toggle("fa-angle-up");
  } else {
    songsList.removeChild(songsList.firstChild);
    open = false;
    drawerIcon.classList.toggle("fa-angle-down");
    drawerIcon.classList.toggle("fa-angle-up");
  }
}

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
