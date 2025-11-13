/* === script.js - carrito funcional + filtros + detalles visuales === */

// helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// elementos
const carritoItems = $("#carritoItems");
const totalElemento = $("#total");
const vaciarCarritoBtn = $("#vaciarCarritoBtn");
const checkoutBtn = $("#checkoutBtn");
const checkoutForm = $("#checkoutForm");
const confirmarBtn = $("#confirmarBtn");
const mensajeCompra = $("#mensajeCompra");

let carrito = JSON.parse(localStorage.getItem("carrito_miel")) || [];

// === FUNCIÓN: Renderizar carrito ===
function renderCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <div class="item-info">
        <strong>${item.nombre}</strong>
        <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
      </div>
      <div class="item-acciones">
        <button class="qty-btn" data-idx="${index}" data-action="minus">-</button>
        <button class="qty-btn" data-idx="${index}" data-action="plus">+</button>
        <button class="eliminar" data-idx="${index}">Eliminar</button>
      </div>
    `;
    carritoItems.appendChild(div);
  });

  totalElemento.textContent = total.toFixed(2);
  localStorage.setItem("carrito_miel", JSON.stringify(carrito));

  // acciones sobre los ítems
  $$(".eliminar").forEach(btn => {
    btn.onclick = (e) => {
      const idx = parseInt(e.target.dataset.idx);
      carrito.splice(idx, 1);
      renderCarrito();
    };
  });

  $$(".qty-btn").forEach(btn => {
    btn.onclick = (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const action = e.target.dataset.action;
      if (action === "plus") carrito[idx].cantidad++;
      if (action === "minus") carrito[idx].cantidad = Math.max(1, carrito[idx].cantidad - 1);
      renderCarrito();
    };
  });
}

// === FUNCIÓN: Agregar producto ===
function agregarProductoDesdeCard(card) {
  const nombre = card.dataset.nombre || card.querySelector("h4").innerText;
  const precio = parseFloat(card.dataset.precio || card.querySelector(".precio-row span").innerText.replace("$", ""));
  
  const existente = carrito.find(p => p.nombre === nombre && p.precio === precio);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  renderCarrito();
}

// === Activar botones "Agregar" ===
function activarAddBtns() {
  $$(".add-btn").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".producto-card");
      agregarProductoDesdeCard(card);
      btn.classList.add("added");
      setTimeout(() => btn.classList.remove("added"), 400);
    };
  });
}

// === Vaciar carrito ===
vaciarCarritoBtn.onclick = () => {
  carrito = [];
  renderCarrito();
};

// === Mostrar / ocultar formulario ===
if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    checkoutForm.classList.toggle("checkout-oculto");
  };
}

// === Confirmar compra ===
if (confirmarBtn) {
  confirmarBtn.onclick = () => {
    const nombre = $("#nombreCliente").value.trim();
    const direccion = $("#direccionCliente").value.trim();

    if (!nombre || !direccion) {
      alert("Por favor completa tu nombre y dirección.");
      return;
    }
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    mensajeCompra.classList.remove("mensaje-oculto");
    carrito = [];
    renderCarrito();

    setTimeout(() => {
      mensajeCompra.classList.add("mensaje-oculto");
      checkoutForm.classList.add("checkout-oculto");
      $("#nombreCliente").value = "";
      $("#direccionCliente").value = "";
      alert("Compra confirmada. ¡Gracias! 🐝");
    }, 1500);
  };
}

// === FILTRO DE CATEGORÍAS (Menú) ===
const botonesCategorias = $$(".categoria-btn");
const productos = $$(".producto-card");

botonesCategorias.forEach((btn) => {
  btn.addEventListener("click", () => {
    // quitar el estado activo de todos
    botonesCategorias.forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");

    const categoria = btn.dataset.cat;

    productos.forEach((producto) => {
      if (categoria === "todos" || producto.dataset.categoria === categoria) {
        producto.style.display = "block";
        producto.style.opacity = "0";
        setTimeout(() => (producto.style.opacity = "1"), 150);
      } else {
        producto.style.display = "none";
      }
    });
  });
});

// === Inicializar ===
activarAddBtns();
renderCarrito();
