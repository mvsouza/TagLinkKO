'use strict';

// Saves options to chrome.storage
function save_options() {
  var appId = document.getElementById('appId').value;
  var jsKey = document.getElementById('jsKey').value;
  chrome.storage.sync.set({
    appId: appId,
    jsKey: jsKey
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    appId: '',
    jsKey: ''
  }, function(items) {
    document.getElementById('appId').value = items.appId;
    document.getElementById('jsKey').checked = items.jsKey;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);