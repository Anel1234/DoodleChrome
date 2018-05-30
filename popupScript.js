document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('clickbutton');
    link.addEventListener('click', function(response) {
        //chrome.runtime.sendMessage({"message": "Existing"});
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'draw', function(response) {
            //   console.log('draw');
            });
          });
    });
});