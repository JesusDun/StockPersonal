const STORAGE_KEY = "stock-personal-products-v1";
const THEME_KEY = "stock-personal-theme-v1";
const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const starterProducts = [
  { id: "vitamin-gummies", name: "Gomitas de vitaminas", store: "Amazon", icon: "🍊", quantity: 180, unit: "gomitas", step: 1, priceMin: 250, priceMax: 250, detail: "Frasco con 180 gomitas", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "protein-bars", name: "Barritas de proteína", store: "Walmart", icon: "🍫", quantity: 5, unit: "paquetitos", step: 1, priceMin: 150, priceMax: 200, detail: "1 caja = 5 paquetitos", consumptionAmount: 1, consumptionPeriod: "day", stock: 0 },
  { id: "greek-yogurt", name: "Yogurt Oikos Griego", store: "Walmart", icon: "🥣", quantity: 900, unit: "g", step: 100, priceMin: 90, priceMax: 180, detail: "900 g · Sabores anotados: Natural/Fresa $90, Coco rayado $96, Selecto Natural/Vainilla $95", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "almonds", name: "Almendras Great Value", store: "Walmart", icon: "🥜", quantity: 1, unit: "bolsa", step: 1, priceMin: 33, priceMax: 33, detail: "1 bolsa", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "roasted-peanuts", name: "Cacahuates rostizados", store: "Walmart", icon: "🥜", quantity: 1, unit: "paquete", step: 1, priceMin: 74, priceMax: 74, detail: "1 paquete", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "fresh-berries", name: "Charola de moras", store: "Walmart", icon: "🫐", quantity: 1, unit: "charola", step: 1, priceMin: 59, priceMax: 59, detail: "1 charola", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "frozen-berries", name: "Mezcla de moras congeladas", store: "Walmart", icon: "🫐", quantity: 1, unit: "bolsa", step: 1, priceMin: 150, priceMax: 150, detail: "1 bolsa", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "sandwich-bags", name: "Ziploc para sándwich", store: "Walmart", icon: "🛍️", quantity: 100, unit: "bolsas", step: 1, priceMin: 90, priceMax: 90, detail: "1 paquete = 100 bolsas", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "snack-bags", name: "Ziploc para snacks", store: "Walmart", icon: "🛍️", quantity: 50, unit: "bolsas", step: 1, priceMin: 58, priceMax: 58, detail: "1 paquete = 50 bolsas", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "bimbo-bread", name: "Barra de pan Bimbo", store: "Walmart", icon: "🍞", quantity: 1, unit: "barra", step: 1, priceMin: 50, priceMax: 50, detail: "1 barra", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "kraft-cheese", name: "Queso amarillo Kraft Singles", store: "Walmart", icon: "🧀", quantity: 1, unit: "paquete", step: 1, priceMin: 66, priceMax: 66, detail: "1 paquete", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "kraft-mayo", name: "Mayonesa Kraft Limón", store: "Walmart", icon: "🍋", quantity: 1, unit: "frasco", step: 1, priceMin: 65, priceMax: 65, detail: "1 frasco", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "tuna", name: "Atún", store: "Walmart", icon: "🐟", quantity: 4, unit: "latas", step: 1, priceMin: 68, priceMax: 68, detail: "4 latas · $17 c/u", consumptionAmount: 0, consumptionPeriod: "day", stock: 0 },
  { id: "bananas", name: "Bananas", store: "Walmart", icon: "🍌", quantity: 5, unit: "piezas", step: 1, priceMin: 50, priceMax: 50, detail: "5 piezas", consumptionAmount: 1, consumptionPeriod: "day", stock: 0 },
];

const notice = document.querySelector("#notice");
let products = loadProducts();
let editingPaceId = null;

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starterProducts));
      return starterProducts.map((product) => ({ ...product }));
    }

    const parsed = JSON.parse(saved);
    const validProduct = (product) => product
      && typeof product.id === "string"
      && typeof product.name === "string"
      && typeof product.unit === "string"
      && ["quantity", "step", "priceMin", "priceMax", "stock"].every(
        (key) => Number.isFinite(product[key]) && product[key] >= 0,
      )
      && Number.isFinite(product.consumptionAmount ?? product.dailyUse ?? 0)
      && (product.consumptionAmount ?? product.dailyUse ?? 0) >= 0
      && ["day", "week", "month"].includes(product.consumptionPeriod || "day")
      && product.quantity > 0
      && product.step > 0
      && product.priceMax >= product.priceMin;
    if (!Array.isArray(parsed) || parsed.some((product) => !validProduct(product))) {
      throw new Error("El inventario guardado no tiene un formato válido.");
    }
    return parsed.map((product) => ({
      ...product,
      consumptionAmount: product.consumptionAmount ?? product.dailyUse ?? 0,
      consumptionPeriod: product.consumptionPeriod || "day",
    }));
  } catch (error) {
    showNotice(`No se pudo leer el inventario guardado. Se mostrará una lista inicial; revisa la configuración de almacenamiento del navegador. ${error.message}`);
    return starterProducts.map((product) => ({ ...product }));
  }
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    showNotice(`No se pudieron guardar los cambios en este dispositivo: ${error.message}`);
    return false;
  }
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

function priceLabel(product) {
  if (product.priceMin === product.priceMax) return money.format(product.priceMin);
  return `${money.format(product.priceMin)}–${money.format(product.priceMax)}`;
}

function formatQuantity(value) {
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(value);
}

function formatDuration(daysRemaining) {
  if (daysRemaining < 1) return "menos de 1 día";
  const days = Math.ceil(daysRemaining);
  const months = Math.floor(days / 30);
  const daysAfterMonths = days % 30;
  const weeks = Math.floor(daysAfterMonths / 7);
  const extraDays = daysAfterMonths % 7;
  const parts = [];
  if (months > 0) parts.push(`${months} ${months === 1 ? "mes" : "meses"}`);
  if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "semana" : "semanas"}`);
  if (extraDays > 0) parts.push(`${extraDays} ${extraDays === 1 ? "día" : "días"}`);
  if (parts.length > 1) return parts.slice(0, -1).join(", ") + " y " + parts.at(-1);
  if (parts.length === 1) return parts[0];
  return `${days} ${days === 1 ? "día" : "días"}`;
}

function daysPerPeriod(period) {
  return { day: 1, week: 7, month: 30 }[period] || 1;
}

function periodLabel(period) {
  return { day: "día", week: "semana", month: "mes" }[period] || "día";
}

function renderGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour >= 5 && hour < 12 ? "Buenos días"
    : hour >= 12 && hour < 19 ? "Buenas tardes"
      : "Buenas noches";
  document.querySelector("#greeting-title").innerHTML = `${greeting},<br><span>Jesús García.</span>`;
  document.querySelector("#local-date").textContent = new Intl.DateTimeFormat("es-MX", {
    weekday: "long", day: "numeric", month: "long",
  }).format(now);
  const localTime = document.querySelector("#local-time");
  localTime.dateTime = now.toISOString();
  localTime.textContent = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric", minute: "2-digit",
  }).format(now);
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  document.querySelector("#theme-icon").textContent = isDark ? "☀" : "☾";
  const label = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  const button = document.querySelector("#theme-toggle");
  button.setAttribute("aria-label", label);
  button.title = label;
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#111622" : "#f5f3ed";
}

function initializeTheme() {
  let theme = "dark";
  try {
    theme = localStorage.getItem(THEME_KEY) || "dark";
  } catch (error) {
    showNotice(`No se pudo leer tu preferencia de tema: ${error.message}`);
  }
  applyTheme(theme === "light" ? "light" : "dark");
}

function renderSummary() {
  const stocked = products.filter((product) => product.stock > 0);
  const planned = products.filter((product) => product.stock <= 0);
  const plannedMin = planned.reduce((total, product) => total + Number(product.priceMin || 0), 0);
  const plannedMax = planned.reduce((total, product) => total + Number(product.priceMax || 0), 0);

  document.querySelector("#stock-count").textContent = stocked.length;
  document.querySelector("#planned-count").textContent = planned.length;
  document.querySelector("#shopping-heading-count").textContent = planned.length;
  document.querySelector("#budget-value").textContent = plannedMin === plannedMax
    ? money.format(plannedMin)
    : `${money.format(plannedMin)}–${money.format(plannedMax)}`;
}

function renderShoppingList() {
  const container = document.querySelector("#shopping-list");
  const planned = products.filter((product) => product.stock <= 0);
  if (planned.length === 0) {
    container.innerHTML = '<p class="empty-state">¡Todo listo! No tienes productos pendientes de compra.</p>';
    return;
  }

  const stores = [...new Set(planned.map((product) => product.store || "Otros"))];
  container.innerHTML = stores.map((store) => {
    const items = planned.filter((product) => (product.store || "Otros") === store);
    return `<h3 class="shop-group">${escapeHtml(store)}</h3>${items.map((product) => `
      <article class="shopping-item">
        <span class="item-icon" aria-hidden="true">${escapeHtml(product.icon || "📦")}</span>
        <div class="item-info">
          <p class="item-name">${escapeHtml(product.name)}</p>
          <p class="item-detail">${escapeHtml(product.detail || `${formatQuantity(product.quantity)} ${product.unit}`)}</p>
        </div>
        <span class="item-price">${priceLabel(product)}</span>
        <button class="button button-primary" type="button" data-action="purchase" data-id="${escapeHtml(product.id)}">Ya lo compré</button>
      </article>
    `).join("")}`;
  }).join("");
}

function stockStatus(product) {
  if (product.stock <= 0) return "empty";
  if (product.stock <= product.step * 2) return "low";
  return "available";
}

function renderInventory() {
  const container = document.querySelector("#inventory-list");
  const filter = document.querySelector("#inventory-filter").value;
  const visible = products.filter((product) => {
    const status = stockStatus(product);
    if (filter === "available") return status !== "empty";
    if (filter === "low") return status === "low";
    if (filter === "empty") return status === "empty";
    return true;
  });

  if (visible.length === 0) {
    container.innerHTML = '<p class="empty-state">No hay productos en esta vista.</p>';
    return;
  }

  container.innerHTML = visible.map((product) => {
    const status = stockStatus(product);
    const progress = product.stock > 0 ? Math.min(100, (product.stock / product.quantity) * 100) : 0;
    const consumptionAmount = product.consumptionAmount ?? product.dailyUse ?? 0;
    const consumptionPeriod = product.consumptionPeriod || "day";
    const forecast = consumptionAmount > 0 && product.stock > 0
      ? `Aprox. <strong>${formatDuration(product.stock / consumptionAmount * daysPerPeriod(consumptionPeriod))}</strong> al ritmo actual`
      : product.stock > 0 ? "Aún sin estimar cuánto te dura" : "Todavía no lo has comprado";
    const badge = status === "empty" ? "Pendiente"
      : `${formatQuantity(product.stock)} ${escapeHtml(product.unit)}`;
    return `
      <article class="inventory-card">
        <div class="inventory-top">
          <span class="item-icon" aria-hidden="true">${escapeHtml(product.icon || "📦")}</span>
          <div class="item-info">
            <p class="item-name">${escapeHtml(product.name)}</p>
            <p class="item-detail">${escapeHtml(product.store || "Personal")}</p>
          </div>
          <span class="stock-badge ${status === "empty" ? "is-empty" : status === "low" ? "is-low" : ""}">${badge}</span>
        </div>
        <div class="stock-track" role="progressbar" aria-label="Existencias de ${escapeHtml(product.name)}" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100">
          <div class="stock-fill ${status === "empty" ? "is-empty" : status === "low" ? "is-low" : ""}" style="width: ${progress}%"></div>
        </div>
        <div class="inventory-bottom">
          <span class="forecast">${forecast}</span>
          ${editingPaceId === product.id ? `
            <form class="pace-form" data-id="${escapeHtml(product.id)}">
              <label for="pace-${escapeHtml(product.id)}">Consumo</label>
              <input id="pace-${escapeHtml(product.id)}" name="pace" type="number" min="0" step="any" required value="${consumptionAmount || ""}" aria-label="Cantidad de ${escapeHtml(product.unit)} que consumes">
              <span>${escapeHtml(product.unit)}</span>
              <label class="visually-hidden" for="period-${escapeHtml(product.id)}">Periodo de consumo</label>
              <select id="period-${escapeHtml(product.id)}" name="period" aria-label="Periodo de consumo">
                <option value="day" ${consumptionPeriod === "day" ? "selected" : ""}>por día</option>
                <option value="week" ${consumptionPeriod === "week" ? "selected" : ""}>por semana</option>
                <option value="month" ${consumptionPeriod === "month" ? "selected" : ""}>por mes</option>
              </select>
              <button class="button button-primary" type="submit">Guardar</button>
              <button class="button button-quiet" type="button" data-action="cancel-pace" data-id="${escapeHtml(product.id)}" aria-label="Cancelar">×</button>
            </form>
          ` : `
            <div class="stock-actions">
              <button class="button button-quiet" type="button" data-action="consume" data-id="${escapeHtml(product.id)}" aria-label="Registrar consumo de ${escapeHtml(product.name)}" ${product.stock <= 0 ? "disabled" : ""}>−</button>
              <button class="button button-quiet" type="button" data-action="add-stock" data-id="${escapeHtml(product.id)}" aria-label="Agregar existencias de ${escapeHtml(product.name)}">+</button>
              <button class="button button-use" type="button" data-action="set-pace" data-id="${escapeHtml(product.id)}">Consumo</button>
            </div>
          `}
        </div>
      </article>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function render() {
  renderSummary();
  renderShoppingList();
  renderInventory();
}

function updateProduct(id, update) {
  const previousProducts = products;
  products = products.map((product) => product.id === id ? update(product) : product);
  if (saveProducts()) {
    notice.hidden = true;
    render();
    return true;
  } else {
    products = previousProducts;
    return false;
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.id);
  if (!product) return;

  if (button.dataset.action === "cancel-pace") {
    editingPaceId = null;
    renderInventory();
  } else if (button.dataset.action === "purchase") {
    updateProduct(product.id, (item) => ({ ...item, stock: item.quantity }));
  } else if (button.dataset.action === "consume") {
    updateProduct(product.id, (item) => ({ ...item, stock: Math.max(0, item.stock - item.step) }));
  } else if (button.dataset.action === "add-stock") {
    updateProduct(product.id, (item) => ({ ...item, stock: item.stock + item.step }));
  } else if (button.dataset.action === "set-pace") {
    editingPaceId = product.id;
    renderInventory();
  }
});

document.querySelector("#inventory-list").addEventListener("submit", (event) => {
  if (!event.target.matches(".pace-form")) return;
  event.preventDefault();
  const product = products.find((item) => item.id === event.target.dataset.id);
  const formData = new FormData(event.target);
  const amount = Number(formData.get("pace"));
  const period = String(formData.get("period"));
  if (!product || !Number.isFinite(amount) || amount < 0 || !["day", "week", "month"].includes(period)) {
    showNotice("Escribe una cantidad válida mayor o igual a cero.");
    return;
  }
  if (updateProduct(product.id, (item) => ({
    ...item,
    consumptionAmount: amount,
    consumptionPeriod: period,
    dailyUse: undefined,
  }))) {
    editingPaceId = null;
    renderInventory();
  }
});

document.querySelector("#inventory-filter").addEventListener("change", renderInventory);

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    showNotice(`No se pudo guardar tu preferencia de tema: ${error.message}`);
  }
});

document.querySelector("#add-product-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name")).trim();
  const quantity = Number(form.get("quantity"));
  const unit = String(form.get("unit")).trim();
  const price = Number(form.get("price") || 0);
  if (!name || !unit || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0) {
    showNotice("Revisa el nombre, la cantidad, la unidad y el precio del producto.");
    return;
  }

  const id = `custom-${Date.now()}`;
  products.push({
    id, name, store: "Personal", icon: "📦", quantity, unit, step: 1,
    priceMin: price, priceMax: price, detail: `${formatQuantity(quantity)} ${unit}`,
    consumptionAmount: 0, consumptionPeriod: "day", stock: 0,
  });
  if (saveProducts()) {
    event.currentTarget.reset();
    event.currentTarget.closest("details").open = false;
    notice.hidden = true;
    render();
  } else {
    products = products.filter((product) => product.id !== id);
  }
});

initializeTheme();
renderGreeting();
render();
window.setInterval(renderGreeting, 60_000);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      showNotice(`No se pudo activar el modo sin conexión: ${error.message}`);
    });
  });
}
