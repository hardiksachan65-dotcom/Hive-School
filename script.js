document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    
    // Add scrolled class when user scrolls down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // INTERSECTION OBSERVER FOR ENTRANCE ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => {
        // Remove the class initially so observer can trigger it
        el.classList.remove('animate-in');
        observer.observe(el);
    });

    // Mobile menu toggle logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                mobileBtn.style.transform = 'scale(1)';
            }, 150);
            
            console.log('Mobile menu clicked!');
        });
    }

    // CAROUSEL INITIALIZATION
    const carouselContainer = document.getElementById('carousel');
    if (carouselContainer) {
        initCarousel(carouselContainer);
    }
});

function initCarousel(container) {
    const totalCards = 30;
    const cards = [];
    
    // Expanded people names for 30 cards
    const names = [
        'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn', 'Harper', 'Avery', 
        'Rowan', 'Cameron', 'Peyton', 'Skyler', 'Emerson', 'Charlie', 'Finley', 'Parker', 'Sawyer', 
        'Hayden', 'River', 'Sage', 'Indigo', 'Phoenix', 'Jasper', 'Asher', 'Felix', 'Leo', 'Milo', 'Wren'
    ];

    // Generate Cards
    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.className = 'play-card';
        // Random portrait image from pravatar - using 600px for higher clarity
        const imgNum = (i % 70) + 1; 
        card.innerHTML = `
            <img src="https://i.pravatar.cc/600?img=${imgNum}" alt="${names[i % names.length]}">
            <div class="card-content">
                <p class="card-name">${names[i % names.length]}</p>
            </div>
        `;
        container.appendChild(card);
        cards.push(card);
    }

    let progress = 0;
    const speed = 0.003; 

    function animate() {
        progress += speed; 
        
        cards.forEach((card, i) => {
            let offset = (i - progress) % totalCards;
            if (offset < 0) offset += totalCards; 
            
            if (offset > totalCards / 2) {
                offset -= totalCards; 
            }
            
            let absOffset = Math.abs(offset);
            
            // HIHGE DENSITY CIRCULAR LOGIC
            // Slightly more spacing (11vw instead of 8.5vw)
            const xPos = offset * 11; 
            // Push center back (z negative), sides forward (z positive)
            const zPos = (absOffset * 65) - 100; 
            
            let scale, opacity, zIndex;
            
            // Show more cards (up to 14 offset instead of 6)
            if (absOffset > 14) {
                opacity = 0;
                scale = 0.5;
                zIndex = 0;
            } else {
                // Inverted scaling: sides bigger
                scale = 0.82 + (absOffset * 0.045);
                // Sides in front: higher z-index
                zIndex = Math.floor(absOffset * 100); 
                
                if (absOffset > 12) {
                    opacity = 1 - (absOffset - 12); 
                } else {
                    opacity = 1;
                }
            }

            // Circular rotation: rotate towards the center
            const rotateY = offset * -20;

            card.style.transform = `
                translate3d(calc(-50% + ${xPos}vw), -50%, ${zPos}px) 
                scale(${scale}) 
                rotateY(${rotateY}deg)
            `;
            
            card.style.opacity = Math.max(0, opacity);
            card.style.zIndex = zIndex;
            
            // Brightness logic
            const brightVal = 0.7 + (absOffset * 0.05); 
            card.style.filter = `brightness(${Math.min(1, brightVal)})`;
        });

        requestAnimationFrame(animate);
    }

    animate();
}
