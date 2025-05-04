chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "enableSubOverlay",
        title: "Enable Double Subtitles",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "enableSubOverlay") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.enableSubtitleOverlay?.()
        });
    }
});

// let isOverlayEnabled = false;

// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         id: "toggleSubOverlay",
//         title: "Enable Double Subtitles",
//         contexts: ["page"]
//     });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "toggleSubOverlay") {
//         isOverlayEnabled = !isOverlayEnabled;

//         chrome.contextMenus.update("toggleSubOverlay", {
//             title: isOverlayEnabled ? "Disable Double Subtitles" : "Enable Double Subtitles"
//         });

//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             func: toggleSubtitleOverlay,
//             args: [isOverlayEnabled]
//         });
//     }
// });

// function toggleSubtitleOverlay(enabled) {
//     if (enabled) {
//         window.enableSubtitleOverlay?.();
//     } else {
//         window.disableSubtitleOverlay?.();
//     }
// }
