export function updateCartCount() {
  let userCart = JSON.parse(localStorage.getItem("userCart"));
  let cartCount = userCart.reduce((acc, e) => acc + e.count, 0);
  document.getElementById("button-cart").innerText = cartCount;
}
