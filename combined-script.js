// circle-menu.js
(function() {
    'use strict';
// सुनिश्चित करें कि DOM पूरी तरह से लोड हो गया है
document.addEventListener('DOMContentLoaded', function() {

    // सुनिश्चित करें कि JS कोड यूनिक आईडी के अंदर के एलिमेंट को टारगेट करे
    const menuWidget = document.getElementById('my-unique-circle-menu');

    // यदि विजेट मौजूद है, तभी आगे बढ़ें
    if (menuWidget) {
        // मेन्यू टॉगल बटन और मेन्यू एलिमेंट्स प्राप्त करें (विजेट के अंदर से)
        const menuToggle = menuWidget.querySelector('.menu-toggle');
        const categoriesMenu = menuWidget.querySelector('.menu-categories');
        const linksMenu = menuWidget.querySelector('.menu-links');
        // सुनिश्चित करें कि ये एलिमेंट मौजूद हैं, अन्यथा त्रुटि आ सकती है
        const linksTitle = linksMenu ? linksMenu.querySelector('.links-title') : null;
        const categoryTitleElement = categoriesMenu ? categoriesMenu.querySelector('.category-title') : null;

        // सभी कैटेगरी एलिमेंट्स प्राप्त करें (विजेट के अंदर से)
        const categories = menuWidget.querySelectorAll('.category');

        // सभी लिंक्स कंटेंट एलिमेंट्स प्राप्त करें (विजेट के अंदर से)
        const linksContent = menuWidget.querySelectorAll('.links-content .links');

        // आइकन मैपिंग (यह वही रहेगा)
        const categoryIcons = {
            'class-1-5': '<i class="fas fa-book-reader"></i>', 'class-6-8': '<i class="fas fa-graduation-cap"></i>',
            'class-9-10': '<i class="fas fa-school"></i>', 'class-11-12': '<i class="fas fa-university"></i>',
            'competitive-exam': '<i class="fas fa-trophy"></i>', 'news-channel': '<i class="fas fa-newspaper"></i>',
            'yoga-ayurveda': '<i class="fas fa-heart"></i>', 'marriage-links': '<i class="fas fa-ring"></i>',
            'editorial-links': '<i class="fas fa-edit"></i>', 'government-links': '<i class="fas fa-flag"></i>',
            'astrology-links': '<i class="fas fa-star"></i>', 'vaidik-links': '<i class="fas fa-om"></i>'
        };

        // Gradient classes (यह वही रहेगा)
        const gradientClasses = [
            'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6',
            'gradient-7', 'gradient-8', 'gradient-9', 'gradient-10', 'gradient-11', 'gradient-12'
        ];

        // Function to remove all gradient classes (यह वही रहेगा)
        function removeGradientClasses(element) {
             if (element) { // Check if element exists
                 gradientClasses.forEach(cls => element.classList.remove(cls));
             }
         }

        // --- इवेंट लिस्टनर्स ---

        // मेन्यू टॉगल बटन पर क्लिक इवेंट जोड़ें
        if (menuToggle && categoriesMenu && linksMenu && categoryTitleElement) {
            menuToggle.addEventListener('click', (event) => {
                event.stopPropagation();
                const isActive = categoriesMenu.classList.contains('active');

                if (isActive) {
                    categoriesMenu.classList.remove('active');
                    linksMenu.classList.remove('show');
                    categoryTitleElement.style.display = 'none';
                } else {
                    linksMenu.classList.remove('show');
                    categoriesMenu.classList.add('active');
                    categoryTitleElement.style.display = 'block';
                    removeGradientClasses(categoryTitleElement);
                    const randomGradientIndex = Math.floor(Math.random() * gradientClasses.length);
                    categoryTitleElement.classList.add(gradientClasses[randomGradientIndex]);
                    categoryTitleElement.innerHTML = '<i class="fas fa-hand-point-down"></i> अपनी पसंद पर क्लिक करें';
                }
            });
        }

         // हर कैटेगरी के लिए क्लिक इवेंट जोड़ें
         if (categories.length > 0 && linksMenu && linksTitle && categoriesMenu && categoryTitleElement) {
             categories.forEach((category, index) => {
                 category.addEventListener('click', (event) => {
                     event.stopPropagation();

                     const categoryData = category.getAttribute('data-category');
                     const titleText = category.getAttribute('data-title');
                     const iconHtml = categoryIcons[categoryData] || '<i class="fas fa-link"></i>';

                     // सभी लिंक्स सेक्शन छिपाएं
                     linksContent.forEach(linkBox => {
                         linkBox.style.display = 'none';
                     });

                     // सही लिंक्स सेक्शन दिखाएं (विजेट के अंदर से)
                     const targetLinks = linksMenu.querySelector(`.links-content .${categoryData}`);
                     if (targetLinks) {
                         targetLinks.style.display = 'block';
                     } // वार्निंग हटा दी गई, अगर नहीं मिलता है तो कुछ नहीं होगा

                     // लिंक्स टाइटल अपडेट करें
                     linksTitle.innerHTML = `${iconHtml} ${titleText}`;

                     // लिंक्स टाइटल पर स्पेसिफिक ग्रेडिएंट बॉर्डर लागू करें
                     removeGradientClasses(linksTitle);
                     linksTitle.classList.add(gradientClasses[index % gradientClasses.length]);

                     // मेन्यू छिपाएं और दिखाएं
                     categoriesMenu.classList.remove('active');
                     linksMenu.classList.add('show');
                     categoryTitleElement.style.display = 'none';
                 });
             });
         }

        // डॉक्यूमेंट पर कहीं और क्लिक होने पर मेन्यू छिपाने के लिए इवेंट जोड़ें
        document.addEventListener('click', (event) => {
            // Ensure elements exist before checking contains
            if (menuToggle && categoriesMenu && linksMenu && categoryTitleElement) {
                 if (
                    !menuToggle.contains(event.target) &&
                    !categoriesMenu.contains(event.target) &&
                    !linksMenu.contains(event.target)
                 ) {
                    categoriesMenu.classList.remove('active');
                    linksMenu.classList.remove('show');
                    categoryTitleElement.style.display = 'none';
                 }
            }
        });

    } // End if (menuWidget)
}); // End DOMContentLoaded listener
 })();
// ====== Widget 1 Scripts (Prefix: w1-) ======
(function() {
    'use strict'; // वैकल्पिक लेकिन अच्छा अभ्यास
document.addEventListener("DOMContentLoaded", function() {

    // --- सामान्य स्क्रिप्ट्स (Smooth Scroll, Nav Update, TTS, Pagination) ---

    // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
    const smoothScrollLinks = document.querySelectorAll(".akc-custom-a[href^='#'], .akc-story-nav a[href^='#']"); // Prefixed
    const navHeight = document.querySelector('.akc-story-nav') ? document.querySelector('.akc-story-nav').offsetHeight : 50; // Prefixed
    smoothScrollLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#") && href.length > 1) {
                 const targetElement = document.querySelector(href); // ID selector remains same
                 if (targetElement) {
                    event.preventDefault();
                    const offsetTop = targetElement.offsetTop;
                    window.scrollTo({ top: offsetTop - navHeight - 15, behavior: 'smooth' });
                    if (link.closest('.akc-story-nav')) { // Prefixed
                         document.querySelectorAll('.akc-story-nav a').forEach(nav => nav.classList.remove('akc-active')); // Prefixed state
                         link.classList.add('akc-active'); // Prefixed state
                    }
                } else { console.warn(`Element with ID ${href} not found.`); }
            }
        });
    });
     const sections = document.querySelectorAll('.akc-custom-div[id^="part"]'); // Prefixed
     const navLinks = document.querySelectorAll('.akc-story-nav a[href^="#part"]'); // Prefixed
     const updateActiveLinkBasedOnScroll = () => {
         if (sections.length === 0 || navLinks.length === 0) return;
         let current = '';
         const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
         const windowHeight = window.innerHeight;
         sections.forEach(section => {
             const sectionTop = section.offsetTop - navHeight - 50;
             // const sectionBottom = sectionTop + section.offsetHeight; // Not needed for this logic
             if (scrollPosition >= sectionTop && scrollPosition < sectionTop + (section.offsetHeight * 0.8) ) { current = section.getAttribute('id'); }
         });
          if (!current && sections.length > 0) {
             if (scrollPosition < (sections[0].offsetTop - navHeight - 50)) { current = sections[0].getAttribute('id'); }
             else if ((windowHeight + scrollPosition) >= document.body.offsetHeight - 100) { current = sections[sections.length - 1].getAttribute('id'); }
          }
         navLinks.forEach(link => {
             link.classList.remove('akc-active'); // Prefixed state
             if (link.hash === `#${current}`) { link.classList.add('akc-active'); } // Prefixed state
         });
     };
     updateActiveLinkBasedOnScroll();
     window.addEventListener('scroll', updateActiveLinkBasedOnScroll);
     const hash = window.location.hash;
     if (hash && hash.startsWith("#part")) {
         const activeLink = document.querySelector(`.akc-story-nav a[href$="${hash}"]`); // Prefixed
         if (activeLink) { document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active')); activeLink.classList.add('akc-active'); } // Prefixed state
         setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'auto' }); }
         }, 100);
      } else {
          if ((window.pageYOffset || document.documentElement.scrollTop) < 100 && sections.length > 0) {
             const defaultActiveLink = document.querySelector('.akc-story-nav a[href$="#part1"]'); // Prefixed
             if(defaultActiveLink) { document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active')); defaultActiveLink.classList.add('akc-active'); } // Prefixed state
          }
      }
    // --- स्मूथ स्क्रॉल समाप्त ---

    // --- स्वचालित पेजिनेशन और भाग नेविगेशन ---
    function setupPaginationAndNav() {
        const paginationContainer = document.querySelector('.akc-pagination-section'); // Prefixed
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
        if (startPage > 1) { const firstLink = document.createElement('a'); firstLink.href = `${baseFilename}1${fileExtension}`; firstLink.textContent = '1'; firstLink.classList.add('akc-pagination-link'); paginationContainer.appendChild(firstLink); if (startPage > 2) { const ellipsisStart = document.createElement('span'); ellipsisStart.textContent = '...'; ellipsisStart.classList.add('akc-pagination-label'); paginationContainer.appendChild(ellipsisStart); } } // Prefixed class
        for (let i = startPage; i <= endPage; i++) { if (i === currentPageNumber) { const currentSpan = document.createElement('span'); currentSpan.textContent = i; currentSpan.classList.add('akc-pagination-link', 'akc-current'); paginationContainer.appendChild(currentSpan); } else { const link = document.createElement('a'); link.href = `${baseFilename}${i}${fileExtension}`; link.textContent = i; link.classList.add('akc-pagination-link'); paginationContainer.appendChild(link); } } // Prefixed classes
        if (endPage < totalPages) { if (endPage < totalPages - 1) { const ellipsisEnd = document.createElement('span'); ellipsisEnd.textContent = '...'; ellipsisEnd.classList.add('akc-pagination-label'); paginationContainer.appendChild(ellipsisEnd); } const lastLink = document.createElement('a'); lastLink.href = `${baseFilename}${totalPages}${fileExtension}`; lastLink.textContent = totalPages; lastLink.classList.add('akc-pagination-link'); paginationContainer.appendChild(lastLink); } // Prefixed class
        const prevPartLinks = document.querySelectorAll('.akc-part-navigation .akc-prev-part-link'); // Prefixed
        const nextPartLinks = document.querySelectorAll('.akc-part-navigation .akc-next-part-link'); // Prefixed
        prevPartLinks.forEach(btn => { if(btn) { if (currentPageNumber > 1) { btn.href = `${baseFilename}${currentPageNumber - 1}${fileExtension}`; btn.classList.remove('akc-disabled'); } else { btn.href = '#'; btn.classList.add('akc-disabled'); } } }); // Prefixed state
        nextPartLinks.forEach(btn => { if(btn) { if (currentPageNumber < totalPages) { btn.href = `${baseFilename}${currentPageNumber + 1}${fileExtension}`; btn.classList.remove('akc-disabled', 'akc-hidden-on-last'); } else { btn.href = '#'; btn.classList.add('akc-disabled', 'akc-hidden-on-last'); } } }); // Prefixed states
    }
    setupPaginationAndNav();
    // --- पेजिनेशन समाप्त ---

    // --- TTS कार्यक्षमता ---
    let currentSpeech = null;
    function speakText(text, lang = "hi-IN") {
        if ('speechSynthesis' in window) { if (currentSpeech && window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); if (currentSpeech.text === text) { currentSpeech = null; return; } } const speech = new SpeechSynthesisUtterance(text); speech.lang = lang; speech.volume = 1; speech.rate = 0.9; speech.pitch = 1; currentSpeech = speech; speech.onend = () => { currentSpeech = null; }; window.speechSynthesis.speak(speech); } else { console.warn("Speech synthesis not supported."); alert("क्षमा करें, टेक्स्ट-टू-स्पीच समर्थित नहीं है।"); }
    }
    document.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(term => { term.addEventListener("click", (event) => { event.stopPropagation(); speakText(term.textContent, "hi-IN"); }); term.title = "सुनने के लिए क्लिक करें"; }); // Prefixed
    document.querySelectorAll("p").forEach(paragraph => {
        // TTS केवल कहानी पैराग्राफ के लिए
        if (paragraph.classList.contains('akc-custom-p')) { // Prefixed
             paragraph.style.cursor = 'pointer'; paragraph.title = "पैराग्राफ सुनने के लिए क्लिक करें";
             paragraph.addEventListener("click", () => {
                let clonedNode = paragraph.cloneNode(true);
                clonedNode.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(span => span.remove()); // Prefixed
                let textToSpeak = (clonedNode.textContent || clonedNode.innerText || "").trim().replace(/\s+/g, ' ');
                speakText(textToSpeak, "hi-IN");
             });
             paragraph.addEventListener("mouseenter", () => { paragraph.style.backgroundColor = "#fffacd"; });
             paragraph.addEventListener("mouseleave", () => { paragraph.style.backgroundColor = ""; });
        } else if (paragraph.closest('.akc-story-description') || paragraph.closest('.akc-tv-ad-explanation') || paragraph.closest('.akc-video-caption-below')) { // Prefixed containers check
             // विवरण, विज्ञापन, कैप्शन के लिए डिफ़ॉल्ट कर्सर
             paragraph.style.cursor = 'default'; paragraph.title = "";
        }
        // अन्य <p> टैग्स को अनदेखा किया जाएगा
     });
    window.addEventListener('beforeunload', () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); } });
    // --- TTS समाप्त ---

    /* ===== START: Screen Focus Cosmos Widget JS (v1.4 - Prefix: sfcw-) ===== */
    // (यह JS ब्लॉक अपरिवर्तित रहेगा, क्योंकि यह विशिष्ट विजेट का हिस्सा है)
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
            update(deltaTime) { if (!sfcwCanvas) return; this.x += this.speedX * deltaTime * 30; this.y += this.speedY * deltaTime * 30; this.life -= deltaTime; if (this.life <= 0) { this.opacity -= deltaTime * 2; if (this.opacity <= 0) { this.opacity = 0; if (this.life <= -0.5) { this.reset(); } } } else { this.opacity = this.initialOpacity * (0.6 + Math.abs(Math.sin( (this.initialLife - this.life) * Math.PI / this.initialLife ) * 0.4)); } if (this.x <= 0 || this.x >= sfcwCanvas.width) { this.speedX *= -0.95; this.x = Math.max(1, Math.min(this.x, sfcwCanvas.width - 1)); } if (this.y <= 0 || this.y >= sfcwCanvas.height) { this.speedY *= -0.95; this.y = Math.max(1, Math.min(this.y, sfcwCanvas.height - 1)); } }
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
 })();
// ====== Widget 1 Scripts (tocv1) ======
(function() {
    'use strict';
  document.addEventListener("DOMContentLoaded", function () {
  // --- Configuration ---
  const config = {
    postContainerSelector: ".post-body", // *** महत्वपूर्ण: इसे अपनी थीम के अनुसार बदलें ***
    headingsSelector: "h2, h3",
    minHeadingsForToc: 2,
    tocTitleText: "Table of Contents", // <<<--- अपना पसंदीदा अंग्रेजी शीर्षक डालें
    showButtonBaseText: "Explore Topics", // <<<--- केवल बेस टेक्स्ट डालें
    hideButtonBaseText: "Hide Contents", // <<<--- केवल बेस टेक्स्ट डालें
    showIconClass: "fa-solid fa-chevron-down", // <<<--- दिखाने के लिए आइकन क्लास (v6)
    hideIconClass: "fa-solid fa-chevron-up",   // <<<--- छिपाने के लिए आइकन क्लास (v6)
    highlightDuration: 3000,
    useIcons: true, // TOC लिंक्स के लिए आइकन
    h2IconClass: "fa-solid fa-book-reader", // <<<--- अपना H2 आइकन डालें (v6)
    h3IconClass: "fa-regular fa-circle",   // <<<--- अपना H3 आइकन डालें (v6)
  };
  // --- End Configuration ---

  let currentHighlightTimeout = null;
  let tocContainer = null;
  let toc = null;
  let toggleButton = null;

  function createSafeId(heading, index) {
    let textForId = (heading.textContent || '').trim().toLowerCase();
    let baseId = textForId.replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');
    let id = "toc-h-" + (baseId || index);
    let counter = 1; const originalId = id;
    while (document.getElementById(id)) { id = originalId + '-' + counter; counter++; }
    return id;
  }

  function clearHighlights(specificHeading = null, specificContent = []) {
    if (currentHighlightTimeout) { clearTimeout(currentHighlightTimeout); currentHighlightTimeout = null; }
    if (specificHeading) { specificHeading.classList.remove('highlight-target'); }
    if (specificContent.length > 0) { specificContent.forEach(el => el.classList.remove('highlight-content')); }
    else if (!specificHeading && !specificContent.length) {
      document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
      document.querySelectorAll('.highlight-content').forEach(el => el.classList.remove('highlight-content'));
    }
  }

  function applyHighlight(targetHeading) {
    clearHighlights();
    targetHeading.classList.add('highlight-target');
    const highlightedContent = [];
    let sibling = targetHeading.nextElementSibling;
    while (sibling && !sibling.matches(config.headingsSelector) && !sibling.matches('#toc-container')) {
      if (sibling.nodeType === 1) { sibling.classList.add('highlight-content'); highlightedContent.push(sibling); }
      sibling = sibling.nextElementSibling;
    }
    currentHighlightTimeout = setTimeout(() => { clearHighlights(targetHeading, highlightedContent); }, config.highlightDuration);
  }

  function smoothScrollToTarget(element) {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const offset = window.innerHeight * 0.28;
    const targetScrollPosition = absoluteElementTop - offset;
    window.scrollTo({ top: targetScrollPosition });
  }

  function controlButtonGlow(buttonElement, shouldGlow) {
      if (!buttonElement) return;
      if (shouldGlow) {
          setTimeout(() => {
              if (!toc?.classList.contains('toc-visible')) {
                   buttonElement.classList.add('toc-closed-effect');
              }
          }, 700);
      } else {
          buttonElement.classList.remove('toc-closed-effect');
      }
  }

  /**
   * बटन का टेक्स्ट और आइकन अपडेट करता है।
   * @param {boolean} isExpanded - क्या TOC खुला हुआ है?
   */
  function updateButtonContent(isExpanded) {
      if (!toggleButton) return;
      const text = isExpanded ? config.hideButtonBaseText : config.showButtonBaseText;
      const iconClass = isExpanded ? config.hideIconClass : config.showIconClass;
      // innerHTML का उपयोग करके टेक्स्ट और आइकन दोनों सेट करें
      toggleButton.innerHTML = `${text} <i class="${iconClass}" aria-hidden="true" style="margin-left: 8px;"></i>`;
      toggleButton.setAttribute('aria-expanded', String(isExpanded));
  }


  function initializeToc() {
    const postContent = document.querySelector(config.postContainerSelector);
    if (!postContent) { console.warn("TOC: Container '" + config.postContainerSelector + "' not found."); return; }

    const headings = Array.from(postContent.querySelectorAll(config.headingsSelector));
    const validHeadings = [];
    let firstValidHeading = null;

    headings.forEach(heading => {
      if (!heading.closest('#toc-container') && heading.textContent.trim()) {
        validHeadings.push(heading);
        if (!firstValidHeading) firstValidHeading = heading;
      }
    });

    if (validHeadings.length < config.minHeadingsForToc) return;

    tocContainer = document.createElement("div"); tocContainer.id = "toc-container";
    toggleButton = document.createElement("button"); toggleButton.id = "toc-toggle-button";
    // प्रारंभिक बटन टेक्स्ट और आइकन सेट करें
    updateButtonContent(false); // शुरुआत में बंद (false)
    toggleButton.setAttribute("aria-controls", "toc");
    controlButtonGlow(toggleButton, true);

    toc = document.createElement("div"); toc.id = "toc";
    const tocTitle = document.createElement("h2");
    tocTitle.textContent = config.tocTitleText;
    toc.appendChild(tocTitle);
    const tocList = document.createElement("ul");

    validHeadings.forEach((heading, index) => {
      let id = heading.getAttribute("id");
      if (!id) { id = createSafeId(heading, index); heading.setAttribute("id", id); }
      const listItem = document.createElement("li");
      const headingLevel = heading.tagName.toLowerCase();
      listItem.classList.add('toc-level-' + headingLevel.replace('h',''));
      const link = document.createElement("a"); link.setAttribute("href", "#" + id);

      let iconClass = "";
      if (config.useIcons) {
        if (headingLevel === 'h2' && config.h2IconClass) iconClass = config.h2IconClass;
        else if (headingLevel === 'h3' && config.h3IconClass) iconClass = config.h3IconClass;
        if (iconClass) {
          const iconElement = document.createElement("i");
          iconClass.split(' ').forEach(cls => { if (cls) iconElement.classList.add(cls); });
          iconElement.setAttribute("aria-hidden", "true");
          link.appendChild(iconElement);
        }
      }
      link.appendChild(document.createTextNode((heading.textContent || '').trim()));
      listItem.appendChild(link); tocList.appendChild(listItem);
    });

    toc.appendChild(tocList); tocContainer.appendChild(toggleButton); tocContainer.appendChild(toc);

    if (firstValidHeading?.parentNode) { firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading); }
    else if (postContent.firstChild) { postContent.insertBefore(tocContainer, postContent.firstChild); }
    else { postContent.appendChild(tocContainer); }

    setupEventListeners();
  }

  function setupEventListeners() {
    if (!tocContainer || !toc || !toggleButton) return;

    toggleButton.addEventListener('click', () => {
      const isExpanded = toc.classList.toggle('toc-visible');
      // बटन टेक्स्ट और आइकन अपडेट करें
      updateButtonContent(isExpanded);
      tocContainer.classList.toggle('toc-is-shown', isExpanded);
      controlButtonGlow(toggleButton, !isExpanded); // ग्लो नियंत्रित करें
    });

    toc.addEventListener('click', (event) => {
      const linkElement = event.target.closest('a');
      if (linkElement && linkElement.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        const targetId = linkElement.getAttribute('href').substring(1);
        const targetHeading = document.getElementById(targetId);
        if (targetHeading) {
           if (!toc.classList.contains('toc-visible')) {
               // बटन क्लिक को सिमुलेट करने से पहले स्थिति जांचें
               const isCurrentlyExpanded = toc.classList.contains('toc-visible');
               updateButtonContent(!isCurrentlyExpanded); // मैन्युअली स्थिति अपडेट करें
               toc.classList.add('toc-visible'); // मैन्युअली खोलें
               tocContainer.classList.add('toc-is-shown');
               controlButtonGlow(toggleButton, false); // ग्लो बंद करें
           }
           smoothScrollToTarget(targetHeading);
           setTimeout(() => { applyHighlight(targetHeading); }, 500);
        } else { console.warn("TOC: Target '" + targetId + "' not found."); }
      }
    });
  }

  try { initializeToc(); }
  catch (error) { console.error("TOC Script Error:", error); }
});
