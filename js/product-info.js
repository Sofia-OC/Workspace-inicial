import { updateCartCount } from "./utils/updateCartCount.js";
document.addEventListener("DOMContentLoaded", function () {
  // obtener nombre de la página
  function getPageNameFromURL() {
    const path = window.location.pathname;
    const pageName = path.split("/").pop();
    return (
      pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(".html", "")
    );
  }

  // crear el breadcrumb
  function createBreadcrumb(categoryName, productName) {
    const breadcrumbData = [
      { text: "Categoría", href: "categories.html" },
      { text: categoryName, href: "products.html" },
      { text: productName, href: "#" },
    ];

    const breadcrumbContainer = document.getElementById("breadcrumb");
    breadcrumbContainer.innerHTML = "";

    breadcrumbData.forEach((item, index) => {
      const span = document.createElement("span");
      span.classList.add("breadcrumb-item");

      if (item.href && index < breadcrumbData.length - 1) {
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.text;
        span.appendChild(link);
        const separator = document.createElement("span");
        separator.textContent = " > ";
        separator.classList.add("breadcrumb-separator");
        breadcrumbContainer.appendChild(span);
        breadcrumbContainer.appendChild(separator);
      } else {
        span.textContent = item.text;
        span.classList.add("active");
        breadcrumbContainer.appendChild(span);
      }
    });
  }

  // obtener la información del producto
  function getProductInfo(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => ({ status: "ok", data }))
      .catch((error) => ({ status: "error", message: error.message }));
  }

  // obtener el ID del producto desde localStorage
  const productId = localStorage.getItem("productID");
  if (!productId) {
    console.error("ID de producto no encontrado en localStorage.");
    document.getElementById("products-container").innerHTML =
      "<p>ID de producto no encontrado.</p>";
    return;
  }

  const PRODUCT_URL = PRODUCT_INFO_URL + productId + EXT_TYPE;

  // otener la información del producto
  getProductInfo(PRODUCT_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      const product = resultObj.data;

      // mostrar los datos del producto
      const productsContainer = document.getElementById("products-container");

      // ruta a la carpeta de imágenes
      const imageFolder = "img/";

      // establece que se muestre la primera imágen
      const firstImageFilename = `prod${productId}_1.jpg`;
      const firstImageUrl = `${imageFolder}${firstImageFilename}`;

      // array con las imágenes del ID del producto
      const numImages = 5;
      let imagesHtml = "";
      for (let i = 2; i <= numImages; i++) {
        const filename = `prod${productId}_${i}.jpg`;
        imagesHtml += `<img src="${imageFolder}${filename}" alt="product image ${i}" class="col-lg-3 col-md-12 col-sm-12 img_rel" onerror="this.style.display='none';">`;
      }

      let imagesCarrouselHTML = "";
      for (let i = 1; i <= numImages; i++) {
        const filename = `prod${productId}_${i}.jpg`;
        imagesCarrouselHTML += `<img src="${imageFolder}${filename}" alt="product image ${i}" class="carrousel-image" onerror="this.style.display='none';">`;
      }

      productsContainer.innerHTML = `
                <div class="product" data-product-id="${product.id}">
                    <div class="row">
                
                 <div class="col-lg-6  col-md-12 col-sm-12 cont_img">
                <img src="${firstImageUrl}" alt="Product image" class="imgProduct ">
                </div>
                  

                <div class="col-lg-6 col-md-12 col-sm-12 desc_izquierda" >
                   <div class="bloque_superior">
                   <div class="nameButton">
                    <h4>${product.name}</h4> 
                    <button type="button" class="btnBlockRojo" id="btnBlockRojo" value="carrito">
                    <i class="fa-solid fa-cart-shopping"></i></button>
                    </div>

                    <small> llevalo hoy por </small>
                    <p id="precio">${product.currency} ${product.cost}</p>
                    </div>

                   
                    <div class="bloque_color_sm">
                    <div class="bloque_color">
                    <p class="desc">Sobre este producto</p>
                    <p class="description">${product.description}</p>
                    </div>

                    <small id="vendidos">${product.soldCount} personas ya lo eligieron</small>
                   
                    <div class="cont_boton">
                    <p>¡Obten el tuyo ahora!</p>
                <button type="button" class="btnRojo" id="btnRojo" value="comprar">Comprar</button>
                </div>
                </div>
                </div>

             </div>
                    
            `;
      // se llaman las funciones para mostrar datos de la página actual en el breadcrumb
      const categoryName = product.category;
      createBreadcrumb(categoryName, product.name);

      //agregar definicion
      let imagenPrincipal = document.getElementsByClassName("imgProduct")[0];

      console.log(imagenPrincipal);

      imagenPrincipal.addEventListener("click", () => {
        let carrousel = document.createElement("div");
        carrousel.innerHTML = `<div class="carrousel-container">
        <div class="carrousel-slide-container"> 
            <div class="carrousel-slide"> 
                ${imagesCarrouselHTML}
                </div>
            </div>
            <button class="prev">&#10094;</button> 
            <button class="next">&#10095;</button>
        </div>`;

        let container = document.getElementsByTagName("main")[0];
        container.appendChild(carrousel);

        let botonesCarrousel = document.querySelectorAll(
          ".carrousel-container button"
        );

        let currentSlide = 0;
        const slides = document.querySelectorAll(".carrousel-image");
        const totalSlides = slides.length;

        botonesCarrousel.forEach((button) => {
          button.addEventListener("click", (e) => {
            if (button.classList.contains("next")) {
              currentSlide = (currentSlide + 1) % totalSlides;
            } else {
              currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }

            const slideWidth = slides[0].clientWidth;
            document.querySelector(
              ".carrousel-slide"
            ).style.transform = `translateX(-${currentSlide * slideWidth}px)`;
          });
        });

        window.addEventListener("resize", () => {
          const slideWidth = slides[0].clientWidth;
          document.querySelector(
            ".carrousel-slide"
          ).style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        });

        let carrouselContainer = document.getElementsByClassName(
          "carrousel-container"
        )[0];
        carrouselContainer.addEventListener("click", (e) => {
          if (e.target != carrouselContainer) {
            e.stopPropagation();
            return;
          }
          carrousel.remove();
        });
      });

      // función que crea un array y agrega los datos del producto seleccionado

      function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("userCart")) || [];

        // Buscar si el producto ya está en el carrito
        const productM = cart.find(
          (product) => product.productId === productId
        );

        const productToCart = {
          productId,
          name: product.name,
          cost: product.cost,
          currency: product.currency,
          firstImageUrl,
          count: 1,
        };

        if (productM) {
          //Si el producto ya está en el carrito, incrementa la cantidad del producto
          productM.count += 1;
          localStorage.setItem("userCart", JSON.stringify(cart));
        } else {
          // Si el producto no está en el carrito, lo agrega al array
          cart.push(productToCart);
          localStorage.setItem("userCart", JSON.stringify(cart));
        }
        updateCartCount();
      }

      // botón carrito que solo agrega el producto
      const btnBlockRojo = document.getElementById("btnBlockRojo");
      btnBlockRojo.addEventListener("click", function () {
        let productToAdd = localStorage.getItem("productID");

        if (productToAdd) {
          Swal.fire({
            text: "¡Producto agregado al carrito!",
            showConfirmButton: false,
            timer: 1500,
            imageUrl: "img/system-solid-6-shopping-hover-shopping.webp",
            imageWidth: 70, // Ancho del GIF
            imageHeight: 70, // Alto del GIF

            imageAlt: "Icono personalizado",
          });

          addToCart(productToAdd);
        }
      });

      // botón de comprar que agrega producto al carrito y redirige al mismo
      const btnRojo = document.getElementById("btnRojo");
      btnRojo.addEventListener("click", function () {
        let productToAdd = localStorage.getItem("productID");

        if (productToAdd) {
          addToCart(productToAdd);
          window.location.href = "cart.html";
        }
      });
    }
  });

  // el operador ?? se encarga de igualar la variable al valor de la derecha en caso de que la expresion de la izquierda resulte en undefined.
  let localComments = JSON.parse(localStorage.getItem("localComments")) ?? [];
  let apiComments = [];

  //funcion que se encarga de agregar el comentario al array de comentarios local y guardarlo en el localstorage
  function addComment(comment) {
    const duplicateComment = localComments.find(
      (item) => item.user === comment.user && item.product === comment.product
    );

    if (!duplicateComment) {
      localComments.push(comment);
      localStorage.setItem("localComments", JSON.stringify(localComments));
    } else {
      console.log("Duplicate found:", duplicateComment);
    }
  }

  //funcion que se encarga de mostrar los comentarios en el HTML
  function showComments(comments) {
    const calif = document.getElementById("comments");

    calif.innerText = "";

    comments.forEach((cal, index) => {
      const isActive = index === 0 ? "active" : "";

      let circles = "";
      for (let i = 0; i < 5; i++) {
        if (i < cal.score) {
          circles += `<i class="fa-solid fa-circle full-circle"></i>`;
        } else {
          circles += `<i class="fa-solid fa-circle empty-circle"></i>`;
        }
      }

      let commentDate = new Date(cal.dateTime);
      let date =
        commentDate.getDate() +
        "/" +
        (commentDate.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        commentDate.getFullYear();
      // padStart() rellena el string con ceros al principio si es necesario, de manera que el string tenga una longitud de 2 caracteres.

      calif.innerHTML += `
    <div class="carousel-item ${isActive} comments">
    <div class="headComment flex-column flex-md-row flex-lg-row">
      <p class="commentUsername"> ${cal.user} </p>
      <div class="cicles">${circles}</div>
    </div>
    <p> ${cal.description} </p>
    <p class="commentDate"> ${date} </p>
    </div>
    `;
    });
  }

  // calificaciones de product-info
  const CALIFICACIONES = PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE;

  getProductInfo(CALIFICACIONES).then(function (resultObj) {
    if (resultObj.status === "ok") {
      apiComments = resultObj.data;
      showComments([
        ...apiComments,
        ...localComments.filter((comment) => comment.product == productId),
      ]);
    }
  });

  // Para agregar commentarios:
  // Llamo al botón de enviar comentarios y le pido que detecte el evento submit de envio de forms

  document
    .getElementById("enviar_comentarios")
    .addEventListener("submit", function (event) {
      // Este metodo lo que hace es evitar que un formulario se envíe automáticamente y la página se recargue
      // pemrite manejar los datos primero. sin esto no funciona nada y da error http 405
      event.preventDefault();

      // Capturar datos del formulario
      // tomo el email del local storage con su clave

      let user = localStorage.getItem("email");

      let commentText = document.getElementById("comentarios").value;
      let commentVote = document.getElementById("calificacion").value;

      // Verifica que el comentario y la calificacion tengan valor, si alguno de los dos está vacío, se muestra una alerta
      if (commentText && commentVote) {
        //defino un comentario nuevo para que use la funcion addcomments

        const newComment = {
          user: user,
          description: commentText,
          score: parseInt(commentVote),
          product: productId,
          dateTime: new Date().toISOString(), // Timestamp actual
        };

        // Ahora si, agregar el comentario y mostrar los comentarios actualizados

        addComment(newComment);
        showComments([
          ...apiComments,
          ...localComments.filter((comment) => comment.product === productId),
        ]);

        // limpiar el texto en el formulario
        document.getElementById("enviar_comentarios").reset();

        // deja los círculos sin color y limpia la calificación
        let circles = document.querySelectorAll("#calificacion-container i");

        circles.forEach(function (circle) {
          circle.classList.replace("full-circle", "empty-circle");
        });

        document.getElementById("calificacion").value = "";
      } else {
        Swal.fire({
          text: "Por favor, completa todos los campos antes de enviar tu calificación",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#e83b57",
          imageUrl: "img/system-solid-55-error-hover-error-4.webp",
          imageWidth: 70, // Ancho del GIF
          imageHeight: 70, // Alto del GIF
        });
      }
    });

  // Círculos para los comentarios que se envian
  const circles = document.querySelectorAll("#calificacion-container i");
  const hiddenInput = document.getElementById("calificacion");

  circles.forEach((circle, index) => {
    circle.addEventListener("click", () => {
      hiddenInput.value = circle.getAttribute("data-value"); // Actualiza input oculto con el valor del círculo seleccionado

      // Cambia visualmente los círculos
      circles.forEach((c, i) => {
        if (i <= index) {
          c.classList.replace("empty-circle", "full-circle");
        } else {
          c.classList.replace("full-circle", "empty-circle");
        }
      });
    });
  });

  // Productos relacionados

  const RELACIONADOS = PRODUCT_INFO_URL + productId + EXT_TYPE;

  getProductInfo(RELACIONADOS).then(function (resultObj) {
    if (resultObj.status === "ok") {
      const product = resultObj.data.relatedProducts;

      const relac = document.getElementById("related-products");
      relac.innerHTML = ``;
      product.forEach((product) => {
        relac.innerHTML += `
        <div class="col-5 col-md-5 col-lg-4 card product-item" data-product-id="${product.id}">
          <img src="${product.image}" class="card-img-top"/>
        <div class="card-body">
          <h6><strong>${product.name}</strong></h6>
        </div>
        </div>
    `;
      });
    }
    selectedProducts();
  });
});
