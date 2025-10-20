// ========== Загрузка общих компонентов ==========
async function loadComponents() {
  try {
    // Подключаем хедер
    const headerResponse = await fetch('./components/header.html');
    const headerHtml = await headerResponse.text();
    document.getElementById('header-placeholder').innerHTML = headerHtml;

    // Подключаем футер
    const footerResponse = await fetch('./components/footer.html');
    const footerHtml = await footerResponse.text();
    document.getElementById('footer-placeholder').innerHTML = footerHtml;

    // Подключаем модальные окна
    const modalsResponse = await fetch('./components/modals.html');
    const modalsHtml = await modalsResponse.text();
    document.getElementById('modals-placeholder').innerHTML = modalsHtml;
  } catch (error) {
    console.error('Ошибка загрузки компонентов:', error);
  }
}

// Сначала загружаем компоненты, затем инициализируем функционал
loadComponents().then(() => {
  initializeApp();
});

// ========== Мобильное меню Начало==========
function initMobileMenu() {
  const burgerMenu = document.getElementById('burgerMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('mobile-burger-menu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

  if (!burgerMenu || !mobileMenu || !closeMenu || !mobileOverlay) {
    console.warn('Mobile menu elements not found');
    return;
  }

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    burgerMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    burgerMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  burgerMenu.addEventListener('click', function () {
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  closeMenu.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileDropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector('.mobile-dropdown-toggle');
    if (btnDropdown) {
      btnDropdown.addEventListener('click', function (e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
    }
  });
}
// ========== Мобильное меню Конец==========

// ========== Модальное окно регистрации ==========
function initializeApp() {
  // Инициализируем мобильное меню
  initMobileMenu();

  // Инициализируем куки модальные окна
  initCookiePreferences();
  initCookieModal();
  initCookieSwitchers();

  // Проверяем состояние всех куки при инициализации и инициализируем footer кнопки
  setTimeout(() => {
    checkCookieState('analysis');
    checkCookieState('targeting');
    checkCookieState('crossContextual');
    initCookieFooterButtons();
  }, 100);

  const modalSection = document.getElementById('modalSection');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const registrationForm = document.getElementById('registrationForm');
  const registerButtons = document.querySelectorAll('.register-button');

  function openModal() {
    modalSection.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalSection.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Обработчики для всех кнопок регистрации
  registerButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  registrationForm.addEventListener('submit', function (e) {
    closeModal();
  });
}

// ========== Модальное окно Cookie Начало==========
function initCookieModal() {
  const cookieModal = document.getElementById('cookieModal');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');
  const cookieSettings = document.getElementById('cookieSettings');

  if (!cookieModal || !cookieAccept || !cookieDecline || !cookieSettings) {
    console.warn('Cookie modal elements not found');
    return;
  }

  function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    // Показываем модальное окно только если пользователь еще не принял никакого решения
    // Не показываем окно если: 'accepted', 'declined', или 'confirmed'
    if (!consent) {
      setTimeout(() => {
        cookieModal.classList.add('show');
      }, 1000);
    }
  }

  function hideCookieModal() {
    cookieModal.classList.remove('show');
  }

  function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieModal();
  }

  cookieAccept.addEventListener('click', function () {
    // Активируем все куки
    activateAllCookies();
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieModal();
  });

  cookieDecline.addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieModal();

    // Удаляем значение 'declined' через час (60 минут * 60 секунд * 1000 миллисекунд)
    setTimeout(() => {
      localStorage.removeItem('cookieConsent');
    }, 60 * 60 * 1000);
  });

  cookieSettings.addEventListener('click', function () {
    hideCookieModal();
    if (window.openCookiePreferences) {
      window.openCookiePreferences();
    }
  });

  checkCookieConsent();
}
// ========== Модальное окно Cookie Конец==========

// ========== Модальное окно Cookie Preferences Начало==========
function initCookiePreferences() {
  const cookieOptionalSection = document.querySelector('.cookie-optional__section');
  const cookieOptionalClose = document.getElementById('cookieOptionalClose');
  const cookieOptionalOverlay = document.querySelector('.cookie-optional__overlay');

  function initCookieTabs() {
    const sidebarItems = document.querySelectorAll('.cookie-items__sidebar-item');
    const contentItems = document.querySelectorAll('.cookie-items__content-item');

    // Функция для активации таба
    function activateTab(tabName) {
      // Убираем active у всех sidebar items
      sidebarItems.forEach((item) => item.classList.remove('active'));
      // Убираем active у всех content items
      contentItems.forEach((item) => item.classList.remove('active'));

      // На мобильных устройствах (ширина < 810px) показываем весь контент
      if (window.innerWidth < 810) {
        contentItems.forEach((item) => item.classList.add('active'));
      } else {
        // На больших экранах активируем только выбранный контент
        const activeContentItem = document.querySelector(`[content-item="${tabName}"]`);
        if (activeContentItem) {
          activeContentItem.classList.add('active');
        }
      }

      // Находим и активируем нужный sidebar item
      const activeSidebarItem = document.querySelector(`[sidebar-item="${tabName}"]`);
      if (activeSidebarItem) {
        activeSidebarItem.classList.add('active');
      }
    }

    // Добавляем обработчики кликов на sidebar items
    sidebarItems.forEach((item) => {
      item.addEventListener('click', function () {
        const tabName = this.getAttribute('sidebar-item');
        activateTab(tabName);
      });
    });

    // Активируем первый таб "yourPrivacy" по умолчанию
    activateTab('yourPrivacy');
  }

  function openCookiePreferences() {
    cookieOptionalSection.classList.add('active');
    document.body.style.overflow = 'hidden';
    initCookieTabs();
  }

  function closeCookiePreferences() {
    cookieOptionalSection.classList.remove('active');
    document.body.style.overflow = '';
  }

  cookieOptionalClose.addEventListener('click', closeCookiePreferences);
  cookieOptionalOverlay.addEventListener('click', closeCookiePreferences);

  // Делаем функции глобальными для использования в других местах
  window.openCookiePreferences = openCookiePreferences;
}
// ========== Модальное окно Cookie Preferences Конец==========

// ========== Переключатель Cookie Начало==========
function initCookieSwitchers() {
  const switcherBoxes = document.querySelectorAll('.switcher__box');

  switcherBoxes.forEach((switcherBox) => {
    switcherBox.addEventListener('click', function () {
      const switchElement = this.querySelector('.switch');
      const handleSwitchElement = this.querySelector('.handle-switch');
      const textItems = this.querySelectorAll('.switcher__text-item');

      // Переключаем класс active на switch
      if (switchElement) {
        switchElement.classList.toggle('active');
        handleSwitchElement.classList.toggle('active');
      }

      // Переключаем класс active между текстовыми элементами
      textItems.forEach((item) => {
        item.classList.toggle('active');
      });

      // Проверяем тип переключателя и обновляем соответствующее состояние
      const contentItem = this.closest('[content-item]');
      if (contentItem) {
        const cookieType = contentItem.getAttribute('content-item');
        if (cookieConfigs[cookieType]) {
          const isActive = switchElement.classList.contains('active');
          updateCookieConsent(cookieType, isActive);
        }
      }

      // Обновляем состояние кнопки "Confirm my choices"
      updateConfirmButtonState();
    });
  });
}
// ========== Переключатель Cookie Конец==========

// ========== Управление Google Analytics Начало==========

// Конфигурация для разных типов куки
const cookieConfigs = {
  analysis: {
    selector: '[content-item="analysis"] .switch-analysis',
    consentUpdate: (isEnabled) => ({
      analytics_storage: isEnabled ? 'granted' : 'denied',
    }),
  },
  targeting: {
    selector: '[content-item="targeting"] .switch-targeting',
    consentUpdate: (isEnabled) => ({
      ad_personalization: isEnabled ? 'granted' : 'denied',
      ad_user_data: isEnabled ? 'granted' : 'denied',
    }),
  },
  crossContextual: {
    selector: '[content-item="crossContextual"] .switch-crossContextual',
    consentUpdate: (isEnabled) => ({
      ad_storage: isEnabled ? 'granted' : 'denied',
      ad_personalization: isEnabled ? 'granted' : 'denied',
      ad_user_data: isEnabled ? 'granted' : 'denied',
    }),
  },
  functionality: {
    selector: '[content-item="functionality"] .switch',
    consentUpdate: (isEnabled) => ({
      // Functionality cookies обычно не требуют специального gtag consent
    }),
  },
};

// Универсальная функция для управления согласием
function updateCookieConsent(cookieType, isEnabled) {
  if (
    typeof gtag !== 'undefined' &&
    cookieConfigs[cookieType] &&
    cookieConfigs[cookieType].consentUpdate
  ) {
    const consentUpdate = cookieConfigs[cookieType].consentUpdate(isEnabled);
    // Проверяем, что consentUpdate возвращает не пустой объект
    if (consentUpdate && Object.keys(consentUpdate).length > 0) {
      gtag('consent', 'update', consentUpdate);
    }
  }
}

// Универсальная функция для проверки состояния переключателя
function checkCookieState(cookieType) {
  const config = cookieConfigs[cookieType];
  if (!config) return false;

  const switchElement = document.querySelector(config.selector);
  if (switchElement) {
    const isActive = switchElement.classList.contains('active');
    updateCookieConsent(cookieType, isActive);
    return isActive;
  }
  return false;
}

// Функция для активации всех куки
function activateAllCookies() {
  // Активируем все типы куки из конфигурации
  Object.keys(cookieConfigs).forEach((cookieType) => {
    const config = cookieConfigs[cookieType];
    const switchElement = document.querySelector(config.selector);

    if (switchElement) {
      const switcherBox = switchElement.closest('.switcher__box');
      if (switcherBox) {
        const handleSwitchElement = switcherBox.querySelector('.handle-switch');
        const activeText = switcherBox.querySelector('.active-text');
        const disactiveText = switcherBox.querySelector('.disactive-text');

        // Активируем переключатель
        switchElement.classList.add('active');
        if (handleSwitchElement) {
          handleSwitchElement.classList.add('active');
        }

        // Устанавливаем правильное состояние текста
        if (activeText) {
          activeText.classList.add('active');
        }
        if (disactiveText) {
          disactiveText.classList.remove('active');
        }

        // Обновляем gtag согласие
        updateCookieConsent(cookieType, true);
      }
    }
  });

  // Обновляем состояние кнопки "Confirm my choices" после активации всех куки
  updateConfirmButtonState();
}

// Функция для сбора всех выбранных состояний куки и отправки их
function confirmSelectedCookies() {
  const selectedStates = {};
  const consentUpdates = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_personalization: 'denied',
    ad_user_data: 'denied',
  };

  // Проходим по всем типам куки и собираем их состояния
  Object.keys(cookieConfigs).forEach((cookieType) => {
    const config = cookieConfigs[cookieType];
    const switchElement = document.querySelector(config.selector);

    if (switchElement) {
      const isActive = switchElement.classList.contains('active');
      selectedStates[cookieType] = isActive;

      // Применяем изменения через gtag
      if (config.consentUpdate) {
        const updates = config.consentUpdate(isActive);
        if (updates && Object.keys(updates).length > 0) {
          Object.assign(consentUpdates, updates);
        }
      }
    }
  });

  // Отправляем все consent updates одним вызовом
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', consentUpdates);
  }

  return selectedStates;
}

// Функция для проверки состояния переключателей куки
function checkAnySwitchActive() {
  let hasActiveSwitch = false;

  Object.keys(cookieConfigs).forEach((cookieType) => {
    const config = cookieConfigs[cookieType];
    const switchElement = document.querySelector(config.selector);

    if (switchElement && switchElement.classList.contains('active')) {
      hasActiveSwitch = true;
    }
  });

  return hasActiveSwitch;
}

// Функция для обновления состояния кнопки "Confirm my choices"
function updateConfirmButtonState() {
  const confirmButton = Array.from(document.querySelectorAll('.cookie-items__footer-button')).find(
    (button) => button.textContent.trim() === 'Confirm my choices',
  );

  if (confirmButton) {
    const isAnySwitchActive = checkAnySwitchActive();
    if (isAnySwitchActive) {
      confirmButton.classList.add('active');
      confirmButton.style.pointerEvents = 'auto';
      confirmButton.style.opacity = '1';
    } else {
      confirmButton.classList.remove('active');
      confirmButton.style.pointerEvents = 'none';
      confirmButton.style.opacity = '0.5';
    }
  }
}

// Функция для инициализации footer кнопок cookie preferences
function initCookieFooterButtons() {
  const footerButtons = document.querySelectorAll('.cookie-items__footer-button');
  footerButtons.forEach((button) => {
    if (button.textContent.trim() === 'Allow all cookies') {
      button.addEventListener('click', function () {
        // Активируем все куки
        activateAllCookies();
        localStorage.setItem('cookieConsent', 'accepted');

        // Закрываем окно cookie preferences
        const cookieOptionalSection = document.querySelector('.cookie-optional__section');
        if (cookieOptionalSection) {
          cookieOptionalSection.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    if (button.textContent.trim() === 'Reject optional cookies') {
      button.addEventListener('click', function () {
        // Делаем то же самое, что и кнопка Decline
        localStorage.setItem('cookieConsent', 'declined');

        // Удаляем значение 'declined' через час
        setTimeout(() => {
          localStorage.removeItem('cookieConsent');
        }, 60 * 60 * 1000);

        // Закрываем окно cookie preferences
        const cookieOptionalSection = document.querySelector('.cookie-optional__section');
        if (cookieOptionalSection) {
          cookieOptionalSection.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    if (button.textContent.trim() === 'Confirm my choices') {
      // Изначально делаем кнопку неактивной
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.5';

      button.addEventListener('click', function () {
        // Собираем и отправляем выбранные настройки куки
        const selectedCookies = confirmSelectedCookies();

        // Сохраняем выбранные настройки навсегда
        localStorage.setItem('cookieConsent', 'confirmed');
        localStorage.setItem('cookieSettings', JSON.stringify(selectedCookies));

        // Закрываем окно cookie preferences
        const cookieOptionalSection = document.querySelector('.cookie-optional__section');
        if (cookieOptionalSection) {
          cookieOptionalSection.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // Проверяем начальное состояние кнопки
  updateConfirmButtonState();
}
// ========== Управление Google Analytics Конец==========
