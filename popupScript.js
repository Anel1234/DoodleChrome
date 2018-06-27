window.onload = function() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'loaded', function(response) {
        });
      });

    $(".btn").click(function(){
        $(".btn").removeClass("active");
        $(this).addClass("active");
     });

    $("#popoutbutton").click(function(){

        // chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(window) {
        // });
        //window.open(chrome.extension.getURL("popup.html"),"dc-popout-window","width=400,height=200")
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'popout', function(response) {
            });
        });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {code: "selected"}, function(results){
            $('#' + results[0] + 'button').addClass("active");
        });
        chrome.tabs.executeScript(tabs[0].id, {code: "selectedWidth"}, function(results){
            $('#myRange').val(results[0]);
        });
        chrome.tabs.executeScript(tabs[0].id, {code: "selectedColor"}, function(results){
            document.getElementById('colorInput').jscolor.fromString(results[0].replace('#',''));
        });
    });
};

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('colorInput');
    link.addEventListener('change', function(response) {
        document.getElementById('rect').style.backgroundColor = '#' + response.srcElement.jscolor
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'colorcode:#' + response.srcElement.jscolor, function(response) {
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('selectbutton');
    link.addEventListener('click', function(response) {
        //chrome.runtime.sendMessage({"message": "Existing"});
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'select', function(response) {
            //   console.log('draw');
            });
          });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('drawbutton');
    link.addEventListener('click', function(response) {
        //chrome.runtime.sendMessage({"message": "Existing"});
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'draw', function(response) {
            //   console.log('draw');
            });
          });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('selectionboxbutton');
    link.addEventListener('click', function(response) {
        //chrome.runtime.sendMessage({"message": "Existing"});
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'selectionbox', function(response) {
            //   console.log('draw');
            });
          });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('highlightbutton');
    link.addEventListener('click', function(response) {
        //chrome.runtime.sendMessage({"message": "Existing"});
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'highlight', function(response) {
            //   console.log('draw');
            });
          });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('erasebutton');
    link.addEventListener('click', function(response) {
        //chrome.runtime.sendMessage({"message": "Existing"});
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'erase', function(response) {
            //   console.log('draw');
            });
          });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('myRange');
    link.addEventListener('change', function(response) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'rangechange:' + response.srcElement.value, function(response) {
            });
        });
    });
});

function update(jscolor) {
    // 'jscolor' instance can be used as a string
    console.log('jscolor');
    document.getElementById('rect').style.backgroundColor = '#' + jscolor
}
