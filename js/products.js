let LIST_URL = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

//array donde se cargarán los datos recibidos:
let productsArray = [];

// Función que recibe un array con los datos, y los muestra en pantalla a través del DOM
function showProductList(array) {
  let htmlContentToAppend = "";

  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    htmlContentToAppend += `
         <div class="product-item row" data-product-id="` + product.id + `">
    <div class="cont_img col-lg-5 col-md-6 col-sm-12">
        <img src="` + product.image + `" alt="product image" class="imgProduct">
    </div>
    
    <div class="bloque_madre col-lg-7 col-md-6 col-sm-12">
      <div>
        <div class="nameButton col-12">
            <h4>` + product.name + `</h4> 
            <button type="button" class="btnBlockRojo" id="btnBlockRojo" value="carrito">
                <i class="fa-solid fa-cart-shopping"></i>
            </button>
        </div>

        <div class="col-12">
            <p class="description">` + product.description + `</p>
        </div>
      </div>

        <div>
        <div class="sold">
            <small>` + product.soldCount + ` vendidos</small>
        </div>
        <div class="bloqueGrande">
            <p id="precio">` + product.currency + ` ` + product.cost + `</p>
            <button type="button" class="btnRojo" value="comprar">Comprar</button>
        </div>
        </div>
    </div>
</div>
            
            `;
  }
  document.getElementById("products-container").innerHTML = htmlContentToAppend;
  selectedProducts();
}

// Cargar datos y mostrar productos cuando la página se haya cargado
document.addEventListener("DOMContentLoaded", function () {
  getJSONData(LIST_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      productsArray = resultObj.data.products;
      showProductList(productsArray);
    }
  });
  searchProduct();
});

let productsFiltradosArray = [];

//Entrega 3 filtrado de productos intervalo de precios

function filtrarPrecios() {
  //obtener los valores numericos de los input
  //parseInt convierte el string en valores numericos enteros
  let preciomin = parseInt(document.getElementById("preciomin").value);
  let preciomax = parseInt(document.getElementById("preciomax").value);

  // agrego una validacion por si el usuario no ingresa letras
  if (isNaN(preciomin) || isNaN(preciomax)) {
    alert("Por favor, ingresar valores numéricos.");
  } else if (preciomin > preciomax) {
    alert("Precio mínimo debe ser menor a precio máximo");
  } else {
    productsFiltradosArray = productsArray.filter(
      (product) => product.cost >= preciomin && product.cost <= preciomax
    );

    // Mostrar los productos filtrados en la página
    showProductList(productsFiltradosArray);
  }
}

//recorrer arreglo comparando los costos
//      for (let product of productsArray) {
//        if (product.cost >= preciomin && product.cost <= preciomax) {
//            console.log (product.cost)

//        }}}

//Agrego evento al boton de filtrar

let filtrarBtn = document.getElementById("filtrarbtn");

filtrarBtn.addEventListener("click", (event) => {
  filtrarPrecios();
});

// funcion que ordena los productos según el parámetro ingresado

function sortProducts(option) {
  let productsSort;
  if (productsFiltradosArray.length) {
    productsSort = productsFiltradosArray;
  } else {
    productsSort = productsArray;
  }

  switch (option) {
    case "precioAscendente":
      productsSort = productsSort.sort((a, b) => a.cost - b.cost);
      break;
    case "precioDescendente":
      productsSort = productsSort.sort((a, b) => b.cost - a.cost);
      break;
    case "relevancia":
      productsSort = productsSort.sort((a, b) => b.soldCount - a.soldCount);
      break;
  }
  showProductList(productsSort);
}

let sortButtonPriceUp = document.getElementById("price-up");
let sortButtonPriceDown = document.getElementById("price-down");
let sortButtonRelevance = document.getElementById("relevance");

sortButtonPriceUp.addEventListener("click", (event) => {
  sortProducts("precioAscendente");
});

sortButtonPriceDown.addEventListener("click", (event) => {
  sortProducts("precioDescendente");
});

sortButtonRelevance.addEventListener("click", (event) => {
  sortProducts("relevancia");
});


// Función para filtrar productos según lo que se escriba en la barra de búsqueda
function searchProduct(){
    let searchBar = document.getElementById("searchBar");
        
    searchBar.addEventListener("input", function() {
        const input = document.getElementById("searchBar").value.toLowerCase();

        let filteredProducts = productsArray.filter(products => {
            return products.name.toLowerCase().includes(input) || products.description.toLowerCase().includes(input);
        });
    
        showProductList(filteredProducts);
    });
}
// El evento "input" detecta cada vez que se escribe algo.
// .filter permite filtrar los elementos de un array según una condición.
// En este caso filtra si la descripción o el nombre de los productos incluye el texto escrito en la barra de búsqueda.