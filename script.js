document.addEventListener('DOMContentLoaded', function() {
    const menuToggleBtn = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggleBtn && mainNav) {
      menuToggleBtn.addEventListener('click', () => {
        mainNav.classList.toggle('open');
      });
    }
    
  
    const fadeElements = document.querySelectorAll('.fadeInUp');
    const stickyCta = document.querySelector('.sticky-cta');
    
    const fadeInElements = () => {
      fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('active');
        }
      });
      
      const hero = document.querySelector('.hero');
      if (hero) {
        const heroHeight = hero.offsetHeight;
        if (window.scrollY > heroHeight / 2) {
          stickyCta.classList.add('visible');
        } else {
          stickyCta.classList.remove('visible');
        }
      }
    };
    
  
    
    fadeInElements();
    window.addEventListener('scroll', fadeInElements);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        document.getElementById('cart-count').textContent = cart.length;
    }
    
    function renderCartItems() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;
    
        cartContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });
    
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            });
        });
    }
    
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(event) {
            if (event.target.textContent.includes('Add to Cart')) {
                const productCard = event.target.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productImage = productCard.querySelector('img').src;
    
                cart.push({ name: productName, price: productPrice, image: productImage });
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Product added to cart!');
                updateCartCount();
            }
        });
    });
    
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    
    if (document.getElementById('clear-cart')) {
        document.getElementById('clear-cart').addEventListener('click', function() {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        });
    }
    
    updateCartCount();
    
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            const toggle = question.querySelector('.faq-toggle');
            toggle.textContent = item.classList.contains('active') ? '-' : '+';
        });
    });
    
    const heroCanvas = document.getElementById('heroCanvas');
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const heroRenderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: true
    });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);
    
    const leaves = [];
    const leafGeometry = new THREE.CircleGeometry(0.5, 5);
    const leafMaterial = new THREE.MeshBasicMaterial({ color: 0x8BC34A, transparent: true, opacity: 0.7 });
    
    for (let i = 0; i < 50; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.x = Math.random() * 40 - 20;
        leaf.position.y = Math.random() * 20 - 10;
        leaf.position.z = Math.random() * 20 - 10;
        leaf.rotation.x = Math.random() * Math.PI;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.scale.setScalar(Math.random() * 0.5 + 0.5);
        
        leaf.userData = {
            speedX: Math.random() * 0.01 - 0.005,
            speedY: Math.random() * 0.01 - 0.005,
            speedRotation: Math.random() * 0.01 - 0.005
        };
        
        heroScene.add(leaf);
        leaves.push(leaf);
    }
    
    heroCamera.position.z = 15;
    
    
    function onWindowResize() {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    
    function animate() {
        requestAnimationFrame(animate);
        
        leaves.forEach(leaf => {
            leaf.position.x += leaf.userData.speedX;
            leaf.position.y += leaf.userData.speedY;
            leaf.rotation.z += leaf.userData.speedRotation;
            
            if (leaf.position.x > 20) leaf.position.x = -20;
            if (leaf.position.x < -20) leaf.position.x = 20;
            if (leaf.position.y > 10) leaf.position.y = -10;
            if (leaf.position.y < -10) leaf.position.y = 10;
        });
        
        heroRenderer.render(heroScene, heroCamera);
    }
    animate();
    
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch(".fadeInUp", {
        onEnter: (elements) => {
            gsap.to(elements, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
        },
        start: "top 85%"
    });
});
