const createTVZoomEffect = (pathElement, options = {}) => {
  const settings = {
    duration: options.duration || 1500,
    copies: options.copies || 5,
    maxScale: options.maxScale || 2,
    staggerDelay: options.staggerDelay || 100,
    easing: options.easing || "cubic-bezier(0.19, 1, 0.22, 1)",
  };

  const zoomContainer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  pathElement.parentNode.appendChild(zoomContainer);

  // Create multiple copies for strobe effect
  for (let i = 0; i < settings.copies; i++) {
    const copy = pathElement.cloneNode(true);
    copy.style.fill = "none";
    copy.style.stroke = "#005bbb";
    copy.style.strokeWidth = 2;
    copy.style.opacity = "0.6";

    // Center point for scaling
    const bbox = pathElement.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    // Set transform origin
    copy.style.transformOrigin = `${centerX}px ${centerY}px`;
    copy.style.transform = "scale(1)";
    copy.style.transition = `all ${settings.duration}ms ${settings.easing}`;

    zoomContainer.appendChild(copy);

    // Stagger the animation of each copy
    setTimeout(() => {
      copy.style.transform = `scale(${settings.maxScale})`;
      copy.style.opacity = "0";
    }, i * settings.staggerDelay);
  }

  // Clean up
  setTimeout(
    () => {
      zoomContainer.remove();
    },
    settings.duration + settings.copies * settings.staggerDelay,
  );
};
