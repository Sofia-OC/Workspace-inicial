export function emailValidation(email) {
  let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  if (!validEmail.test(email)) {
    Swal.fire({
      text: "Por favor, ingrese un email válido.",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#e83b57",
      imageUrl: "img/system-solid-55-error-hover-error-4.webp",
      imageWidth: 70, // Ancho del GIF
      imageHeight: 70, // Alto del GIF
    });
    return false;
  }
  return true;
}
