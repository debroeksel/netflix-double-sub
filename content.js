const subtitleSelector = '.player-timedtext-text-container';
const containerSelector = '.player-timedtext';

let lastSubtitle = '';
let subStyle = {}

let observer;

// detect changes in full screen, if screen changes -> reset lastSubtitle
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
    document.addEventListener(event, () => {
        // console.log('[Subtitle Overlay] Fullscreen changed');
        lastSubtitle = ''; // Force re-render
    });
});

// append to the right element (changing between full screen)
const getOverlayParent = () => {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement ||
           document.msFullscreenElement ||
           document.body;
}

const createShadowSubtitle = (text) => {
    // Remove old overlay if it exists
    const oldHost = document.getElementById('subtitle-shadow-host');
    if (oldHost) oldHost.remove();

    // Create shadow host
    const shadowHost = document.createElement('div');
    shadowHost.id = 'subtitle-shadow-host';
    shadowHost.style.position = 'fixed';
    shadowHost.style.bottom = '15%';
    shadowHost.style.left = '50%';
    shadowHost.style.transform = 'translateX(-50%)';
    shadowHost.style.zIndex = '9999';
    shadowHost.style.pointerEvents = 'none';
    shadowHost.setAttribute('translate', 'no');
    shadowHost.classList.add('notranslate');

    // Attach shadow root
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Create subtitle div inside shadow root with styles from subStyle
    const subtitleDiv = document.createElement('div');
    subtitleDiv.textContent = text;

    Object.assign(subtitleDiv.style, {
        color: subStyle.color || 'yellow',
        fontSize: subStyle.fontSize,
        fontFamily: subStyle.fontFamily,
        fontWeight: subStyle.fontWeight,
        textShadow: subStyle.textShadow,
        lineHeight: subStyle.lineHeight,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        translate: 'no',
        textTransform: 'none',
    });
    shadowRoot.appendChild(subtitleDiv);

    // document.body.appendChild(shadowHost);
    getOverlayParent().appendChild(shadowHost);
}

const createNormalSubtitle = (text) => {
    // Remove old overlay if it exists
    const oldOverlay = document.getElementById('subtitle-normal-overlay');
    if (oldOverlay) oldOverlay.remove();

    // Create normal subtitle container
    const subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'subtitle-normal-overlay';
    subtitleContainer.style.position = 'fixed';
    subtitleContainer.style.bottom = '10%';
    subtitleContainer.style.left = '50%';
    subtitleContainer.style.transform = 'translateX(-50%)';
    subtitleContainer.style.zIndex = '9999';
    subtitleContainer.style.pointerEvents = 'none';
    // subtitleContainer.setAttribute('translate', 'yes'); // Allow Chrome to translate
    // subtitleContainer.style.textTransform = 'none'; // Allow translation

    // Apply the subtitle styles
    subtitleContainer.style.color = 'yellow';  // Can change the color to any desired value
    subtitleContainer.style.fontSize = subStyle.fontSize;
    subtitleContainer.style.fontFamily = subStyle.fontFamily;
    subtitleContainer.style.fontWeight = subStyle.fontWeight;
    subtitleContainer.style.textShadow = subStyle.textShadow;
    subtitleContainer.style.lineHeight = subStyle.lineHeight;
    subtitleContainer.style.textAlign = 'center';
    subtitleContainer.style.whiteSpace = 'nowrap';

    // Add subtitle text
    subtitleContainer.textContent = text;

    // document.body.appendChild(subtitleContainer);
    getOverlayParent().appendChild(subtitleContainer);
}

const handleSubtitleUpdate = (subtitleEl) => {
    const rawText = subtitleEl.innerText.trim();
    const text = rawText.replaceAll('\n', ' ');

    if (!text || text === lastSubtitle) return;
    lastSubtitle = text;

    createShadowSubtitle(text, subtitleEl);

    createNormalSubtitle(text, subtitleEl)
}

const getNetflixStyle = (el) => {
    const allSpans = el.querySelectorAll('span');
    let spanRef = null;

    if (allSpans.length > 1) {
        spanRef = allSpans[1];
    } else if (allSpans.length === 1) {
        spanRef = allSpans[0];
    }

    if (spanRef) {
        const computed = window.getComputedStyle(spanRef);
        subStyle = {
            display: computed.display,
            whiteSpace: computed.whiteSpace,
            textAlign: window.getComputedStyle(el).textAlign || 'center',
            position: window.getComputedStyle(el).position,
            left: window.getComputedStyle(el).left,
            top: window.getComputedStyle(el).top,
            fontSize: `${parseFloat(computed.fontSize || '24px') * 0.8}px`,
            lineHeight: computed.lineHeight,
            fontWeight: computed.fontWeight,
            color: computed.color || 'yellow',
            textShadow: computed.textShadow,
            fontFamily: computed.fontFamily,
        };
    } else {
        // Fallback to default styles if no span is found
        subStyle = {
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'yellow',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            fontFamily: 'Arial, sans-serif',
            lineHeight: 'normal',
            textAlign: 'center',
        };
    }
}

const monitorSubtitles = () => {
    if (observer) return;

    const targetNode = document.querySelector(containerSelector);
    if (!targetNode) {
        console.warn('[Subtitle Overlay] Subtitle container not found.');
        return;
    }

    const debouncedSubtitleCheck = () => {
        const subtitleEl = document.querySelector(subtitleSelector);
        const containerEl = document.querySelector(containerSelector);

        if (!containerEl || containerEl.style.display === 'none') {
            document.getElementById('subtitle-shadow-host')?.remove();
            document.getElementById('subtitle-normal-overlay')?.remove();
            lastSubtitle = '';
            return;
        }

        if (subtitleEl && subtitleEl.innerText.trim()) {
            getNetflixStyle(subtitleEl);
            handleSubtitleUpdate(subtitleEl);
            subtitleEl.style.visibility = 'hidden';
        }
    };

    observer = new MutationObserver(debouncedSubtitleCheck);
    observer.observe(targetNode, { childList: true, subtree: true });

    // Initial run in case subtitle is already present
    debouncedSubtitleCheck();
}

// const disableSubtitleOverlay = () => {
//     if (observer) {
//         observer.disconnect();
//         observer = null;
//     }

//     const oldHost = document.getElementById('subtitle-shadow-host');
//     const oldNormal = document.getElementById('subtitle-normal-overlay');
//     if (oldHost) oldHost.remove();
//     if (oldNormal) oldNormal.remove();

//     const subtitleEl = document.querySelector(subtitleSelector);
//     if (subtitleEl) {
//         subtitleEl.style.visibility = 'visible';
//     }

//     lastSubtitle = '';
//     // console.log('[Shadow DOM Subtitle Overlay] Disabled');
// }

// enable and disable
window.enableSubtitleOverlay = monitorSubtitles;
// window.disableSubtitleOverlay = disableSubtitleOverlay;


