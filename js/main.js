/**
 * ineedcoffee.online Main JavaScript
 * Handles all interactive functionality for the e-commerce website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initProductCards();
    initTestimonialSlider();
    initNewsletterForm();
    initBackToTop();
    initCartFunctionality();
    loadProducts();
});

/**
 * Dynamically Loads Products from JSON
 */
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        const productsGrid = document.querySelector('.products-grid');

        if (productsGrid) {
            productsGrid.innerHTML = ''; // Clear placeholder
            products.forEach(product => {
                const productCardHTML = `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                            ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <div class="product-price">${product.price}</div>
                            <a href="${product.url}" target="_blank" class="btn btn-secondary" style="margin-top:10px;">
                              Buy on Amazon
                            </a>
                        </div>
                    </div>
                `;
                productsGrid.insertAdjacentHTML('beforeend', productCardHTML);
            });
        }
    } catch (error) {
        console.error('Could not load products:', error);
        const productsGrid = document.querySelector('.products-grid');
        if(productsGrid) {
            productsGrid.innerHTML = '<p>Could not load products at this time. Please try again later.</p>';
        }
    }
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile nav if it doesn't exist yet
            if (!document.querySelector('.mobile-nav')) {
                const mobileNav = document.createElement('div');
                mobileNav.className = 'mobile-nav';
                mobileNav.innerHTML = navList.outerHTML;
                document.body.appendChild(mobileNav);
                
                // Add event listeners to mobile nav links
                const mobileNavLinks = mobileNav.querySelectorAll('a');
                mobileNavLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        mobileNav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    });
                });
            }
            
            // Toggle mobile nav
            const mobileNav = document.querySelector('.mobile-nav');
            mobileNav.classList.toggle('active');
            
            // Prevent scrolling when mobile menu is open
            document.body.classList.toggle('no-scroll');
        });
    }
}

/**
 * Product Cards Interaction
 */
function initProductCards() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Add to cart animation
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            this.classList.add('added');
            
            // Update cart count
            updateCartCount(1);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.classList.remove('added');
            }, 2000);
            
            // Show notification
            showNotification(`${productName} added to cart`);
        });
    });
}

/**
 * Update Cart Count
 */
function updateCartCount(increment) {
    const cartCount = document.querySelector('.cart-count');
    let currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + increment;
    
    // Animate cart icon
    const cartIcon = document.querySelector('.cart-btn i');
    cartIcon.classList.add('bounce');
    setTimeout(() => {
        cartIcon.classList.remove('bounce');
    }, 500);
}

/**
 * Show Notification
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    const notification = document.querySelector('.notification');
    notification.textContent = message;
    notification.classList.add('active');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!testimonials.length) return;
    
    let currentIndex = 0;
    
    // Show testimonial at index
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial and activate current dot
        testimonials[index].style.display = 'block';
        dots[index].classList.add('active');
    }
    
    // Initialize slider
    showTestimonial(currentIndex);
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        });
    }
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        });
    }
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(function() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

/**
 * Newsletter Form Submission
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Success state
                this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank You!</h3><p>You\'ve been successfully subscribed to our newsletter.</p></div>';
            } else {
                // Show error
                emailInput.classList.add('error');
                
                // Remove error class after 2 seconds
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 2000);
            }
        });
    }
}

/**
 * Validate Email
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Cart Functionality
 */
function initCartFunctionality() {
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create cart modal if it doesn't exist yet
            if (!document.querySelector('.cart-modal')) {
                const cartModal = document.createElement('div');
                cartModal.className = 'cart-modal';
                cartModal.innerHTML = `
                    <div class="cart-modal-content">
                        <div class="cart-modal-header">
                            <h3>Your Cart</h3>
                            <button class="close-cart"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="cart-items">
                            <p class="empty-cart">Your cart is empty</p>
                        </div>
                        <div class="cart-total">
                            <p>Total: <span>$0.00</span></p>
                        </div>
                        <div class="cart-actions">
                            <button class="btn btn-secondary">Continue Shopping</button>
                            <button class="btn btn-primary">Checkout</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(cartModal);
                
                // Close cart modal
                const closeCartBtn = cartModal.querySelector('.close-cart');
                closeCartBtn.addEventListener('click', function() {
                    cartModal.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
                
                // Continue shopping button
                const continueShoppingBtn = cartModal.querySelector('.btn-secondary');
                continueShoppingBtn.addEventListener('click', function() {
                    cartModal.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
                
                // Checkout button
                const checkoutBtn = cartModal.querySelector('.btn-primary');
                checkoutBtn.addEventListener('click', function() {
                    showNotification('Checkout functionality coming soon!');
                });
            }
            
            // Show cart modal
            const cartModal = document.querySelector('.cart-modal');
            cartModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }
}

/**
 * Add CSS for JavaScript-generated elements
 */
(function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Navigation */
        .mobile-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--espresso-brown);
            z-index: 1001;
            padding: 2rem;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .mobile-nav.active {
            transform: translateX(0);
        }
        
        .mobile-nav .nav-list {
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .mobile-nav a {
            color: var(--cream);
            font-size: 1.5rem;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .no-scroll {
            overflow: hidden;
        }
        
        /* Notification */
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--muted-gold);
            color: var(--dark-roast);
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transition: transform 0.3s ease;
        }
        
        .notification.active {
            transform: translateX(-50%) translateY(0);
        }
        
        /* Cart Modal */
        .cart-modal {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(30, 20, 16, 0.8);
            z-index: 1001;
            display: flex;
            justify-content: flex-end;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
        }
        
        .cart-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .cart-modal-content {
            width: 400px;
            max-width: 90%;
            height: 100%;
            background-color: var(--cream);
            padding: 2rem;
            overflow-y: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .cart-modal.active .cart-modal-content {
            transform: translateX(0);
        }
        
        .cart-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .cart-modal-header h3 {
            font-family: var(--heading-font);
            font-size: 1.5rem;
            color: var(--espresso-brown);
        }
        
        .close-cart {
            background: none;
            border: none;
            font-size: 1.2rem;
            color: var(--espresso-brown);
            cursor: pointer;
        }
        
        .cart-items {
            margin-bottom: 2rem;
        }
        
        .empty-cart {
            text-align: center;
            color: var(--coffee-bean);
            font-style: italic;
            padding: 2rem 0;
        }
        
        .cart-total {
            display: flex;
            justify-content: flex-end;
            font-weight: 600;
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            border-top: 1px solid var(--latte);
            padding-top: 1rem;
        }
        
        .cart-actions {
            display: flex;
            gap: 1rem;
        }
        
        .cart-actions .btn {
            flex: 1;
        }
        
        /* Success Message */
        .success-message {
            text-align: center;
            padding: 2rem 0;
        }
        
        .success-message i {
            font-size: 3rem;
            color: var(--muted-gold);
            margin-bottom: 1rem;
        }
        
        .success-message h3 {
            font-family: var(--heading-font);
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        /* Animations */
        .bounce {
            animation: bounce 0.5s;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        /* Form Validation */
        input.error {
            border: 2px solid #e74c3c;
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
                transform: translateX(5px);
            }
        }
        
        /* Add to Cart Button States */
        .add-to-cart.added {
            background-color: #2ecc71;
        }
    `;
    document.head.appendChild(style);
})();
// Simple review storage in localStorage for demo/testing
const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '{}');

function renderReviews(place) {
  const reviewsDiv = document.getElementById('reviews-list');
  reviewsDiv.innerHTML = '';
  if (place && reviews[place]) {
    reviews[place].forEach((review, idx) => {
      let el = document.createElement('div');
      el.className = 'review-item';
      el.textContent = review;
      reviewsDiv.appendChild(el);
    });
  }
}

document.getElementById('place-select').addEventListener('change', function() {
  renderReviews(this.value);
  document.getElementById('review-text').value = '';
});

document.getElementById('save-review-btn').addEventListener('click', function() {
  const place = document.getElementById('place-select').value;
  const reviewText = document.getElementById('review-text').value.trim();
  if (!place || !reviewText) {
    alert('Please select a place and write a review.');
    return;
  }
  reviews[place] = reviews[place] || [];
  reviews[place].push(reviewText);
  localStorage.setItem('cafeReviews', JSON.stringify(reviews));
  renderReviews(place);
  document.getElementById('review-text').value = '';
});
// Cafe Reviews Modal functionality
const cafeReviews = JSON.parse(localStorage.getItem('cafeCardReviews') || '{}');

// Modal elements
const modal = document.getElementById('cafe-review-modal');
const modalPlace = document.getElementById('modal-place-name');
const modalPlaceReviews = document.getElementById('modal-place-reviews');
const modalTxt = document.getElementById('modal-review-text');
const reviewsDiv = document.getElementById('modal-reviews-list');

function renderModalReviews(place) {
  reviewsDiv.innerHTML = '';
  modalPlaceReviews.textContent = place;
  if (cafeReviews[place]) {
    cafeReviews[place].forEach(r => {
      let el = document.createElement('div');
      el.textContent = r;
      el.style.padding = "0.32rem 0";
      reviewsDiv.appendChild(el);
    });
  }
}

document.querySelectorAll('.review-btn').forEach(btn => {
  btn.onclick = function() {
    const place = this.getAttribute('data-place');
    modal.style.display = 'flex';
    modalPlace.textContent = place + ' Cafe Reviews';
    modalTxt.value = '';
    renderModalReviews(place);
    // Attach save handler (only once)
    document.getElementById('save-modal-review').onclick = function() {
      const txt = modalTxt.value.trim();
      if (!txt) return;
      cafeReviews[place] = cafeReviews[place] || [];
      cafeReviews[place].push(txt);
      localStorage.setItem('cafeCardReviews', JSON.stringify(cafeReviews));
      modalTxt.value = '';
      renderModalReviews(place);
    }
  };
});

document.getElementById('close-modal').onclick = function() {
  modal.style.display = 'none';
};
// Optional: close modal when clicking outside modal-content
modal.onclick = function(e) {
  if (e.target === modal) modal.style.display = 'none';
};
const galleryImages = [
  'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg',
  'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
  'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
  'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg',
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
  'https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg',
  'https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg',
  // add or swap image URLs here
];

function fillHeroGallery() {
  const imgCount = Math.min(6, galleryImages.length);
  const shuffled = galleryImages.slice().sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, imgCount);
  const grid = document.getElementById('heroGalleryGrid');
  grid.innerHTML = '';
  selected.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Coffee Photo';
    grid.appendChild(img);
  });
}
document.addEventListener('DOMContentLoaded', fillHeroGallery);
// Dynamic coffee image pool for cafe review hero
const cafeReviewImages = [
  'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg',
  'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
  'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
  'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg',
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
  'https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg',
  'https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg'
];

