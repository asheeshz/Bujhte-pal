// circle-menu.js
// यह स्क्रिप्ट <script defer> के साथ उपयोग के लिए है।
// बाहरी DOMContentLoaded लिस्नर हटा दिया गया है।

(function() { // विजेट कोड को एनकैप्सुलेट करने के लिए IIFE का उपयोग करना अभी भी अच्छा अभ्यास है

    // सुनिश्चित करें कि JS कोड यूनिक आईडी के अंदर के एलिमेंट को टारगेट करे
    const menuWidget = document.getElementById('my-unique-circle-menu');

    // यदि विजेट मौजूद नहीं है, तो कुछ भी न करें और बाहर निकल जाएं
    if (!menuWidget) {
        // console.log("Circle Menu widget not found on this page."); // वैकल्पिक डीबगिंग संदेश
        return;
    }

    // --- विजेट के आंतरिक तत्व ---
    // (यहां से आपका बाकी कोड अपरिवर्तित रहेगा)

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

    // आइकन मैपिंग
    const categoryIcons = {
        'class-1-5': '<i class="fas fa-book-reader"></i>', 'class-6-8': '<i class="fas fa-graduation-cap"></i>',
        'class-9-10': '<i class="fas fa-school"></i>', 'class-11-12': '<i class="fas fa-university"></i>',
        'competitive-exam': '<i class="fas fa-trophy"></i>', 'news-channel': '<i class="fas fa-newspaper"></i>',
        'yoga-ayurveda': '<i class="fas fa-heart"></i>', 'marriage-links': '<i class="fas fa-ring"></i>',
        'editorial-links': '<i class="fas fa-edit"></i>', 'government-links': '<i class="fas fa-flag"></i>',
        'astrology-links': '<i class="fas fa-star"></i>', 'vaidik-links': '<i class="fas fa-om"></i>'
    };

    // Gradient classes
    const gradientClasses = [
        'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6',
        'gradient-7', 'gradient-8', 'gradient-9', 'gradient-10', 'gradient-11', 'gradient-12'
    ];

    // Function to remove all gradient classes
    function removeGradientClasses(element) {
         if (element) {
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
                linksMenu.classList.remove('show'); // Close links if opening categories
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

                 linksContent.forEach(linkBox => {
                     linkBox.style.display = 'none';
                 });

                 const targetLinks = linksMenu.querySelector(`.links-content .${categoryData}`);
                 if (targetLinks) {
                     targetLinks.style.display = 'block';
                 }

                 if (linksTitle) { // Check if linksTitle exists
                     linksTitle.innerHTML = `${iconHtml} ${titleText}`;
                     removeGradientClasses(linksTitle);
                     linksTitle.classList.add(gradientClasses[index % gradientClasses.length]);
                 }

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

    console.log("Circle Menu Initialized (deferred)."); // पुष्टि संदेश

})(); // End IIFE
// --------------------------------------------------
// विजेट 2: टेबल ऑफ कंटेंट्स (TOC) लॉजिक
// --------------------------------------------------
(function() { // Start IIFE for TOC widget

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

    // --- Variables (scoped within this IIFE) ---
    let currentHighlightTimeout = null;
    let tocContainer = null;
    let toc = null;
    let toggleButton = null;
    const postContent = document.querySelector(config.postContainerSelector); // Query once

    // --- Functions (scoped within this IIFE) ---
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
        // Use smooth scrolling behavior
        window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
    }


    function controlButtonGlow(buttonElement, shouldGlow) {
        if (!buttonElement) return;
        if (shouldGlow) {
            setTimeout(() => {
                // Check again inside timeout in case state changed quickly
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

    function setupEventListeners() {
        if (!tocContainer || !toc || !toggleButton) return;

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
                const targetHeading = document.getElementById(targetId);
                if (targetHeading) {
                   // Only force open if it's currently closed
                   if (!toc.classList.contains('toc-visible')) {
                       toc.classList.add('toc-visible');
                       tocContainer.classList.add('toc-is-shown');
                       updateButtonContent(true); // Update button state
                       controlButtonGlow(toggleButton, false); // Stop glow
                   }
                   smoothScrollToTarget(targetHeading);
                   // Apply highlight after scrolling might have finished
                   setTimeout(() => { applyHighlight(targetHeading); }, 500); // Delay might need adjustment
                } else { console.warn("TOC: Target '" + targetId + "' not found."); }
            }
        });
    }

    function initializeToc() {
        // postContent is already defined at the top of the IIFE
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

        if (validHeadings.length < config.minHeadingsForToc) {
             // console.log("TOC: Not enough headings found to generate TOC."); // Optional message
             return; // Exit if not enough headings
        }


        tocContainer = document.createElement("div"); tocContainer.id = "toc-container";
        toggleButton = document.createElement("button"); toggleButton.id = "toc-toggle-button";
        updateButtonContent(false); // Initial state: collapsed
        toggleButton.setAttribute("aria-controls", "toc");
        controlButtonGlow(toggleButton, true); // Initial glow

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

        // Insert TOC before the first valid heading found
        if (firstValidHeading && firstValidHeading.parentNode) {
             firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading);
         } else if (postContent.firstChild) { // Fallback: Insert at the beginning of post content
             postContent.insertBefore(tocContainer, postContent.firstChild);
         } else { // Fallback: Append if post content is empty
             postContent.appendChild(tocContainer);
         }


        setupEventListeners(); // Setup listeners after elements are in the DOM
        console.log("Table of Contents Initialized."); // Confirmation message
    }

    // --- Initialization ---
    // Execute the initialization logic for this widget
    try {
        initializeToc();
    } catch (error) {
        console.error("TOC Script Error:", error);
    }

})(); // End IIFE for TOC widget
