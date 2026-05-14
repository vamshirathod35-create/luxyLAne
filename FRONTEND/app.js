async function addProduct() {

    let productName =
    document.getElementById("product-name").value;

    let productPrice =
    document.getElementById("product-price").value;

    let productDescription =
    document.getElementById("product-description").value;

    let productImage =
    document.getElementById("product-image").value;

    let product = {

        name: productName,

        price: productPrice,

        description: productDescription,

        image: productImage
    };

    let response = await fetch(
        "https://luxylane-backend.onrender.com/products",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)
        }
    );

    let data = await response.text();

    alert(data);
}