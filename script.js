document.addEventListener('DOMContentLoaded', function() {
    // Activate scroll effects
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
        
        // Show order button when scrolling past the Hero section
        const heroHeight = document.querySelector('.hero').offsetHeight;
        if (window.scrollY > heroHeight / 2) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    };
    
    fadeInElements();
    window.addEventListener('scroll', fadeInElements);
    
    // Enable FAQ section expansion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            const toggle = question.querySelector('.faq-toggle');
            toggle.textContent = item.classList.contains('active') ? '-' : '+';
        });
    });
    
    // Initialize animated background in Hero section
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
    
    // Create floating leaves for background
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
    
    // Update camera on window resize
    function onWindowResize() {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Activate background animation
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
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Apply scroll-triggered animations
    ScrollTrigger.batch(".fadeInUp", {
        onEnter: (elements) => {
            gsap.to(elements, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
        },
        start: "top 85%"
    });
});
