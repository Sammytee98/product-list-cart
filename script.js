// Selecting necessary DOM elements
const cartLength = document.querySelector('.cart-length');
const cartButtons = document.querySelectorAll('#add-button');
const cartList = document.querySelector('.cart-list');
const emptyCart = document.querySelector('.empty-cart-image');
const cartConfirmation = document.querySelector('.order-confirmation-con');
const orderTotal = document.querySelector('.order-total');
const orderPopup = document.querySelector('#confirm-all-order');
const startNewOrder = document.querySelector('.confirm-button');

// Update total quantity in the cart display
const updateCartMultiplier = () => {
    const cartMultiplierElement = document.querySelectorAll('.cart-counter');
    const totalQuantity = Array.from(cartMultiplierElement).reduce((sum, counter) => {
        return sum + parseInt(counter.textContent);
    }, 0);
    cartLength.textContent = `Your Cart(${totalQuantity})`;
}

// Update total order price by summing individual item totals
const updateOrderTotal = () => {
    const totalPriceElements = document.querySelectorAll('.total-price');
    const totalPriceArray = Array.from(totalPriceElements, item => 
        parseFloat(item.textContent.replace('$', '')));
    const totalOrderPrice = totalPriceArray.reduce((a,b) => a + b, 0).toFixed(2);
    orderTotal.textContent = `$${totalOrderPrice}`;
}

// Reset all 'Add to Cart' buttons and images back to original content/styles
const resetAllButtons = () => {
    cartButtons.forEach((button) => {
        const originalContent = button.getAttribute('button-original-content');
        button.innerHTML = originalContent;
        button.style.backgroundColor = 'hsl(13, 31%, 94%)';
        const imageFrame = button.closest('.image').querySelector('img');
        imageFrame.classList.remove('image-frame');
    });
}

// Update cart display by toggling empty cart message or confirmation section
const updateCartDisplay = () => {
    if(cartList.children.length > 0){
        emptyCart.style.display = 'none';
        cartConfirmation.style.display = 'block';
    }
    else{
        emptyCart.style.display = 'block';
        cartConfirmation.style.display = 'none';
    }
}

// Loop over each 'Add to Cart' button to add event listeners for cart functionality
cartButtons.forEach((button) => {
    button.setAttribute('button-original-content', button.innerHTML);

    button.addEventListener('click', (e) => {
        const button = e.target;
        const originalContent = button.innerHTML;

        // Find the product container, image. and details
        const productContainer = button.closest('.product-con');
        const image = button.closest('.image');
        const imageFrame = image.querySelector('img');

        const price = productContainer.querySelector('.price').textContent;
        const name = productContainer.querySelector('.name').textContent;
        const amount = parseFloat(price.replace('$', '')).toFixed(2);

        // Reset button content and styles back to default
        const buttonOriginalContent = () => {
            button.innerHTML = originalContent;
            button.style.backgroundColor = 'hsl(13, 31%, 94%)';
            imageFrame.classList.remove('image-frame');
        }

        // Check if the product already exists in the cart and update if so
        let productInfo = Array.from(cartList.children).find(
            item => item.querySelector('h3')?.textContent === name
        );

        // If the product is already in the cart, update its quantity and total
        if(productInfo){
            const counterDisplay = productInfo.querySelector('.cart-counter');
            const totalPrice = productInfo.querySelector('.total-price');
            const quantityDisplay = productInfo.querySelector('h4');
            let currentQuantity = parseFloat(counterDisplay.textContent);
            
            currentQuantity++;
            counterDisplay.textContent = currentQuantity;
            quantityDisplay.textContent = `${currentQuantity}x`;
            totalPrice.textContent = `$${(amount * currentQuantity).toFixed(2)}`;

            updateCartMultiplier();
            updateOrderTotal();
            return;
        }

        let i = 1;  // Initial quantity for new cart item

        // Define HTML for quantity controls
        const cartMultiplier = `
        <div class="cart-multiplier">
            <img class="decrement" src="./assets/images/decrement-outline.png" alt = "decrement image" width = "20px">
            <span class="cart-counter">${i}</span>
            <img class="increment" src="./assets/images/increment-outline.png" alt = "increment image" width = "20px">
        </div> `;

        // Set button styles and insert cart multiplier controls
        if(button.innerHTML === originalContent) {
            button.style.backgroundColor = '#c73a0f';
            button.innerHTML = cartMultiplier;
            imageFrame.classList.add('image-frame');

            // Create product item in the cart with details
            const productItem = document.createElement('div')
            productItem.classList.add('product'); 
            productItem.innerHTML = `
            <div class="con">
            <h3>${name}</h3>
                <div class="product-price">
                    <h4 class="cart-multiplier">${i}x</h4>
                    <p class="original-price">@${price}</p>
                    <p class="total-price">$${(amount * i).toFixed(2)}</p>
                </div>
            </div>
            <img class="remove-item" src="./assets/images/remove-icon.png" alt="remove icon">
            `;
            
            cartList.appendChild(productItem);
            updateCartMultiplier();
            updateOrderTotal();
            updateCartDisplay();
            
            // Define increment and decrement functionality
            const decrement = button.querySelector('.decrement');
            const counterDisplay = button.querySelector('.cart-counter');
            const increment = button.querySelector('.increment');
            const totalPrice = productItem.querySelector('.total-price');
            const quantityDisplay = productItem.querySelector('h4');

            // Mouseover and Mouseout events for button styling
            decrement.addEventListener('mouseover', () => decrement.src = './assets/images/decrement-filled.png');
            decrement.addEventListener('mouseout', () => decrement.src = 'assets/images/decrement-outline.png');
            increment.addEventListener('mouseover', () => increment.src = './assets/images/increment-filled.png');
            increment.addEventListener('mouseout', () => increment.src = 'assets/images/increment-outline.png');

            // Increment product quantity in cart
            increment.addEventListener('click', () => {
                i++;
                counterDisplay.textContent = i;
                quantityDisplay.textContent = `${i}x`;
                totalPrice.textContent = `$${(amount * i).toFixed(2)}`;
                updateOrderTotal();
                updateCartMultiplier();
            });
            
            // Decrement product quantity or remove item if quantity is < 1
            decrement.addEventListener('click', () => {
                if(i > 1){
                    i--;
                    counterDisplay.textContent = i;
                    quantityDisplay.textContent = `${i}x`;
                    totalPrice.textContent = `$${(amount * i).toFixed(2)}`;
                    
                    updateOrderTotal();
                    updateCartMultiplier();
                }
                else{
                    productItem.remove();
                    buttonOriginalContent();
                    updateOrderTotal();
                    updateCartMultiplier();
                    updateCartDisplay();
                }
            });

            // Remove item from cart 
            const removeButton = productItem.querySelector('.remove-item');
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', () => {
                    removeButton.closest('.product').remove();
                    buttonOriginalContent();
                    updateOrderTotal();
                    updateCartMultiplier();
                    updateCartDisplay();
            });
            removeButton.addEventListener('mouseover', () => {
                removeButton.src = './assets/images/cancel-filled.png';
            });
            removeButton.addEventListener('mouseout', () => {
            removeButton.src = './assets/images/remove-icon.png';
            });
            
        }
    });
});

// Event to show order confirmation modal
orderPopup.addEventListener('click', () => {
    const orderDetails = document.querySelector('#orderDetails');
    orderDetails.innerHTML = '';
    const orderProduct = document.querySelectorAll('.product');

    // Build each product's details for thee order confirmation
    orderProduct.forEach((product) => {
        const name = product.querySelector('h3').textContent.trim();
        const productQuantity = product.querySelector('.cart-multiplier').textContent;
        const price = product.querySelector('.original-price').textContent;
        const totalPrice = product.querySelector('.total-price').textContent;
        
        // Locate the original product container by matching the name 
        const originalProduct = Array.from(document.querySelectorAll('.product-con')).find((original) => {
        const originalName = original.querySelector('.product-info h3.name').textContent.trim();
        return originalName === name;
        });
        
        // Extract image using on product name
        const imageSrc = originalProduct.querySelector('.image img').src;
        
        const orderItemHTML = `
            <div class="order-item">
                <div class="order-detail">
                    <img src="${imageSrc}" alt="${name}" style="width: 30px; height: 30px; border-radius: 5px;">
                    <div class="order-detail-header">
                        <h3>${name}</h3>
                        <div class="quantity-price">
                            <h4>${productQuantity}</h4>
                            <p>${price}</p>
                        </div>
                    </div>
                </div>
                <h4 class="order-price">${totalPrice}</h4>
            </div>
        `;

        orderDetails.insertAdjacentHTML('beforeend', orderItemHTML);
        
    });
    
    const overallOrderprice = document.querySelector('.order-total').textContent;
    const totalHTML = `
        <div class="total">
            <p>Order Total</p>
            <p class="overall-price">${overallOrderprice}</p>
        </div>
    `;

    orderDetails.insertAdjacentHTML('beforeend', totalHTML)

    const orderModalContainer = document.getElementById('orderModalContainer');
    orderModalContainer.style.visibility = 'visible';
    orderModalContainer.style.transition = '0.5s';

});

// Event to close order confimation modal and start new order
startNewOrder.addEventListener('click', () => {
    document.getElementById('orderModalContainer').style.visibility = 'hidden';
    
    cartList.innerHTML = '';
    resetAllButtons();
    updateCartDisplay();
    updateCartMultiplier();
    updateOrderTotal();
});