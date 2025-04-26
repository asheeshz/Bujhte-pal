// ====== START: Combined & Isolated Scripts ======

// --- Script Block 1: Post Template Functionality (kaalpath) ---
;(function() {
    "use strict";
    document.addEventListener("DOMContentLoaded", function() {
        try { // Add try block for robustness
            console.log("Initializing Kaalpath Post Script..."); // Log for potential future debugging

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
                            } else { console.warn(`Kaalpath: Element with ID ${href} not found.`); }
                        }
                    });
                });

                const sections = document.querySelectorAll('.kaalpath-custom-div[id^="part"]');
                const navLinks = document.querySelectorAll('.kaalpath-story-nav a[href^="#part"]');

                function kaalpath_updateActiveLinkBasedOnScroll() {
                    if (sections.length === 0 || navLinks.length === 0) return;
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

                kaalpath_updateActiveLinkBasedOnScroll();
                window.addEventListener('scroll', kaalpath_updateActiveLinkBasedOnScroll);

                const hash = window.location.hash;
                if (hash && hash.startsWith("#part")) {
                    const activeLink = document.querySelector(`.kaalpath-story-nav a[href$="${hash}"]`);
                    if (activeLink) {
                        document.querySelectorAll('.kaalpath-story-nav a').forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                    setTimeout(() => {
                       const targetElement = document.querySelector(hash);
                       if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'smooth' }); }
                    }, 100);
                 } else {
                     const defaultActiveLink = document.querySelector('.kaalpath-story-nav a[href$="#part1"]');
                     if (defaultActiveLink) {
                          document.querySelectorAll('.kaalpath-story-nav a').forEach(link => link.classList.remove('active'));
                          defaultActiveLink.classList.add('active');
                     }
                 }
            } else {
                 console.warn("Kaalpath: Smooth scroll links or nav element not found.");
            }
            // --- स्मूथ स्क्रॉल समाप्त ---


            // --- स्वचालित पेजिनेशन ---
            function kaalpath_setupPagination() {
                const paginationContainer = document.querySelector('.kaalpath-pagination-section');
                if (!paginationContainer) { console.warn("Kaalpath: Pagination container not found."); return; }

                const totalPages = 6; // <-- कॉन्फ़िगरेशन
                const baseFilename = 'aranyani-kaushik-part'; // <-- कॉन्फ़िगरेशन
                const fileExtension = '.html'; // <-- कॉन्फ़िगरेशन

                let currentPageNumber = 1;
                try {
                    const pathParts = window.location.pathname.split('/');
                    const filename = pathParts.pop() || pathParts.pop() || '';
                    const match = filename.match(/part(\d+)/i) || filename.match(/(\d+)(?:\.\w+)?$/);
                    if (match && match[1]) {
                        const parsedNum = parseInt(match[1], 10);
                        if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= totalPages) { currentPageNumber = parsedNum; }
                         else { console.warn("Kaalpath Pagination: Page number from URL invalid/out of range."); }
                    } else { console.warn("Kaalpath Pagination: Couldn't find page number in URL/filename: ", filename); }
                } catch (e) { console.error("Kaalpath Pagination: Error getting page number.", e); }
                 if (isNaN(currentPageNumber) || currentPageNumber < 1 || currentPageNumber > totalPages) { currentPageNumber = 1; }

                paginationContainer.innerHTML = '';

                // Previous links (condensed loop)
                for (let i = Math.max(1, currentPageNumber - 4); i < currentPageNumber; i++) {
                   const link = document.createElement('a');
                   link.href = `${baseFilename}${i}${fileExtension}`;
                   link.textContent = i; link.classList.add('kaalpath-pagination-link');
                   paginationContainer.appendChild(link);
                 }

                // Current page span
                const currentSpan = document.createElement('span');
                currentSpan.textContent = currentPageNumber;
                currentSpan.classList.add('kaalpath-pagination-link', 'current');
                paginationContainer.appendChild(currentSpan);

                // Next links (simplified for clarity, assuming only one next shown usually)
                 const nextPageIndex = currentPageNumber + 1;
                 if (nextPageIndex <= totalPages) {
                     const nextLink = document.createElement('a');
                     nextLink.href = `${baseFilename}${nextPageIndex}${fileExtension}`;
                     nextLink.textContent = nextPageIndex; nextLink.classList.add('kaalpath-pagination-link');
                     paginationContainer.appendChild(nextLink);
                 }
                 // You might want to add more next links similar to previous links if needed

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
                            nextPartButton.classList.remove('disabled', 'hidden-on-last');
                        } else {
                            nextPartButton.href = '#';
                            nextPartButton.classList.add('disabled', 'hidden-on-last');
                        }
                    }
                });
            }
            // केवल पोस्ट पेज जैसी विशिष्ट जगहों पर ही पेजिनेशन चलाएं (यदि आवश्यक हो)
            // if (document.body.classList.contains('item-view')) { // उदाहरण ब्लॉगर क्लास
                 kaalpath_setupPagination();
            // }
            // --- स्वचालित पेजिनेशन समाप्त ---


            // --- TTS कार्यक्षमता ---
            function kaalpath_speakText(text, lang = "hi-IN") {
                if ('speechSynthesis' in window && text) {
                    window.speechSynthesis.cancel(); // पिछला बोलना रोकें
                    const speech = new SpeechSynthesisUtterance(text.trim());
                    speech.lang = lang; speech.volume = 1; speech.rate = 0.9; speech.pitch = 1;
                    window.speechSynthesis.speak(speech);
                } else { console.warn("Kaalpath TTS: Speech synthesis not supported or text is empty."); }
            }
            const specialTermElements = document.querySelectorAll(".kaalpath-special-term-1, .kaalpath-special-term-2, .kaalpath-special-term-3");
            if (specialTermElements.length > 0) {
                specialTermElements.forEach(term => {
                    term.addEventListener("click", (event) => { event.stopPropagation(); kaalpath_speakText(term.textContent, "hi-IN"); });
                    term.title = "सुनने के लिए क्लिक करें";
                });
            }
            const paragraphElements = document.querySelectorAll(".kaalpath-custom-p");
             if (paragraphElements.length > 0) {
                 paragraphElements.forEach(paragraph => {
                    if (!paragraph.closest('.kaalpath-story-description') && !paragraph.closest('.kaalpath-tv-ad-explanation')) {
                        paragraph.addEventListener("click", () => kaalpath_speakText(paragraph.textContent, "hi-IN"));
                        paragraph.title = "पूरा पैराग्राफ सुनने के लिए क्लिक करें";
                        paragraph.style.cursor = 'pointer'; // Explicitly set cursor
                        paragraph.addEventListener("mouseenter", () => { paragraph.style.color = "#C71585"; });
                        paragraph.addEventListener("mouseleave", () => { paragraph.style.color = ""; }); // Reset to default
                    } else { paragraph.style.cursor = "default"; }
                 });
             }
            // --- TTS कार्यक्षमता समाप्त ---

             console.log("Kaalpath Post Script Initialized Successfully.");

        } catch (error) {
            console.error("Error in Kaalpath Post Script:", error);
        }
    });
})();
// --- End Script Block 1 ---

// खाली लाइन या सेमीकोलन जोड़ें
;

// --- Script Block 2: Footer Widget Functionality (sfcw) ---
;(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        try { // Add try block
             console.log("Initializing SFCW Footer Script...");

            // --- कॉपीराइट वर्ष अपडेट करें ---
            const sfcwYearSpan = document.getElementById('sfcw-current-year');
            if (sfcwYearSpan) {
              sfcwYearSpan.textContent = " " + new Date().getFullYear();
            }

            // --- कण कैनवास सेटअप ---
            const sfcwCanvas = document.getElementById('sfcw-particle-canvas');
             if (!sfcwCanvas) {
                 console.warn("SFCW Particle canvas element not found!");
                 return; // कैनवास नहीं है तो इस ब्लॉक का कण भाग रोकें
             }
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
                    if (this.opacity <= 0 || !sfcwCtx) return;
                    sfcwCtx.globalAlpha = this.opacity; sfcwCtx.fillStyle = this.color;
                    sfcwCtx.beginPath(); sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); sfcwCtx.fill();
                }
            }

            function sfcwInitParticles() {
                sfcwParticles = [];
                let numberOfParticles = Math.floor(sfcwCanvas.width * sfcwCanvas.height / 15000);
                numberOfParticles = Math.max(50, Math.min(numberOfParticles, 150)); // कणों की संख्या सीमित करें
                for (let i = 0; i < numberOfParticles; i++) { sfcwParticles.push(new SFCW_Particle()); }
            }

            let sfcwLastTime = 0;
            function sfcwAnimateParticles(timestamp) {
                if (document.hidden || !sfcwCtx) { // यदि टैब निष्क्रिय है या संदर्भ खो गया है
                    sfcwLastTime = timestamp;
                    if (sfcwAnimationFrameId) sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
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
                 if (!sfcwCanvas || !sfcwCtx) return; // सुनिश्चित करें कि कैनवास मौजूद है
                sfcwResizeCanvas(); sfcwInitParticles();
                if (sfcwAnimationFrameId) { cancelAnimationFrame(sfcwAnimationFrameId); }
                sfcwLastTime = performance.now();
                sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
            }

            const sfcwStartDelay = setTimeout(sfcwStartAnimation, 100);
            let sfcwResizeTimeout;
            window.addEventListener('resize', () => {
                 if (!sfcwCanvas) return; // कैनवास मौजूद है तो ही रीसाइज़ हैंडल करें
                clearTimeout(sfcwResizeTimeout);
                sfcwResizeTimeout = setTimeout(() => {
                    if (sfcwAnimationFrameId) cancelAnimationFrame(sfcwAnimationFrameId);
                    sfcwStartAnimation();
                }, 500);
            });

             // पेज छोडते समय सफाई
             window.addEventListener('beforeunload', () => {
                 if (sfcwAnimationFrameId) cancelAnimationFrame(sfcwAnimationFrameId);
                 clearTimeout(sfcwStartDelay); clearTimeout(sfcwResizeTimeout);
             });

             console.log("SFCW Footer Script Initialized Successfully.");

        } catch (error) {
            console.error("Error in SFCW Footer Script:", error);
        }
    });
})();
// --- End Script Block 2 ---

// खाली लाइन या सेमीकोलन जोड़ें
;

// --- Script Block 3: Table of Contents (TOC) ---
// ***** महत्वपूर्ण: सुनिश्चित करें कि यह कोड ब्लॉक आपकी फ़ाइल में केवल एक बार है *****
;(function() {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
        try { // Add try block
            console.log("Initializing TOC Script...");

            // --- Configuration ---
            const config = {
                postContainerSelector: ".post-body", // *** महत्वपूर्ण: इसे अपनी थीम के अनुसार बदलें ***
                headingsSelector: "h2, h3", // केवल h2 और h3 लें
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
            // --- End Configuration ---

            let currentHighlightTimeout = null;
            let tocContainer = null;
            let toc = null;
            let toggleButton = null;

            // --- Helper Functions ---
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
                else if (!specificHeading && specificContent.length === 0) { // Corrected condition
                    document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
                    document.querySelectorAll('.highlight-content').forEach(el => el.classList.remove('highlight-content'));
                }
            }

            function applyHighlight(targetHeading) {
                clearHighlights(); // पहले सभी हाइलाइट साफ़ करें
                if (!targetHeading) return;
                targetHeading.classList.add('highlight-target');
                const highlightedContent = [];
                let sibling = targetHeading.nextElementSibling;
                while (sibling && !sibling.matches(config.headingsSelector) && !sibling.matches('#toc-container')) {
                    if (sibling.nodeType === 1) { // केवल एलिमेंट नोड्स
                         sibling.classList.add('highlight-content');
                         highlightedContent.push(sibling);
                    }
                    sibling = sibling.nextElementSibling;
                }
                // टाइमआउट सेट करें
                if (currentHighlightTimeout) clearTimeout(currentHighlightTimeout); // पिछला टाइमआउट साफ करें
                currentHighlightTimeout = setTimeout(() => {
                     clearHighlights(targetHeading, highlightedContent);
                }, config.highlightDuration);
            }


             function smoothScrollToTarget(element) {
                if (!element) return;
                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const offset = window.innerHeight * 0.2; // ऑफसेट थोड़ा कम किया
                const targetScrollPosition = absoluteElementTop - offset;
                window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' }); // स्मूथ स्क्रॉल जोड़ा
            }

            function controlButtonGlow(buttonElement, shouldGlow) {
                if (!buttonElement) return;
                if (shouldGlow) {
                    setTimeout(() => {
                        if (toc && !toc.classList.contains('toc-visible')) { // toc की जांच करें
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

            // --- Initialization Function ---
            function initializeToc() {
                console.log("TOC: Starting initialization...");
                const postContent = document.querySelector(config.postContainerSelector);
                if (!postContent) {
                    console.warn("TOC: Container '" + config.postContainerSelector + "' not found. TOC cannot be created.");
                    return; // यदि कंटेनर नहीं मिलता है तो बाहर निकलें
                }
                console.log("TOC: Found post container:", postContent);

                // हेडिंग्स प्राप्त करें (केवल पोस्ट कंटेंट के अंदर, TOC के अंदर नहीं)
                const headings = Array.from(postContent.querySelectorAll(config.headingsSelector))
                                     .filter(h => !h.closest('#toc-container') && h.textContent.trim());

                console.log(`TOC: Found ${headings.length} valid headings.`);

                if (headings.length < config.minHeadingsForToc) {
                    console.log("TOC: Not enough headings (" + headings.length + ") to create TOC (minimum required: " + config.minHeadingsForToc + ").");
                    return; // यदि पर्याप्त हेडिंग्स नहीं हैं तो बाहर निकलें
                }

                // मौजूदा TOC हटाएं यदि है (डुप्लीकेट से बचने के लिए)
                 const existingTocContainer = document.getElementById('toc-container');
                 if (existingTocContainer) {
                     console.warn("TOC: Found existing TOC container. Removing it before creating a new one.");
                     existingTocContainer.remove();
                 }


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

                headings.forEach((heading, index) => {
                    let id = heading.getAttribute("id");
                    if (!id || document.querySelectorAll(`#${id}`).length > 1) { // आईडी यूनिक न हो तो नई बनाएं
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

                 // TOC को पहले मान्य हेडिंग से पहले डालें
                 const firstValidHeading = headings[0];
                if (firstValidHeading?.parentNode) {
                     firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading);
                     console.log("TOC: Inserted before the first heading.");
                } else if (postContent.firstChild) { // यदि पहली हेडिंग नहीं मिलती है तो पोस्ट की शुरुआत में डालें
                     postContent.insertBefore(tocContainer, postContent.firstChild);
                     console.log("TOC: Inserted at the beginning of the post container.");
                } else { // यदि पोस्ट खाली है
                     postContent.appendChild(tocContainer);
                     console.log("TOC: Appended to an empty post container.");
                }


                setupEventListeners();
                 console.log("TOC Initialized Successfully.");
            }

            // --- Event Listeners Function ---
            function setupEventListeners() {
                 console.log("TOC: Setting up event listeners...");
                if (!tocContainer || !toc || !toggleButton) {
                     console.warn("TOC: Cannot set up listeners because elements are missing.");
                     return;
                 }

                toggleButton.addEventListener('click', () => {
                     console.log("TOC: Toggle button clicked.");
                    const isExpanded = toc.classList.toggle('toc-visible');
                    updateButtonContent(isExpanded);
                    tocContainer.classList.toggle('toc-is-shown', isExpanded);
                    controlButtonGlow(toggleButton, !isExpanded);
                });

                toc.addEventListener('click', (event) => {
                     const linkElement = event.target.closest('a');
                     if (linkElement && linkElement.getAttribute('href')?.startsWith('#')) { // सुरक्षित जाँच
                        event.preventDefault();
                        const targetId = linkElement.getAttribute('href').substring(1);
                         console.log(`TOC: Link clicked, target ID: ${targetId}`);
                         const targetHeading = document.getElementById(targetId);
                         if (targetHeading) {
                             console.log("TOC: Target heading found:", targetHeading);
                             // यदि TOC बंद है तो खोलने की आवश्यकता नहीं क्योंकि स्क्रॉल और हाइलाइट फिर भी काम करेगा
                             smoothScrollToTarget(targetHeading);
                              // थोड़ी देर बाद हाइलाइट करें ताकि स्क्रॉलिंग के दौरान दिखाई दे
                             setTimeout(() => { applyHighlight(targetHeading); }, 300);
                         } else { console.warn("TOC: Target heading '" + targetId + "' not found in the document."); }
                     }
                 });
                 console.log("TOC: Event listeners set up.");
            }

            // --- Initialize ---
            initializeToc(); // मुख्य इनिशियलाइज़ेशन फ़ंक्शन को कॉल करें

        } catch (error) {
            console.error("Error in TOC Script:", error);
        }
    });
})();
// --- End Script Block 3 ---

// खाली लाइन या सेमीकोलन जोड़ें
;

// --- Script Block 4: Circular Menu ---
;(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        try { // Add try block
            console.log("Initializing Circular Menu Script...");
            const menuWidget = document.getElementById('my-unique-circle-menu');

            if (menuWidget) {
                 console.log("Circular Menu: Widget container found.");
                const menuToggle = menuWidget.querySelector('.menu-toggle');
                const categoriesMenu = menuWidget.querySelector('.menu-categories');
                const linksMenu = menuWidget.querySelector('.menu-links');
                const linksTitle = linksMenu ? linksMenu.querySelector('.links-title') : null;
                const categoryTitleElement = categoriesMenu ? categoriesMenu.querySelector('.category-title') : null;
                const categories = menuWidget.querySelectorAll('.category');
                const linksContent = menuWidget.querySelectorAll('.links-content .links'); // Specific selector

                const categoryIcons = { 'class-1-5': '<i class="fas fa-book-reader"></i>', 'class-6-8': '<i class="fas fa-graduation-cap"></i>', 'class-9-10': '<i class="fas fa-school"></i>', 'class-11-12': '<i class="fas fa-university"></i>', 'competitive-exam': '<i class="fas fa-trophy"></i>', 'news-channel': '<i class="fas fa-newspaper"></i>', 'yoga-ayurveda': '<i class="fas fa-heart"></i>', 'marriage-links': '<i class="fas fa-ring"></i>', 'editorial-links': '<i class="fas fa-edit"></i>', 'government-links': '<i class="fas fa-flag"></i>', 'astrology-links': '<i class="fas fa-star"></i>', 'vaidik-links': '<i class="fas fa-om"></i>' };
                const gradientClasses = [ 'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6', 'gradient-7', 'gradient-8', 'gradient-9', 'gradient-10', 'gradient-11', 'gradient-12' ];

                function removeGradientClasses(element) {
                    if (element) { gradientClasses.forEach(cls => element.classList.remove(cls)); }
                }

                // Check if all essential elements are found
                if (!menuToggle || !categoriesMenu || !linksMenu || !linksTitle || !categoryTitleElement || categories.length === 0 || linksContent.length === 0) {
                     console.warn("Circular Menu: One or more essential elements not found. Menu might not function correctly.");
                     return; // यदि आवश्यक तत्व नहीं मिलते हैं तो आगे न बढ़ें
                 }

                menuToggle.addEventListener('click', (event) => {
                     console.log("Circular Menu: Toggle clicked.");
                    event.stopPropagation();
                    const isActive = categoriesMenu.classList.contains('active');
                    if (isActive) {
                        categoriesMenu.classList.remove('active');
                        linksMenu.classList.remove('show');
                        categoryTitleElement.style.display = 'none';
                    } else {
                        linksMenu.classList.remove('show'); // पहले लिंक्स छिपाएं
                        categoriesMenu.classList.add('active');
                        categoryTitleElement.style.display = 'block'; // JS से नियंत्रित करें
                        removeGradientClasses(categoryTitleElement);
                        const randomGradientIndex = Math.floor(Math.random() * gradientClasses.length);
                        categoryTitleElement.classList.add(gradientClasses[randomGradientIndex]);
                        categoryTitleElement.innerHTML = '<i class="fas fa-hand-point-down"></i> अपनी पसंद पर क्लिक करें';
                    }
                });

                categories.forEach((category, index) => {
                    category.addEventListener('click', (event) => {
                         console.log(`Circular Menu: Category '${category.getAttribute('data-category')}' clicked.`);
                        event.stopPropagation();
                        const categoryData = category.getAttribute('data-category');
                        const titleText = category.getAttribute('data-title');
                        const iconHtml = categoryIcons[categoryData] || '<i class="fas fa-link"></i>';

                        linksContent.forEach(linkBox => { linkBox.style.display = 'none'; });

                        const targetLinks = linksMenu.querySelector(`.links-content .links.${categoryData}`); // More specific selector
                         if (targetLinks) {
                             targetLinks.style.display = 'block'; // या 'grid'/'flex' यदि लेआउट की आवश्यकता है
                         } else {
                             console.warn(`Circular Menu: Links container for category '${categoryData}' not found.`);
                         }

                        linksTitle.innerHTML = `${iconHtml} ${titleText}`;
                        removeGradientClasses(linksTitle);
                        linksTitle.classList.add(gradientClasses[index % gradientClasses.length]);

                        categoriesMenu.classList.remove('active');
                        linksMenu.classList.add('show');
                        categoryTitleElement.style.display = 'none';
                    });
                });

                document.addEventListener('click', (event) => {
                    if (!menuToggle.contains(event.target) && !categoriesMenu.contains(event.target) && !linksMenu.contains(event.target)) {
                        categoriesMenu.classList.remove('active');
                        linksMenu.classList.remove('show');
                        if (categoryTitleElement) categoryTitleElement.style.display = 'none'; // सुरक्षित जाँच
                    }
                });

                 console.log("Circular Menu Script Initialized Successfully.");

            } else {
                console.warn("Circular Menu: Widget container #my-unique-circle-menu not found.");
            }
        } catch (error) {
            console.error("Error in Circular Menu Script:", error);
        }
    });
})();
// --- End Script Block 4 ---


// ====== END: Combined & Isolated Scripts ======
