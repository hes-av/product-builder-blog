class ProductItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const image = this.getAttribute('image');
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');

        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--card-background, #fff);
                    border-radius: 12px;
                    box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 32px var(--shadow-color, rgba(0,0,0,0.15));
                }
                img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .info {
                    padding: 1.5rem;
                }
                h3 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem;
                }
                .price {
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: var(--primary-color, #3a7bd5);
                    margin-bottom: 1rem;
                }
                button {
                    background: linear-gradient(45deg, var(--primary-color, #3a7bd5), var(--secondary-color, #3a6073));
                    color: #fff;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: box-shadow 0.3s ease;
                    box-shadow: 0 0 15px var(--glow-color, rgba(58, 123, 213, 0));
                }
                button:hover {
                    box-shadow: 0 0 25px var(--glow-color, rgba(58, 123, 213, 0.7));
                }
            </style>
            <div>
                <img src="${image}" alt="${name}">
                <div class="info">
                    <h3>${name}</h3>
                    <p class="price">${price}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
        `;

        shadow.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-to-cart', { bubbles: true, composed: true }));
        });
    }
}

customElements.define('product-item', ProductItem);

const products = [
    {
        name: 'Wireless Headphones',
        price: '$99.99',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: 'Stylish Smartwatch',
        price: '$199.99',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop'
    },
    {
        name: 'Modern Backpack',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb6e0e5c8?q=80&w=1887&auto=format&fit=crop'
    },
    {
        name: 'Organic Green Tea',
        price: '$19.99',
        image: 'https://images.unsplash.com/photo-1556742054-c1de3a4e5033?q=80&w=2070&auto=format&fit=crop'
    }
];

const productGrid = document.getElementById('product-grid');

products.forEach(product => {
    const productItem = document.createElement('product-item');
    productItem.setAttribute('name', product.name);
    productItem.setAttribute('price', product.price);
    productItem.setAttribute('image', product.image);
    productGrid.appendChild(productItem);
});

const cartCount = document.querySelector('.cart-count');
let currentCartCount = 0;

document.addEventListener('add-to-cart', () => {
    currentCartCount++;
    cartCount.textContent = currentCartCount;
});
