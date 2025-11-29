// Funciones de autenticación

// Abrir modal de inicio de sesión
function abrirModalLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// Cerrar modal de inicio de sesión
function cerrarModalLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    limpiarFormularioLogin();
  }
}

// Abrir modal de registro
function abrirModalRegistro() {
  const modal = document.getElementById("modal-registro");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// Cerrar modal de registro
function cerrarModalRegistro() {
  const modal = document.getElementById("modal-registro");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    limpiarFormularioRegistro();
  }
}

// Cambiar de login a registro
function cambiarARegistro() {
  cerrarModalLogin();
  setTimeout(() => abrirModalRegistro(), 300);
}

// Cambiar de registro a login
function cambiarALogin() {
  cerrarModalRegistro();
  setTimeout(() => abrirModalLogin(), 300);
}

// Limpiar formulario de login
function limpiarFormularioLogin() {
  const form = document.getElementById("form-login");
  if (form) {
    form.reset();
    ocultarError("login");
  }
}

// Limpiar formulario de registro
function limpiarFormularioRegistro() {
  const form = document.getElementById("form-registro");
  if (form) {
    form.reset();
    ocultarError("registro");
  }
}

// Mostrar mensaje de error
function mostrarError(tipo, mensaje) {
  const errorDiv = document.getElementById(`error-${tipo}`);
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = "block";
  }
}

// Ocultar mensaje de error
function ocultarError(tipo) {
  const errorDiv = document.getElementById(`error-${tipo}`);
  if (errorDiv) {
    errorDiv.style.display = "none";
  }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = "exito") {
  const notificacion = document.createElement("div");
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.innerHTML = `
        <i class="fa-solid ${tipo === "exito" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
        <span>${mensaje}</span>
    `;

  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.classList.add("show");
  }, 100);

  setTimeout(() => {
    notificacion.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

// Validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Manejar inicio de sesión
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  ocultarError("login");

  // Validaciones
  if (!email || !password) {
    mostrarError("login", "Por favor completa todos los campos");
    return;
  }

  if (!validarEmail(email)) {
    mostrarError("login", "Por favor ingresa un email válido");
    return;
  }

  // Simular autenticación (aquí deberías conectar con un backend real)
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find((u) => u.email === email && u.password === password);

  if (usuario) {
    // Guardar sesión
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({
        nombre: usuario.nombre,
        email: usuario.email,
        fechaRegistro: usuario.fechaRegistro,
      })
    );

    cerrarModalLogin();
    mostrarNotificacion(`¡Bienvenido de vuelta, ${usuario.nombre}!`, "exito");
    actualizarUIUsuario();
  } else {
    mostrarError("login", "Email o contraseña incorrectos");
  }
}

// Manejar registro
function handleRegistro(event) {
  event.preventDefault();

  const nombre = document.getElementById("registro-nombre").value.trim();
  const email = document.getElementById("registro-email").value.trim();
  const password = document.getElementById("registro-password").value;
  const confirmPassword = document.getElementById("registro-confirm-password").value;

  ocultarError("registro");

  // Validaciones
  if (!nombre || !email || !password || !confirmPassword) {
    mostrarError("registro", "Por favor completa todos los campos");
    return;
  }

  if (nombre.length < 3) {
    mostrarError("registro", "El nombre debe tener al menos 3 caracteres");
    return;
  }

  if (!validarEmail(email)) {
    mostrarError("registro", "Por favor ingresa un email válido");
    return;
  }

  if (password.length < 6) {
    mostrarError("registro", "La contraseña debe tener al menos 6 caracteres");
    return;
  }

  if (password !== confirmPassword) {
    mostrarError("registro", "Las contraseñas no coinciden");
    return;
  }

  // Verificar si el email ya existe
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  if (usuarios.some((u) => u.email === email)) {
    mostrarError("registro", "Este email ya está registrado");
    return;
  }

  // Registrar nuevo usuario
  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    email,
    password, // En producción, la contraseña debería estar encriptada
    fechaRegistro: new Date().toISOString(),
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Auto-login después del registro
  localStorage.setItem(
    "usuarioActual",
    JSON.stringify({
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      fechaRegistro: nuevoUsuario.fechaRegistro,
    })
  );

  cerrarModalRegistro();
  mostrarNotificacion(`¡Registro exitoso! Bienvenido, ${nombre}`, "exito");
  actualizarUIUsuario();
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  mostrarNotificacion("Sesión cerrada exitosamente", "exito");
  actualizarUIUsuario();
}

// Actualizar UI según el estado de autenticación
function actualizarUIUsuario() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  const botonesHeader = document.querySelector(".header-botones");

  if (usuarioActual && botonesHeader) {
    botonesHeader.innerHTML = `
            <button onclick="abrirCarrito()" class="carrito-btn">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="carrito-contador">0</span>
            </button>
            <button onclick="abrirPerfil()" class="btn btn-perfil">
                <i class="fa-solid fa-user-circle"></i>
                <span>${usuarioActual.nombre}</span>
            </button>
            <button onclick="cerrarSesion()" class="btn btn-logout">
                <i class="fa-solid fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
  } else if (botonesHeader) {
    botonesHeader.innerHTML = `
            <button onclick="abrirCarrito()" class="carrito-btn">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="carrito-contador">0</span>
            </button>
            <a href="#" onclick="abrirModalLogin(); return false;" class="btn" role="button">Iniciar sesión</a>
            <a href="#" onclick="abrirModalRegistro(); return false;" class="btn" role="button">Regístrate</a>
        `;
  }

  // Actualizar el contador del carrito después de recrear el HTML
  if (typeof actualizarContadorCarrito === "function") {
    actualizarContadorCarrito();
  }
}

// Cerrar modales al hacer clic fuera
document.addEventListener("DOMContentLoaded", function () {
  // Modal login
  const modalLogin = document.getElementById("modal-login");
  if (modalLogin) {
    modalLogin.addEventListener("click", function (e) {
      if (e.target === modalLogin) {
        cerrarModalLogin();
      }
    });
  }

  // Modal registro
  const modalRegistro = document.getElementById("modal-registro");
  if (modalRegistro) {
    modalRegistro.addEventListener("click", function (e) {
      if (e.target === modalRegistro) {
        cerrarModalRegistro();
      }
    });
  }

  // Cerrar con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      cerrarModalLogin();
      cerrarModalRegistro();
    }
  });

  // Actualizar UI al cargar la página
  actualizarUIUsuario();

  // Configurar formularios
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", handleLogin);
  }

  const formRegistro = document.getElementById("form-registro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", handleRegistro);
  }

  // Modal perfil - cerrar al hacer clic fuera
  const modalPerfil = document.getElementById("modal-perfil");
  if (modalPerfil) {
    modalPerfil.addEventListener("click", function (e) {
      if (e.target === modalPerfil) {
        cerrarPerfil();
      }
    });
  }
});

// ============================================
// FUNCIONES DE PERFIL DE USUARIO
// ============================================

function abrirPerfil() {
  const modalPerfil = document.getElementById("modal-perfil");
  if (modalPerfil) {
    modalPerfil.classList.add("active");
    cargarComprasUsuario();
  }
}

function cerrarPerfil() {
  const modalPerfil = document.getElementById("modal-perfil");
  if (modalPerfil) {
    modalPerfil.classList.remove("active");
  }
}

function cargarComprasUsuario() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  const todasLasCompras = JSON.parse(localStorage.getItem("compras") || "[]");

  // Filtrar compras del usuario actual
  const comprasUsuario = todasLasCompras.filter((compra) => compra.emailUsuario === usuarioActual.email);

  const contenedorCompras = document.getElementById("lista-compras");

  if (!contenedorCompras) return;

  if (comprasUsuario.length === 0) {
    // Detectar si estamos en una subcarpeta
    const enSubcarpeta = window.location.pathname.includes("/pages/");
    const rutaProductos = enSubcarpeta ? "./productos.html" : "./pages/productos.html";

    contenedorCompras.innerHTML = `
      <div class="sin-compras">
        <i class="fa-solid fa-shopping-bag"></i>
        <h3>No has realizado compras aún</h3>
        <p>Explora nuestros productos y realiza tu primera compra</p>
        <a href="${rutaProductos}" class="btn-ver-productos">
          <i class="fa-solid fa-arrow-right"></i> Ver Productos
        </a>
      </div>
    `;
    return;
  }

  // Ordenar compras por fecha (más reciente primero)
  comprasUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Generar HTML de compras
  contenedorCompras.innerHTML = comprasUsuario
    .map((compra) => {
      const fecha = new Date(compra.fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const productosHTML = compra.productos
        .map(
          (prod) => `
          <div class="compra-producto">
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <div class="producto-info">
              <h5>${prod.nombre}</h5>
              <p>Cantidad: ${prod.cantidad}</p>
              <p class="producto-precio">S/ ${prod.precio.toFixed(2)}</p>
            </div>
          </div>
        `
        )
        .join("");

      const estadoBadge = getEstadoBadge(compra.estado);

      return `
        <div class="compra-item">
          <div class="compra-header">
            <div class="compra-info">
              <i class="fa-solid fa-box"></i>
              <div>
                <h4>Pedido #${compra.id}</h4>
                <p class="compra-fecha">${fecha}</p>
              </div>
            </div>
            <div class="compra-total">
              <span class="total-label">Total</span>
              <span class="total-precio">S/ ${compra.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="compra-productos">
            ${productosHTML}
          </div>
          <div class="compra-estado">
            ${estadoBadge}
          </div>
        </div>
      `;
    })
    .join("");
}

function getEstadoBadge(estado) {
  const estados = {
    procesando: {
      icono: "fa-clock",
      texto: "Procesando",
      clase: "procesando",
    },
    enviado: {
      icono: "fa-truck",
      texto: "En camino",
      clase: "enviado",
    },
    entregado: {
      icono: "fa-circle-check",
      texto: "Entregado",
      clase: "entregado",
    },
  };

  const info = estados[estado] || estados.procesando;

  return `
    <span class="estado-badge ${info.clase}">
      <i class="fa-solid ${info.icono}"></i>
      ${info.texto}
    </span>
  `;
}
