/**
 * Our Process page: "Who We Work With" hover-swap interaction.
 * Hovering (or focusing/tapping) a partner category swaps the left-hand
 * image and reveals that category's short description.
 */
(function () {
  function initPartnersInteractive() {
    const items = document.querySelectorAll('[data-partner]');
    const images = document.querySelectorAll('[data-partner-image]');
    if (!items.length || !images.length) return;

    function setActive(key) {
      items.forEach((item) => {
        item.classList.toggle('is-active', item.dataset.partner === key);
      });
      images.forEach((img) => {
        img.classList.toggle('is-active', img.dataset.partnerImage === key);
      });
    }

    items.forEach((item) => {
      const key = item.dataset.partner;
      item.addEventListener('mouseenter', () => setActive(key));
      item.addEventListener('focus', () => setActive(key));
      item.addEventListener('click', () => setActive(key));
    });
  }

  document.addEventListener('DOMContentLoaded', initPartnersInteractive);
})();
