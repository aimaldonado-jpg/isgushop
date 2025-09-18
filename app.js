// ===== Galería por URL (versión simple) =====
const imageUrlInput = document.getElementById("imageUrl");
const addImageBtn   = document.getElementById("addImageBtn");
const galleryRow    = document.getElementById("galleryRow");
const urlError      = document.getElementById("urlError");

function hasHttpProtocol(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function tryLoadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = url;
  });
}

async function handleAddImage() {
  urlError.classList.add("d-none");
  let url = imageUrlInput.value.trim();

  if (!hasHttpProtocol(url)) {
    urlError.classList.remove("d-none");
    return;
  }

  try {
    await tryLoadImage(url);
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Imagen agregada";
    img.className = "img-fluid shadow-sm";
    col.appendChild(img);
    galleryRow.appendChild(col);
    imageUrlInput.value = "";
    imageUrlInput.focus();
  } catch (e) {
    urlError.textContent = e.message;
    urlError.classList.remove("d-none");
  }
}

addImageBtn?.addEventListener("click", handleAddImage);
imageUrlInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleAddImage();
});

// ===== Lista de tareas =====
const taskList     = document.getElementById("taskList");
const removeBtn    = document.getElementById("removeBtn");
const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn   = document.getElementById("addTaskBtn");

let taskCounter = 4;

removeBtn?.addEventListener("click", () => {
  const first = taskList.querySelector("li");
  if (first) first.remove();
});

addTaskBtn?.addEventListener("click", () => {
  const text = newTaskInput.value.trim();
  if (!text) return;
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.id = `tarea${taskCounter++}`;
  li.textContent = text;
  taskList.appendChild(li);
  newTaskInput.value = "";
  newTaskInput.focus();
});

newTaskInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

// ===== Sesión 19: DOM =====
document.getElementById("btnCambiarTitulo")?.addEventListener("click", () => {
  document.getElementById("titulo19").textContent = "🌸 Especial de Regalos Personalizados 🌸";
});

document.getElementById("btnColorCajas")?.addEventListener("click", () => {
  const cajas = document.getElementsByClassName("caja");
  for (let i = 0; i < cajas.length; i++) {
    cajas[i].style.backgroundColor = "#fce4ec"; // rosa claro
    cajas[i].style.borderColor = "#ec407a";     // rosa fuerte
  }
});

document.getElementById("btnPrimeraCaja")?.addEventListener("click", () => {
  const caja = document.querySelector(".caja");
  if (caja) {
    caja.style.backgroundColor = "#dcedc8";  // verde pastel
    caja.style.borderColor = "#689f38";
  }
});

document.getElementById("contactoForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("¡Gracias por tu solicitud! Te contactaremos pronto 💌");
});

// ===== Sesión 21: Cambios en la Card 1 (seguirá funcionando con render dinámico) =====
document.getElementById("btnCambiarCard1")?.addEventListener("click", () => {
  const card = document.querySelector('.product-card[data-product-id="1"]');
  if (!card) return;
  card.querySelector(".card-title").firstChild.nodeValue = "Caja con chocolates y flores 🌷🍫";
  card.querySelector(".card-text strong").textContent = "$950";
  card.querySelector(".extra-text").textContent = "Incluye tarjeta personalizada y empaque temático.";
});

document.getElementById("btnCambiarImg1")?.addEventListener("click", () => {
  const img = document.querySelector('.product-card[data-product-id="1"] img');
  if (img) img.src = "https://images.unsplash.com/photo-1589820296150-3d5a2640c9a8?w=800";
});

// ===== Carrito =====
const cartListEl   = document.getElementById("cartList");
const cartCountEl  = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCartBtn");

function updateCartCount() {
  cartCountEl.textContent = cartListEl.querySelectorAll("li").length;
}

function addToCart({ id, name, price }) {
  if (cartListEl.querySelector(`[data-id="${id}"]`)) return;
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.dataset.id = id;
  li.innerHTML = `<span>${name} — <strong>${price}</strong></span><button class="btn btn-sm btn-outline-danger">Eliminar</button>`;
  li.querySelector("button").addEventListener("click", () => {
    li.remove();
    updateCartCount();
  });
  cartListEl.appendChild(li);
  updateCartCount();
}

clearCartBtn?.addEventListener("click", () => {
  cartListEl.innerHTML = "";
  updateCartCount();
});

// ===== Integración con API (Django REST) =====
const API_BASE = "http://127.0.0.1:8000/api";

async function loadProducts() {
  const res = await fetch(`${API_BASE}/productos/`);
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";
  products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card h-100 product-card" data-product-id="${p.id}">
        <img src="${p.imagen || 'liston.png'}" class="card-img-top" alt="${p.nombre}" />
        <div class="card-body">
          <h5 class="card-title d-flex align-items-center gap-2">
            ${p.nombre}
            <span class="badge bg-secondary status-badge">
              ${p.disponible ? "Disponible" : "Agotado"}
            </span>
          </h5>
          <p class="card-text mb-2">Precio: <strong>$${Number(p.precio).toLocaleString()}</strong></p>
          <p class="card-text extra-text">${p.descripcion || ""}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-primary btn-select">1) Seleccionar</button>
            <button class="btn btn-outline-secondary btn-remove">2) Quitar</button>
          </div>
        </div>
      </div>`;
    grid.appendChild(col);
  });

  // Enlaza los botones del carrito después de renderizar
  bindCartButtons();
}

function bindCartButtons() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const id    = card.dataset.productId;
    const name  = card.querySelector(".card-title").childNodes[0].textContent.trim();
    const price = card.querySelector(".card-text strong").textContent.trim();

    card.querySelector(".btn-select")?.addEventListener("click", () =>
      addToCart({ id, name, price })
    );
    card.querySelector(".btn-remove")?.addEventListener("click", () => {
      const li = cartListEl.querySelector(`[data-id="${id}"]`);
      if (li) { li.remove(); updateCartCount(); }
    });
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
