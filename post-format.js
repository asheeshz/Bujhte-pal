document.addEventListener("DOMContentLoaded", function() {

    // --- सामान्य स्क्रिप्ट्स (Smooth Scroll, Nav Update, TTS, Pagination) ---

    // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
    const smoothScrollLinks = document.querySelectorAll(".akc-custom-a[href^='#'], .akc-story-nav a[href^='#']");
    const navHeight = document.querySelector('.akc-story-nav') ? document.querySelector('.akc-story-nav').offsetHeight : 50;
    smoothScrollLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#") && href.length > 1) {
                 const targetElement = document.querySelector(href);
                 if (targetElement) {
                    event.preventDefault();
                    const offsetTop = targetElement.offsetTop;
                    window.scrollTo({ top: offsetTop - navHeight - 15, behavior: 'smooth' });
                    if (link.closest('.akc-story-nav')) {
                         document.querySelectorAll('.akc-story-nav a').forEach(nav => nav.classList.remove('akc-active'));
                         link.classList.add('akc-active');
                    }
                } else { console.warn(`Element with ID ${href} not found.`); }
            }
        });
    });
     const sections = document.querySelectorAll('.akc-custom-div[id^="part"]');
     const navLinks = document.querySelectorAll('.akc-story-nav a[href^="#part"]');
     const updateActiveLinkBasedOnScroll = () => {
         if (sections.length === 0 || navLinks.length === 0) return;
         let current = '';
         const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
         const windowHeight = window.innerHeight;
         sections.forEach(section => {
             const sectionTop = section.offsetTop - navHeight - 50;
             // सुनिश्चित करें कि वर्तमान सेक्शन को ठीक से पहचाना जाए
             const sectionBottom = sectionTop + section.offsetHeight;
             if (scrollPosition >= sectionTop && scrollPosition < sectionBottom - (windowHeight * 0.3) ) { // सेक्शन का ऊपरी 70% दिखने पर एक्टिव करें
                 current = section.getAttribute('id');
             }
         });
          // यदि कोई सेक्शन सक्रिय नहीं है, तो पहले या अंतिम को संभालें
          if (!current && sections.length > 0) {
             if (scrollPosition < (sections[0].offsetTop - navHeight - 50)) { current = sections[0].getAttribute('id'); }
             else if ((windowHeight + scrollPosition) >= document.body.offsetHeight - 100) { current = sections[sections.length - 1].getAttribute('id'); }
             // यदि स्क्रॉल मध्य में है और कोई सेक्शन नहीं मिला, तो निकटतम को चुनें (वैकल्पिक, अधिक जटिल)
          }
         navLinks.forEach(link => {
             link.classList.remove('akc-active');
             if (link.hash === `#${current}`) { link.classList.add('akc-active'); }
         });
     };
     updateActiveLinkBasedOnScroll(); // Initial check
     window.addEventListener('scroll', updateActiveLinkBasedOnScroll);
     const hash = window.location.hash;
     if (hash && hash.startsWith("#part")) {
         const activeLink = document.querySelector(`.akc-story-nav a[href$="${hash}"]`);
         if (activeLink) { document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active')); activeLink.classList.add('akc-active'); }
         setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'auto' }); }
         }, 100);
      } else {
          if ((window.pageYOffset || document.documentElement.scrollTop) < 100 && sections.length > 0) {
             const defaultActiveLink = document.querySelector('.akc-story-nav a[href$="#part1"]');
             if(defaultActiveLink) { document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active')); defaultActiveLink.classList.add('akc-active'); }
          }
      }
    // --- स्मूथ स्क्रॉल समाप्त ---

    // --- स्वचालित पेजिनेशन और भाग नेविगेशन ---
    function setupPaginationAndNav() {
        const paginationContainer = document.querySelector('.akc-pagination-section');
        if (!paginationContainer) { console.warn("Pagination container not found."); return; }
        const totalPages = 6; const baseFilename = 'aranyani-kaushik-part'; const fileExtension = '.html';
        let currentPageNumber = 1; const currentPath = window.location.pathname;
        const filenameMatch = currentPath.match(/part(\d+)\.html$/i);
        if (filenameMatch && filenameMatch[1]) {
             const parsedNum = parseInt(filenameMatch[1], 10);
             if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= totalPages) { currentPageNumber = parsedNum; }
             else { console.warn("Pagination: Page number from URL filename invalid/out of range."); }
        } else { console.warn("Pagination: Could not find page number in filename:", currentPath, ". Assuming page 1."); }
        paginationContainer.innerHTML = ''; const maxVisibleLinks = 5; let startPage, endPage;
        if (totalPages <= maxVisibleLinks) { startPage = 1; endPage = totalPages; }
        else {
            const maxBefore = Math.floor((maxVisibleLinks - 1) / 2); const maxAfter = Math.ceil((maxVisibleLinks - 1) / 2);
            if (currentPageNumber <= maxBefore) { startPage = 1; endPage = maxVisibleLinks; }
            else if (currentPageNumber + maxAfter >= totalPages) { startPage = totalPages - maxVisibleLinks + 1; endPage = totalPages; }
            else { startPage = currentPageNumber - maxBefore; endPage = currentPageNumber + maxAfter; }
        }
        if (startPage > 1) { const firstLink = document.createElement('a'); firstLink.href = `${baseFilename}1${fileExtension}`; firstLink.textContent = '1'; firstLink.classList.add('akc-pagination-link'); paginationContainer.appendChild(firstLink); if (startPage > 2) { const ellipsisStart = document.createElement('span'); ellipsisStart.textContent = '...'; ellipsisStart.classList.add('akc-pagination-label'); paginationContainer.appendChild(ellipsisStart); } }
        for (let i = startPage; i <= endPage; i++) { if (i === currentPageNumber) { const currentSpan = document.createElement('span'); currentSpan.textContent = i; currentSpan.classList.add('akc-pagination-link', 'akc-current'); paginationContainer.appendChild(currentSpan); } else { const link = document.createElement('a'); link.href = `${baseFilename}${i}${fileExtension}`; link.textContent = i; link.classList.add('akc-pagination-link'); paginationContainer.appendChild(link); } }
        if (endPage < totalPages) { if (endPage < totalPages - 1) { const ellipsisEnd = document.createElement('span'); ellipsisEnd.textContent = '...'; ellipsisEnd.classList.add('akc-pagination-label'); paginationContainer.appendChild(ellipsisEnd); } const lastLink = document.createElement('a'); lastLink.href = `${baseFilename}${totalPages}${fileExtension}`; lastLink.textContent = totalPages; lastLink.classList.add('akc-pagination-link'); paginationContainer.appendChild(lastLink); }
        const prevPartLinks = document.querySelectorAll('.akc-part-navigation .akc-prev-part-link');
        const nextPartLinks = document.querySelectorAll('.akc-part-navigation .akc-next-part-link');
        prevPartLinks.forEach(btn => { if(btn) { if (currentPageNumber > 1) { btn.href = `${baseFilename}${currentPageNumber - 1}${fileExtension}`; btn.classList.remove('akc-disabled'); } else { btn.href = '#'; btn.classList.add('akc-disabled'); } } });
        nextPartLinks.forEach(btn => { if(btn) { if (currentPageNumber < totalPages) { btn.href = `${baseFilename}${currentPageNumber + 1}${fileExtension}`; btn.classList.remove('akc-disabled', 'akc-hidden-on-last'); } else { btn.href = '#'; btn.classList.add('akc-disabled', 'akc-hidden-on-last'); } } });
    }
    setupPaginationAndNav();
    // --- पेजिनेशन समाप्त ---

    // --- TTS कार्यक्षमता ---
    let currentSpeech = null;
    function speakText(text, lang = "hi-IN", buttonElement = null) { // Added buttonElement parameter
        if ('speechSynthesis' in window) {
            const readAllBtn = document.getElementById('akc-read-full-post-button');

            // यदि कुछ बोला जा रहा है, तो उसे रोकें
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                 // Reset the 'Read All' button if it was speaking
                 if(readAllBtn && readAllBtn.classList.contains('akc-tts-speaking')) {
                     readAllBtn.classList.remove('akc-tts-speaking');
                     readAllBtn.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
                 }
                // यदि वही टेक्स्ट दोबारा क्लिक किया गया है, तो बस रुकें
                if (currentSpeech && currentSpeech.text === text) {
                     currentSpeech = null;
                     return;
                }
            }

            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = lang;
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1;
            currentSpeech = speech;
             // Store reference to the button if it's the 'Read All' button
             if(buttonElement && buttonElement.id === 'akc-read-full-post-button') {
                 currentSpeech.buttonElement = buttonElement;
                 buttonElement.dataset.fullText = text; // Store text on the button itself
             }

            speech.onend = () => {
                 // Reset button only if it was the 'Read All' button
                 if(currentSpeech && currentSpeech.buttonElement) {
                     currentSpeech.buttonElement.classList.remove('akc-tts-speaking');
                     currentSpeech.buttonElement.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
                 }
                 currentSpeech = null;
            };
            speech.onerror = (event) => {
                console.error("Speech synthesis error:", event);
                 // Reset button only if it was the 'Read All' button
                 if(currentSpeech && currentSpeech.buttonElement) {
                     currentSpeech.buttonElement.classList.remove('akc-tts-speaking');
                     currentSpeech.buttonElement.innerHTML = '<i class="fas fa-volume-up"></i> संपूर्ण भाग सुनें';
                 }
                 currentSpeech = null;
            };

            window.speechSynthesis.speak(speech);

             // Change button appearance only if it's the 'Read All' button
             if(buttonElement && buttonElement.id === 'akc-read-full-post-button') {
                 buttonElement.classList.add('akc-tts-speaking');
                 buttonElement.innerHTML = '<i class="fas fa-stop-circle"></i> रोका जा रहा है...';
             }

        } else {
            console.warn("Speech synthesis not supported.");
            alert("क्षमा करें, टेक्स्ट-टू-स्पीच समर्थित नहीं है।");
        }
    }

    // विशेष शब्दों पर TTS
    document.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(term => {
        term.addEventListener("click", (event) => {
            event.stopPropagation();
            speakText(term.textContent, "hi-IN");
        });
        term.title = "सुनने के लिए क्लिक करें";
    });

    // पैराग्राफ पर TTS
    document.querySelectorAll("p.akc-custom-p").forEach(paragraph => {
        paragraph.style.cursor = 'pointer';
        paragraph.title = "पैराग्राफ सुनने के लिए क्लिक करें";
        paragraph.addEventListener("click", () => {
            let clonedNode = paragraph.cloneNode(true);
            clonedNode.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(span => span.remove());
            let textToSpeak = (clonedNode.textContent || clonedNode.innerText || "").trim().replace(/\s+/g, ' ');
            speakText(textToSpeak, "hi-IN"); // Pass null for buttonElement
        });
    });

    // संपूर्ण भाग सुनें बटन के लिए TTS
    const readAllButton = document.getElementById('akc-read-full-post-button');
    if (readAllButton) {
        readAllButton.addEventListener('click', (event) => {
            event.preventDefault();

            // यदि वर्तमान में यही टेक्स्ट बोला जा रहा है, तो उसे रोकें (speakText function handles this)
             // Check if the same button click is intended to stop speech
             if (window.speechSynthesis.speaking && currentSpeech && currentSpeech.buttonElement === readAllButton) {
                 speakText(readAllButton.dataset?.fullText || '', "hi-IN", readAllButton); // Call speakText to handle cancellation
                 return;
             }

            const contentDiv = document.getElementById('part1');
            if (contentDiv) {
                let fullText = "";
                const elementsToRead = contentDiv.querySelectorAll('h2.akc-custom-h2, h3.akc-custom-h3, p.akc-custom-p');

                elementsToRead.forEach((el) => {
                    let clonedNode = el.cloneNode(true);
                    clonedNode.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(span => span.remove());
                    let text = (clonedNode.textContent || clonedNode.innerText || "").trim().replace(/\s+/g, ' ');
                    if (text) {
                         fullText += text + ". ";
                    }
                    if(el.tagName === 'H2' || el.tagName === 'H3') {
                        fullText += ". "; // Extra pause
                    }
                });

                if (fullText) {
                    speakText(fullText, "hi-IN", readAllButton); // Pass the button element
                } else {
                    console.warn("Could not extract text to read for the full post.");
                }
            }
        });
    }


    // पेज छोड़ने पर TTS रोकें
    window.addEventListener('beforeunload', () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    });
    // --- TTS समाप्त ---

    /* ===== START: Screen Focus Cosmos Widget JS (v1.4 - Prefix: sfcw-) ===== */
    const sfcwYearSpan = document.getElementById('sfcw-current-year');
    if (sfcwYearSpan) { sfcwYearSpan.textContent = " " + new Date().getFullYear(); }
    else { console.warn("sfcw-current-year element not found!")}
    const sfcwCanvas = document.getElementById('sfcw-particle-canvas');
    if (!sfcwCanvas) { console.error("SFCW Particle canvas element (#sfcw-particle-canvas) not found!"); }
    else {
        const sfcwCtx = sfcwCanvas.getContext('2d');
        let sfcwParticles = []; let sfcwAnimationFrameId = null;
        function sfcwResizeCanvas() { if (!sfcwCanvas || !sfcwCtx) return; sfcwCanvas.width = sfcwCanvas.offsetWidth; sfcwCanvas.height = sfcwCanvas.offsetHeight; }
        class SFCW_Particle {
            constructor(x, y) { if (!sfcwCanvas) return; this.x = x || Math.random() * sfcwCanvas.width; this.y = y || Math.random() * sfcwCanvas.height; this.size = Math.random() * 2.5 + 1; this.speedX = (Math.random() * 1 - 0.5) * 0.5; this.speedY = (Math.random() * 1 - 0.5) * 0.5; const rootStyle = getComputedStyle(document.documentElement); const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)'; const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)'; this.color = Math.random() > 0.1 ? starColor : particleColor; this.opacity = Math.random() * 0.6 + 0.2; this.initialOpacity = this.opacity; this.life = Math.random() * 2 + 1; this.initialLife = this.life; }
            update(deltaTime) { if (!sfcwCanvas) return; this.x += this.speedX * deltaTime * 30; this.y += this.speedY * deltaTime * 30; this.life -= deltaTime; if (this.life <= 0) { this.opacity = 0; if (this.life <= -0.5) { this.reset(); } } else { this.opacity = this.initialOpacity * (0.6 + Math.abs(Math.sin( (this.initialLife - this.life) * Math.PI / this.initialLife ) * 0.4)); } if (this.x <= 0 || this.x >= sfcwCanvas.width) { this.speedX *= -0.95; this.x = Math.max(1, Math.min(this.x, sfcwCanvas.width - 1)); } if (this.y <= 0 || this.y >= sfcwCanvas.height) { this.speedY *= -0.95; this.y = Math.max(1, Math.min(this.y, sfcwCanvas.height - 1)); } }
            reset() { if (!sfcwCanvas) return; this.x = Math.random() * sfcwCanvas.width; this.y = Math.random() * sfcwCanvas.height; this.opacity = this.initialOpacity; this.life = this.initialLife; this.speedX = (Math.random() * 1 - 0.5) * 0.5; this.speedY = (Math.random() * 1 - 0.5) * 0.5; }
            draw() { if (!sfcwCtx || this.opacity <= 0) return; sfcwCtx.globalAlpha = this.opacity; sfcwCtx.fillStyle = this.color; sfcwCtx.beginPath(); sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); sfcwCtx.fill(); }
        }
        function sfcwInitParticles() { sfcwParticles = []; if (!sfcwCanvas || sfcwCanvas.width === 0 || sfcwCanvas.height === 0) return; let numberOfParticles = Math.floor(sfcwCanvas.width * sfcwCanvas.height / 15000); numberOfParticles = Math.max(50, Math.min(numberOfParticles, 150)); for (let i = 0; i < numberOfParticles; i++) { sfcwParticles.push(new SFCW_Particle()); } }
        let sfcwLastTime = 0;
        function sfcwAnimateParticles(timestamp) { if (!sfcwCtx || !sfcwCanvas) { cancelAnimationFrame(sfcwAnimationFrameId); return; } if (document.hidden) { sfcwLastTime = timestamp; sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); return; } const deltaTime = (timestamp - sfcwLastTime) / 1000; sfcwLastTime = timestamp; sfcwCtx.clearRect(0, 0, sfcwCanvas.width, sfcwCanvas.height); sfcwParticles.forEach(p => { if (deltaTime > 0 && deltaTime < 0.1) { p.update(deltaTime); } else if (deltaTime >= 0.1) { p.reset(); } p.draw(); }); sfcwCtx.globalAlpha = 1.0; sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); }
        function sfcwStartAnimation() { if (!sfcwCanvas || !sfcwCtx) return; sfcwResizeCanvas(); sfcwInitParticles(); if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); } sfcwLastTime = performance.now(); sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); }
        const sfcwStartDelay = setTimeout(sfcwStartAnimation, 150); let sfcwResizeTimeout;
        window.addEventListener('resize', () => { clearTimeout(sfcwResizeTimeout); sfcwResizeTimeout = setTimeout(() => { if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); sfcwAnimationFrameId = null; } console.log("Resizing detected, restarting animation..."); sfcwStartAnimation(); }, 500); });
        window.addEventListener('beforeunload', () => { if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); } clearTimeout(sfcwStartDelay); clearTimeout(sfcwResizeTimeout); });
    }
    /* ===== END: Screen Focus Cosmos Widget JS ===== */

}); // DOMContentLoaded समाप्त
