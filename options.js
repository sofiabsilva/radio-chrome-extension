// from https://developer.chrome.com/extensions/options
// Saves options to chrome.storage
function save_options() {
  var selected = document.querySelector('.ios-switch').checked;

  chrome.storage.sync.set({
    mute: selected
  }, function() {
    // Update status to let user know options were saved.
    var status = document.querySelector('#status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default checked selected = true.
  chrome.storage.sync.get({
    mute: true
  }, function(items) {
    document.querySelector('.ios-switch').checked = items.mute;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('.ios-switch').addEventListener('change', save_options);
