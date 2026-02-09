// swipeBase.js
export function enableSwipe({
  element,
  onSwipeLeft,
  onSwipeRight,
  threshold = 40,
}) {
  let startX = 0;
  let startY = 0;
  let isTracking = false;

  element.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      isTracking = true;
    },
    { passive: true },
  );

  element.addEventListener(
    "touchmove",
    (e) => {
      if (!isTracking) return;

      const t = e.touches[0];
      const diffX = Math.abs(t.clientX - startX);
      const diffY = Math.abs(t.clientY - startY);

      if (diffY > diffX) {
        isTracking = false;
      }
    },
    { passive: true },
  );

  element.addEventListener("touchend", (e) => {
    if (!isTracking) return;

    const t = e.changedTouches[0];
    const deltaX = t.clientX - startX;

    if (Math.abs(deltaX) >= threshold) {
      deltaX < 0 ? onSwipeLeft?.() : onSwipeRight?.();
    }

    isTracking = false;
  });
}
