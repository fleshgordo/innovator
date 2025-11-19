// Capacitor plugin bridge with graceful fallback for web/browser testing
// Wraps Geolocation and Haptics (vibration) APIs

(function () {
  // Check if running in Capacitor native context
  const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

  async function getCurrentPosition() {
    try {
      if (isNative && window.Capacitor.Plugins.Geolocation) {
        // Use Capacitor Geolocation plugin
        const position =
          await window.Capacitor.Plugins.Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
          });
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: position.timestamp,
        };
      } else {
        // Fallback to browser Geolocation API
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                altitude: pos.coords.altitude,
                timestamp: pos.timestamp,
              });
            },
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
      }
    } catch (error) {
      throw new Error(`Geolocation failed: ${error.message}`);
    }
  }

  async function vibrate(duration = 200) {
    try {
      if (isNative && window.Capacitor.Plugins.Haptics) {
        // Use Capacitor Haptics plugin
        await window.Capacitor.Plugins.Haptics.impact({ style: "medium" });
        return true;
      } else if (navigator.vibrate) {
        // Fallback to browser Vibration API
        navigator.vibrate(duration);
        return true;
      } else {
        console.warn("Vibration not supported");
        return false;
      }
    } catch (error) {
      console.error("Vibration failed:", error);
      return false;
    }
  }

  // Expose global API
  window.CapacitorBridge = {
    isNative,
    getLocation: getCurrentPosition,
    vibrate,
  };
})();
