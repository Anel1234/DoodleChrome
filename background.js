var doodlechrome = chrome.contextMenus.create({
    title: "DoodleChrome",
    contexts: ["all"],
    onclick: function() {
      alert('first');
    },
});
chrome.contextMenus.create({
    title: "Select",
    parentId: doodlechrome,
    contexts: ["all"],
    onclick: function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'select', function(response) {
            //   console.log('draw');
            });
        });
      //alert('2nd');
    },
});
chrome.contextMenus.create({
    title: "Draw",
    parentId: doodlechrome,
    contexts: ["all"],
    onclick: function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'draw', function(response) {
            //   console.log('draw');
            });
        });
      //alert('2nd');
    },
});
chrome.contextMenus.create({
    title: "Highlight",
    parentId: doodlechrome,
    contexts: ["all"],
    onclick: function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'highlight', function(response) {
            //   console.log('draw');
            });
        });
      //alert('2nd');
    },
});
chrome.contextMenus.create({
    title: "Clear",
    parentId: doodlechrome,
    contexts: ["all"],
    onclick: function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'erase', function(response) {
            //   console.log('draw');
            });
        });
      //alert('2nd');
    },
});

// chrome.contextMenus.create({
//     title: "Delete",
//     parentId: doodlechrome,
//     contexts: ["image"],
//     onclick: function() {
//         chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, 'deleteImage', function(response) {
//             //   console.log('draw');
//             });
//         });
//       //alert('2nd');
//     },
// });
// chrome.contextMenus.create({
//     title: "Paste",
//     parentId: doodlechrome,
//     contexts: ["all"],
//     onclick: function() {
//         chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, 'paste', function(response) {
//             //   console.log('draw');
//             });
//         });
//       //alert('2nd');
//     },
// });