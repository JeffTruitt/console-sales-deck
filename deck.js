(function () {
  "use strict";

  // Slides are authored at a fixed size and scaled to whatever viewport we land in.
  var SLIDE_W = 1920;
  var SLIDE_H = 1080;

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dotsHost = document.querySelector(".dots");
  var counter = document.querySelector(".counter");
  var prevBtn = document.querySelector(".nav-prev");
  var nextBtn = document.querySelector(".nav-next");
  var index = 0;

  if (!slides.length) {
    return;
  }

  function scaleSlides() {
    var scale = Math.min(window.innerWidth / SLIDE_W, window.innerHeight / SLIDE_H);
    slides.forEach(function (slide) {
      slide.style.transform = "scale(" + scale + ")";
    });
  }

  function buildDots() {
    slides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.dataset.index = String(i);
      dot.setAttribute("aria-label", slide.dataset.title || "Slide " + (i + 1));
      dot.title = slide.dataset.title || "Slide " + (i + 1);
      dotsHost.appendChild(dot);
    });
  }

  function render() {
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });

    Array.prototype.forEach.call(dotsHost.children, function (dot, i) {
      dot.classList.toggle("is-on", i === index);
    });

    counter.textContent = index + 1 + " / " + slides.length;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    if (window.location.hash !== "#" + (index + 1)) {
      history.replaceState(null, "", "#" + (index + 1));
    }
  }

  function goTo(next) {
    var clamped = Math.max(0, Math.min(slides.length - 1, next));
    if (clamped === index) {
      return;
    }
    index = clamped;
    render();
  }

  function indexFromHash() {
    var parsed = parseInt(window.location.hash.replace("#", ""), 10);
    if (isNaN(parsed)) {
      return 0;
    }
    return Math.max(0, Math.min(slides.length - 1, parsed - 1));
  }

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        event.preventDefault();
        goTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        goTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(slides.length - 1);
        break;
      case "f":
      case "F":
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
        break;
      default:
        break;
    }
  });

  prevBtn.addEventListener("click", function () {
    goTo(index - 1);
  });

  nextBtn.addEventListener("click", function () {
    goTo(index + 1);
  });

  dotsHost.addEventListener("click", function (event) {
    var dot = event.target.closest(".dot");
    if (dot) {
      goTo(parseInt(dot.dataset.index, 10));
    }
  });

  window.addEventListener("hashchange", function () {
    goTo(indexFromHash());
  });

  window.addEventListener("resize", scaleSlides);

  buildDots();
  index = indexFromHash();
  scaleSlides();
  render();
})();
