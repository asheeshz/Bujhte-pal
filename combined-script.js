<script>
//<![CDATA[

// ====== START: Combined & Isolated Scripts ======

// --- Script Block 1: Post Template Functionality (kaalpath) ---
;(function() {
    "use strict";
    document.addEventListener("DOMContentLoaded", function() {
        try {
            // console.log("Initializing Kaalpath Post Script..."); // लॉग्स को चाहें तो हटा सकते हैं

            // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
            const smoothScrollLinks = document.querySelectorAll(".kaalpath-custom-a[href^='#'], .kaalpath-story-nav a[href^='#']");
            const navElement = document.querySelector('.kaalpath-story-nav');
            const navHeight = navElement ? navElement.offsetHeight : 50;

            if (smoothScrollLinks.length > 0 && navElement) {
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
                                        document.querySelectorAll('.kaalpath-story-nav a').forEach(nav => nav.classList.remove('active'));
                                        link.classList.add('active');
                                    } else { kaalpath_updateActiveLinkBasedOnScroll(); }
                                } catch(e) { console.error("Kaalpath: Error updating active nav link:", e); }
                            } // else { console.warn(`Kaalpath: Element with ID ${href} not found.`); } // वार्निंग हटाई
                        }
                    });
                });

                const sections = document.querySelectorAll('.kaalpath-custom-div[id^="part"]');
                const navLinks = document.querySelectorAll('.kaalpath-story-nav a[href^="#part"]');

                // Function scoped to this block
                function kaalpath_updateActiveLinkBasedOnScroll() {
                    if (sections.length === 0 || navLinks.length === 0) return;
                    let current = '';
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    const triggerOffset = navHeight + 50; // सक्रियण के लिए ऑफसेट

                    sections.forEach(section => {
                         const sectionTop = section.offsetTop - triggerOffset; // ऊपर से ऑफसेट घटाएं
                         // सेक्शन के बॉटम तक सक्रिय रखें, जब तक अगला टॉप न आ जाए
                         if (scrollPosition >= sectionTop) {
                            current = section.getAttribute('id');
                         }
                     });

                     // यदि कोई सेक्शन सक्रिय नहीं है (जैसे पेज टॉप या बॉटम)
                     if (!current && sections.length > 0) {
                         if (scrollPosition < (sections[0].offsetTop - triggerOffset)) {
                             // यदि पहले सेक्शन के ऊपर हैं, तो कुछ भी सक्रिय न करें या पहला करें (वैकल्पिक)
                             // current = sections[0].getAttribute('id');
                         } else if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 50) {
                             // यदि पेज के बहुत नीचे हैं
                             current = sections[sections.length - 1].getAttribute('id');
                         }
                     }

                     // लिंक अपडेट करें
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        // href के हैश भाग से तुलना करें
                        if (link.getAttribute('href') === `#${current}`) {
                            link.classList.add('active');
                        }
                    });
                 };


                // Initial and scroll update
                kaalpath_updateActiveLinkBasedOnScroll();
                window.addEventListener('scroll', kaalpath_updateActiveLinkBasedOnScroll, { passive: true }); // Passive listener for performance

                // Handle direct hash links on load
                const hash = window.location.hash;
                if (hash && hash.startsWith("#part")) {
                    const activeLink = document.querySelector(`.kaalpath-story-nav a[href$="${hash}"]`);
                    if (activeLink) {
                        document.querySelectorAll('.kaalpath-story-nav a').forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                    // Smooth scroll to hash after a slight delay
                    setTimeout(() => {
                       const targetElement = document.getElementById(hash.substring(1)); // Get element by ID
                       if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'smooth' }); }
                    }, 150); // थोड़ा ज़्यादा विलंब
                 } else {
                     // Set default active link (e.g., Part 1) if no hash
                     const defaultActiveLink = document.querySelector('.kaalpath-story-nav a[href$="#part1"]');
                     if (defaultActiveLink) {
                          document.querySelectorAll('.kaalpath-story-nav a').forEach(link => link.classList.remove('active'));
                          defaultActiveLink.classList.add('active');
                     }
                 }
            } // else { console.warn("Kaalpath: Smooth scroll links or nav element not found."); } // वार्निंग हटाई
            // --- स्मूथ स्क्रॉल समाप्त ---


            // --- स्वचालित पेजिनेशन ---
            function kaalpath_setupPagination() {
                const paginationContainer = document.querySelector('.kaalpath-pagination-section');
                if (!paginationContainer) return; // { console.warn("Kaalpath: Pagination container not found."); return; }

                // ******** USER CONFIGURATION ********
                const totalPages = 6;
                const baseFilename = 'aranyani-kaushik-part';
                const fileExtension = '.html';
                // *************************************

                let currentPageNumber = 1;
                try {
                    const pathParts = window.location.pathname.split('/');
                    const filename = pathParts.pop() || pathParts.pop() || '';
                    // Regex को थोड़ा और मजबूत बनाया
                    const match = filename.match(/(?:part|page)[_-]?(\d+)/i) || filename.match(/(\d+)(?:\.\w+)?$/);
                    if (match && match[1]) {
                        const parsedNum = parseInt(match[1], 10);
                        if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= totalPages) { currentPageNumber = parsedNum; }
                         // else { console.warn("Kaalpath Pagination: Page number from URL invalid/out of range."); }
                    } // else { console.warn("Kaalpath Pagination: Couldn't find page number in URL/filename: ", filename); }
                } catch (e) { console.error("Kaalpath Pagination: Error getting page number.", e); }
                 if (isNaN(currentPageNumber) || currentPageNumber < 1 || currentPageNumber > totalPages) { currentPageNumber = 1; }

                paginationContainer.innerHTML = ''; // Clear existing pagination

                 // Function to create link
                 const createPageLink = (pageNumber, text = pageNumber, isCurrent = false, isDisabled = false) => {
                     const link = document.createElement(isCurrent ? 'span' : 'a');
                     link.textContent = text;
                     link.classList.add('kaalpath-pagination-link');
                     if (isCurrent) link.classList.add('current');
                     if (isDisabled) {
                         link.classList.add('disabled');
                         if (!isCurrent) link.href = '#'; // Non-current disabled links go nowhere
                     } else if (!isCurrent) {
                         link.href = `${baseFilename}${pageNumber}${fileExtension}`;
                     }
                     return link;
                 };


                 // Add "Previous" link
                 paginationContainer.appendChild(createPageLink(currentPageNumber - 1, 'पिछला', false, currentPageNumber === 1));


                 // Add page number links (simplified logic for demonstration)
                 // Show first page
                 if (currentPageNumber > 2) {
                     paginationContainer.appendChild(createPageLink(1));
                     if (currentPageNumber > 3) {
                         const ellipsis = document.createElement('span');
                         ellipsis.textContent = '...';
                         ellipsis.classList.add('kaalpath-pagination-label'); // Use label class
                         paginationContainer.appendChild(ellipsis);
                     }
                 }

                 // Show pages around current
                 for (let i = Math.max(1, currentPageNumber - 1); i <= Math.min(totalPages, currentPageNumber + 1); i++) {
                     paginationContainer.appendChild(createPageLink(i, i, i === currentPageNumber));
                 }

                 // Show last page
                 if (currentPageNumber < totalPages - 1) {
                     if (currentPageNumber < totalPages - 2) {
                         const ellipsis = document.createElement('span');
                         ellipsis.textContent = '...';
                         ellipsis.classList.add('kaalpath-pagination-label');
                         paginationContainer.appendChild(ellipsis);
                     }
                     paginationContainer.appendChild(createPageLink(totalPages));
                 }


                 // Add "Next" link
                 paginationContainer.appendChild(createPageLink(currentPageNumber + 1, 'अगला', false, currentPageNumber === totalPages));


                // Update Part Navigation Buttons
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
                            nextPartButton.classList.remove('disabled'); // 'hidden-on-last' क्लास शायद CSS में हैंडल हो रही है
                        } else {
                            nextPartButton.href = '#';
                            nextPartButton.classList.add('disabled');
                        }
                    }
                });
            }
            // केवल पोस्ट पेज जैसी विशिष्ट जगहों पर ही पेजिनेशन चलाएं
            // यह ब्लॉगर क्लास '.item' पर निर्भर करता है, आपकी थीम में अलग हो सकता है
            if (document.body.classList.contains('item')) {
                 kaalpath_setupPagination();
            }
            // --- स्वचालित पेजिनेशन समाप्त ---


            // --- TTS कार्यक्षमता ---
            function kaalpath_speakText(text, lang = "hi-IN") {
                if ('speechSynthesis' in window && text && typeof text === 'string') {
                    window.speechSynthesis.cancel();
                    const speech = new SpeechSynthesisUtterance(text.trim());
                    speech.lang = lang; speech.volume = 1; speech.rate = 0.9; speech.pitch = 1;
                    window.speechSynthesis.speak(speech);
                } // else { console.warn("Kaalpath TTS: Speech synthesis not supported or text is empty."); }
            }
            const specialTermElements = document.querySelectorAll(".kaalpath-special-term-1, .kaalpath-special-term-2, .kaalpath-special-term-3");
            if (specialTermElements.length > 0) {
                specialTermElements.forEach(term => {
                    term.addEventListener("click", (event) => { event.stopPropagation(); kaalpath_speakText(term.textContent, "hi-IN"); });
                    if (!term.title) term.title = "सुनने के लिए क्लिक करें"; // यदि टाइटल पहले से नहीं है
                });
            }
            const paragraphElements = document.querySelectorAll(".kaalpath-custom-p");
             if (paragraphElements.length > 0) {
                 paragraphElements.forEach(paragraph => {
                    // TTS से बाहर करने के लिए '.no-tts' क्लास जोड़ सकते हैं
                    if (!paragraph.closest('.kaalpath-story-description') && !paragraph.closest('.kaalpath-tv-ad-explanation') && !paragraph.classList.contains('no-tts')) {
                        paragraph.addEventListener("click", () => kaalpath_speakText(paragraph.textContent, "hi-IN"));
                        if (!paragraph.title) paragraph.title = "पूरा पैराग्राफ सुनने के लिए क्लिक करें";
                        paragraph.style.cursor = 'pointer';
                        paragraph.addEventListener("mouseenter", () => { paragraph.style.color = "#C71585"; });
                        paragraph.addEventListener("mouseleave", () => { paragraph.style.color = ""; }); // Reset to original CSS color
                    } else { paragraph.style.cursor = "default"; }
                 });
             }
            // --- TTS कार्यक्षमता समाप्त ---

             // console.log("Kaalpath Post Script Initialized Successfully.");

        } catch (error) {
            console.error("Error in Kaalpath Post Script:", error);
        }
    });
})();
// --- End Script Block 1 ---

; // Separator

// --- Script Block 2: Footer Widget Functionality (sfcw) ---
;(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // console.log("Initializing SFCW Footer Script...");

            // --- कॉपीराइट वर्ष अपडेट करें ---
            const sfcwYearSpan = document.getElementById('sfcw-current-year');
            if (sfcwYearSpan) {
              sfcwYearSpan.textContent = new Date().getFullYear(); // स्पेस हटाया
            }

            // --- कण कैनवास सेटअप ---
            const sfcwCanvas = document.getElementById('sfcw-particle-canvas');
             if (!sfcwCanvas) {
                 // console.warn("SFCW Particle canvas element not found!");
                 return;
             }
            const sfcwCtx = sfcwCanvas.getContext('2d');
            if (!sfcwCtx) { // कॉन्टेक्स्ट जांचें
                 console.error("SFCW: Failed to get 2D context for canvas.");
                 return;
             }

            let sfcwParticles = [];
            let sfcwAnimationFrameId = null;

            function sfcwResizeCanvas() {
                 if (!sfcwCanvas) return;
                sfcwCanvas.width = sfcwCanvas.offsetWidth;
                sfcwCanvas.height = sfcwCanvas.offsetHeight;
            }

            class SFCW_Particle {
                 constructor(x, y) {
                     this.canvasWidth = sfcwCanvas.width; // स्टोर करें
                     this.canvasHeight = sfcwCanvas.height;
                     this.x = x || Math.random() * this.canvasWidth;
                     this.y = y || Math.random() * this.canvasHeight;
                     this.size = Math.random() * 2.5 + 1;
                     this.speedX = (Math.random() * 1 - 0.5) * 0.5;
                     this.speedY = (Math.random() * 1 - 0.5) * 0.5;
                     const rootStyle = getComputedStyle(document.documentElement);
                     const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)';
                     const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)';
                     this.color = Math.random() > 0.1 ? starColor : particleColor;
                     this.opacity = Math.random() * 0.6 + 0.2;
                     this.initialOpacity = this.opacity;
                     this.life = Math.random() * 2 + 1; // सेकंड में
                     this.initialLife = this.life;
                 }
                 update(deltaTime) {
                     if (deltaTime <= 0 || deltaTime > 0.1) { // असामान्य डेल्टा टाइम को अनदेखा करें
                         this.resetPositionIfNeeded(); // यदि आवश्यक हो तो स्थिति रीसेट करें
                         return;
                     }
                     this.x += this.speedX * deltaTime * 30; // गति समायोजित करें
                     this.y += this.speedY * deltaTime * 30;
                     this.life -= deltaTime;

                     if (this.life <= 0) {
                         this.opacity = 0; // पूरी तरह से अदृश्य
                         if (this.life <= -0.5) { this.reset(); } // थोड़ी देर बाद रीसेट करें
                     } else {
                         // जीवनकाल के आधार पर स्पंदन प्रभाव
                         this.opacity = this.initialOpacity * (0.6 + Math.abs(Math.sin((this.initialLife - this.life) * Math.PI / this.initialLife) * 0.4));
                     }
                     this.handleBoundaries();
                 }
                  handleBoundaries() {
                    // किनारों से धीरे से वापस मोड़ें
                    if (this.x <= this.size || this.x >= this.canvasWidth - this.size) {
                        this.speedX *= -1;
                        this.x = Math.max(this.size + 1, Math.min(this.x, this.canvasWidth - this.size - 1)); // अंदर रखें
                    }
                    if (this.y <= this.size || this.y >= this.canvasHeight - this.size) {
                        this.speedY *= -1;
                        this.y = Math.max(this.size + 1, Math.min(this.y, this.canvasHeight - this.size - 1)); // अंदर रखें
                    }
                 }
                 resetPositionIfNeeded() { // यदि कैनवास आकार बदलता है तो स्थिति रीसेट करें
                     if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {
                         this.x = Math.random() * this.canvasWidth;
                         this.y = Math.random() * this.canvasHeight;
                     }
                 }
                 reset() {
                     this.canvasWidth = sfcwCanvas.width; // आकार अपडेट करें
                     this.canvasHeight = sfcwCanvas.height;
                     this.x = Math.random() * this.canvasWidth;
                     this.y = Math.random() * this.canvasHeight;
                     this.opacity = this.initialOpacity;
                     this.life = this.initialLife;
                     this.speedX = (Math.random() * 1 - 0.5) * 0.5;
                     this.speedY = (Math.random() * 1 - 0.5) * 0.5;
                 }
                 draw() {
                     if (this.opacity <= 0 || !sfcwCtx) return;
                     sfcwCtx.globalAlpha = this.opacity;
                     sfcwCtx.fillStyle = this.color;
                     sfcwCtx.beginPath();
                     sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                     sfcwCtx.fill();
                 }
             }

            function sfcwInitParticles() {
                 if (!sfcwCanvas) return;
                sfcwParticles = [];
                let numberOfParticles = Math.floor(sfcwCanvas.width * sfcwCanvas.height / 18000); // थोड़ा कम घनत्व
                numberOfParticles = Math.max(40, Math.min(numberOfParticles, 120)); // सीमा समायोजित
                for (let i = 0; i < numberOfParticles; i++) { sfcwParticles.push(new SFCW_Particle()); }
            }

            let sfcwLastTime = 0;
            function sfcwAnimateParticles(timestamp) {
                if (!sfcwCanvas || !sfcwCtx) { // सुनिश्चित करें कि तत्व मौजूद हैं
                     if (sfcwAnimationFrameId) cancelAnimationFrame(sfcwAnimationFrameId);
                     sfcwAnimationFrameId = null;
                     return;
                 }
                if (document.hidden) {
                    sfcwLastTime = timestamp;
                    sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
                    return;
                }
                const deltaTime = (timestamp - sfcwLastTime) / 1000;
                sfcwLastTime = timestamp;

                sfcwCtx.clearRect(0, 0, sfcwCanvas.width, sfcwCanvas.height);
                sfcwParticles.forEach(p => {
                    p.update(deltaTime);
                    p.draw();
                });
                sfcwCtx.globalAlpha = 1.0;
                sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
            }

            function sfcwStartAnimation() {
                 if (!sfcwCanvas || !sfcwCtx) return;
                sfcwResizeCanvas();
                sfcwInitParticles();
                if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); }
                sfcwLastTime = performance.now();
                sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
            }

            // एनिमेशन शुरू करने में थोड़ी देर करें
            const sfcwStartDelay = setTimeout(sfcwStartAnimation, 200); // थोड़ा ज़्यादा विलंब

            // रीसाइज़ हैंडलर (डिबाउंस के साथ)
            let sfcwResizeTimeout;
            window.addEventListener('resize', () => {
                 if (!sfcwCanvas) return;
                clearTimeout(sfcwResizeTimeout);
                sfcwResizeTimeout = setTimeout(() => {
                    if (sfcwAnimationFrameId) cancelAnimationFrame(sfcwAnimationFrameId);
                    sfcwStartAnimation(); // एनीमेशन पुनः आरंभ करें
                }, 300); // थोड़ा तेज़ रीसाइज़ प्रतिक्रिया
            });

             // पेज छोडते समय क्लीनअप
             window.addEventListener('beforeunload', () => {
                 if (sfcwAnimationFrameId) cancelAnimationFrame(sfcwAnimationFrameId);
                 sfcwAnimationFrameId = null;
                 clearTimeout(sfcwStartDelay); clearTimeout(sfcwResizeTimeout);
             });

            // console.log("SFCW Footer Script Initialized Successfully.");

        } catch (error) {
            console.error("Error in SFCW Footer Script:", error);
        }
    });
})();
// --- End Script Block 2 ---

; // Separator

// --- Script Block 3: Table of Contents (TOC) ---
// ***** महत्वपूर्ण: यह ब्लॉक केवल एक बार होना चाहिए *****
;(function() {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
        try {
            // console.log("Initializing TOC Script...");

            const config = {
                postContainerSelector: ".post-body", // *** अपनी थीम के अनुसार बदलें ***
                headingsSelector: "h2, h3",
                minHeadingsForToc: 2,
                tocTitleText: "विषय - सूची", // हिंदी शीर्षक
                showButtonBaseText: "विषय अन्वेषण करें", // हिंदी
                hideButtonBaseText: "सामग्री छिपाएँ", // हिंदी
                showIconClass: "fa-solid fa-chevron-down",
                hideIconClass: "fa-solid fa-chevron-up",
                highlightDuration: 3000,
                useIcons: true,
                h2IconClass: "fa-solid fa-book-open-reader", // बदला हुआ आइकन
                h3IconClass: "fa-regular fa-circle-dot",   // बदला हुआ आइकन
            };

            let currentHighlightTimeout = null;
            let tocContainer = null;
            let toc = null;
            let toggleButton = null;

            function createSafeId(heading, index) {
                let textForId = (heading.textContent || '').trim().toLowerCase();
                // आईडी बनाने के लिए अधिक मजबूत रेगेक्स
                let baseId = textForId
                    .replace(/[^a-z0-9\u0900-\u097F\s-]/g, '') // देवनागरी वर्णों को अनुमति दें
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
                 baseId = baseId.substring(0, 50); // आईडी बहुत लंबी न हो
                let id = "toc-h-" + (baseId || index);
                let counter = 1; const originalId = id;
                // मौजूदा आईडी जांचें
                 while (document.getElementById(id)) {
                     id = `${originalId}-${counter}`;
                     counter++;
                     if (counter > 50) break; // अनंत लूप से बचें
                 }
                 return id;
             }

             function clearHighlights(specificHeading = null, specificContent = []) {
                if (currentHighlightTimeout) { clearTimeout(currentHighlightTimeout); currentHighlightTimeout = null; }
                // Remove specific first if provided
                if (specificHeading) { specificHeading.classList.remove('highlight-target'); }
                if (specificContent.length > 0) { specificContent.forEach(el => el.classList.remove('highlight-content')); }

                // If nothing specific was provided, clear all globally
                if (!specificHeading && specificContent.length === 0) {
                    document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
                    document.querySelectorAll('.highlight-content').forEach(el => el.classList.remove('highlight-content'));
                }
            }

            function applyHighlight(targetHeading) {
                if (!targetHeading) return;
                clearHighlights(); // Clear all previous highlights first
                targetHeading.classList.add('highlight-target');
                const highlightedContent = [];
                let sibling = targetHeading.nextElementSibling;
                // Collect content until the next heading or TOC container
                while (sibling && !sibling.matches(config.headingsSelector) && !sibling.matches('#toc-container')) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && !sibling.matches('script, style')) { // केवल वास्तविक तत्व नोड, स्क्रिप्ट/स्टाइल नहीं
                         sibling.classList.add('highlight-content');
                         highlightedContent.push(sibling);
                    }
                    sibling = sibling.nextElementSibling;
                }
                 // Set timeout to clear *this specific* highlight
                currentHighlightTimeout = setTimeout(() => {
                    clearHighlights(targetHeading, highlightedContent);
                }, config.highlightDuration);
            }

            function smoothScrollToTarget(element) {
                if (!element) return;
                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                // टॉप पर ज़्यादा जगह छोड़ें, खास कर फिक्स्ड हेडर के लिए
                const headerOffset = document.querySelector('.kaalpath-story-nav')?.offsetHeight || 60; // यदि हेडर है तो उसकी ऊंचाई लें
                const extraOffset = 20; // अतिरिक्त मार्जिन
                const targetScrollPosition = absoluteElementTop - headerOffset - extraOffset;
                window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
            }

            function controlButtonGlow(buttonElement, shouldGlow) {
                if (!buttonElement) return;
                if (shouldGlow) {
                    // सुनिश्चित करें कि यह केवल तभी जोड़ा जाए जब TOC वास्तव में बंद हो
                    setTimeout(() => {
                        if (toc && !toc.classList.contains('toc-visible')) {
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
                // console.log("TOC: Starting initialization...");
                const postContent = document.querySelector(config.postContainerSelector);
                if (!postContent) {
                    console.warn("TOC: Container '" + config.postContainerSelector + "' not found. TOC cannot be created.");
                    return;
                }
                // console.log("TOC: Found post container:", postContent);

                const headings = Array.from(postContent.querySelectorAll(config.headingsSelector))
                                     .filter(h => !h.closest('#toc-container') && h.textContent?.trim()); // Optional chaining

                // console.log(`TOC: Found ${headings.length} valid headings.`);
                if (headings.length < config.minHeadingsForToc) {
                    // console.log(`TOC: Not enough headings (${headings.length}) to create TOC (min: ${config.minHeadingsForToc}).`);
                    return;
                }

                 const existingTocContainer = document.getElementById('toc-container');
                 if (existingTocContainer) {
                     // console.warn("TOC: Removing existing TOC container.");
                     existingTocContainer.remove();
                 }

                tocContainer = document.createElement("div"); tocContainer.id = "toc-container";
                toggleButton = document.createElement("button"); toggleButton.id = "toc-toggle-button";
                updateButtonContent(false);
                toggleButton.setAttribute("aria-controls", "toc");
                toggleButton.setAttribute("type", "button"); // टाइप जोड़ें
                controlButtonGlow(toggleButton, true);

                toc = document.createElement("div"); toc.id = "toc";
                const tocTitle = document.createElement("h2");
                tocTitle.textContent = config.tocTitleText;
                toc.appendChild(tocTitle);
                const tocList = document.createElement("ul");

                headings.forEach((heading, index) => {
                    let id = heading.id;
                    // यदि आईडी नहीं है या डुप्लिकेट है तो नई आईडी बनाएं
                    if (!id || document.querySelectorAll(`#${CSS.escape(id)}`).length > 1) {
                         id = createSafeId(heading, index);
                         heading.id = id;
                    }
                    const listItem = document.createElement("li");
                    const headingLevel = heading.tagName.toLowerCase();
                    listItem.classList.add('toc-level-' + headingLevel.replace('h',''));
                    const link = document.createElement("a"); link.href = "#" + id;

                    if (config.useIcons) {
                        let iconClass = "";
                        if (headingLevel === 'h2' && config.h2IconClass) iconClass = config.h2IconClass;
                        else if (headingLevel === 'h3' && config.h3IconClass) iconClass = config.h3IconClass;
                        if (iconClass) {
                            const iconElement = document.createElement("i");
                            iconClass.split(' ').forEach(cls => { if (cls) iconElement.classList.add(cls.trim()); }); // Trim classes
                            iconElement.setAttribute("aria-hidden", "true");
                            link.appendChild(iconElement);
                        }
                    }
                    link.appendChild(document.createTextNode((heading.textContent || '').trim()));
                    listItem.appendChild(link); tocList.appendChild(listItem);
                });

                toc.appendChild(tocList); tocContainer.appendChild(toggleButton); tocContainer.appendChild(toc);

                const firstValidHeading = headings[0];
                if (firstValidHeading?.parentNode) {
                     firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading);
                     // console.log("TOC: Inserted before the first heading.");
                } else if (postContent.firstChild) {
                     postContent.insertBefore(tocContainer, postContent.firstChild);
                     // console.log("TOC: Inserted at the beginning of the post container.");
                } else {
                     postContent.appendChild(tocContainer);
                    // console.log("TOC: Appended to an empty post container.");
                }

                setupEventListeners();
                // console.log("TOC Initialized Successfully.");
            }

            function setupEventListeners() {
                // console.log("TOC: Setting up event listeners...");
                if (!tocContainer || !toc || !toggleButton) {
                     // console.warn("TOC: Cannot set up listeners - elements missing.");
                     return;
                 }

                toggleButton.addEventListener('click', () => {
                    // console.log("TOC: Toggle button clicked.");
                    const isExpanded = toc.classList.toggle('toc-visible');
                    updateButtonContent(isExpanded);
                    tocContainer.classList.toggle('toc-is-shown', isExpanded);
                    controlButtonGlow(toggleButton, !isExpanded);
                });

                toc.addEventListener('click', (event) => {
                     const linkElement = event.target.closest('a');
                     if (linkElement && linkElement.getAttribute('href')?.startsWith('#')) {
                        event.preventDefault();
                        const targetId = linkElement.getAttribute('href').substring(1);
                        // console.log(`TOC: Link clicked, target ID: ${targetId}`);
                         // आईडी से तत्व ढूंढें
                         const targetHeading = document.getElementById(targetId);
                         if (targetHeading) {
                             // console.log("TOC: Target heading found:", targetHeading);
                             smoothScrollToTarget(targetHeading);
                             setTimeout(() => { applyHighlight(targetHeading); }, 300); // स्क्रॉल के बाद हाइलाइट
                         } // else { console.warn(`TOC: Target heading '#${targetId}' not found.`); }
                     }
                 });
                 // console.log("TOC: Event listeners set up.");
            }

            // Initialize
            // केवल आइटम व्यू पर चलाएं (ब्लॉगर डिफ़ॉल्ट)
             if (document.body.classList.contains('item')) {
                initializeToc();
             } else {
                 // console.log("TOC: Not on an item page. TOC initialization skipped.");
             }


        } catch (error) {
            console.error("Error in TOC Script:", error);
        }
    });
})();
// --- End Script Block 3 ---

; // Separator

// --- Script Block 4: Circular Menu ---
;(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // console.log("Initializing Circular Menu Script...");
            const menuWidget = document.getElementById('my-unique-circle-menu');

            if (menuWidget) {
                 // console.log("Circular Menu: Widget container found.");
                const menuToggle = menuWidget.querySelector('.menu-toggle');
                const categoriesMenu = menuWidget.querySelector('.menu-categories');
                const linksMenu = menuWidget.querySelector('.menu-links');
                const linksTitle = linksMenu?.querySelector('.links-title'); // Optional chaining
                const categoryTitleElement = categoriesMenu?.querySelector('.category-title'); // Optional chaining
                const categories = menuWidget.querySelectorAll('.category');
                const linksContentDivs = menuWidget.querySelectorAll('.links-content .links'); // Links container divs

                const categoryIcons = { 'class-1-5': '<i class="fas fa-book-reader"></i>', 'class-6-8': '<i class="fas fa-graduation-cap"></i>', 'class-9-10': '<i class="fas fa-school"></i>', 'class-11-12': '<i class="fas fa-university"></i>', 'competitive-exam': '<i class="fas fa-trophy"></i>', 'news-channel': '<i class="fas fa-newspaper"></i>', 'yoga-ayurveda': '<i class="fas fa-spa"></i>', 'marriage-links': '<i class="fas fa-ring"></i>', 'editorial-links': '<i class="fas fa-edit"></i>', 'government-links': '<i class="fas fa-landmark"></i>', 'astrology-links': '<i class="fas fa-star-of-david"></i>', 'vaidik-links': '<i class="fas fa-om"></i>' }; // Updated icons
                const gradientClasses = [ 'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6', 'gradient-7', 'gradient-8', 'gradient-9', 'gradient-10', 'gradient-11', 'gradient-12' ];

                function removeGradientClasses(element) {
                    if (element) { gradientClasses.forEach(cls => element.classList.remove(cls)); }
                }

                // Check essential elements more robustly
                if (!menuToggle || !categoriesMenu || !linksMenu || !linksTitle || !categoryTitleElement || categories.length === 0 || linksContentDivs.length === 0) {
                     console.warn("Circular Menu: One or more essential elements are missing. Menu cannot function.");
                     // You could potentially hide the toggle button if essential parts are missing
                     // if (menuToggle) menuToggle.style.display = 'none';
                     return;
                 }

                menuToggle.addEventListener('click', (event) => {
                    // console.log("Circular Menu: Toggle clicked.");
                    event.stopPropagation(); // बाहर क्लिक से बंद होने से रोकें
                    const isCategoriesActive = categoriesMenu.classList.contains('active');
                    const isLinksActive = linksMenu.classList.contains('show');

                     // यदि लिंक्स खुले हैं, तो उन्हें बंद करें
                     if (isLinksActive) {
                         linksMenu.classList.remove('show');
                     }
                     // कैटेगरी टॉगल करें
                     if (isCategoriesActive) {
                         categoriesMenu.classList.remove('active');
                         if (categoryTitleElement) categoryTitleElement.style.display = 'none';
                     } else {
                         categoriesMenu.classList.add('active');
                         if (categoryTitleElement) {
                            categoryTitleElement.style.display = 'block';
                            removeGradientClasses(categoryTitleElement);
                            const randomGradientIndex = Math.floor(Math.random() * gradientClasses.length);
                            categoryTitleElement.classList.add(gradientClasses[randomGradientIndex]);
                            categoryTitleElement.innerHTML = '<i class="fas fa-hand-pointer-down"></i> अपनी पसंद चुनें'; // बदला हुआ टेक्स्ट
                         }
                     }
                });

                categories.forEach((category, index) => {
                    category.addEventListener('click', (event) => {
                        event.stopPropagation(); // बाहर क्लिक से बंद होने से रोकें
                        const categoryData = category.getAttribute('data-category');
                        const titleText = category.getAttribute('data-title');
                        // console.log(`Circular Menu: Category '${categoryData}' clicked.`);

                        if (!categoryData || !titleText) {
                             console.warn("Circular Menu: Category missing data-category or data-title.");
                             return;
                         }

                        const iconHtml = categoryIcons[categoryData] || '<i class="fas fa-link"></i>';

                        // Hide all link content divs first
                        linksContentDivs.forEach(linkBox => { linkBox.style.display = 'none'; });

                        // Find and show the correct link content div
                        const targetLinksDiv = linksMenu.querySelector(`.links-content .links.${categoryData}`);
                        if (targetLinksDiv) {
                            targetLinksDiv.style.display = 'block'; // या 'grid'/'flex' यदि आवश्यक हो
                        } // else { console.warn(`Circular Menu: Links div for category '${categoryData}' not found.`); }

                        // Update links title
                        linksTitle.innerHTML = `${iconHtml} ${titleText}`;
                        removeGradientClasses(linksTitle);
                        linksTitle.classList.add(gradientClasses[index % gradientClasses.length]);

                        // Hide categories menu and show links menu
                        categoriesMenu.classList.remove('active');
                        if (categoryTitleElement) categoryTitleElement.style.display = 'none';
                        linksMenu.classList.add('show');
                    });
                });

                 // Click outside handler - closes *both* menus
                 document.addEventListener('click', (event) => {
                     // If the click is outside the entire menu widget
                     if (menuWidget && !menuWidget.contains(event.target)) {
                         categoriesMenu.classList.remove('active');
                         linksMenu.classList.remove('show');
                         if (categoryTitleElement) categoryTitleElement.style.display = 'none';
                     }
                 });

                 // console.log("Circular Menu Script Initialized Successfully.");

            } // else { console.warn("Circular Menu: Widget container #my-unique-circle-menu not found."); }
        } catch (error) {
            console.error("Error in Circular Menu Script:", error);
        }
    });
})();
// --- End Script Block 4 ---


// ====== END: Combined & Isolated Scripts ======

//]]>
</script>
