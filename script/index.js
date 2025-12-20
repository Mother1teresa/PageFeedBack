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

  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const customDropdown = document.querySelector(".custom-dropdown");

  function showTab(tabId) {
    buttons.forEach((b) => b.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    const activeButton = document.querySelector(
      `.tab-button[data-tab="${tabId}"]`
    );
    const activeContent = document.getElementById(tabId);

    if (activeButton) activeButton.classList.add("active");
    if (activeContent) activeContent.classList.add("active");

    // dropdown sync
    if (dropdownToggle && dropdownMenu) {
      const selected = dropdownMenu.querySelector(`li[data-value="${tabId}"]`);
      if (selected) {
        dropdownToggle.innerHTML = `${selected.textContent}
          <span class="dropdown-arrow"></span>`;
        dropdownMenu
          .querySelectorAll("li")
          .forEach((li) => li.classList.remove("active"));
        selected.classList.add("active");
      }
    }
  }

  // клики по кнопкам
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tab);
    });
  });

  // 🔴 ВАЖНО: показываем первый таб автоматически
  if (buttons.length > 0) {
    showTab(buttons[0].dataset.tab);
  }

  /* ================= DROPDOWN TABS ================= */

  if (dropdownToggle && dropdownMenu && customDropdown) {
    dropdownToggle.addEventListener("click", () => {
      customDropdown.classList.toggle("open");
      dropdownMenu.style.display = customDropdown.classList.contains("open")
        ? "block"
        : "none";
    });

    dropdownMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        showTab(e.target.dataset.value);
        customDropdown.classList.remove("open");
        dropdownMenu.style.display = "none";
      }
    });

    document.addEventListener("click", (e) => {
      if (!customDropdown.contains(e.target)) {
        customDropdown.classList.remove("open");
        dropdownMenu.style.display = "none";
      }
    });
  }

  /* ================= TEXTAREA COUNTER ================= */

  const textarea = document.getElementById("review-text");
  const counter = document.getElementById("char-count");

  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length}` / 250;
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
});
