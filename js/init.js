const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

// Guarda en localStorage la ID del producto seleccionado y redirige a la página product-info.html
function selectedProducts() {
  let productItem = document.querySelectorAll(".product-item");

  productItem.forEach(function (products) {
    products.addEventListener("click", function () {
      let idP = products.getAttribute("data-product-id");

      localStorage.setItem("productID", idP);
      window.location.href = "product-info.html";
    });
  });
}
// Se agregó el atributo data-product-id.
// El prefijo data- permite crear atributos personalizados.
// Son útiles para almacenar datos que se puedan usar en JS sin interferir con la estructura HTML.

// Dropdown del perfil
let iconDropDown =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" id="dropDownIcon" width="12.000000pt" height="12.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"fill="#000000" stroke="none"><path d="M652 3623 c-68 -33 -102 -102 -87 -180 6 -34 112 -143 963 -995 852 -851 961 -957 995 -963 94 -18 30 -76 1056 948 712 711 948 953 963 986 54 118 -47 240 -179 216 -34 -6 -137 -105 -921 -888 l-882 -882 -873 872 c-614 614 -883 877 -909 888 -47 19 -84 19 -126 -2z"/></g></svg>';

let profileContainer = document.getElementsByClassName("perfil")[0];
let userCart = JSON.parse(localStorage.getItem("userCart")) ?? [];
let cartCount = userCart.reduce((acc, e) => acc + e.count, 0);

profileContainer.innerHTML += `${iconDropDown} <ul class="dropdown-menu" id="dropdownMenu">
  
  <li><a href="my-profile.html">Mi Perfil</a></li>
  <li id="primerElementoli"><a href="cart.html">Mi Carrito</a><button id="button-cart">${cartCount}</button></li>
  <li><a id="logout" href="login.html">Cerrar Sesión</a></li>
</ul>`;

let dropdownMenu = document.getElementById("dropdownMenu");
let profile = document.getElementById("miPerfil");

let dropDownIcon = document.getElementById("dropDownIcon");

profile.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

dropDownIcon.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (
    !profile.contains(e.target) &&
    !dropdownMenu.contains(e.target) &&
    !dropDownIcon.contains(e.target)
  ) {
    dropdownMenu.style.display = "none";
  }
});

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("email");
  localStorage.removeItem("modo");
  localStorage.removeItem("userCart");
  localStorage.removeItem("selectedCurrency");
});

// Función para aplicar el modo día/noche
function aplicarModo(modo) {
  document.body.classList.toggle("modo-noche", modo === "noche");
  document.querySelector(`input[name="modo"][value="${modo}"]`).checked = true;
}

// Guarda modo en el LocalStorage
// También actualiza el modo del usuario si ya está logueado
function guardarDatos() {
  let modo = document.querySelector('input[name="modo"]:checked').value;

  const datos = { modo };
  localStorage.setItem("modo", JSON.stringify(datos));

  // Si el usuario está logueado, actualiza su modo en el arreglo de usuarios
  if (usuarioLoggeado > -1) {
    usuarios[usuarioLoggeado].modo = modo;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
  aplicarModo(modo);
}

let radioButtons = document.querySelectorAll('input[name="modo"]');
radioButtons.forEach((radio) => {
  radio.addEventListener("click", guardarDatos);
});

// obtener usuarios ya guardados o sino hacer un arreglo vacio en el cual se guardaran los datos
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const email = localStorage.getItem("email");
const usuarioLoggeado = usuarios.findIndex(
  (usuarios) => usuarios.email === email
); // Encuentra el índice del usuario logueado

// Si el usuario está logueado y tiene una imagen guardada, la muestra; si no, muestra una imagen por defecto
if (usuarioLoggeado > -1 && usuarios[usuarioLoggeado].imagen) {
  document.getElementById("fotoPerfil").src = usuarios[usuarioLoggeado].imagen;
} else {
  document.getElementById("fotoPerfil").src = "img/img_perfil.png";
}

document.addEventListener("DOMContentLoaded", () => {
  if (email === null) {
    location.href = "login.html";
  } else {
    document.getElementById("miPerfil").innerHTML = email; // Muestra el email del usuario en la navbar
  }

  // Si el usuario guarda sus datos se muestra su nombre en vez de su email en la navbar
  if (usuarioLoggeado > -1) {
    document.getElementById("miPerfil").innerHTML =
      usuarios[usuarioLoggeado].nombre;
  }

  // Mostrar el modo guardado al cargar la página
  const datosGuardados = JSON.parse(localStorage.getItem("modo"));
  if (usuarioLoggeado > -1) {
    aplicarModo(usuarios[usuarioLoggeado].modo); // Aplica el modo guardado para el usuario logueado
  } else if (datosGuardados) {
    aplicarModo(datosGuardados.modo); // Aplica el modo guardado global
  }
});
