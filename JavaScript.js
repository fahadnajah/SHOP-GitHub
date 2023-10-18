//Header//
function changeBg() {

    var navbar = document.getElementById('navbar');
    var scrollValue = window.scrollY;
    if (scrollValue < 150) {
        navbar.classList.remove('bgColor');
    } else {
        navbar.classList.add('bgColor');
    }

}
window.addEventListener('scroll', changeBg);
//End Header//

//Hamburger Menu//
function menuBtnFunction(menuBtn) {
    menuBtn.classList.toggle("active");
}
//End Hamburger Menu//



// Wait for the document to load
document.addEventListener('DOMContentLoaded', function () {
    // Get the form elements
    var addToCartForms = document.querySelectorAll('.add-to-cart-form');

    // Add a submit event listener to each form
    addToCartForms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            // Prevent the form from submitting and refreshing the page
            event.preventDefault();

            // Get the selected size from the dropdown
            var size = form.querySelector('select').value;

            // Get the product details from the form's data attributes
            var name = form.dataset.name;
            var price = parseFloat(form.dataset.price);
            var imageSrc = form.getAttribute('data-imageSrc');

            // Create an object representing the product being added to the cart
            var product = {
                name: name,
                price: price,
                size: size,
                imageSrc: imageSrc,
                quantity: 1 // Set initial quantity to 1
            };

            // Add the product to the cart (store in localStorage)
            addToCart(product);


        });
    });

    // Function to add the product to the cart (store in localStorage)
    function addToCart(product) {
        // Retrieve the existing cart items from localStorage (if any)
        var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if the product already exists in the cart
        var existingProduct = cartItems.find(function (item) {
            return item.name === product.name && item.size === product.size;
        });

        if (existingProduct) {
            // If the product exists, update its quantity
            existingProduct.quantity += 1;
        } else {
            // If the product doesn't exist, add it to the cart
            product.quantity = 1;
            cartItems.push(product);
        }

        // Display an alert message
        alert('Item added to the cart');

        // Store the updated cart items in localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update the cart items display
        renderCartItems();
    }

    // Get the cart items from localStorage
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Get the cart items table body
    var cartItemsBody = document.getElementById('cart-items-body');

    // Get the total box elements
    var totalAmountText = document.getElementById('total-amount');

    // Function to calculate and update the total amount
    function updateTotalAmount() {
        // Calculate the total amount
        var totalAmount = cartItems.reduce(function (total, product) {
            return total + product.price * product.quantity;
        }, 0);

        // Update the total amount text
        totalAmountText.textContent = totalAmount.toFixed(2) + ' EUR';
    }

    // Function to remove a product from the cart
    function removeFromCart(product) {
        var index = cartItems.findIndex(function (item) {
            return item.name === product.name && item.size === product.size;
        });

        if (index !== -1) {
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateTotalAmount();
            renderCartItems();
        }
    }
    // Function to update the quantity of a product in the cart
    function updateQuantity(product, newQuantity) {
        if (newQuantity >= 1) {
            product.quantity = newQuantity;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartItems();
            updateTotalAmount();
        }
    }

    // Function to render the cart items
    function renderCartItems() {
        // Clear the cart items table body
        cartItemsBody.innerHTML = '';

        // Check if the cart is empty
        if (cartItems.length === 0) {
            var emptyRow = document.createElement('tr');
            var emptyCell = document.createElement('td');
            emptyCell.setAttribute('colspan', '6');
            emptyCell.textContent = 'Your cart is empty';
            emptyRow.appendChild(emptyCell);
            cartItemsBody.appendChild(emptyRow);
        } else {
            // Iterate over the cart items and create rows for each item
            cartItems.forEach(function (product) {
                var row = document.createElement('tr');

                // Create the image cell
                var imageCell = document.createElement('td');
                var image = document.createElement('img');
                image.src = product.imageSrc;
                image.alt = product.name;
                image.width = 150;
                imageCell.appendChild(image);
                row.appendChild(imageCell);

                // Create the name cell
                var nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                // Create the price cell
                var priceCell = document.createElement('td');
                priceCell.textContent = product.price.toFixed(2) + ' EUR';
                row.appendChild(priceCell);

                // Create the size cell
                var sizeCell = document.createElement('td');
                sizeCell.textContent = product.size;
                row.appendChild(sizeCell);

                // Create the quantity cell
                var quantityCell = document.createElement('td');
                var quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.min = 1;
                quantityInput.value = product.quantity;
                quantityInput.addEventListener('input', function (event) {
                    updateQuantity(product, parseInt(event.target.value));
                });
                quantityInput.classList.add('quantity-input'); // Add this line to assign a CSS class
                quantityCell.appendChild(quantityInput);
                row.appendChild(quantityCell);

                // Create the actions cell
                var actionsCell = document.createElement('td');
                var removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', function () {
                    removeFromCart(product);
                });
                actionsCell.appendChild(removeButton);
                row.appendChild(actionsCell);

                // Append the row to the table body
                cartItemsBody.appendChild(row);
            });
        }

        // Update the total amount
        updateTotalAmount();
    }

    // Render the initial cart items
    renderCartItems();
});

