document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".menu-dropdown");

  dropdowns.forEach((drop) => {
    const toggle = drop.querySelector(".menu-dropdown__toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // закрыть все остальные
      dropdowns.forEach((d) => {
        if (d !== drop) d.classList.remove("is-open");
      });

      drop.classList.toggle("is-open");
    });

    // если это select
    if (drop.classList.contains("project-list-filter__select")) {
      const popup = drop.querySelector(".menu-dropdown__popup");
      if (!popup) return;

      popup.querySelectorAll("a").forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();

          // смена текста
          toggle.childNodes[0].textContent = option.textContent.trim();

          // активный пункт
          popup
            .querySelectorAll("a")
            .forEach((a) => a.classList.remove("active"));
          option.classList.add("active");

          // помечаем селект как выбранный
          drop.classList.add("has-value");
          drop.dataset.value = option.textContent.trim();

          drop.classList.remove("is-open");
        });
      });
    }
  });

  // закрытие по клику вне
  document.addEventListener("click", () => {
    dropdowns.forEach((d) => d.classList.remove("is-open"));
  });

  // закрытие по Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdowns.forEach((d) => d.classList.remove("is-open"));
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  /* ================= TABS ================= */

  // const buttons = document.querySelectorAll(".tab-button");
  // const contents = document.querySelectorAll(".tab-content");
  // const dropdownToggle = document.querySelector(".dropdown-toggle");
  // const dropdownMenu = document.querySelector(".dropdown-menu");
  // const customDropdown = document.querySelector(".custom-dropdown");

  // function showTab(tabId) {
  //   buttons.forEach((b) => b.classList.remove("active"));
  //   contents.forEach((c) => c.classList.remove("active"));

  //   const activeButton = document.querySelector(
  //     `.tab-button[data-tab="${tabId}"]`
  //   );
  //   const activeContent = document.getElementById(tabId);

  //   if (activeButton) activeButton.classList.add("active");
  //   if (activeContent) activeContent.classList.add("active");

  //   // dropdown sync
  //   if (dropdownToggle && dropdownMenu) {
  //     const selected = dropdownMenu.querySelector(`li[data-value="${tabId}"]`);
  //     if (selected) {
  //       dropdownToggle.innerHTML = `${selected.textContent}
  //         <span class="dropdown-arrow"></span>`;
  //       dropdownMenu
  //         .querySelectorAll("li")
  //         .forEach((li) => li.classList.remove("active"));
  //       selected.classList.add("active");
  //     }
  //   }
  // }

  // // клики по кнопкам
  // buttons.forEach((button) => {
  //   button.addEventListener("click", () => {
  //     showTab(button.dataset.tab);
  //   });
  // });

  // // 🔴 ВАЖНО: показываем первый таб автоматически
  // if (buttons.length > 0) {
  //   showTab(buttons[0].dataset.tab);
  // }

  // /* ================= DROPDOWN TABS ================= */

  // if (dropdownToggle && dropdownMenu && customDropdown) {
  //   dropdownToggle.addEventListener("click", () => {
  //     customDropdown.classList.toggle("open");
  //     dropdownMenu.style.display = customDropdown.classList.contains("open")
  //       ? "block"
  //       : "none";
  //   });

  //   dropdownMenu.addEventListener("click", (e) => {
  //     if (e.target.tagName === "LI") {
  //       showTab(e.target.dataset.value);
  //       customDropdown.classList.remove("open");
  //       dropdownMenu.style.display = "none";
  //     }
  //   });

  //   document.addEventListener("click", (e) => {
  //     if (!customDropdown.contains(e.target)) {
  //       customDropdown.classList.remove("open");
  //       dropdownMenu.style.display = "none";
  //     }
  //   });
  // }

  /* ================= TEXTAREA COUNTER ================= */

  const textarea = document.getElementById("review-text");
  const counter = document.getElementById("char-count");

  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length} / 250`;
    });
  }

  const AccomTextarea = document.getElementById("accom-text");
  const AccomCounter = document.getElementById("char-count");

  if (AccomTextarea && AccomCounter) {
    AccomTextarea.addEventListener("input", () => {
      AccomCounter.textContent = `${AccomTextarea.value.length} / 2500`;
    });
  }

  /* ================= FORM 1 ================= */

  const form1 = document.querySelector(".block__form");

  if (form1) {
    const requiredFields = form1.querySelectorAll(
      "input[required]:not([name='rating']), textarea[required]"
    );
    const rating = form1.querySelector(".rating");
    const ratingInputs = rating
      ? rating.querySelectorAll("input[name='rating']")
      : [];

    const showError = (field) => {
      field.classList.add("input-error");
      field.style.borderColor = "#B41825";
    };

    const clearError = (field) => {
      field.classList.remove("input-error");
      field.style.borderColor = "";
    };

    requiredFields.forEach((field) => {
      field.addEventListener("blur", () =>
        field.value.trim() === "" ? showError(field) : clearError(field)
      );
      field.addEventListener("input", () => clearError(field));
    });

    ratingInputs.forEach((radio) => {
      radio.addEventListener("change", () =>
        rating.classList.remove("rating-error")
      );
    });

    form1.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      requiredFields.forEach((field) => {
        if (field.value.trim() === "") {
          showError(field);
          valid = false;
        }
      });

      if (![...ratingInputs].some((r) => r.checked)) {
        rating.classList.add("rating-error");
        valid = false;
      }

      if (valid) form1.submit();
    });
  }

  /* ================= FORM 2 ================= */

  const form2 = document.querySelector(".footer__form-content");

  if (form2 && window.IMask) {
    const phoneInput = form2.querySelector("#phone");
    if (!phoneInput) return;

    const phoneMask = IMask(phoneInput, {
      mask: "+{375} (00) 000-00-00",
    });

    form2.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const digits = phoneMask.value.replace(/\D/g, "");
      if (digits.length < 12) {
        phoneInput.classList.add("input-error");
        valid = false;
      } else {
        phoneInput.classList.remove("input-error");
      }

      const checkbox = form2.querySelector("input[type='checkbox']");
      if (!checkbox?.checked) {
        checkbox.style.outline = "2px solid #B41825";
        valid = false;
      } else checkbox.style.outline = "";

      if (valid) {
        phoneInput.value = "+" + digits;
        form2.submit();
      }
    });
  }

  /* ================= FOOTER ACCORDION ================= */

  document.querySelectorAll(".footer-accordion").forEach((acc) => {
    const title = acc.querySelector(".footer__row-title");
    if (!title) return;
    title.addEventListener("click", () => acc.classList.toggle("active"));
  });

  /* ================= BURGER ================= */

  const burgerBut = document.querySelector("#burger__but");
  const body = document.body;
  const headerMenu = document.querySelector("#header__menu");

  if (burgerBut && headerMenu) {
    burgerBut.addEventListener("click", () => {
      burgerBut.classList.toggle("burger__but__active");
      headerMenu.classList.toggle("header__menu__active");
      body.style.overflowY = burgerBut.classList.contains("burger__but__active")
        ? "hidden"
        : "";
    });
  }

  /* ================= SWIPER ================= */

  if (document.querySelector(".mySwiper")) {
    new Swiper(".mySwiper", {
      slidesPerView: "auto",
      slidesPerGroup: 2,
      spaceBetween: 22,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: false },
        1024: { spaceBetween: 16, allowTouchMove: false },
        768: { allowTouchMove: true },
        0: { slidesPerGroup: 1 },
      },
    });
  }
  if (document.querySelector(".vacan-swiper")) {
    new Swiper(".vacan-swiper", {
      slidesPerView: 3.1,
      // slidesPerGroup: 2,
      spaceBetween: 24,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: true },
        1024: { spaceBetween: 16, allowTouchMove: true },
        768: { allowTouchMove: false },
        0: { slidesPerGroup: 1 },
      },
      navigation: {
        nextEl: ".vacan-swiper .swiper-button-next",
        prevEl: ".vacan-swiper .swiper-button-prev",
      },
    });
  }
  if (document.querySelector(".project-swiper")) {
    new Swiper(".project-swiper", {
      slidesPerView: 2,
      // slidesPerGroup: 2,
      spaceBetween: 24,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: true },
        1024: { spaceBetween: 16, allowTouchMove: true },
        768: { allowTouchMove: false },
        0: { slidesPerGroup: 1 },
      },
      navigation: {
        nextEl: ".project-swiper .swiper-button-next",
        prevEl: ".project-swiper .swiper-button-prev",
      },
    });
  }

  if (document.querySelector(".articles-swiper")) {
    new Swiper(".articles-swiper", {
      slidesPerView: 3,
      // slidesPerGroup: 2,
      spaceBetween: 24,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: true },
        1024: { spaceBetween: 16, allowTouchMove: true },
        768: { allowTouchMove: false },
        0: { slidesPerGroup: 1 },
      },
      navigation: {
        nextEl: ".articles-button-next",
        prevEl: ".articles-button-prev",
      },
    });
  }
  if (document.querySelector(".popular-swiper")) {
    new Swiper(".popular-swiper", {
      slidesPerView: 4,
      // slidesPerGroup: 2,
      spaceBetween: 24,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: true },
        1024: { spaceBetween: 16, allowTouchMove: true },
        768: { allowTouchMove: false },
        0: { slidesPerGroup: 1 },
      },
      navigation: {
        nextEl: ".popular-button-next",
        prevEl: ".popular-button-prev",
      },
    });
  }
  if (document.querySelector(".reviews-swiper")) {
    new Swiper(".reviews-swiper", {
      slidesPerView: 1,
      // slidesPerGroup: 2,
      spaceBetween: 24,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: true },
        1024: { spaceBetween: 16, allowTouchMove: true },
        768: { allowTouchMove: true },
        0: { slidesPerGroup: 1 },
      },
      navigation: {
        nextEl: ".reviews-button-next",
        prevEl: ".reviews-button-prev",
      },
    });
  }
  if (document.querySelector(".team-swiper")) {
    new Swiper(".team-swiper", {
      slidesPerView: 1,
      // slidesPerGroup: 2,
      spaceBetween: 24,
      allowTouchMove: true,
      breakpoints: {
        1440: { allowTouchMove: true },
        1024: { spaceBetween: 16, allowTouchMove: true },
        768: { allowTouchMove: true },
        0: { slidesPerGroup: 1 },
      },
      navigation: {
        nextEl: ".team-button-next",
        prevEl: ".team-button-prev",
      },
    });
  }

  const modalButtons = document.querySelectorAll("[data-modal]");
  const modals = document.querySelectorAll(".modal");

  modalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);

      if (!modal) return;

      modal.classList.add("active");
      document.body.classList.add("no-scroll");
    });
  });

  // закрытие по overlay и кнопке
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) {
        modal.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
      });
      document.body.classList.remove("no-scroll");
    }
  });
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      // когда прокрутка больше 50px
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });




  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const overlay = modal.querySelector(".project-modal__overlay");
  const closeBtn = modal.querySelector(".project-modal__close");

  const swiperEl = document.getElementById("projectSwiper");
  const wrapper = document.getElementById("projectSwiperWrapper");
  const info = document.getElementById("projectModalInfo");

  let swiperInstance = null;

  function getImagesFromCard(card) {
    const raw = card.getAttribute("data-images");
    if (!raw) return [];

    // поддержка JSON и строки через запятую
    const trimmed = raw.trim();
    if (trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return [];
      }
    }

    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function buildSlides(images) {
    wrapper.innerHTML = images
      .slice(0, 4)
      .map(
        (src) => `
      <div class="swiper-slide"><img src="${src}" alt=""></div>
    `
      )
      .join("");
  }

  function initSwiper() {
    if (swiperInstance) swiperInstance.destroy(true, true);

    swiperInstance = new Swiper("#projectSwiper", {
      loop: true,
      slidesPerView: 3.3,
      spaceBetween: 16,
      speed: 450,
      centeredSlides: false,
      watchOverflow: true,
      slidesOffsetBefore: 108,
      slidesOffsetAfter: 0,

      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      breakpoints: {
        0: { slidesPerView: 1.3, spaceBetween: 12, slidesOffsetBefore: 24 },
        768: { slidesPerView: 2.3, spaceBetween: 14, slidesOffsetBefore: 60 },
        1024: { slidesPerView: 3.3, spaceBetween: 16, slidesOffsetBefore: 108 },
      },
    });

    swiperInstance.update();
  }

  function openModal(card) {
    const images = getImagesFromCard(card);
    buildSlides(images);

    // 2) текст снизу (левая часть карточки)
    info.innerHTML = "";
    const left = card.querySelector(".project-card__left");
    if (left) {
      info.appendChild(left.cloneNode(true));
    } else {
      info.appendChild(card.cloneNode(true));
    }

    // 3) открыть модалку
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // 4) инициализировать swiper после того, как модалка отрисуется
    requestAnimationFrame(() => {
      if (!wrapper.children.length) return;
      initSwiper();
    });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      wrapper.innerHTML = "";
      info.innerHTML = "";
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
    }, 300);
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  overlay?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".main-numbers__track");
  const group = track.querySelector(".main-numbers__group");
  const clone = track.querySelector(".clone");

  // 1. Клонируем 1 в 1
  clone.innerHTML = group.innerHTML;

  // 2. Получаем точную ширину ОДНОЙ группы
  const width = group.offsetWidth;

  // 3. Анимация
  gsap.set(track, { x: 0 });

  gsap.to(track, {
    x: -width,
    duration: 30,     // скорость
    ease: "none",
    repeat: -1
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".js-tabs").forEach(initTabs);
});

function initTabs(container) {
  const buttons = container.querySelectorAll(".tab-button");
  const contents = container.querySelectorAll(".tab-content");

  const dropdownToggle = container.querySelector(".dropdown-toggle");
  const dropdownMenu = container.querySelector(".dropdown-menu");
  const customDropdown = container.querySelector(".custom-dropdown");

  function showTab(tabId) {
    // кнопки
    buttons.forEach((b) =>
      b.classList.toggle("active", b.dataset.tab === tabId)
    );

    // контент
    contents.forEach((c) =>
      c.classList.toggle("active", c.id === tabId)
    );

    // синхронизация dropdown
    if (dropdownToggle && dropdownMenu) {
      const selected = dropdownMenu.querySelector(`li[data-value="${tabId}"]`);
      if (selected) {
        dropdownToggle.innerHTML = `
          ${selected.textContent}
          <span class="dropdown-arrow"></span>
        `;
        dropdownMenu
          .querySelectorAll("li")
          .forEach((li) => li.classList.remove("active"));
        selected.classList.add("active");
      }
    }
  }

  // клики по кнопкам (desktop)
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showTab(btn.dataset.tab);
    });
  });

  // клики по dropdown (mobile)
  if (dropdownMenu) {
    dropdownMenu.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        showTab(item.dataset.value);
        customDropdown.classList.remove("open");
        dropdownMenu.style.display = "none";
      });
    });
  }

  if (dropdownToggle && customDropdown) {
    dropdownToggle.addEventListener("click", () => {
      customDropdown.classList.toggle("open");
      dropdownMenu.style.display = customDropdown.classList.contains("open")
        ? "block"
        : "none";
    });

    document.addEventListener("click", (e) => {
      if (!customDropdown.contains(e.target)) {
        customDropdown.classList.remove("open");
        dropdownMenu.style.display = "none";
      }
    });
  }

  // стартовый таб
  const initialTab =
    container.querySelector(".tab-button.active")?.dataset.tab ||
    buttons[0]?.dataset.tab;

  if (initialTab) showTab(initialTab);
}