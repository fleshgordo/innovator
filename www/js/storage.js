// Simple localStorage wrapper for user preferences
// Provides type-safe get/set with fallback for storage errors

(function () {
  const STORAGE_KEY = "innovator_user_prefs";

  const defaultPrefs = {
    userName: "",
    theme: "dark",
    notifications: false,
  };

  function getPrefs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultPrefs, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("localStorage read failed:", e);
    }
    return { ...defaultPrefs };
  }

  function setPrefs(prefs) {
    try {
      const current = getPrefs();
      const updated = { ...current, ...prefs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("localStorage write failed:", e);
      return false;
    }
  }

  function clearPrefs() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error("localStorage clear failed:", e);
      return false;
    }
  }

  // Expose global API
  window.AppStorage = {
    get: getPrefs,
    set: setPrefs,
    clear: clearPrefs,
  };
})();
