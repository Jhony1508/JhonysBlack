/* =========================================================
   JHONYSBLACK
   MAIN.JS
   ========================================================= */


/* =========================================================
   CARRITO
   ========================================================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


/* =========================================================
   AÑADIR PRODUCTO
   ========================================================= */

function addToCart(nombre, precio, imagen = "") {

  const existingProduct = cart.find(
    item => item.nombre === nombre
  );

  if (existingProduct) {

    existingProduct.cantidad += 1;

  } else {

    cart.push({
      nombre: nombre,
      precio: Number(precio),
      cantidad: 1,
      imagen: imagen
    });

  }

  saveCart();
  updateCart();
  showCartMessage();

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

function removeFromCart(index) {

  if (!cart[index]) return;

  cart.splice(index, 1);

  saveCart();
  updateCart();

}


/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function changeQuantity(index, amount) {

  if (!cart[index]) return;

  cart[index].cantidad += amount;

  if (cart[index].cantidad <= 0) {

    cart.splice(index, 1);

  }

  saveCart();
  updateCart();

}


/* =========================================================
   VACIAR CARRITO
   ========================================================= */

function clearCart() {

  cart = [];

  localStorage.removeItem("cart");

  updateCart();

}


/* =========================================================
   CONTADOR DEL CARRITO
   ========================================================= */

function getCartCount() {

  return cart.reduce(
    (total, item) => total + Number(item.cantidad),
    0
  );

}


/* =========================================================
   SUBTOTAL
   ========================================================= */

function getCartSubtotal() {

  return cart.reduce(
    (total, item) =>
      total +
      (Number(item.precio) * Number(item.cantidad)),
    0
  );

}


/* =========================================================
   ENVÍO
   ========================================================= */

function getShipping() {

  const subtotal = getCartSubtotal();

  if (subtotal === 0) {
    return 0;
  }

  /*
   * ENVÍO GRATIS A PARTIR DE 60€
   */

  if (subtotal >= 60) {
    return 0;
  }

  return 5.90;

}


/* =========================================================
   TOTAL
   ========================================================= */

function getCartTotal() {

  return getCartSubtotal() + getShipping();

}


/* =========================================================
   FORMATO DE PRECIO
   ========================================================= */

function formatPrice(price) {

  return Number(price)
    .toFixed(2)
    .replace(".", ",") + "€";

}


/* =========================================================
   ACTUALIZAR TODO EL CARRITO
   ========================================================= */

function updateCart() {

  updateCartCount();

  updateSideCart();

  updateCartPage();

}


/* =========================================================
   ACTUALIZAR CONTADOR
   ========================================================= */

function updateCartCount() {

  const counters =
    document.querySelectorAll(".cart-count");

  const count = getCartCount();

  counters.forEach(counter => {

    counter.textContent = count;

  });

}


/* =========================================================
   ABRIR / CERRAR CARRITO
   ========================================================= */

function toggleCart() {

  const panel =
    document.getElementById("cartPanel");

  if (!panel) return;

  /*
   * Compatible con:
   * .active
   * .open
   */

  panel.classList.toggle("active");
  panel.classList.toggle("open");

}


/* =========================================================
   PANEL LATERAL
   ========================================================= */

function updateSideCart() {

  const itemsContainer =
    document.getElementById("cart-items");

  const totalElement =
    document.getElementById("cart-total");

  if (!itemsContainer) return;


  itemsContainer.innerHTML = "";


  /* ================= CARRITO VACÍO ================= */

  if (cart.length === 0) {

    itemsContainer.innerHTML = `

      <div class="empty-cart">

        <p>
          TU CARRITO ESTÁ VACÍO
        </p>

      </div>

    `;

  }


  /* ================= PRODUCTOS ================= */

  else {

    cart.forEach((item, index) => {

      const itemElement =
        document.createElement("div");

      itemElement.className =
        "cart-item";


      itemElement.innerHTML = `

        <div class="cart-item-info">

          <strong>
            ${escapeHTML(item.nombre)}
          </strong>

          <div class="cart-item-price">

            ${item.cantidad}
            ×
            ${formatPrice(item.precio)}

          </div>

        </div>


        <button
          type="button"
          onclick="removeFromCart(${index})"
          class="cart-remove cart-page-item-remove"
        >
          ELIMINAR
        </button>

      `;


      itemsContainer.appendChild(itemElement);

    });

  }


  /* ================= TOTAL ================= */

  if (totalElement) {

    totalElement.textContent =
      formatPrice(getCartTotal());

  }

}


/* =========================================================
   PÁGINA COMPLETA DEL CARRITO
   ========================================================= */

function updateCartPage() {

  const container =
    document.getElementById("cart-page-items");

  if (!container) return;


  const emptyCart =
    document.getElementById("empty-cart");

  const countElement =
    document.getElementById("cart-page-count");

  const subtotalElement =
    document.getElementById("summary-subtotal");

  const shippingElement =
    document.getElementById("summary-shipping");

  const totalElement =
    document.getElementById("summary-total");


  container.innerHTML = "";


  /* =====================================================
     CARRITO VACÍO
     ===================================================== */

  if (cart.length === 0) {

    if (emptyCart) {
      emptyCart.style.display = "block";
    }

  }


  /* =====================================================
     PRODUCTOS
     ===================================================== */

  else {

    if (emptyCart) {
      emptyCart.style.display = "none";
    }


    cart.forEach((item, index) => {

      const product =
        document.createElement("div");

      product.className =
        "cart-page-item";


      /* ================= IMAGEN ================= */

      let imageHTML = "";

      if (item.imagen) {

        imageHTML = `

          <div class="cart-page-item-image">

            <img
              src="${escapeAttribute(item.imagen)}"
              alt="${escapeAttribute(item.nombre)}"
            >

          </div>

        `;

      } else {

        imageHTML = `

          <div class="cart-page-item-image">

          </div>

        `;

      }


      /* ================= PRODUCTO ================= */

      product.innerHTML = `

        ${imageHTML}


        <div class="cart-page-item-info">

          <h3>
            ${escapeHTML(item.nombre)}
          </h3>


          <p>
            ${formatPrice(item.precio)}
          </p>


          <div class="quantity-controls">

            <button
              type="button"
              onclick="changeQuantity(${index}, -1)"
              aria-label="Reducir cantidad"
            >
              −
            </button>


            <span>
              ${item.cantidad}
            </span>


            <button
              type="button"
              onclick="changeQuantity(${index}, 1)"
              aria-label="Aumentar cantidad"
            >
              +
            </button>

          </div>


          <button
            type="button"
            class="cart-page-item-remove"
            onclick="removeFromCart(${index})"
          >
            ELIMINAR
          </button>

        </div>


        <div class="cart-page-item-price">

          ${formatPrice(
            Number(item.precio) *
            Number(item.cantidad)
          )}

        </div>

      `;


      container.appendChild(product);

    });

  }


  /* =====================================================
     CONTADOR
     ===================================================== */

  if (countElement) {

    const count =
      getCartCount();

    countElement.textContent =
      count +
      (
        count === 1
          ? " PRODUCTO"
          : " PRODUCTOS"
      );

  }


  /* =====================================================
     SUBTOTAL
     ===================================================== */

  if (subtotalElement) {

    subtotalElement.textContent =
      formatPrice(
        getCartSubtotal()
      );

  }


  /* =====================================================
     ENVÍO
     ===================================================== */

  if (shippingElement) {

    const shipping =
      getShipping();

    shippingElement.textContent =
      shipping === 0 && cart.length > 0
        ? "GRATIS"
        : formatPrice(shipping);

  }


  /* =====================================================
     TOTAL
     ===================================================== */

  if (totalElement) {

    totalElement.textContent =
      formatPrice(
        getCartTotal()
      );

  }

}


/* =========================================================
   MENSAJE PRODUCTO AÑADIDO
   ========================================================= */

function showCartMessage() {

  let message =
    document.getElementById("cart-message");


  if (!message) {

    message =
      document.createElement("div");

    message.id =
      "cart-message";

    message.textContent =
      "PRODUCTO AÑADIDO AL CARRITO";

    document.body.appendChild(message);

  }


  message.classList.remove("show");


  /*
   * Permite reiniciar la animación
   */

  void message.offsetWidth;


  message.classList.add("show");


  setTimeout(() => {

    message.classList.remove("show");

  }, 2000);

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

  if (cart.length === 0) {

    alert(
      "TU CARRITO ESTÁ VACÍO."
    );

    return;

  }


  /*
   * De momento mostramos este mensaje.
   * Después podremos conectar Stripe,
   * PayPal u otro sistema de pago.
   */

  alert(
    "CHECKOUT PREPARADO. EL SISTEMA DE PAGO SE CONECTARÁ EN EL SIGUIENTE PASO."
  );

}


/* =========================================================
   REGISTRO
   ========================================================= */

function initializeRegister() {

  const registerForm =
    document.getElementById("registerForm");

  if (!registerForm) return;


  registerForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const nameInput =
        document.getElementById("registerName");

      const emailInput =
        document.getElementById("registerEmail");

      const passwordInput =
        document.getElementById("registerPassword");

      const passwordConfirmInput =
        document.getElementById(
          "registerPasswordConfirm"
        );

      const message =
        document.getElementById(
          "registerMessage"
        );


      if (
        !nameInput ||
        !emailInput ||
        !passwordInput ||
        !passwordConfirmInput
      ) {

        return;

      }


      const name =
        nameInput.value.trim();


      const email =
        emailInput.value
          .trim()
          .toLowerCase();


      const password =
        passwordInput.value;


      const passwordConfirm =
        passwordConfirmInput.value;


      /* ================= VALIDACIÓN ================= */

      if (!name) {

        showFormMessage(
          message,
          "INTRODUCE TU NOMBRE",
          "error"
        );

        return;

      }


      if (!email) {

        showFormMessage(
          message,
          "INTRODUCE TU EMAIL",
          "error"
        );

        return;

      }


      if (password.length < 6) {

        showFormMessage(
          message,
          "LA CONTRASEÑA DEBE TENER AL MENOS 6 CARACTERES",
          "error"
        );

        return;

      }


      if (password !== passwordConfirm) {

        showFormMessage(
          message,
          "LAS CONTRASEÑAS NO COINCIDEN",
          "error"
        );

        return;

      }


      /* ================= CREAR USUARIO ================= */

      const user = {

        name: name,

        email: email,

        password: password

      };


      localStorage.setItem(
        "jhonysblackUser",
        JSON.stringify(user)
      );


      localStorage.removeItem(
        "jhonysblackLoggedIn"
      );


      showFormMessage(
        message,
        "CUENTA CREADA CORRECTAMENTE",
        "success"
      );


      registerForm.reset();


      setTimeout(() => {

        window.location.href =
          "login.html";

      }, 1200);

    }
  );

}


/* =========================================================
   LOGIN
   ========================================================= */

function initializeLogin() {

  const loginForm =
    document.getElementById("loginForm");

  if (!loginForm) return;


  loginForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const emailInput =
        document.getElementById("loginEmail");

      const passwordInput =
        document.getElementById("loginPassword");

      const message =
        document.getElementById(
          "loginMessage"
        );


      if (
        !emailInput ||
        !passwordInput
      ) {

        return;

      }


      const email =
        emailInput.value
          .trim()
          .toLowerCase();


      const password =
        passwordInput.value;


      /* ================= USUARIO GUARDADO ================= */

      const savedUserRaw =
        localStorage.getItem(
          "jhonysblackUser"
        );


      if (!savedUserRaw) {

        showFormMessage(
          message,
          "NO EXISTE NINGUNA CUENTA. REGÍSTRATE PRIMERO.",
          "error"
        );

        return;

      }


      let savedUser;


      try {

        savedUser =
          JSON.parse(savedUserRaw);

      } catch (error) {

        showFormMessage(
          message,
          "ERROR CON LOS DATOS DE LA CUENTA.",
          "error"
        );

        return;

      }


      /* ================= COMPROBAR DATOS ================= */

      if (
        email === savedUser.email &&
        password === savedUser.password
      ) {

        localStorage.setItem(
          "jhonysblackLoggedIn",
          "true"
        );


        localStorage.setItem(
          "jhonysblackCurrentUser",
          JSON.stringify({
            name: savedUser.name,
            email: savedUser.email
          })
        );


        showFormMessage(
          message,
          "BIENVENIDO A JHONYSBLACK",
          "success"
        );


        setTimeout(() => {

          window.location.href =
            "index.html";

        }, 1000);

      }


      else {

        showFormMessage(
          message,
          "EMAIL O CONTRASEÑA INCORRECTOS",
          "error"
        );

      }

    }
  );

}


/* =========================================================
   MENSAJES DE FORMULARIO
   ========================================================= */

function showFormMessage(
  element,
  text,
  type
) {

  if (!element) return;


  element.textContent =
    text;


  if (type === "error") {

    element.style.color =
      "#ff4444";

  } else {

    element.style.color =
      "#ffffff";

  }

}


/* =========================================================
   RECUPERAR CONTRASEÑA
   ========================================================= */

function forgotPassword(event) {

  if (event) {
    event.preventDefault();
  }


  const savedUserRaw =
    localStorage.getItem(
      "jhonysblackUser"
    );


  if (!savedUserRaw) {

    alert(
      "NO EXISTE NINGUNA CUENTA REGISTRADA."
    );

    return;

  }


  alert(
    "LA RECUPERACIÓN DE CONTRASEÑA SE CONECTARÁ POSTERIORMENTE A UN SISTEMA DE EMAIL."
  );

}


/* =========================================================
   DROPDOWN ARTÍCULOS
   ========================================================= */

function initializeDropdown() {

  const dropdown =
    document.querySelector(
      "nav .dropdown"
    );

  const toggle =
    document.querySelector(
      ".dropdown-toggle"
    );


  if (!dropdown || !toggle) {
    return;
  }


  toggle.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();

      dropdown.classList.toggle(
        "active"
      );

    }
  );


  document.addEventListener(
    "click",
    function(event) {

      if (
        !dropdown.contains(
          event.target
        )
      ) {

        dropdown.classList.remove(
          "active"
        );

      }

    }
  );

}


/* =========================================================
   FILTROS DE SHOP
   ========================================================= */

function initializeShopFilters() {

  const filterButtons =
    document.querySelectorAll(
      ".category-filter button"
    );


  const productCards =
    document.querySelectorAll(
      ".product-card"
    );


  const visibleCounter =
    document.getElementById(
      "visible-products"
    );


  const noProducts =
    document.getElementById(
      "no-products"
    );


  if (
    !filterButtons.length ||
    !productCards.length
  ) {

    return;

  }


  filterButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        function() {

          const filter =
            button.dataset.filter;


          /* ================= BOTÓN ACTIVO ================= */

          filterButtons.forEach(
            item => {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          /* ================= FILTRAR ================= */

          let visibleProducts = 0;


          productCards.forEach(
            card => {

              const category =
                card.dataset.category;


              const show =
                filter === "todos" ||
                category === filter;


              if (show) {

                card.classList.remove(
                  "hidden"
                );

                card.style.display =
                  "";

                visibleProducts++;

              }

              else {

                card.classList.add(
                  "hidden"
                );

                card.style.display =
                  "none";

              }

            }
          );


          /* ================= CONTADOR ================= */

          if (visibleCounter) {

            visibleCounter.textContent =
              visibleProducts;

          }


          /* ================= SIN PRODUCTOS ================= */

          if (noProducts) {

            noProducts.style.display =
              visibleProducts === 0
                ? "block"
                : "none";

          }

        }
      );

    }
  );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value);

  return div.innerHTML;

}


/* =========================================================
   ESCAPE ATRIBUTOS
   ========================================================= */

function escapeAttribute(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCart();

    initializeDropdown();

    initializeShopFilters();

    initializeRegister();

    initializeLogin();

  }
);
