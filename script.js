function addToCart(product){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.push(product);

localStorage.setItem("cart", JSON.stringify(cart));

alert(product + " added to cart!");
}

if(document.getElementById("cartItems")){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let list = document.getElementById("cartItems");

cart.forEach(item => {

let li = document.createElement("li");

li.textContent = item;

list.appendChild(li);

});
}