function addToCart(product, price) {

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: product,
        price: price
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(product + " added to cart!");
}

if(document.getElementById("cartItems")) {

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    let list =
    document.getElementById("cartItems");

    let total = 0;

    cart.forEach(item => {

        let li =
        document.createElement("li");

        li.innerHTML =
        item.name + " - Rs. " + item.price;

        list.appendChild(li);

        total += item.price;

    });

    let totalElement =
    document.createElement("h2");

    totalElement.innerHTML =
    "Total: Rs. " + total;

    list.appendChild(totalElement);
}