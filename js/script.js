document.addEventListener('DOMContentLoaded', () => {
    // 1. Confetti Animation
    // Fires festive confetti when the website loads
    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        
        // Shoot confetti from two different origins
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);

    // 2. Slow Smooth Scrolling
    // Makes the buttons smoothly and slowly scroll down to their sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const startPosition = window.scrollY;
                const distance = targetPosition - startPosition;
                const duration = 1500; // 1.5 seconds for a beautifully slow scroll
                let start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    
                    // easeInOutCubic easing function for super smooth start and end
                    const ease = progress < duration / 2 
                        ? 4 * Math.pow(progress / duration, 3) 
                        : 1 - Math.pow(-2 * progress / duration + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * ease);
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        window.scrollTo(0, targetPosition);
                    }
                }
                window.requestAnimationFrame(step);
            }
        });
    });

    // 3. Music Player Logic
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicText = musicBtn.querySelector('.music-text');
    let isPlaying = false;

    function playMusic() {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicText.textContent = 'Pause Music';
                musicBtn.classList.add('playing');
            }).catch(error => {
                console.log("Browser blocked autoplay. Waiting for user interaction.");
            });
        }
    }

    // Attempt to play as soon as possible
    playMusic();

    // If browser blocks autoplay, start music on the very first click anywhere on the page
    document.body.addEventListener('click', function firstInteraction() {
        playMusic();
        document.body.removeEventListener('click', firstInteraction);
    }, { once: true });

    // The button still acts as a manual toggle
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering the body click event
        if (isPlaying) {
            bgMusic.pause();
            musicText.textContent = 'Play Music';
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(error => console.log(error));
            musicText.textContent = 'Pause Music';
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
});
