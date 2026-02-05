const DEFAULTS = {
  enabled: true,
  hide_home_feed: true,
  hide_sidebar: true,
  hide_shorts: true,
  hide_endcards: true,
  hide_comments: false,
  hide_thumbnails: false
};

const KEYS = Object.keys(DEFAULTS);

function load() {
  chrome.storage.sync.get(KEYS, (st) => {
    KEYS.forEach((k) => {
      const el = document.getElementById(k);
      if (el) el.checked = !!st[k];
    });
  });
}

function save() {
  const updated = {};
  KEYS.forEach((k) => {
    const el = document.getElementById(k);
    if (el) updated[k] = el.checked;
  });
  chrome.storage.sync.set(updated);
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  KEYS.forEach((k) => {
    const el = document.getElementById(k);
    el?.addEventListener("change", save);
  });

  document.getElementById("reset")?.addEventListener("click", () => {
    chrome.storage.sync.set(DEFAULTS, load);
  });
});
