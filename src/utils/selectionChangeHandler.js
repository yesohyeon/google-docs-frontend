function debounce(func, wait) {
  let timeout;

  return function(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function selectionChangeHandler(cursors, id) {
  const debouncedUpdate = debounce(updateCursor, 500);

  return function (range, oldRange, source) {
    if (source === "user") {
      updateCursor(range);
    } else {
      debouncedUpdate(range);
    }
  };

  function updateCursor(range) {
    const CURSOR_LATENCY = 1000;

    setTimeout(() => cursors.moveCursor(id, range), CURSOR_LATENCY);
  }
}
