const player = document.querySelector(".player");
const drawer = document.querySelector("#drawer");
const drawerIcon = document.querySelector(".drawerIcon");
player.addEventListener("click", toggleAudio);
drawer.addEventListener("click", lastAired);

// when not being clicked:
drawerIcon.removeAttribute("style");
// Getting current songs from centovacast JSON
function currentSongs() {
  const songInfo = document.querySelector("#currentSong");
  const albumCover = document.querySelector("#cover");
  let content;
  $.getJSON('https://europa.shoutca.st/rpc/atsueste/streaminfo.get', function(data) {
      content = `<ul>
      <li class="songTitle">Song: ${data.data[0]['track']['title']}</li>
      <li class="artist">Artist: ${data.data[0]['track']['artist']}</li>
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
  // toggle icons
  drawerIcon.classList.toggle("fa-angle-down");
  drawerIcon.classList.toggle("fa-angle-up");
  const songsList = document.querySelector("#recentSongs");

  if (drawerIcon.classList.contains("fa-angle-down")) {
      drawerIcon.classList.add("open");
      drawerIcon.classList.remove("closed");
  }
  // if drawerIcon contains angle up when button clicked
  if (drawerIcon.classList.contains("fa-angle-up")) {
      drawerIcon.classList.remove("open");
      drawerIcon.classList.add("closed");
  }
  if (!open) {
    let content;
    // loading animation
    if (typeof(content) == "undefined") {
    // http://www.ajaxload.info/
    recentSongs.innerHTML= "<img class='loading' alt='loading' src='images/ajax-loader.gif'/>";
    }
    $.getJSON('https://europa.shoutca.st/recentfeed/atsueste/json/', function(data) {
      content = `<ul id ="airedList">`
      let lastFive = Object.entries(data.items).slice(1,6);
        for (let i = 0; i < lastFive.length; i++) {
          content += `<li>
          <img src="${lastFive[i][1]['enclosure']['url']}" alt="${lastFive[i][1]['description']}">
          ${lastFive[i][1]['title']}</li>`;
        }
      content +=`</ul>`;
      recentSongs.innerHTML= content;
    })
    open = true;
  } else {
    open = false;
    airedList.classList.toggle("slideUp");
    setTimeout(function(){songsList.removeChild(songsList.firstChild);}, 300);
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

// detecting the navigator language and changing title
let userLang = navigator.language || navigator.userLanguage;
let title = document.querySelector('.title');
let pt = /^pt/i;
let fr = /^fr/i;
let es = /^es/i;
let de = /^de/i;
if (pt.test(userLang)) {
  title.innerText = "música sem fronteiras";
} else if (fr.test(userLang)) {
  title.innerText = "musique sans frontières";
} else if (es.test(userLang)) {
  title.innerText = "música sin fronteras";
} else if (de.test(userLang)){
  title.innerText = "musik ohne grenzen";
} else {
  title.innerText = "music without frontiers";
};
