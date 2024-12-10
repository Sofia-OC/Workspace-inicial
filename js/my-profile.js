import { emailValidation } from "./utils/emailValidation.js";
// funcion para guardar datos del formulario y modificar los datos se se ingresan distintos con el mismo mail

function guardarDatos() {
  let nombre = document.getElementById("nombre").value;
  let segundo_nombre = document.getElementById("segundo_nombre").value;
  let apellido = document.getElementById("apellido").value;
  let segundo_apellido = document.getElementById("segundo_apellido").value;
  let email = document.getElementById("email").value;
  let telefono_contacto = document.getElementById("telefono_contacto").value;
  let fotoPerfil = document.getElementById("imagen").files[0];
  let modo = document.querySelector('input[name="modo"]:checked').value;

  // validar campos requeridos
  if (!nombre || !email || !apellido) {
    Swal.fire({
      text: "Por favor, complete todos los campos obligatorios.",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#e83b57",
      imageUrl: "img/system-solid-55-error-hover-error-4.webp",
      imageWidth: 70, // Ancho del GIF
      imageHeight: 70, // Alto del GIF
    });
    return;
  }
  if (!emailValidation(email)) {
    return;
  }

  // aqui se abren 2 opcion, o modificar los datos ya guardados
  // o crear un usuario nuevo pusheandolo al arreglo

  if (usuarioLoggeado > -1) {
    let usuarioExistente = usuarios[usuarioLoggeado];

    // Modificar los datos del usuario manteniendo la imagen existente si no se cambia
    usuarios[usuarioLoggeado] = {
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      email,
      telefono_contacto,
      modo,
      imagen: usuarioExistente.imagen,
    };
  }

  // guardar el arreglo actualizado en localStorage
  // convertir datos en cadena de texto para guardar en el local
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  //guardar imagen en el local con FileReader
  if (fotoPerfil) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imagenBase64 = e.target.result;

      // Si no existe el usuario logueado, es un usuario nuevo y se agrega al arreglo
      if (usuarioLoggeado < 0) {
        const nuevoUsuario = {
          nombre,
          segundo_nombre,
          apellido,
          segundo_apellido,
          email,
          telefono_contacto,
          modo,
          imagen: imagenBase64,
        };
        usuarios.push(nuevoUsuario);
      } else {
        usuarios[usuarioLoggeado].imagen = imagenBase64; // Si es un usuario existente, actualizar su imagen
      }
      localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guardar usuarios actualizados en localStorage

      document.getElementById("fotoPerfil").src = imagenBase64;
      document.getElementById("imgPerfil").src = imagenBase64;
    };
    // leer el archivo como URL de datos
    reader.readAsDataURL(fotoPerfil);

    // Si no se ha cargado una imagen y es un nuevo usuario, se guarda sin imagen
  } else if (usuarioLoggeado < 0) {
    const nuevoUsuario = {
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      email,
      telefono_contacto,
      modo,
      imagen: null,
    };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  // Vuelve a guardar el email en localStorage por si fue modificado
  localStorage.setItem("email", email);

  Swal.fire({
    text: "Datos guardados con exito",
    confirmButtonText: "Continuar",
    confirmButtonColor: "#e83b57",
    imageUrl: "img/system-solid-31-check-hover-check-2.webp",
    imageWidth: 70, // Ancho del GIF
    imageHeight: 70, // Alto del GIF
  }).then(() => {
    location.reload(); // Recargar la página después de que el usuario cierre el mensaje de éxito
  });
}

// Verifica si el usuario tiene una imagen guardada y la muestra, si no tiene, muestra una imagen por defecto
if (usuarioLoggeado > -1 && usuarios[usuarioLoggeado].imagen != null) {
  document.getElementById("imgPerfil").src = usuarios[usuarioLoggeado].imagen;
} else {
  document.getElementById("imgPerfil").src = "img/img_perfil.png";
}

// mostrar el email guardado en el local al cargar la p[agina
// window.onload (esto es nuevo)se dispara cuando la pagina y  sus recursos cargaron por completo

window.onload = function () {
  const emailLoggin = localStorage.getItem("email");
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // buscar el usuario por email
  const usuario = usuarios.find((usuario) => usuario.email === emailLoggin);

  // verificar si hay datos guardados y si el email coincide,
  // si es asi entonces se cargan los datos

  if (usuario) {
    document.getElementById("nombre").value = usuario.nombre || "";
    document.getElementById("segundo_nombre").value =
      usuario.segundo_nombre || "";
    document.getElementById("apellido").value = usuario.apellido || "";
    document.getElementById("segundo_apellido").value =
      usuario.segundo_apellido || "";
    document.getElementById("telefono_contacto").value =
      usuario.telefono_contacto || "";
    document.getElementById("email").value = usuario.email;

    if (usuario.modo) {
      document.querySelector(
        `input[name="modo"][value="${usuario.modo}"]`
      ).checked = true;
    }
  } else {
    const emailGuardado = localStorage.getItem("email");
    document.getElementById("email").value = emailGuardado;
  }
};

// asignar el evento al boton y voilà! yey!!

let guardar = document.getElementById("guardarBtn");

guardar.addEventListener("click", () => {
  guardarDatos();
});

// Feedback de imagen cargada
document.getElementById("imagen").addEventListener("change", function () {
  const feedbackValid = document.getElementById("valid-feedback-img");
  feedbackValid.style.display = "block";
});
