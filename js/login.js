import { emailValidation } from "./utils/emailValidation.js";

document.addEventListener("DOMContentLoaded", () => {
  let boton = document.getElementById("inicio");
  boton.addEventListener("click", () => {
    // let usuario = document.getElementById('usuario').value;
    let email = document.getElementById("email").value;
    let contraseña = document.getElementById("contraseña").value;

    if (contraseña != "" && email != "") {
      if (!emailValidation(email)) {
        return;
      }
      // localStorage.setItem("user", usuario ); // aca indico que guarde en el localstorage mi variable usuario
      localStorage.setItem("email", email); // aca indico que guarde en el localstorage mi variable usuario

      location.href = "index.html"; // y luego me mande al index
    } else {
      Swal.fire({
        text: "Falta completar usuario o contraseña",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#e83b57",
        imageUrl: "img/system-solid-55-error-hover-error-4.webp",
        imageWidth: 70, // Ancho del GIF
        imageHeight: 70, // Alto del GIF
      });
    }
  });
});
