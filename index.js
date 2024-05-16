
import { menuArray } from "./data.js";

const main = document.getElementById('main')
const orderContainer = document.getElementById('order-container')
const modal = document.getElementById('modal')

function renderMenu(menus) {
    menus.forEach(menu => {
        const {name, ingredients, id, price, emoji} = menu
        main.innerHTML += `
            <div class="menu-container" id="menu-container-${id}">
                <div class="menu">
                    <h3 id="menuItemEmoji">${emoji}</h3>
                    <div class="menu-info">
                        <p id="menuItem">${name}</p>
                        <p id="menuItemIngredients">${ingredients.join(', ')}</p>
                        <p id="menuItemPrice">$${price}</p>
                    </div>
                </div>
                <button id=${id} class="add-btns">+</button>
            </div>
        `
    })

    const addBtn = document.querySelectorAll('.add-btns')
    addBtn.forEach(button => {
        button.addEventListener('click', function() {
            const menuId = parseInt(button.getAttribute('id'))
            const menuItem = menus.find(menu => menu.id === menuId)
            addToOrder(menuItem)
        })
    })
}

function addToOrder(item) {
    let orderSubTotal = orderContainer.querySelector('.order-subtotal')

    if (!orderSubTotal) {
        orderContainer.innerHTML += `
            <div class="order-subtotal">
                <h4>Your Order</h4>
                <div class="order-items"></div>
                <div class="order-total"></div>
                <button class="complete-order-btn"
                id="complete-order-btn">Complete order</button>
            </div>
        `
        orderSubTotal = orderContainer.querySelector('.order-subtotal')
    }

    const completeOrderBtn = orderSubTotal.querySelector('.complete-order-btn')
    completeOrderBtn.addEventListener('click', function() {
        modal.style.display = 'inline'
        modal.innerHTML = `
            <div>
                <h3>Enter card details</h3>
                <form class="modal-form">
                    <input
                    class="modal-input" 
                    type="text" 
                    name="fullName"
                    placeholder="Enter your name"
                    required
                    >
                    <input 
                    class="modal-input"
                    type="number"
                    name="cardNumber"
                    placeholder="Enter card number"
                    pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                    required
                    >
                    <input
                    class="modal-input" 
                    type="number"
                    name="cvvNumber"
                    placeholder="Enter CVV"
                    pattern="[0-9]{3,4}"
                    required
                    >
                    <button type="submit" class="pay-btn">Pay</button>
                </form>
            </div>
        `
        const payForm = modal.querySelector('.modal-form')
        payForm.addEventListener('submit', function(e) {
            e.preventDefault()
            modal.style.display = 'none'
            orderContainer.innerHTML = `
                <div class="order-confirmation">
                    <h3>Thanks! Your order is on its way!</h3>
                </div>
            `
            const orderConfirmation = orderContainer.querySelector('.order-confirmation')
            orderConfirmation.addEventListener('click', function() {
                orderConfirmation.style.display = 'none'
            })
        })        
    })

    const orderItems = orderSubTotal.querySelector('.order-items')
    const orderItemInfo = document.createElement('div')
    orderItemInfo.classList.add('order-item-info')
    orderItemInfo.innerHTML += `
            <div class="order-item">
                <h4>${item.name}</h4>
                <button class="remove-btn">remove</button>
            </div>
            <p class="order-subtotal-price">$${item.price}</p>
    `
    orderItems.appendChild(orderItemInfo)

    const orderTotal = orderSubTotal.querySelector('.order-total')
    const orderSubtotalPrices = orderItems.querySelectorAll('.order-subtotal-price')
    let totalPrice = 0
    orderSubtotalPrices.forEach(subtotalPrice => {
        totalPrice += parseFloat(subtotalPrice.textContent.slice(1))
    })
    orderTotal.innerHTML = `
        <div class="total-price">
            <h4>Total price:</h4>
            <p>${totalPrice.toFixed(2)}</p>
        </div>
        `

    orderSubTotal.style.display = 'block'

    const removeButtons = orderItems.querySelectorAll('.remove-btn')
    removeButtons.forEach(removeButton => {
        removeButton.addEventListener('click', function() {
            const parentOrderItemInfo = removeButton.closest('.order-item-info')
            const itemPrice = parseFloat(parentOrderItemInfo.querySelector('.order-subtotal-price').textContent.slice(1))
            parentOrderItemInfo.remove()

            totalPrice -= itemPrice
            orderTotal.innerHTML = `
                <div class="new-total-price">
                    <h4>Total price:</h4>
                    <p>$${totalPrice.toFixed(2)}</p>
                </div>
            `
            if (orderItems.children.length === 0) {
                orderSubTotal.style.display = 'none'
            } 
        })
    })
}
renderMenu(menuArray)


