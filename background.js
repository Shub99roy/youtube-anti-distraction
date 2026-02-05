// Default settings on install
const DEFAULTS = {
  enabled: true,
  hide_home_feed: true,
  hide_sidebar: true,
  hide_shorts: true,
  hide_endcards: true,
  hide_comments: false,      // off by default (optional)
  hide_thumbnails: false     // off by default (optional)
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (curr) => {
    const initial = { ...DEFAULTS, ...curr };
    chrome.storage.sync.set(initial);
  });
});

// Small helper: notify tabs on change so content script can re-apply
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: "ytc:settings-updated" }).catch(() => {});
      }
    }
  });
});
