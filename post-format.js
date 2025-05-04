// script.js (बिना DOMContentLoaded, <script defer src="script.js"></script> के साथ प्रयोग करें)

// --- सामान्य स्क्रिप्ट्स (Smooth Scroll, Nav Update, TTS, Pagination) ---

// --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
const smoothScrollLinks = document.querySelectorAll(".akc-custom-a[href^='#'], .akc-story-nav a[href^='#']");
const navElement = document.querySelector('.akc-story-nav');
const navHeight = navElement ? navElement.offsetHeight : 50;

smoothScrollLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#") && href.length > 1) {
            try {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    event.preventDefault();
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: offsetTop - navHeight - 15, behavior: 'smooth' });
                    if (link.closest('.akc-story-nav')) {
                        document.querySelectorAll('.akc-story-nav a').forEach(nav => nav.classList.remove('akc-active'));
                        link.classList.add('akc-active');
                    }
                } else {
                    console.warn(`Smooth scroll target element with ID ${href} not found.`);
                }
            } catch (e) {
                console.error(`Invalid selector for smooth scroll: ${href}`, e);
            }
        }
    });
});

const sections = document.querySelectorAll('.akc-custom-div[id^="part"]');
const navLinks = document.querySelectorAll('.akc-story-nav a[href^="#part"]');

const updateActiveLinkBasedOnScroll = () => {
    if (sections.length === 0 || navLinks.length === 0) return;
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        // getBoundingClientRect अधिक सटीक है, लेकिन pageYOffset जोड़ना आवश्यक है
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.pageYOffset - navHeight - 50; // Adjust threshold
        const sectionBottom = sectionTop + rect.height;

        // Check if the section is sufficiently visible
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom - (windowHeight * 0.4) ) {
            currentSectionId = section.getAttribute('id');
        }
    });

     // Handle edge cases (top/bottom of page)
     if (!currentSectionId && sections.length > 0) {
        const firstSectionTop = sections[0].getBoundingClientRect().top + window.pageYOffset - navHeight - 50;
        const lastSection = sections[sections.length - 1];
        // Check if scroll is above the first section
        if (scrollPosition < firstSectionTop) {
            currentSectionId = sections[0].getAttribute('id');
        }
        // Check if scroll is near the bottom
        // Use scrollHeight for total document height
        else if ((windowHeight + scrollPosition) >= document.documentElement.scrollHeight - 150) {
            currentSectionId = lastSection.getAttribute('id');
        }
     }

    // Update nav links
    navLinks.forEach(link => {
        if (link.hash && link.hash === `#${currentSectionId}`) {
            link.classList.add('akc-active');
        } else {
            link.classList.remove('akc-active');
        }
    });
};

// Debounce/Throttle scroll event handler (optional but recommended for performance)
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLinkBasedOnScroll, 50); // 50ms debounce
});

// Initial check on load
updateActiveLinkBasedOnScroll();

// Activate link and scroll based on hash on page load
const currentHash = window.location.hash;
if (currentHash && currentHash.startsWith("#part")) {
    try {
        const targetElementOnLoad = document.querySelector(currentHash);
        const activeLinkOnLoad = document.querySelector(`.akc-story-nav a[href$="${currentHash}"]`);

        if (activeLinkOnLoad) {
           document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active'));
           activeLinkOnLoad.classList.add('akc-active');
        }

        // Scroll after a short delay to allow layout stabilization
        if (targetElementOnLoad) {
            setTimeout(() => {
               const offsetTopOnLoad = targetElementOnLoad.getBoundingClientRect().top + window.pageYOffset;
               window.scrollTo({ top: offsetTopOnLoad - navHeight - 15, behavior: 'auto' });
               // Update active link again after scroll
               updateActiveLinkBasedOnScroll();
            }, 150);
        }
    } catch(e) {
       console.error(`Invalid selector for initial scroll: ${currentHash}`, e);
    }
 } else {
     // If no hash, activate the first link if at the top of the page
     if ((window.pageYOffset || document.documentElement.scrollTop) < 150 && sections.length > 0) {
        const defaultActiveLink = document.querySelector('.akc-story-nav a[href$="#part1"]');
        if(defaultActiveLink) {
           document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active'));
           defaultActiveLink.classList.add('akc-active');
        }
     }
 }
// --- स्मूथ स्क्रॉल समाप्त ---


// --- स्वचालित पेजिनेशन और भाग नेविगेशन ---
function setupPaginationAndNav() {
    const paginationContainer = document.querySelector('.akc-pagination-section');
    if (!paginationContainer) {
        console.warn("Pagination container (.akc-pagination-section) not found.");
        return;
    }

    const totalPages = 6; // <<<< कुल भागों की संख्या यहाँ अपडेट करें
    const baseFilename = 'aranyani-kaushik-part'; // <<<< फ़ाइल नाम का आधार
    const indexFilename = 'index.html'; // <<<< पहले भाग का फ़ाइल नाम
    const fileExtension = '.html';

    let currentPageNumber = 1;
    // Use location.pathname for reliability
    const currentPath = window.location.pathname;
    const currentFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // Determine current page number
    if (currentFilename === indexFilename || currentFilename === '') {
         currentPageNumber = 1;
    } else {
        const filenameMatch = currentFilename.match(/part(\d+)\.html$/i);
        if (filenameMatch && filenameMatch[1]) {
             const parsedNum = parseInt(filenameMatch[1], 10);
             if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= totalPages) {
                 currentPageNumber = parsedNum;
             } else {
                 console.warn("Pagination: Page number from URL filename is invalid or out of range. Defaulting to 1.");
                 currentPageNumber = 1;
             }
        } else {
             console.warn("Pagination: Could not determine page number from filename:", currentFilename, ". Defaulting to 1.");
             currentPageNumber = 1;
        }
    }
    // console.log("Current Page Number:", currentPageNumber);


    // Generate pagination links
    paginationContainer.innerHTML = ''; // Clear previous links
    const maxVisibleLinks = 5;
    let startPage, endPage;

    if (totalPages <= maxVisibleLinks) {
        startPage = 1; endPage = totalPages;
    } else {
        const maxBefore = Math.floor((maxVisibleLinks - 1) / 2);
        const maxAfter = Math.ceil((maxVisibleLinks - 1) / 2);
        if (currentPageNumber <= maxBefore + 1) {
            startPage = 1; endPage = maxVisibleLinks;
        } else if (currentPageNumber + maxAfter >= totalPages) {
            startPage = totalPages - maxVisibleLinks + 1; endPage = totalPages;
        } else {
            startPage = currentPageNumber - maxBefore; endPage = currentPageNumber + maxAfter;
        }
    }

    // First page and ellipsis (...)
    if (startPage > 1) {
         const firstLink = document.createElement('a');
         firstLink.href = indexFilename; // First page is always index.html
         firstLink.textContent = '1';
         firstLink.classList.add('akc-pagination-link');
         paginationContainer.appendChild(firstLink);
         if (startPage > 2) {
             const ellipsisStart = document.createElement('span');
             ellipsisStart.textContent = '...';
             ellipsisStart.classList.add('akc-pagination-label');
             paginationContainer.appendChild(ellipsisStart);
         }
    }

    // Middle page numbers
    for (let i = startPage; i <= endPage; i++) {
         if (i === currentPageNumber) {
             const currentSpan = document.createElement('span');
             currentSpan.textContent = i;
             currentSpan.classList.add('akc-pagination-link', 'akc-current');
             paginationContainer.appendChild(currentSpan);
         } else {
             const link = document.createElement('a');
             link.href = (i === 1) ? indexFilename : `${baseFilename}${i}${fileExtension}`;
             link.textContent = i;
             link.classList.add('akc-pagination-link');
             paginationContainer.appendChild(link);
         }
    }

    // Last page and ellipsis (...)
    if (endPage < totalPages) {
         if (endPage < totalPages - 1) {
             const ellipsisEnd = document.createElement('span');
             ellipsisEnd.textContent = '...';
             ellipsisEnd.classList.add('akc-pagination-label');
             paginationContainer.appendChild(ellipsisEnd);
         }
         const lastLink = document.createElement('a');
         lastLink.href = `${baseFilename}${totalPages}${fileExtension}`;
         lastLink.textContent = totalPages;
         lastLink.classList.add('akc-pagination-link');
         paginationContainer.appendChild(lastLink);
    }

    // --- Update Part Navigation Buttons ---
    document.querySelectorAll('.akc-part-navigation').forEach(navContainer => {
        const prevBtn = navContainer.querySelector('.akc-prev-part-link');
        const nextBtn = navContainer.querySelector('.akc-next-part-link');
        const homeBtn = navContainer.querySelector('.akc-home-link');

        if (homeBtn) homeBtn.href = indexFilename;

        if (prevBtn) {
            if (currentPageNumber > 1) {
                prevBtn.href = (currentPageNumber === 2) ? indexFilename : `${baseFilename}${currentPageNumber - 1}${fileExtension}`;
                prevBtn.classList.remove('akc-disabled');
            } else {
                prevBtn.href = '#';
                prevBtn.classList.add('akc-disabled');
            }
        }

        if (nextBtn) {
            if (currentPageNumber < totalPages) {
                nextBtn.href = `${baseFilename}${currentPageNumber + 1}${fileExtension}`;
                nextBtn.classList.remove('akc-disabled', 'akc-hidden-on-last');
            } else {
                nextBtn.href = '#';
                nextBtn.classList.add('akc-disabled', 'akc-hidden-on-last');
            }
        }
    });
}
setupPaginationAndNav();
// --- पेजिनेशन समाप्त ---


// --- TTS कार्यक्षमता ---
let currentSpeechUtterance = null;
let speechQueue = [];
let isSpeakingQueue = false;
const readAllButton = document.getElementById('akc-read-full-post-button');
const synth = window.speechSynthesis;

// Check for Speech Synthesis support *before* adding listeners
if (!synth) {
    console.warn("Speech Synthesis not supported by this browser.");
    if (readAllButton) {
        readAllButton.style.display = 'none'; // Hide button if not supported
    }
} else {
    // --- TTS Functions (only if supported) ---
    function speakText(text, lang = "hi-IN", associatedButton = null, addToQueue = false) {
        if (!text || text.trim() === '') return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.volume = 1;
        utterance.rate = 0.95;
        utterance.pitch = 1;

        if (associatedButton && associatedButton.id === 'akc-read-full-post-button') {
            utterance.buttonElement = associatedButton;
        }

        utterance.onstart = () => {
            console.log("TTS Start:", text.substring(0, 40) + "...");
            currentSpeechUtterance = utterance;
            if (utterance.buttonElement) {
                utterance.buttonElement.classList.add('akc-tts-speaking');
                utterance.buttonElement.innerHTML = '<i class="fas fa-stop-circle"></i> रोका जा रहा है...';
            }
        };

        utterance.onend = () => {
            // console.log("TTS End:", text.substring(0, 40) + "..."); // थोड़ा कम वर्बोज़
            currentSpeechUtterance = null;

            if (isSpeakingQueue) {
                speechQueue.shift();
                if (speechQueue.length > 0) {
                    synth.speak(speechQueue[0]);
                } else {
                    isSpeakingQueue = false;
                    if (utterance.buttonElement) {
                        utterance.buttonElement.classList.remove('akc-tts-speaking');
                        utterance.buttonElement.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
                    }
                }
            } else {
                 if (utterance.buttonElement) {
                    utterance.buttonElement.classList.remove('akc-tts-speaking');
                    utterance.buttonElement.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
                 }
            }
        };

        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event);
            synth.cancel();
            speechQueue = [];
            isSpeakingQueue = false;
            currentSpeechUtterance = null;
            if (utterance.buttonElement) {
                utterance.buttonElement.classList.remove('akc-tts-speaking');
                utterance.buttonElement.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
            }
        };

        if (addToQueue) {
            speechQueue.push(utterance);
            if (!isSpeakingQueue && !synth.speaking) {
                isSpeakingQueue = true;
                synth.speak(speechQueue[0]);
            }
        } else {
            if (synth.speaking) {
                synth.cancel();
            }
            speechQueue = [];
            isSpeakingQueue = false;
            // Use a minimal timeout to ensure cancel completes before speaking again
            setTimeout(() => {
                // Check if it wasn't cancelled again immediately after timeout started
                if (!synth.speaking && speechQueue.length === 0) {
                   synth.speak(utterance);
                }
            }, 50);
        }
    }

    // --- Event Listeners (only if supported) ---
    if (readAllButton) {
        readAllButton.addEventListener('click', (event) => {
            event.preventDefault();

            if (synth.speaking) {
                synth.cancel();
                speechQueue = [];
                isSpeakingQueue = false;
                // Manually reset button state as onend might not fire reliably on cancel
                readAllButton.classList.remove('akc-tts-speaking');
                readAllButton.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
            } else {
                const contentDiv = document.querySelector('.akc-custom-div[id^="part"]');
                if (!contentDiv) return;

                speechQueue = [];
                const elementsToRead = contentDiv.querySelectorAll('h2.akc-custom-h2, h3.akc-custom-h3, p.akc-custom-p');

                elementsToRead.forEach((el) => {
                    let clonedNode = el.cloneNode(true);
                    clonedNode.querySelectorAll(".akc-special-term, .akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(span => span.remove());
                    let text = (clonedNode.textContent || clonedNode.innerText || "").trim().replace(/\s+/g, ' ');
                    if (text) {
                        text = text.replace(/[\.。]+/g, '. '); // Normalize sentence endings
                        speakText(text, "hi-IN", readAllButton, true);
                    }
                });

                if (speechQueue.length > 0 && !isSpeakingQueue && !synth.speaking) {
                     isSpeakingQueue = true;
                     synth.speak(speechQueue[0]);
                } else if (speechQueue.length === 0) {
                    console.warn("TTS: No text extracted for the full post.");
                }
            }
        });
    }

    document.querySelectorAll(".akc-special-term, .akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(term => {
        term.addEventListener("click", (event) => {
            event.stopPropagation();
            const textToSpeak = term.textContent.trim();
            speakText(textToSpeak, "hi-IN", null, false);
        });
        term.title = "सुनने के लिए क्लिक करें";
    });

    document.querySelectorAll("p.akc-custom-p").forEach(paragraph => {
        paragraph.style.cursor = 'pointer';
        paragraph.title = "पैराग्राफ सुनने के लिए क्लिक करें";
        paragraph.addEventListener("click", () => {
            let clonedNode = paragraph.cloneNode(true);
            clonedNode.querySelectorAll(".akc-special-term, .akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(span => span.remove());
            let textToSpeak = (clonedNode.textContent || clonedNode.innerText || "").trim().replace(/\s+/g, ' ');
            speakText(textToSpeak, "hi-IN", null, false);
        });
    });

    // Stop TTS when leaving the page
    window.addEventListener('beforeunload', () => {
        if (synth && synth.speaking) {
            synth.cancel();
        }
    });
} // End of Speech Synthesis support check
// --- TTS समाप्त ---


/* ===== START: Screen Focus Cosmos Widget JS (v1.4 - Prefix: sfcw-) ===== */
const sfcwYearSpan = document.getElementById('sfcw-current-year');
if (sfcwYearSpan) {
    sfcwYearSpan.textContent = " " + new Date().getFullYear();
} else {
    console.warn("sfcw-current-year element not found!");
}

const sfcwCanvas = document.getElementById('sfcw-particle-canvas');
if (!sfcwCanvas) {
    console.error("SFCW Particle canvas element (#sfcw-particle-canvas) not found!");
} else {
    const sfcwCtx = sfcwCanvas.getContext('2d');
    if (!sfcwCtx) {
         console.error("Could not get 2D context for SFCW canvas.");
    } else {

        let sfcwParticles = [];
        let sfcwAnimationFrameId = null;

        function sfcwResizeCanvas() {
            if (!sfcwCanvas || !sfcwCtx) return;
            // Use devicePixelRatio for sharper rendering on high-res displays
            const dpr = window.devicePixelRatio || 1;
            sfcwCanvas.width = sfcwCanvas.offsetWidth * dpr;
            sfcwCanvas.height = sfcwCanvas.offsetHeight * dpr;
            sfcwCtx.scale(dpr, dpr); // Scale context to match
        }

        class SFCW_Particle {
             constructor(x, y) {
                if (!sfcwCanvas) return;
                const width = sfcwCanvas.offsetWidth; // Use offsetWidth for initial position
                const height = sfcwCanvas.offsetHeight;
                this.x = x || Math.random() * width;
                this.y = y || Math.random() * height;
                this.size = Math.random() * 1.8 + 0.8; // Slightly smaller size
                this.speedX = (Math.random() * 1 - 0.5) * 0.3; // Slower speed
                this.speedY = (Math.random() * 1 - 0.5) * 0.3;
                const rootStyle = getComputedStyle(document.documentElement);
                const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)';
                const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)';
                this.color = Math.random() > 0.15 ? starColor : particleColor; // More stars
                this.opacity = Math.random() * 0.5 + 0.15; // Lower opacity range
                this.initialOpacity = this.opacity;
                this.life = Math.random() * 3 + 1.5; // Longer life
                this.initialLife = this.life;
            }


            update(deltaTime) {
                if (!sfcwCanvas || deltaTime <= 0) return;
                const width = sfcwCanvas.offsetWidth;
                const height = sfcwCanvas.offsetHeight;

                this.x += this.speedX * deltaTime * 30;
                this.y += this.speedY * deltaTime * 30;
                this.life -= deltaTime;

                if (this.life <= 0) {
                    this.opacity -= 0.01; // Fade out
                    if(this.opacity <= 0) {
                       this.reset();
                    }
                } else {
                    // Twinkle effect based on life remaining
                     this.opacity = this.initialOpacity * (0.5 + Math.abs(Math.sin( (this.initialLife - this.life) * Math.PI * 1.5 / this.initialLife )) * 0.5);
                }

                // Wrap around edges instead of bouncing
                if (this.x < -this.size) this.x = width + this.size;
                if (this.x > width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = height + this.size;
                if (this.y > height + this.size) this.y = -this.size;
            }

            reset() {
                if (!sfcwCanvas) return;
                const width = sfcwCanvas.offsetWidth;
                const height = sfcwCanvas.offsetHeight;
                // Reset position slightly off-screen for smoother wrapping
                const side = Math.floor(Math.random() * 4);
                if (side === 0) { // Top
                    this.x = Math.random() * width;
                    this.y = -this.size;
                } else if (side === 1) { // Right
                    this.x = width + this.size;
                    this.y = Math.random() * height;
                } else if (side === 2) { // Bottom
                    this.x = Math.random() * width;
                    this.y = height + this.size;
                } else { // Left
                    this.x = -this.size;
                    this.y = Math.random() * height;
                }

                this.opacity = this.initialOpacity;
                this.life = this.initialLife;
                this.speedX = (Math.random() * 1 - 0.5) * 0.3;
                this.speedY = (Math.random() * 1 - 0.5) * 0.3;
            }

            draw() {
                if (!sfcwCtx || this.opacity <= 0) return;
                sfcwCtx.save();
                sfcwCtx.globalAlpha = this.opacity;
                sfcwCtx.fillStyle = this.color;
                sfcwCtx.beginPath();
                sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                sfcwCtx.fill();
                sfcwCtx.restore();
            }
        }

        function sfcwInitParticles() {
            sfcwParticles = [];
            if (!sfcwCanvas || sfcwCanvas.offsetWidth === 0 || sfcwCanvas.offsetHeight === 0) return;
            const width = sfcwCanvas.offsetWidth;
            const height = sfcwCanvas.offsetHeight;
            let numberOfParticles = Math.floor(width * height / 10000); // Adjusted density
            numberOfParticles = Math.max(70, Math.min(numberOfParticles, 250)); // Adjusted limits
            // console.log("Initializing SFCW particles:", numberOfParticles);
            for (let i = 0; i < numberOfParticles; i++) {
                sfcwParticles.push(new SFCW_Particle());
            }
        }

        let sfcwLastTime = 0;
        function sfcwAnimateParticles(timestamp) {
            if (!sfcwCtx || !sfcwCanvas) {
                if (sfcwAnimationFrameId) cancelAnimationFrame(sfcwAnimationFrameId);
                return;
            }
            if (document.hidden) {
                sfcwLastTime = timestamp;
                sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
                return;
            }

            const deltaTime = (timestamp - sfcwLastTime) / 1000 || 0;
            sfcwLastTime = timestamp;

            // Clear canvas (considering devicePixelRatio scaling)
            sfcwCtx.clearRect(0, 0, sfcwCanvas.width, sfcwCanvas.height);

            sfcwParticles.forEach(p => {
                if (deltaTime > 0 && deltaTime < 0.2) {
                    p.update(deltaTime);
                } else if (deltaTime >= 0.2) {
                    p.reset(); // Reset if tab was inactive for too long
                }
                p.draw();
            });

            sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
        }

        function sfcwStartAnimation() {
            if (!sfcwCanvas || !sfcwCtx) return;
            // console.log("Starting SFCW animation...");
            sfcwResizeCanvas(); // Resize first
            sfcwInitParticles(); // Then initialize based on size
            if (sfcwAnimationFrameId) {
                cancelAnimationFrame(sfcwAnimationFrameId);
            }
            sfcwLastTime = performance.now();
            sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
        }

        // Start after a short delay
        const sfcwStartDelay = setTimeout(sfcwStartAnimation, 200);

        // Resize handler with throttling
        let sfcwResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(sfcwResizeTimeout);
            sfcwResizeTimeout = setTimeout(() => {
                // console.log("Resizing detected, restarting SFCW animation...");
                sfcwStartAnimation(); // Restart animation on resize
            }, 300);
        });

        // Cleanup before unload
        window.addEventListener('beforeunload', () => {
            if (sfcwAnimationFrameId) {
                cancelAnimationFrame(sfcwAnimationFrameId);
            }
            clearTimeout(sfcwStartDelay);
            clearTimeout(sfcwResizeTimeout);
            // Stop any ongoing speech
            if (synth && synth.speaking) {
                 synth.cancel();
            }
        });

    } // End of context check
} // End of canvas check
/* ===== END: Screen Focus Cosmos Widget JS ===== */

// <<< यहां कोई और टॉप-लेवल कोड न जोड़ें जब तक आवश्यक न हो >>>
