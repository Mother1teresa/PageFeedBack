function toggleDropdown(button) {
  var dropdown = button.parentElement;
  dropdown.classList.toggle("active");
  document.addEventListener("click", function closeDropdown(event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("active");
      document.removeEventListener("click", closeDropdown);
    }
  });
}
const buttons = document.querySelectorAll(".tab-button");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");
const customDropdown = document.querySelector(".custom-dropdown");
const contents = document.querySelectorAll(".tab-content");

function showTab(tabId) {
  buttons.forEach((button) => button.classList.remove("active"));
  contents.forEach((content) => content.classList.remove("active"));

  const activeButton = document.querySelector(
    `.tab-button[data-tab="${tabId}"]`
  );
  if (activeButton) activeButton.classList.add("active");
  const activeContent = document.getElementById(tabId);
  if (activeContent) activeContent.classList.add("active");
  if (dropdownToggle) {
    const selectedOption = dropdownMenu.querySelector(
      `li[data-value="${tabId}"]`
    );
    if (selectedOption) {
      dropdownToggle.innerHTML = `${selectedOption.textContent}<span class="dropdown-arrow"></span>`;
      dropdownMenu
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("active"));
      selectedOption.classList.add("active");
    }
  }
}

if (dropdownToggle) {
  dropdownToggle.addEventListener("click", () => {
    customDropdown.classList.toggle("open");
    dropdownMenu.style.display = customDropdown.classList.contains("open")
      ? "block"
      : "none";
  });
}

if (dropdownMenu) {
  dropdownMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const tabId = e.target.getAttribute("data-value");
      showTab(tabId);
      customDropdown.classList.remove("open");
      dropdownMenu.style.display = "none";
    }
  });
}

document.addEventListener("click", (e) => {
  if (!customDropdown.contains(e.target)) {
    customDropdown.classList.remove("open");
    dropdownMenu.style.display = "none";
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.getAttribute("data-tab");
    showTab(tabId);
  });
});
showTab("video");

const textarea = document.getElementById("review-text");
const counter = document.getElementById("char-count");

textarea.addEventListener("input", () => {
  counter.textContent = `${textarea.value.length}/250`;
});

const swiper = new Swiper(".mySwiper", {
  slidesPerView: "auto",
  slidesPerGroup: 2,
  spaceBetween: 22,
  allowTouchMove: true,
  breakpoints: {
    1440: {
      slidesPerView: "auto",
      slidesPerGroup: 2,
      spaceBetween: 22,
      allowTouchMove: false,
    },
    1024: {
      slidesPerView: "auto",
      slidesPerGroup: 2,
      spaceBetween: 16,
      allowTouchMove: false,
    },
    768: {
      slidesPerView: "auto",
      slidesPerGroup: 2,
      allowTouchMove: true,
    },
    0: {
      slidesPerView: "auto",
      slidesPerGroup: 1,
      allowTouchMove: true,
    },
  },
  pagination: {
    el: ".swiper-pagination",
    type: "custom",
    clickable: true,
    renderCustom: function (swiper, current, total) {
      let html = "";
      const isFirst = current === 1;
      const leftColor = isFirst ? "#ECECEC" : "black";

      html += `
    <li>
      <a href="#" class="link-back ${isFirst ? "disabled" : ""}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path d="M14 9L10 13L14 17" stroke="${leftColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </li>
  `;
      const maxVisible = 4;

      let start = current - Math.floor(maxVisible / 2);
      let end = current + Math.floor(maxVisible / 2);

      if (start < 1) {
        start = 1;
        end = maxVisible;
      }
      if (end > total) {
        end = total;
        start = total - maxVisible + 1;
        if (start < 1) start = 1;
      }

      if (start > 1) {
        html += `<li><a href="#">1</a></li>`;
        if (start > 2) html += `<li><span class="dots">...</span></li>`;
      }
      for (let i = start; i <= end; i++) {
        const activeClass = i === current ? "active" : "";
        html += `<li><a class="${activeClass}" href="#">${i}</a></li>`;
      }

      if (end < total) {
        if (end < total - 1) html += `<li><span class="dots">...</span></li>`;
        html += `<li><a href="#">${total}</a></li>`;
      }

      const isLast = current === total;
      const rightColor = isLast ? "#ECECEC" : "black";

      html += `
    <li>
      <a href="#" class="link-next ${isLast ? "disabled" : ""}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path d="M10 9L14 13L10 17" stroke="${rightColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </li>
  `;

      return html;
    },
  },
  on: {
    init: function () {
      this.el
        .querySelector(".swiper-pagination")
        .addEventListener("click", (e) => {
          if (e.target.closest("a")) {
            e.preventDefault();
            const target = e.target.closest("a");
            if (target.classList.contains("link-back")) {
              this.slidePrev();
            } else if (target.classList.contains("link-next")) {
              this.slideNext();
            } else if (
              target.tagName === "A" &&
              /^\d+$/.test(target.textContent)
            ) {
              const page = parseInt(target.textContent, 10);
              if (!isNaN(page)) {
                this.slideTo((page - 1) * this.params.slidesPerGroup);
              }
            }
          }
        });
    },
    slideChange: function () {
      const currentSlideIndex = this.activeIndex;
      const slidesPerGroup = this.params.slidesPerGroup;

      const currentPage = Math.floor(currentSlideIndex / slidesPerGroup) + 1;

      const links = this.el.querySelectorAll(
        ".swiper-pagination li a:not(.link-back):not(.link-next)"
      );

      links.forEach((link) => link.classList.remove("active"));

      const activeLink = Array.from(links).find(
        (link) => parseInt(link.textContent, 10) === currentPage
      );

      if (activeLink) activeLink.classList.add("active");
    },
  },
});

const form1 = document.querySelector(".block__form");

if (form1) {
  const requiredFields = form1.querySelectorAll(
    "input[required]:not([name='rating']), textarea[required]"
  );
  const rating = form1.querySelector(".rating");
  const ratingInputs = rating
    ? rating.querySelectorAll("input[name='rating']")
    : [];

  function showError(field) {
    field.classList.add("input-error");
    field.style.borderColor = "#B41825";
  }

  function clearError(field) {
    field.classList.remove("input-error");
    field.style.borderColor = "";
  }

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

    let ratingChecked = [...ratingInputs].some((r) => r.checked);
    if (!ratingChecked) {
      rating.classList.add("rating-error");
      valid = false;
    }

    if (valid) form1.submit();
  });
}

const form2 = document.querySelector(".footer__form-content");

if (form2) {
  const phoneInput = form2.querySelector("#phone");

  if (!window.IMask) {
    console.error("IMask не подключён!");
  } else {
    const phoneMask = IMask(phoneInput, {
      mask: "+{375} (00) 000-00-00",
      lazy: true,
      placeholderChar: "_",
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
      if (!checkbox.checked) {
        checkbox.style.outline = "2px solid #B41825";
        valid = false;
      } else {
        checkbox.style.outline = "";
      }

      if (valid) {
        phoneInput.value = "+" + digits;
        form2.submit();
      }
    });
  }
}

document.querySelectorAll(".footer-accordion").forEach((acc) => {
  const title = acc.querySelector(".footer__row-title");

  title.addEventListener("click", () => {
    acc.classList.toggle("active");
  });
});

const burgerBut = document.querySelector("#burger__but");
const body = document.body;

burgerBut.addEventListener("click", () => {
  if (burgerBut.classList.contains("burger__but__active")) {
    body.style.overflowY = "";
    burgerBut.classList.remove("burger__but__active");

    const headerMenu = document.querySelector(".header__menu__active");
    headerMenu.classList.remove("header__menu__active");
  } else {
    body.style.overflowY = "hidden";
    burgerBut.classList.add("burger__but__active");

    const headerMenu = document.querySelector("#header__menu");
    headerMenu.classList.add("header__menu__active");
  }
});

