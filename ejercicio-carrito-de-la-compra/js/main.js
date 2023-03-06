
const div = document.querySelector("#smallCard");
const perPage = 9; // Numro de imagenes por pagina
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartDiv = document.querySelector("#cart");

const displayCart = () => {
    //const cartDiv = document.querySelector("#cart");
    if (!cartDiv) {
        console.log("no se en cuentra ")
        return
    }
    cartDiv.innerHTML = "";
    cart.forEach((item) => {
        const { title, price, imageUrl } = item;
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
          <img src="${imageUrl}" alt="${title}">
          <p>${title}</p>
          <p>$${price.toFixed(2)}</p>
        `;
        cartDiv.append(itemDiv);
    });
}

const addToCart = (item) => {
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {

            const pintarProductos = (productos, page) => {
                const start = (page - 1) * perPage;
                const end = start + perPage;
                div.innerHTML = "";
                productos.slice(start, end).forEach((producto) => {
                    const { title, price, images } = producto;
                    const imgUrl = images[0];
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', imgUrl);
                    const nameElement = document.createElement('p');
                    nameElement.innerHTML = title;
                    const priceElement = document.createElement('p');
                    priceElement.innerHTML = `$${price.toFixed(2)}`;
                    const buttonElement = document.createElement('button');
                    buttonElement.innerHTML = "Add to cart";

                    buttonElement.addEventListener('click', () => {
                        addToCart({ title, price, imageUrl: imgUrl });
                    });
                    const productDiv = document.createElement('div');
                    productDiv.id="fotoscuatro"
                    productDiv.appendChild(imgElement);
                    productDiv.appendChild(nameElement);
                    productDiv.appendChild(priceElement);
                    productDiv.appendChild(buttonElement);
                    div.appendChild(productDiv);
                });
            }

            pintarProductos(data.products, 1);
            displayCart();

            const prevButton = document.querySelector("#prevButton");
            const nextButton = document.querySelector("#nextButton");
            const comprar = document.querySelector("#enlace");
            let currentPage = 1;
            const numPages = Math.ceil(data.products.length / perPage);

            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    pintarProductos(data.products, currentPage);
                }
            });

            nextButton.addEventListener('click', () => {
                if (currentPage < numPages) {
                    currentPage++;
                    pintarProductos(data.products, currentPage);
                }
            });

            comprar.addEventListener('click', () => {
                window.location.href = "index-compra.html";
            });

            const viewCartButton = document.querySelector("#viewCartButton");
            viewCartButton.addEventListener("click", ()=>{
                const cart = JSON.parse(localStorage.getItem("cart"));
                const cartItems = cart
                  .map((item) => `<p>${item.title} - $${item.price.toFixed(2)}</p>`)
                  .join("");
                const cartContent = `
                  <div id="cartModal">
                    <div id="cartModalContent">
                      <h2>Cart</h2>
                      ${cartItems || "<p>Your cart is empty</p>"}
                      <button id="closeCartButton">Close</button>
                    </div>
                  </div>`;
                document.body.insertAdjacentHTML("beforeend", cartContent);
                const closeCartButton = document.querySelector("#closeCartButton");
                closeCartButton.addEventListener("click", () => {
                  const cartModal = document.querySelector("#cartModal");
                  cartModal.parentNode.removeChild(cartModal);
                });  
            })
        
        })
        
    }

)