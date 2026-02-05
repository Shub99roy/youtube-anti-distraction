const CHECKS = [
  "enabled",
  "hide_home_feed",
  "hide_sidebar",
  "hide_shorts",
  "hide_endcards",
  "hide_comments",
  "hide_thumbnails"
];

function load() {
  chrome.storage.sync.get(CHECKS, (st) => {
    CHECKS.forEach((k) => {
      const el = document.getElementById(k);
      if (el) el.checked = !!st[k];
    });
  });
}

function saveOne(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => {
    // Background will broadcast to YT tabs.
  });
}

document.addEventListener("DOMContentLoaded", () => {
  load();

  CHECKS.forEach((k) => {
    const el = document.getElementById(k);
    el?.addEventListener("change", (e) => saveOne(k, e.target.checked));
  });

  document.getElementById("openOptions")?.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
