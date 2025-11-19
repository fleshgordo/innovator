// Minimal hash-based router (no framework)
// Contract:
//  - routes: hash -> template ID
//  - templates live in <template> elements in index.html
//  - unknown route falls back to '#start'
//  - updates aria-current on matching nav buttons

(function () {
  // Map routes to template IDs
  const routes = {
    "#start": "tpl-start",
    "#about": "tpl-about",
    "#settings": "tpl-settings",
  };

  function render(route) {
    const app = document.getElementById("app");
    const templateId = routes[route] || routes["#start"];
    const template = document.getElementById(templateId);

    if (!template) {
      console.error(`Template ${templateId} not found`);
      return;
    }

    // Clone template content and inject
    const content = template.content.cloneNode(true);
    app.innerHTML = "";
    app.appendChild(content);
    app.setAttribute("data-screen", route.replace("#", ""));
    updateNavState(route);

    // Bind actions after render
    bindScreenActions(route);
  }

  function bindScreenActions(route) {
    // Start screen: display user preferences
    if (route === "#start") {
      const prefs = window.AppStorage.get();
      const greetingEl = document.getElementById("user-greeting");
      const prefsEl = document.getElementById("user-prefs");

      if (greetingEl && prefs.userName) {
        greetingEl.textContent = `, ${prefs.userName}`;
      }

      if (prefsEl) {
        prefsEl.innerHTML = prefs.userName
          ? `<p class="pref-summary">Theme: <strong>${
              prefs.theme
            }</strong> | Notifications: <strong>${
              prefs.notifications ? "On" : "Off"
            }</strong></p>`
          : '<p class="pref-summary dim">No settings saved yet. Visit Settings to customize.</p>';
      }

      const actionBtn = document.getElementById("demo-action");
      if (actionBtn) {
        actionBtn.addEventListener("click", () => {
          console.log("Demo action triggered");
          actionBtn.textContent = "Done";
          actionBtn.disabled = true;

          // Trigger fullscreen circle zoom
          triggerCircleZoom();
        });
      }

      const geoBtn = document.getElementById("geo-action");
      const locationDisplay = document.getElementById("location-display");
      if (geoBtn && locationDisplay) {
        geoBtn.addEventListener("click", async () => {
          geoBtn.disabled = true;
          geoBtn.textContent = "Getting location...";
          locationDisplay.className = "location-info";
          locationDisplay.innerHTML =
            '<p class="loading">📍 Requesting GPS...</p>';

          try {
            // Vibrate on click if supported
            await window.CapacitorBridge.vibrate(100);

            // Get current position
            const position = await window.CapacitorBridge.getLocation();

            // Display coordinates
            locationDisplay.innerHTML = `
              <div class="location-card">
                <h3>📍 Your Location</h3>
                <div class="coords">
                  <div class="coord-row">
                    <span class="label">Latitude:</span>
                    <span class="value">${position.latitude.toFixed(6)}</span>
                  </div>
                  <div class="coord-row">
                    <span class="label">Longitude:</span>
                    <span class="value">${position.longitude.toFixed(6)}</span>
                  </div>
                  <div class="coord-row">
                    <span class="label">Accuracy:</span>
                    <span class="value">${Math.round(position.accuracy)}m</span>
                  </div>
                  ${
                    position.altitude !== null
                      ? `
                    <div class="coord-row">
                      <span class="label">Altitude:</span>
                      <span class="value">${Math.round(
                        position.altitude
                      )}m</span>
                    </div>
                  `
                      : ""
                  }
                </div>
                <a 
                  href="https://www.google.com/maps?q=${position.latitude},${
              position.longitude
            }" 
                  target="_blank" 
                  class="map-link"
                >
                  View on Google Maps →
                </a>
              </div>
            `;
            geoBtn.textContent = "Refresh Location";
            geoBtn.disabled = false;

            // Vibrate on success
            await window.CapacitorBridge.vibrate(50);
          } catch (error) {
            console.error("Geolocation error:", error);
            locationDisplay.innerHTML = `
              <p class="error-msg">⚠️ ${error.message}</p>
              <p class="hint">Make sure location permissions are enabled.</p>
            `;
            geoBtn.textContent = "Try Again";
            geoBtn.disabled = false;
          }
        });
      }
    }

    // Settings screen: bind form handlers
    if (route === "#settings") {
      const form = document.getElementById("settings-form");
      const clearBtn = document.getElementById("clear-settings");
      const feedback = document.getElementById("save-feedback");

      // Load current preferences into form
      const prefs = window.AppStorage.get();
      const nameInput = document.getElementById("user-name");
      const themeSelect = document.getElementById("user-theme");
      const notificationsCheck = document.getElementById("notifications");

      if (nameInput) nameInput.value = prefs.userName || "";
      if (themeSelect) themeSelect.value = prefs.theme || "dark";
      if (notificationsCheck)
        notificationsCheck.checked = prefs.notifications || false;

      // Save handler
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const newPrefs = {
            userName: formData.get("userName") || "",
            theme: formData.get("theme") || "dark",
            notifications: formData.has("notifications"),
          };

          const success = window.AppStorage.set(newPrefs);
          if (feedback) {
            feedback.textContent = success
              ? "✓ Settings saved!"
              : "⚠ Failed to save";
            feedback.className = success
              ? "feedback success"
              : "feedback error";
            setTimeout(() => {
              feedback.className = "feedback hidden";
            }, 2000);
          }
        });
      }

      // Clear handler
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          if (confirm("Clear all settings?")) {
            window.AppStorage.clear();
            if (nameInput) nameInput.value = "";
            if (themeSelect) themeSelect.value = "dark";
            if (notificationsCheck) notificationsCheck.checked = false;
            if (feedback) {
              feedback.textContent = "✓ Settings cleared!";
              feedback.className = "feedback success";
              setTimeout(() => {
                feedback.className = "feedback hidden";
              }, 2000);
            }
          }
        });
      }
    }
  }

  function updateNavState(route) {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      const target = btn.getAttribute("data-route");
      btn.setAttribute("aria-current", target === route ? "page" : "false");
    });
  }

  function handleRouteChange() {
    render(location.hash || "#start");
  }

  function triggerCircleZoom() {
    // Create circle element
    const circle = document.createElement("div");
    circle.className = "zoom-circle";
    document.body.appendChild(circle);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      circle.classList.add("active");
    });

    // Remove element after animation completes
    setTimeout(() => {
      circle.remove();
    }, 1200);
  }

  function initRouter() {
    // Delegate clicks for nav buttons (progressive enhancement)
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.matches(".nav-btn[data-route]")
      ) {
        const route = target.getAttribute("data-route");
        if (route) {
          location.hash = route;
        }
      }
    });
    window.addEventListener("hashchange", handleRouteChange);
    handleRouteChange(); // initial render
  }

  // Expose minimal API if needed elsewhere
  window.AppRouter = { init: initRouter };
})();
