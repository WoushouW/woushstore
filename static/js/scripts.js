let language = "en";  // Default language
let isSortedAscending = true;
let storeData = [];  // Для товаров на продажу
let inventoryData = [];  // Для полного инвентаря

const STATIC_STEAM_ID = "76561198127660581";  // ← Твой SteamID64 здесь

const translations = {
  en: {
    title: "CS2 Skin Store",
    forSale: "Items for Sale",
    inventory: "Full Inventory",
    sortBtnAsc: "Sort: Low to High",
    sortBtnDesc: "Sort: High to Low",
    buy: "Buy",
    price: "Price",
    stock: "In Stock"
  },
  ru: {
    title: "Магазин скинов CS2",
    forSale: "Товары на продажу",
    inventory: "Полный инвентарь",
    sortBtnAsc: "Сортировать: От дешевых к дорогим",
    sortBtnDesc: "Сортировать: От дорогих к дешевым",
    buy: "Купить",
    price: "Цена",
    stock: "В наличии"
  }
};

function switchLanguage() {
  language = document.getElementById("languageSelect").value;
  updateTextContent();
  renderStore();      // Перерисовать карточки магазина
  renderInventory();  // Перерисовать карточки инвентаря
}

function updateTextContent() {
  document.getElementById("title").textContent = translations[language].title;
  document.getElementById("forSale").textContent = translations[language].forSale;
  document.getElementById("inventory").textContent = translations[language].inventory;
  document.getElementById("sortBtn").textContent = isSortedAscending ? translations[language].sortBtnAsc : translations[language].sortBtnDesc;
}

function loadStore() {
  fetch(`/inventory?steam_id=${STATIC_STEAM_ID}`)
    .then(res => res.json())
    .then(data => {
      storeData = data;
      renderStore();
    });
}

function loadAll() {
  fetch(`/inventory/all?steam_id=${STATIC_STEAM_ID}`)
    .then(res => res.json())
    .then(data => {
      inventoryData = data;
      renderInventory();
    });
}

function renderStore() {
  const store = document.getElementById("store");
  store.innerHTML = '';
  storeData.forEach(item => {
    store.innerHTML += createStoreItemCard(item);
  });
}

function renderInventory() {
  const all = document.getElementById("all");
  all.innerHTML = '';
  inventoryData.forEach(item => {
    all.innerHTML += createInventoryItemCard(item);
  });
}

function toggleSortOrder() {
  isSortedAscending = !isSortedAscending;
  const store = document.getElementById("store");
  let items = Array.from(store.children);
  
  items.sort((a, b) => {
    let priceA = parseFloat(a.querySelector(".price")?.dataset.value || 0);
    let priceB = parseFloat(b.querySelector(".price")?.dataset.value || 0);
    return isSortedAscending ? priceA - priceB : priceB - priceA;
  });

  store.innerHTML = '';
  items.forEach(item => store.appendChild(item));

  document.getElementById("sortBtn").textContent = isSortedAscending ? translations[language].sortBtnAsc : translations[language].sortBtnDesc;
}

// Создание карточки скина из магазина (с картинкой и кнопкой)
function createStoreItemCard(item) {
  return `
    <div class="item">
      <div class="item-section"><img src="${item.image}" alt="${item.name}" class="item-image"></div>
      <div class="item-section"><h3>${item.name}</h3></div>
      <div class="item-section price" data-value="${item.price}">${translations[language].price}: $${item.price}</div>
      <div class="item-section">${translations[language].stock}: ${item.count}</div>
      <div class="item-section">
        <a href="${item.link}" target="_blank">
          <button ${item.count === 0 ? 'disabled' : ''}>${translations[language].buy}</button>
        </a>
      </div>
    </div>
  `;
}

// Создание карточки обычного инвентарного скина (только имя и количество)
function createInventoryItemCard(item) {
  return `
    <div class="item no-image">
      <div class="item-section"><h3>${item.name}</h3></div>
      <div class="item-section">${translations[language].stock}: ${item.count}</div>
    </div>
  `;
}

// Загружаем товары на продажу при старте
window.onload = () => {
  loadStore();
};
