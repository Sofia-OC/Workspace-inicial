import { updateCartCount } from "./utils/updateCartCount.js";
let productsAdded = JSON.parse(localStorage.getItem("userCart")) ?? [];
let productCard = document.getElementById("productCard");
let keepBuying = document.getElementById("seguir");
let totalCurrency = document.getElementById("total");
let currencySelector = document.querySelector('select[name="select"]');

const exchange = 40;

// Al hacer clic en el botón "seguir comprando", redirige a la página de categorías
keepBuying.addEventListener("click", function () {
  window.location.href = "categories.html";
});

let total = 0;

// Mostrar los productos en el carrito
function cartP(array) {
  productCard.innerHTML = "";
  total = 0;

  for (let i = 0; i < array.length; i++) {
    // Desestructuración de datos
    const { productId, name, cost, currency, firstImageUrl, count } = array[i];

    const subtotal = cost * count; // Calcular el subtotal inicial

    let USD = currency === "UYU" ? subtotal * exchange : subtotal;
    total += USD;

    totalCurrency.innerHTML = `${total}`;

    productCard.innerHTML += `
        <div class="card flex-row align-items-center" id="${productId}">
            <div class="contImg  ">
                <img src="${firstImageUrl}" alt="Nombre del producto" class="imgProducto">
            </div>
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="nameButton d-flex justify-content-between align-items-center">
                    <p class="productName">${name}</p>
                    <button type="button" class="btnBlockRojo trash" data-index="${i}" value="carrito">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            <div>
                <p class="precio d-none d-sm-block">Precio: ${currency} ${cost}</p>
            </div>
            <div class="d-flex justify-content-between align-items-end">
                <div class="subtotal">
                    <p class="subtotal-text">Subtotal:</p>
                    <div class="d-flex align-items-center">
                        <p class="subtotalNum mb-0" id="resultado${productId}"> ${currency} ${subtotal}</p>
                    </div>
                </div>
                <div class="cantidad text-end">
                    <p class="mb-0">Cantidad: <input type="number" class="cantidadInput text-center" data-product-id="${productId}" id="numero${productId}" name="numero" value="${count}"required></p>
                </div>
            </div>
            </div>
        </div>`;
  }
  totalCurrency.innerHTML = `${total.toFixed(2)}`;

  // Añade eventos de eliminación y cambio de cantidad
  Trash(array);
  Quantity(array);

  // Actualiza el total cada vez que se carga el carrito
  updateTotal(array);

  // Si el carrito está vacío, muestra un mensaje indicándolo
  if (array.length === 0) {
    productCard.innerHTML += `
            <div class="card flex-row align-items-center">
                <div class="card-body d-flex flex-column justify-content-between">
                    <p class="my-3">No hay elementos agregados</p>
                </div>
            </div>
        `;
    totalCurrency.innerHTML = `0`;
  }

  console.log(total);
}

// Función para asignar eventos de eliminación de productos
function Trash(array) {
  const trashButtons = document.querySelectorAll(".trash");

  // Al hacer click en los botones de basura (trash) se elimina el producto del carrito
  trashButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Obtiene el índice del producto a eliminar del carrito
      const index = this.getAttribute("data-index");

      // Elimina el producto del array y actualiza el localStorage
      array.splice(index, 1);
      localStorage.setItem("userCart", JSON.stringify(array));

      updateCartCount();

      cartP(productsAdded); // Actualizar la vista del carrito
    });
  });
}

// Función para asignar eventos de cambio de cantidad de productos
function Quantity(array) {
  const quantityInputs = document.querySelectorAll(".cantidadInput");

  // Asignar evento de cambio de cantidad a cada input
  quantityInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const productId = this.getAttribute("data-product-id");
      const product = array.find((p) => p.productId === productId);

      if (product) {
        let cantidad = this.value.trim() === "" ? 1 : parseInt(this.value);

        if (cantidad <= 0) {
          // Asegurar un valor mínimo de 1
          Swal.fire({
            text: "Ingrese un valor mayor 0 o elimine el producto",
            confirmButtonText: "Continuar",
            confirmButtonColor: "#e83b57",
            imageUrl: "img/system-solid-55-error-hover-error-4.webp",
            imageWidth: 70,
            imageHeight: 70,
          });
          this.value = 1; // establece el valor del input en 1
          cantidad = 1;
        }

        // Calcular y actualizar el subtotal
        const newSubtotal = product.cost * cantidad;
        document.getElementById(
          `resultado${productId}`
        ).textContent = `${product.currency} ${newSubtotal}`;

        // Actualizar el array y el localStorage
        product.count = cantidad;
        localStorage.setItem("userCart", JSON.stringify(productsAdded));
      }
      // Llamar a la función para actualizar el badge del carrito y la función para recalcular el total
      updateCartCount();
      updateTotal(array);
    });

    input.addEventListener("change", function () {
      if (this.value.trim() === "") {
        this.value = 1;
      }
      updateCartCount();
      updateTotal(array);
    });
  });
}

// Función para recalcular el total
function updateTotal(array) {
  let newTotal = 0;

  const selectedCurrency = currencySelector.value;

  array.forEach((product) => {
    const subtotal = product.count * product.cost;
    let convertedSubtotal = subtotal;

    if (selectedCurrency === "UYU" && product.currency === "USD") {
      // Si se seleccionó UYU y el producto está en USD, convierte
      convertedSubtotal = subtotal * exchange;
    } else if (selectedCurrency === "USD" && product.currency === "UYU") {
      // Si se seleccionó USD y el producto está en UYU, convierte
      convertedSubtotal = subtotal / exchange;
    }

    newTotal += convertedSubtotal;
  });

  // Detallito, dar formato al total con puntos y comas
  total = newTotal; // Actualizar el total global
  totalCurrency.innerHTML = `${newTotal.toLocaleString("es-UY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  calcularEnvio();
}

currencySelector.addEventListener("change", function () {
  localStorage.setItem("selectedCurrency", currencySelector.value);
  updateTotal(productsAdded); // Recalcular total con la nueva moneda
});

document.addEventListener("DOMContentLoaded", function () {
  // Recuperar la opción de currency seleccionada
  const savedCurrency = localStorage.getItem("selectedCurrency");
  if (savedCurrency) {
    currencySelector.value = savedCurrency;
  }

  cartP(productsAdded);
});

// Botón que abre modal

const btnCompletarDatos = document.getElementById("completarDatos");
const Modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));

btnCompletarDatos.addEventListener("click", function () {
  let envio = document.getElementById("envio").value;
  if (envio) {
    Modal.show();
  } else {
    Swal.fire({
      icon: "error",
      title: "Tipo de envío no seleccionado",
      text: "Por favor, selecciona un tipo de envío antes de continuar.",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#e83b57",
    });
  }
});

let btnFinalizarCompra = document.getElementById("finalizar");
btnFinalizarCompra.addEventListener("click", function (event) {
  event.preventDefault(); // Previene el comportamiento predeterminado del botón
  if (verificarCampos()) {
    Modal.hide(); // Solo oculta el modal si la verificación es exitosa
    Swal.fire({
      //icon: 'success',
      title: "Procedimiento realizado con éxito",
      html: '<lord-icon src="https://cdn.lordicon.com/twsqddew.json" trigger="loop" delay="1000" colors="primary:#1c0e34,secondary:#e83b57" style="width:250px;height:250px"></lord-icon><p>¡Gracias por tu compra!</p>',
      showConfirmButton: false,
      timer: 3000,
    });
  }
});

let departamento = document.getElementById("dpto");
let localidad = document.getElementById("loc");
let containerLocalidad = localidad.parentElement;
departamento.addEventListener("change", (event) => {
  // Obtén el valor de la opción seleccionada
  const selectedValue = event.target.value;

  // Verifica si es la opción específica
  if (selectedValue === "Montevideo") {
    // Cambiar de input text a select
    const selectElement = document.createElement("select");
    selectElement.id = "loc";
    selectElement.className = "form-control form-control-sm";
    selectElement.style = "max-height: 150px; overflow-y: auto;";
    // Agregar opciones al select
    const options = [
      "Aguada",
      "Arroyo Seco",
      "Atahualpa",
      "Barrio Sur",
      "Bella Vista",
      "Belvedere",
      "Brazo Oriental",
      "Buceo",
      "Capurro",
      "Carrasco",
      "Carrasco Norte",
      "Casabó",
      "Centro",
      "Cerrito de la Victoria",
      "Cerro",
      "Ciudad Vieja",
      "Colón",
      "Conciliación",
      "Cordón",
      "Flor de Maroñas",
      "Jacinto Vera",
      "Jardines del Hipódromo",
      "La Blanqueada",
      "La Comercial",
      "La Teja",
      "Lezica",
      "Malvín",
      "Malvín Norte",
      "Manga",
      "Maroñas",
      "Montevideo Rural",
      "Nuevo París",
      "Palermo",
      "Parque Batlle",
      "Parque Rodó",
      "Paso de la Arena",
      "Paso Molino",
      "Peñarol",
      "Piedras Blancas",
      "Pocitos",
      "Pocitos Nuevo",
      "Prado",
      "Punta Carretas",
      "Punta de Rieles",
      "Reducto",
      "Sayago",
      "Tres Cruces",
      "Unión",
      "Villa Biarritz",
      "Villa del Cerro",
      "Villa Española",
    ];
    options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText.toLowerCase().replace(" ", "_");
      option.textContent = optionText;
      selectElement.appendChild(option);
    });

    // Reemplazar el input por el select
    containerLocalidad.replaceChild(selectElement, localidad);
  } else {
    containerLocalidad.replaceChild(localidad, document.getElementById("loc"));
  }
});

//CALCULO DE COSTOS DE ENVIO Y TOTAL

// esto tiene que estar fuera de los bloques para que sea global, sin ROMPE todo
let totalFinal = 0;
let valorFinalEnvio = 0;

//esta funcion se llamara TOTAL FINAL (total de subtotales, mas costo de envio)

function calcularTotalFinal() {
  totalFinal = total + valorFinalEnvio;
  console.log("Total Final: ", totalFinal);

  // agrgarlo con formato al contenedor
  document.getElementById(
    "resultadoTotalFinal"
  ).textContent = `$${totalFinal.toLocaleString("es-UY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function calcularEnvio() {
  let envioSeleccionado = document.getElementById("envio").value;
  let valorEnvio = 0;

  //  porcentajes según el tipo de envio
  if (envioSeleccionado === "Premium") {
    valorEnvio = 0.15;
  } else if (envioSeleccionado === "Express") {
    valorEnvio = 0.07;
  } else if (envioSeleccionado === "Standard") {
    valorEnvio = 0.05;
  }

  // valor del envio
  valorFinalEnvio = total * valorEnvio;

  calcularTotalFinal();

  // mostrar e insertar  el resultado del costo de envio
  document.getElementById(
    "resultadoEnvio"
  ).textContent = `$${valorFinalEnvio.toLocaleString("es-UY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// llamo a `calcularEnvio` cada vez que el total cambie
document.getElementById("envio").addEventListener("change", function () {
  calcularEnvio();
});

// Verificación de campos obligatorios
function verificarCampos() {
  let departamento = document.getElementById("dpto").value;
  let localidad = document.getElementById("loc").value;
  let calle = document.getElementById("calle").value;
  let numero = document.getElementById("nro").value;
  let pago = document.getElementById("pago").value;

  if (!departamento || !localidad || !calle || !numero || !pago) {
    Swal.fire({
      text: "Por favor, complete todos los campos obligatorios.",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#e83b57",
      imageUrl: "img/system-solid-55-error-hover-error-4.webp",
      imageWidth: 50, // Ancho del GIF
      imageHeight: 50, // Alto del GIF
      customClass: {
        popup: "swal2-modal-sobre-modal", //swal.fire sobre modal
      },
    });
    return false; // Retorna false si hay campos vacíos
  }
  return true; // Retorna true si todos los campos están completos
}

// Aplicar estilos para que Swal.fire se muestra sobre el modal
const style = document.createElement("style");
style.innerHTML = ` 
.swal2-modal-sobre-modal { 
z-index: 2000 !important; /* Asignar un valor alto para estar encima del modal */ 
} 
`;
document.head.appendChild(style);
