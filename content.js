// Read settings, add html data-attributes, and keep them in sync.
// Also handle SPA navigation events on YouTube.

const SETTINGS_KEYS = [
  "enabled",
  "hide_home_feed",
  "hide_sidebar",
  "hide_shorts",
  "hide_endcards",
  "hide_comments",
  "hide_thumbnails"
];

let current = {};

function applySettingsToDOM() {
  const html = document.documentElement;

  // Guard: if extension disabled, clear all attributes.
  if (!current.enabled) {
    html.removeAttribute("data-ytc-hide-home");
    html.removeAttribute("data-ytc-hide-sidebar");
    html.removeAttribute("data-ytc-hide-shorts");
    html.removeAttribute("data-ytc-hide-endcards");
    html.removeAttribute("data-ytc-hide-comments");
    html.removeAttribute("data-ytc-hide-thumbs");
    return;
  }

  html.setAttribute("data-ytc-hide-home", String(!!current.hide_home_feed));
  html.setAttribute("data-ytc-hide-sidebar", String(!!current.hide_sidebar));
  html.setAttribute("data-ytc-hide-shorts", String(!!current.hide_shorts));
  html.setAttribute("data-ytc-hide-endcards", String(!!current.hide_endcards));
  html.setAttribute("data-ytc-hide-comments", String(!!current.hide_comments));
  html.setAttribute("data-ytc-hide-thumbs", String(!!current.hide_thumbnails));
}

// Some UI bits are injected after navigation; re-apply when YT finishes nav.
function hookYouTubeSPAEvents() {
  // YouTube fires custom events on navigation in Polymer
  window.addEventListener("yt-navigate-finish", applySettingsToDOM, true);

  // Fallback for other DOM changes
  const obs = new MutationObserver((muts) => {
    // Avoid tight loops: just schedule a microtask
    Promise.resolve().then(applySettingsToDOM);
  });
  obs.observe(document.documentElement, { subtree: true, childList: true });
}

function loadSettings(cb) {
  chrome.storage.sync.get(SETTINGS_KEYS, (res) => {
    current = res;
    // fill defaults (in case)
    if (typeof current.enabled !== "boolean") current.enabled = true;
    SETTINGS_KEYS.forEach(k => {
      if (typeof current[k] === "undefined") current[k] = false;
    });
    cb();
  });
}

// Listen to background/popup updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "ytc:settings-updated") {
    loadSettings(applySettingsToDOM);
  }
});

loadSettings(() => {
  applySettingsToDOM();
  hookYouTubeSPAEvents();
});
