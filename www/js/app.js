// App bootstrap logic kept separate from routing.
// Responsibilities:
//  - Initialize router
//  - Future: global state, simple pub/sub, etc.

(function () {
  function init() {
    if (window.AppRouter) {
      window.AppRouter.init();
    } else {
      console.error("Router not found");
    }
  }
  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
