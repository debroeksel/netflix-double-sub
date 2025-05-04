// with transkate api

// const targetClass = '.player-timedtext-text-container';
// let observer;
// let lastSubtitle = '';

// async function translateToEnglish(text) {
//     try {
//         const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`);
//         const data = await response.json();
//         return data?.responseData?.translatedText || text;
//     } catch (err) {
//         console.error('[Subtitle Translator] Translation failed:', err);
//         return text;
//     }
// }

// function showTranslatedSubtitle(text) {
//     let overlay = document.getElementById("translated-subtitle-overlay");
//     if (!overlay) {
//         overlay = document.createElement("div");
//         overlay.id = "translated-subtitle-overlay";
//         document.body.appendChild(overlay);
//     }
//     overlay.textContent = text;
// }

// async function handleSubtitle(text) {
//     if (!text || text === lastSubtitle) return;
//     lastSubtitle = text;

//     // console.log('[Original Subtitle]', text);

//     // console.log('[Start translation]', text);

//     const translated = await translateToEnglish(text);
//     // console.log('[Translated Subtitle]', translated);
//     showTranslatedSubtitle(translated);
// }

// function startSubtitleLogger() {
//     if (observer) return;

//     observer = new MutationObserver(() => {
//         const el = document.querySelector(targetClass);
//         if (el) {
//             const currentText = el.innerText.trim();
//             handleSubtitle(currentText);
//         }
//     });

//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//     });

//     console.log('[Subtitle Logger] MutationObserver started.');
// }

// // Expose to context menu trigger
// window.enableSubtitleOverlay = startSubtitleLogger;