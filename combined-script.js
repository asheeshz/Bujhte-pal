<script>
//<![CDATA[

// ====== Code from script-post-templet.js ======
;(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {

    // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
    const navElement = document.querySelector('.kaalpath-story-nav');
    const navHeight = navElement ? navElement.offsetHeight : 50;
    const smoothScrollLinks = document.querySelectorAll(".kaalpath-custom-a[href^='#'], .kaalpath-story-nav a[href^='#']");

    if (smoothScrollLinks.length > 0) {
        smoothScrollLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");
                if (href && href.startsWith("#") && href.length > 1) {
                     const targetElement = document.querySelector(href);
                     if (targetElement) {
                        event.preventDefault();
                        const offsetTop = targetElement.offsetTop;
                        window.scrollTo({ top: offsetTop - navHeight - 15, behavior: 'smooth' });
                         try {
                             if (link.closest('.kaalpath-story-nav')) {
                                 document.querySelectorAll('.kaalpath-story-nav a.active').forEach(nav => nav.classList.remove('active'));
                                 link.classList.add('active');
                             } else { kaalpath_updateActiveLinkBasedOnScroll(); }
                         } catch(e) { console.error("Error updating active nav link:", e); }
                    } else { console.warn(`Element with ID ${href} not found.`); }
                }
            });
        });
    }

     const sections = document.querySelectorAll('.kaalpath-custom-div[id^="part"]');
     const navLinks = document.querySelectorAll('.kaalpath-story-nav a[href^="#part"]');

     function kaalpath_updateActiveLinkBasedOnScroll() {
         if (sections.length === 0 || navLinks.length === 0 || !navElement) return; // Added navElement check
         let current = '';
         const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
         sections.forEach(section => {
             const sectionTop = section.offsetTop - navHeight - 50;
             const sectionBottom = sectionTop + section.offsetHeight;
             if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) { current = section.getAttribute('id'); }
         });
          if (!current && sections.length > 0) {
             if (scrollPosition < (sections[0].offsetTop - navHeight - 50)) { current = sections[0].getAttribute('id'); }
             else if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 50) { current = sections[sections.length - 1].getAttribute('id'); }
          }
         navLinks.forEach(link => {
             link.classList.remove('active');
             const linkHrefHash = link.hash;
             if (linkHrefHash === `#${current}`) { link.classList.add('active'); }
         });
     };

     if (sections.length > 0 && navLinks.length > 0) { // Only run if elements exist
        kaalpath_updateActiveLinkBasedOnScroll();
        window.addEventListener('scroll', kaalpath_updateActiveLinkBasedOnScroll);

        const hash = window.location.hash;
        if (hash && hash.startsWith("#part")) {
            const activeLink = document.querySelector(`.kaalpath-story-nav a[href$="${hash}"]`);
            if (activeLink) {
                document.querySelectorAll('.kaalpath-story-nav a.active').forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'smooth' }); }
            }, 100);
        } else {
            const defaultActiveLink = document.querySelector('.kaalpath-story-nav a[href$="#part1"]');
            if (defaultActiveLink) {
                document.querySelectorAll('.kaalpath-story-nav a.active').forEach(link => link.classList.remove('active'));
                defaultActiveLink.classList.add('active');
            }
        }
     }
    // --- स्मूथ स्क्रॉल समाप्त ---

    // --- स्वचालित पेजिनेशन ---
    function kaalpath_setupPagination() {
        const paginationContainer = document.querySelector('.kaalpath-pagination-section');
        if (!paginationContainer) { /* console.warn("Pagination container not found."); */ return; } // Silent return

        const totalPages = 6; // <-- अपनी कहानी के कुल भागों की संख्या यहाँ सेट करें
        const baseFilename = 'aranyani-kaushik-part'; // <-- अपनी फ़ाइल नामकरण योजना यहाँ सेट करें
        const fileExtension = '.html'; // <-- अपनी फ़ाइल का एक्सटेंशन यहाँ सेट करें

        let currentPageNumber = 1;
        // ... (rest of pagination logic remains the same) ...
         try {
            const pathParts = window.location.pathname.split('/');
            const filename = pathParts.pop() || pathParts.pop() || '';
            const match = filename.match(/part(\d+)/i) || filename.match(/(\d+)(?:\.\w+)?$/);
            if (match && match[1]) {
                const parsedNum = parseInt(match[1], 10);
                if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= totalPages) { currentPageNumber = parsedNum; }
                 else { console.warn("Pagination: Page number from URL invalid/out of range."); }
            } else { console.warn("Pagination: Couldn't find page number in URL/filename: ", filename); }
        } catch (e) { console.error("Pagination: Error getting page number.", e); }
        if (isNaN(currentPageNumber) || currentPageNumber < 1 || currentPageNumber > totalPages) { currentPageNumber = 1; }

        paginationContainer.innerHTML = ''; // Clear existing

        // Previous links (condensed loop)
        for (let i = Math.max(1, currentPageNumber - 4); i < currentPageNumber; i++) {
           if (i >= 1) { // Ensure i doesn't go below 1
              const link = document.createElement('a');
              link.href = `${baseFilename}${i}${fileExtension}`;
              link.textContent = i; link.classList.add('kaalpath-pagination-link');
              paginationContainer.appendChild(link);
           }
        }

        // Current page span
        const currentSpan = document.createElement('span');
        currentSpan.textContent = currentPageNumber;
        currentSpan.classList.add('kaalpath-pagination-link', 'current');
        paginationContainer.appendChild(currentSpan);

        // Next links (simplified check)
        const nextLimit = Math.min(totalPages, currentPageNumber + 4);
        for (let i = currentPageNumber + 1; i <= nextLimit; i++) {
            const link = document.createElement('a');
            link.href = `${baseFilename}${i}${fileExtension}`;
            link.textContent = i; link.classList.add('kaalpath-pagination-link');
            paginationContainer.appendChild(link);
        }


         // Part navigation buttons update
         document.querySelectorAll('.kaalpath-part-navigation').forEach(nav => {
             const prevPartButton = nav.querySelector('.kaalpath-prev-part-link');
             const nextPartButton = nav.querySelector('.kaalpath-next-part-link');

             if (prevPartButton) {
                 if (currentPageNumber > 1) {
                     prevPartButton.href = `${baseFilename}${currentPageNumber - 1}${fileExtension}`;
                     prevPartButton.classList.remove('disabled');
                 } else { prevPartButton.href = '#'; prevPartButton.classList.add('disabled'); }
             }
             if (nextPartButton) {
                 if (currentPageNumber < totalPages) {
                     nextPartButton.href = `${baseFilename}${currentPageNumber + 1}${fileExtension}`;
                     nextPartButton.classList.remove('disabled', 'hidden-on-last');
                 } else {
                     nextPartButton.href = '#';
                     nextPartButton.classList.add('disabled', 'hidden-on-last');
                 }
             }
         });

    }
    try { // Add try-catch for safety
        kaalpath_setupPagination();
    } catch (e) {
        console.error("Error setting up pagination:", e);
    }
    // --- स्वचालित पेजिनेशन समाप्त ---

    // --- TTS कार्यक्षमता ---
    function kaalpath_speakText(text, lang = "hi-IN") {
        if ('speechSynthesis' in window && text) { // Added check for text
            try { // Added try-catch
                window.speechSynthesis.cancel();
                const speech = new SpeechSynthesisUtterance(text.trim()); // Trim text
                speech.lang = lang; speech.volume = 1; speech.rate = 0.9; speech.pitch = 1;
                window.speechSynthesis.speak(speech);
            } catch (e) {
                console.error("Speech synthesis error:", e);
            }
        } else if (!('speechSynthesis' in window)) {
             console.warn("Speech synthesis not supported.");
         }
    }

    const specialTermElements = document.querySelectorAll(".kaalpath-special-term-1, .kaalpath-special-term-2, .kaalpath-special-term-3");
    if (specialTermElements.length > 0) {
        specialTermElements.forEach(term => {
            term.addEventListener("click", (event) => {
                 event.stopPropagation();
                 kaalpath_speakText(term.textContent, "hi-IN");
            });
            term.title = "सुनने के लिए क्लिक करें";
        });
    }

    const paragraphElements = document.querySelectorAll(".kaalpath-custom-p");
    if (paragraphElements.length > 0) {
        paragraphElements.forEach(paragraph => {
            if (!paragraph.closest('.kaalpath-story-description') && !paragraph.closest('.kaalpath-tv-ad-explanation')) {
                paragraph.addEventListener("click", () => kaalpath_speakText(paragraph.textContent, "hi-IN"));
                paragraph.title = "पूरा पैराग्राफ सुनने के लिए क्लिक करें";
                paragraph.style.cursor = "pointer"; // Ensure cursor is pointer
                paragraph.addEventListener("mouseenter", () => { paragraph.style.color = "#C71585"; });
                paragraph.addEventListener("mouseout", () => { paragraph.style.color = ""; });
            } else {
                paragraph.style.cursor = "default";
                paragraph.title = ""; // Remove title if not clickable
            }
        });
    }

  }); // DOMContentLoaded समाप्त
})(); // IIFE
; // <-- सेमीकोलन महत्वपूर्ण है

// ====== Code from script-footer.js ======
;(function() {
  "use strict";

  document.addEventListener('DOMContentLoaded', function() {

    // --- कॉपीराइट वर्ष अपडेट करें ---
    const sfcwYearSpan = document.getElementById('sfcw-current-year');
    if (sfcwYearSpan) {
      try { // Add try-catch
          sfcwYearSpan.textContent = " " + new Date().getFullYear();
      } catch(e) {
          console.error("Error setting copyright year:", e);
      }
    }

    // --- कण कैनवास सेटअप ---
    const sfcwCanvas = document.getElementById('sfcw-particle-canvas');
     if (!sfcwCanvas) {
          // console.warn("SFCW Particle canvas not found!"); // Keep console quiet
          return; // Exit if canvas not found
     }

    try { // Wrap canvas logic in try-catch
        const sfcwCtx = sfcwCanvas.getContext('2d');
        let sfcwParticles = [];
        let sfcwAnimationFrameId = null;

        function sfcwResizeCanvas() {
            sfcwCanvas.width = sfcwCanvas.offsetWidth;
            sfcwCanvas.height = sfcwCanvas.offsetHeight;
        }

        class SFCW_Particle {
            constructor(x, y) {
                this.x = x || Math.random() * sfcwCanvas.width;
                this.y = y || Math.random() * sfcwCanvas.height;
                this.size = Math.random() * 2.5 + 1;
                this.speedX = (Math.random() * 1 - 0.5) * 0.5;
                this.speedY = (Math.random() * 1 - 0.5) * 0.5;
                const rootStyle = getComputedStyle(document.documentElement);
                const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)';
                const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)';
                this.color = Math.random() > 0.1 ? starColor : particleColor;
                this.opacity = Math.random() * 0.6 + 0.2;
                this.initialOpacity = this.opacity;
                this.life = Math.random() * 2 + 1;
                this.initialLife = this.life;
            }
            update(deltaTime) {
                this.x += this.speedX * deltaTime * 30;
                this.y += this.speedY * deltaTime * 30;
                this.life -= deltaTime;
                if (this.life <= 0) {
                     this.opacity = 0;
                     if (this.life <= -0.5) { this.reset(); }
                } else {
                     this.opacity = this.initialOpacity * (0.6 + Math.abs(Math.sin( (this.initialLife - this.life) * Math.PI / this.initialLife ) * 0.4));
                }
                if (this.x <= 0 || this.x >= sfcwCanvas.width) {
                    this.speedX *= -1; this.x = Math.max(1, Math.min(this.x, sfcwCanvas.width - 1));
                }
                if (this.y <= 0 || this.y >= sfcwCanvas.height) {
                    this.speedY *= -1; this.y = Math.max(1, Math.min(this.y, sfcwCanvas.height - 1));
                }
            }
            reset() {
                this.x = Math.random() * sfcwCanvas.width; this.y = Math.random() * sfcwCanvas.height;
                this.opacity = this.initialOpacity; this.life = this.initialLife;
                this.speedX = (Math.random() * 1 - 0.5) * 0.5; this.speedY = (Math.random() * 1 - 0.5) * 0.5;
            }
            draw() {
                if (this.opacity <= 0 || isNaN(this.x) || isNaN(this.y)) return; // Add NaN check
                sfcwCtx.globalAlpha = this.opacity; sfcwCtx.fillStyle = this.color;
                sfcwCtx.beginPath(); sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); sfcwCtx.fill();
            }
        }

        function sfcwInitParticles() {
            sfcwParticles = [];
            if (sfcwCanvas.width <= 0 || sfcwCanvas.height <= 0) return; // Don't init if no size
            let numberOfParticles = Math.floor(sfcwCanvas.width * sfcwCanvas.height / 15000);
            numberOfParticles = Math.max(50, Math.min(numberOfParticles, 150));
            for (let i = 0; i < numberOfParticles; i++) { sfcwParticles.push(new SFCW_Particle()); }
        }

        let sfcwLastTime = 0;
        function sfcwAnimateParticles(timestamp) {
             if (document.hidden) {
                 sfcwLastTime = timestamp;
                 sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
                 return;
             }
            const deltaTime = (timestamp - sfcwLastTime) / 1000;
            sfcwLastTime = timestamp;

            sfcwCtx.clearRect(0, 0, sfcwCanvas.width, sfcwCanvas.height);
            sfcwParticles.forEach(p => {
                 if (deltaTime > 0 && deltaTime < 0.1) { p.update(deltaTime); }
                 else if (deltaTime >= 0.1) { p.reset(); }
                 p.draw();
            });
            sfcwCtx.globalAlpha = 1.0;
            sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
        }

        function sfcwStartAnimation() {
            sfcwResizeCanvas();
            sfcwInitParticles();
            if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); }
            sfcwLastTime = performance.now();
            sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
        }

        const sfcwStartDelay = setTimeout(sfcwStartAnimation, 100);
        let sfcwResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(sfcwResizeTimeout);
            sfcwResizeTimeout = setTimeout(() => {
                 if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); }
                 sfcwStartAnimation();
            }, 500);
        });
        window.addEventListener('beforeunload', () => {
             if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); }
             clearTimeout(sfcwStartDelay); clearTimeout(sfcwResizeTimeout);
        });

    } catch (e) {
        console.error("Error initializing SFCW particle animation:", e);
    } // End try-catch for canvas logic

  }); // DOMContentLoaded समाप्त
})(); // IIFE
; // <-- सेमीकोलन महत्वपूर्ण है

// ====== Code from script1.js (TOC Script) ======
;(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const config = {
        postContainerSelector: ".post-body", // *** महत्वपूर्ण: इसे अपनी थीम के अनुसार बदलें ***
        headingsSelector: "h2:not(#toc h2), h3:not(#toc h3)", // TOC के अंदर के हेडिंग्स को अनदेखा करें
        minHeadingsForToc: 2,
        tocTitleText: "Table of Contents",
        showButtonBaseText: "Explore Topics",
        hideButtonBaseText: "Hide Contents",
        showIconClass: "fa-solid fa-chevron-down",
        hideIconClass: "fa-solid fa-chevron-up",
        highlightDuration: 3000,
        useIcons: true,
        h2IconClass: "fa-solid fa-book-reader",
        h3IconClass: "fa-regular fa-circle",
    };

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
        else { // Clear all if no specific elements passed
          document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
          document.querySelectorAll('.highlight-content').forEach(el => el.classList.remove('highlight-content'));
        }
    }

    function applyHighlight(targetHeading) {
        clearHighlights(); // Clear previous highlights first
        if (!targetHeading) return; // Exit if target is null
        targetHeading.classList.add('highlight-target');
        const highlightedContent = [];
        let sibling = targetHeading.nextElementSibling;
        while (sibling && !sibling.matches(config.headingsSelector) && !sibling.matches('#toc-container')) {
            if (sibling.nodeType === 1 && sibling.matches(':not(script):not(style)')) { // Avoid highlighting scripts/styles
                 sibling.classList.add('highlight-content');
                 highlightedContent.push(sibling);
            }
            sibling = sibling.nextElementSibling;
        }
        // Set timeout to clear *only* the newly applied highlights
        currentHighlightTimeout = setTimeout(() => {
             clearHighlights(targetHeading, highlightedContent);
        }, config.highlightDuration);
    }


    function smoothScrollToTarget(element) {
        if (!element) return; // Exit if element is null
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        let offset = 100; // Default offset
        // Try to get nav height dynamically if possible
        const navElement = document.querySelector('.kaalpath-story-nav') || document.querySelector('header') || document.querySelector('.navbar'); // Try common nav selectors
        if (navElement && window.getComputedStyle(navElement).position === 'fixed') {
            offset = navElement.offsetHeight + 20; // Add some padding
        } else {
             offset = window.innerHeight * 0.15; // Fallback offset based on viewport
        }
        const targetScrollPosition = absoluteElementTop - offset;

        // Use scrollIntoView for better cross-browser compatibility if possible
        if (element.scrollIntoView) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
             // Adjust slightly after scroll if needed (less reliable)
             // setTimeout(() => { window.scrollBy(0, -offset); }, 500);
        } else {
            window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
        }
    }

    function controlButtonGlow(buttonElement, shouldGlow) {
        if (!buttonElement) return;
        if (shouldGlow) {
            setTimeout(() => {
                if (toc && !toc.classList.contains('toc-visible')) { // Check toc exists
                   buttonElement.classList.add('toc-closed-effect');
                }
            }, 700);
        } else {
            buttonElement.classList.remove('toc-closed-effect');
        }
    }

    function updateButtonContent(isExpanded) {
        if (!toggleButton) return;
        const text = isExpanded ? config.hideButtonBaseText : config.showButtonBaseText;
        const iconClass = isExpanded ? config.hideIconClass : config.showIconClass;
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
            // Ensure heading is directly within postContent, not inside another TOC or widget
            if (!heading.closest('#toc-container, #my-unique-circle-menu') && heading.textContent.trim() && window.getComputedStyle(heading).display !== 'none') {
                 validHeadings.push(heading);
                 if (!firstValidHeading) firstValidHeading = heading;
             }
        });

        if (validHeadings.length < config.minHeadingsForToc) {
           // console.log("TOC: Not enough headings found (" + validHeadings.length + "). Minimum required: " + config.minHeadingsForToc);
           return; // Don't create TOC if not enough headings
        }

        // Create TOC elements only if needed
        tocContainer = document.createElement("div"); tocContainer.id = "toc-container";
        toggleButton = document.createElement("button"); toggleButton.id = "toc-toggle-button";
        updateButtonContent(false);
        toggleButton.setAttribute("aria-controls", "toc");
        controlButtonGlow(toggleButton, true);

        toc = document.createElement("div"); toc.id = "toc";
        const tocTitle = document.createElement("h2");
        tocTitle.textContent = config.tocTitleText;
        toc.appendChild(tocTitle);
        const tocList = document.createElement("ul");

        validHeadings.forEach((heading, index) => {
            let id = heading.getAttribute("id");
            if (!id || document.querySelectorAll('#' + id.replace(/\\/g, "\\\\")).length > 1) { // Ensure unique ID
                 id = createSafeId(heading, index);
                 heading.setAttribute("id", id);
            }
            const listItem = document.createElement("li");
            const headingLevel = heading.tagName.toLowerCase();
            listItem.classList.add('toc-level-' + headingLevel.replace('h',''));
            const link = document.createElement("a"); link.setAttribute("href", "#" + id);

            if (config.useIcons) {
                let iconClass = "";
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

        // Insert TOC before the first valid heading found
        if (firstValidHeading && firstValidHeading.parentNode) {
             firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading);
        } else if (postContent.firstChild) {
            postContent.insertBefore(tocContainer, postContent.firstChild);
        } else {
            postContent.appendChild(tocContainer);
        }

        setupTocEventListeners(); // Rename setupEventListeners to avoid potential conflicts
    }

    function setupTocEventListeners() { // Renamed function
        if (!tocContainer || !toc || !toggleButton) return; // Check elements exist

        toggleButton.addEventListener('click', () => {
            const isExpanded = toc.classList.toggle('toc-visible');
            updateButtonContent(isExpanded);
            tocContainer.classList.toggle('toc-is-shown', isExpanded);
            controlButtonGlow(toggleButton, !isExpanded);
        });

        toc.addEventListener('click', (event) => {
            const linkElement = event.target.closest('a');
            if (linkElement && linkElement.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                const targetId = linkElement.getAttribute('href').substring(1);
                // Need to escape special characters for querySelector if ID contains them
                // However, getElementById doesn't need escaping
                const targetHeading = document.getElementById(targetId);

                if (targetHeading) {
                   // No need to manually toggle TOC visibility here, scroll should happen regardless
                   // If closed, the button state will be wrong, but scrolling still works.
                   // Let user open it manually if needed after scroll.
                   smoothScrollToTarget(targetHeading);
                   setTimeout(() => { applyHighlight(targetHeading); }, 300); // Shorter delay after scroll
                } else { console.warn("TOC: Target '" + targetId + "' not found."); }
            }
        });
    }

    try {
        initializeToc();
    } catch (error) {
        console.error("TOC Script Error:", error);
    }
  }); // DOMContentLoaded समाप्त
})(); // IIFE
; // <-- सेमीकोलन महत्वपूर्ण है

// ====== Code from script Circular Menu.js ======
;(function() {
  "use strict";

  document.addEventListener('DOMContentLoaded', function() {
    const menuWidget = document.getElementById('my-unique-circle-menu');
    if (!menuWidget) { return; } // Exit if menu container not found

    const menuToggle = menuWidget.querySelector('.menu-toggle');
    const categoriesMenu = menuWidget.querySelector('.menu-categories');
    const linksMenu = menuWidget.querySelector('.menu-links');

    // Check essential elements exist before proceeding
    if (!menuToggle || !categoriesMenu || !linksMenu) {
        console.warn("Circular Menu: Essential elements (toggle, categories, links) not found within #my-unique-circle-menu.");
        return;
    }

    const linksTitle = linksMenu.querySelector('.links-title');
    const categoryTitleElement = categoriesMenu.querySelector('.category-title');
    const categories = menuWidget.querySelectorAll('.category');
    const linksContent = menuWidget.querySelectorAll('.links-content .links');

    // Check optional elements needed for full functionality
    if (!linksTitle || !categoryTitleElement || categories.length === 0 || linksContent.length === 0) {
         console.warn("Circular Menu: Optional elements (linksTitle, categoryTitle, categories, linksContent) are missing. Functionality may be limited.");
         // Allow basic toggle to work even if content is missing
    }

    const categoryIcons = { /* ... icon mapping ... */
        'class-1-5': '<i class="fas fa-book-reader"></i>', 'class-6-8': '<i class="fas fa-graduation-cap"></i>',
        'class-9-10': '<i class="fas fa-school"></i>', 'class-11-12': '<i class="fas fa-university"></i>',
        'competitive-exam': '<i class="fas fa-trophy"></i>', 'news-channel': '<i class="fas fa-newspaper"></i>',
        'yoga-ayurveda': '<i class="fas fa-heart"></i>', 'marriage-links': '<i class="fas fa-ring"></i>',
        'editorial-links': '<i class="fas fa-edit"></i>', 'government-links': '<i class="fas fa-flag"></i>',
        'astrology-links': '<i class="fas fa-star"></i>', 'vaidik-links': '<i class="fas fa-om"></i>'
    };
    const gradientClasses = [ /* ... gradient classes ... */
        'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6',
        'gradient-7', 'gradient-8', 'gradient-9', 'gradient-10', 'gradient-11', 'gradient-12'
    ];

    function removeGradientClasses(element) {
         if (element) { gradientClasses.forEach(cls => element.classList.remove(cls)); }
     }

    // --- Event Listeners ---

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isActive = categoriesMenu.classList.contains('active');
        if (isActive) {
            categoriesMenu.classList.remove('active');
            linksMenu.classList.remove('show');
            if (categoryTitleElement) categoryTitleElement.style.display = 'none';
        } else {
             linksMenu.classList.remove('show'); // Close links menu first
             categoriesMenu.classList.add('active');
             if (categoryTitleElement) { // Check if title exists
                 categoryTitleElement.style.display = 'block';
                 removeGradientClasses(categoryTitleElement);
                 const randomGradientIndex = Math.floor(Math.random() * gradientClasses.length);
                 categoryTitleElement.classList.add(gradientClasses[randomGradientIndex]);
                 categoryTitleElement.innerHTML = '<i class="fas fa-hand-point-down"></i> अपनी पसंद पर क्लिक करें';
             }
        }
    });

     if (categories.length > 0 && linksTitle && categoryTitleElement) { // Ensure needed elements exist
         categories.forEach((category, index) => {
             category.addEventListener('click', (event) => {
                 event.stopPropagation();
                 const categoryData = category.getAttribute('data-category');
                 const titleText = category.getAttribute('data-title');
                 const iconHtml = categoryIcons[categoryData] || '<i class="fas fa-link"></i>';

                 linksContent.forEach(linkBox => { linkBox.style.display = 'none'; });

                 const targetLinks = linksMenu.querySelector(`.links-content .${categoryData}`);
                 if (targetLinks) { targetLinks.style.display = 'block'; }

                 linksTitle.innerHTML = `${iconHtml} ${titleText}`;
                 removeGradientClasses(linksTitle);
                 linksTitle.classList.add(gradientClasses[index % gradientClasses.length]);

                 categoriesMenu.classList.remove('active');
                 linksMenu.classList.add('show');
                 categoryTitleElement.style.display = 'none';
             });
         });
     }


    // ==================================================
    // <<< संशोधित डॉक्यूमेंट क्लिक लिस्नर >>>
    // ==================================================
    // इस लिस्नर को थोड़ा विलंब से जोड़ें ताकि टॉगल बटन पर
    // प्रारंभिक क्लिक इसे तुरंत बंद न कर दे।
    let documentClickListenerAdded = false; // Flag to add listener only once

    function addDocumentClickListener() {
         if (documentClickListenerAdded) return; // Add only once

         document.addEventListener('click', function handleOutsideClick(event) {
            // Check if menu elements still exist (important for robustness)
             const currentMenuToggle = document.querySelector('#my-unique-circle-menu .menu-toggle');
             const currentCategoriesMenu = document.querySelector('#my-unique-circle-menu .menu-categories');
             const currentLinksMenu = document.querySelector('#my-unique-circle-menu .menu-links');
             const currentCategoryTitleElement = document.querySelector('#my-unique-circle-menu .category-title');

             // If any essential part is missing, don't try to close
             if (!currentMenuToggle || !currentCategoriesMenu || !currentLinksMenu) return;

             // Check if the click was outside all menu components
             if (
                 !currentMenuToggle.contains(event.target) &&
                 !currentCategoriesMenu.contains(event.target) &&
                 !currentLinksMenu.contains(event.target)
             ) {
                 currentCategoriesMenu.classList.remove('active');
                 currentLinksMenu.classList.remove('show');
                 if (currentCategoryTitleElement) { // Check optional element
                     currentCategoryTitleElement.style.display = 'none';
                 }
                 // Optional: Remove listener after closing? Depends on desired behavior.
                 // document.removeEventListener('click', handleOutsideClick);
                 // documentClickListenerAdded = false; // Reset flag if removed
             }
         });
         documentClickListenerAdded = true; // Set flag
     }

     // Add the listener after a very short delay (e.g., 0 or 50ms)
     // Use setTimeout with 0 delay to queue it after the current execution context
     setTimeout(addDocumentClickListener, 50);
     // ==================================================
     // <<< डॉक्यूमेंट क्लिक लिस्नर का अंत >>>
     // ==================================================


  }); // DOMContentLoaded समाप्त
})(); // IIFE
; // <-- सेमीकोलन महत्वपूर्ण है

//]]>
</script>
