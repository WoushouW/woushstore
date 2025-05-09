let isSortedAscending = true;
let storeData = [];
let inventoryData = [];

const STATIC_STEAM_ID = "76561198127660581";

// Загрузка товаров
function loadStore() {
  fetch(`/inventory?steam_id=${STATIC_STEAM_ID}`)
    .then(res => res.json())
    .then(data => {
      storeData = data;
      renderStore();
    });
}

// Загрузка полного инвентаря
function loadAll() {
  fetch(`/inventory/all?steam_id=${STATIC_STEAM_ID}`)
    .then(res => res.json())
    .then(data => {
      inventoryData = data;
      renderInventory();
    });
}

// Отрисовка магазина
function renderStore() {
  const store = document.getElementById("store");
  store.innerHTML = '';
  storeData.forEach(item => {
    store.innerHTML += createStoreItemCard(item);
  });
}

// Отрисовка инвентаря
function renderInventory() {
  const all = document.getElementById("all");
  all.innerHTML = '';
  inventoryData.forEach(item => {
    all.innerHTML += createInventoryItemCard(item);
  });
}

// Переключение меню
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  if (menu) {
    menu.classList.toggle("open");
  }
}

// Переключение сортировки
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

  document.getElementById("sortBtn").textContent = isSortedAscending
    ? "Sort: Low to High"
    : "Sort: High to Low";
}

// Создание карточки товара
function createStoreItemCard(item) {
  return `
    <div class="item">
      <div class="item-section"><img src="${item.image}" alt="${item.name}" class="item-image"></div>
      <div class="item-section"><h3>${item.name}</h3></div>
      <div class="item-section price" data-value="${item.price}">Price: $${item.price}</div>
      <div class="item-section">In Stock: ${item.count}</div>
      <div class="item-section">
        <a href="${item.link}" target="_blank">
          <button ${item.count === 0 ? 'disabled' : ''}>Buy</button>
        </a>
      </div>
    </div>
  `;
}

// Создание карточки инвентаря
function createInventoryItemCard(item) {
  return `
    <div class="item no-image">
      <div class="item-section"><h3>${item.name}</h3></div>
      <div class="item-section">In Stock: ${item.count}</div>
    </div>
  `;
}

let inventoryVisible = false;

// Переключение отображения инвентаря
function toggleInventory() {
  const btn = document.getElementById("allBtn");
  const container = document.getElementById("all");

  if (!inventoryVisible) {
    loadAll();
    container.style.display = "grid";
    btn.textContent = "Hide Inventory";
  } else {
    container.innerHTML = "";
    container.style.display = "none";
    btn.textContent = "Show Full Inventory";
  }

  inventoryVisible = !inventoryVisible;
}

// Запуск при загрузке
window.onload = () => {
  loadStore();

  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMenu);
  }
};
