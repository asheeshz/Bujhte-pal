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
// (पिछला कोड यहाँ समाप्त होता है...)

// --------------------------------------------------
// विजेट 3: खोजें और सीखें विजेट लॉजिक
// --------------------------------------------------
(function() { // Start IIFE for Search & Learn widget

    // सबसे पहले मुख्य विजेट तत्व प्राप्त करें
    const mainVSWWidget = document.getElementById('vsw-main-widget');

    // यदि विजेट HTML पेज पर मौजूद नहीं है, तो बाहर निकल जाएं
    if (!mainVSWWidget) {
        // console.log("Search & Learn widget (vsw) not found on this page."); // वैकल्पिक डीबगिंग संदेश
        return;
    }

    // --- विजेट के आंतरिक वेरिएबल्स (अब IIFE के अंदर स्कोप्ड) ---
    // नोट: DOMContentLoaded से हटाए गए वेरिएबल घोषणाएँ यहाँ ले आएँ
    let vsw_categoryButtonsContainer;
    let vsw_categoryBanner;
    let vsw_allSearchContainers;
    let vsw_videoSliderContainer;
    let vsw_videoDisplay;
    let vsw_videoSliderNav;
    let vsw_messageBox;
    let vsw_videoSlider;
    let vsw_youtubeIframe;
    let vsw_messageTexts;

    let vsw_currentVideoItems = [];
    let vsw_videoSlideIndex = 0;
    let vsw_itemsPerPage = 4; // Default, will be recalculated
    let vsw_activeSearchContainerId = null;
    let vsw_messageTimeout;
    let vsw_resizeTimeout;

    // --- विजेट के आंतरिक फंक्शन्स (अब IIFE के अंदर स्कोप्ड) ---
    // नोट: सभी vsw_... फंक्शन परिभाषाएँ यहाँ कॉपी करें

    // --- Banner Helper Functions (Prefixed) ---
    function vsw_showBanner() {
        // Ensure vsw_categoryBanner is assigned *before* calling this if needed immediately
        if(vsw_categoryBanner) vsw_categoryBanner.style.display = 'block';
    }
    function vsw_hideBanner() {
         if(vsw_categoryBanner) vsw_categoryBanner.style.display = 'none';
    }

    // --- Helper function to get text from hidden message elements (Prefixed) ---
    function vsw_getTextById(id) {
        // Ensure vsw_messageTexts is assigned first
        if (!vsw_messageTexts) {
            console.error("VSW Error: Message text container not found (check initialization order).");
            return `[${id}]`;
        }
        const element = vsw_messageTexts.querySelector(`#${id}`);
        if (element) {
            return element.textContent || `[${id}]`;
        } else {
            console.warn(`VSW Warning: Message ID "${id}" not found.`);
            return `[${id}]`;
        }
    }

    // --- Category Button Logic (Prefixed) ---
    function vsw_setupCategoryButtons() {
        if (!vsw_categoryButtonsContainer) return;
        const buttons = vsw_categoryButtonsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const targetId = button.getAttribute('data-target');
                if (targetId) {
                    vsw_toggleCategory(targetId);
                } else {
                     console.warn("VSW Warning: Button missing data-target attribute.");
                }
            });
        });
    }

    function vsw_closeCurrentlyActiveCategory() {
        if (vsw_activeSearchContainerId) {
            const currentActiveContainer = document.getElementById(vsw_activeSearchContainerId);
            if (currentActiveContainer) {
                currentActiveContainer.classList.remove('vsw-active-search-box');
                // Use optional chaining in case elements aren't yet attached
                if (vsw_videoSliderContainer && currentActiveContainer.contains(vsw_videoSliderContainer)) vsw_videoSliderContainer.remove();
                if (vsw_videoDisplay && currentActiveContainer.contains(vsw_videoDisplay)) vsw_videoDisplay.remove();
            } else {
                 console.warn(`VSW Warning: Active container ID ${vsw_activeSearchContainerId} not found in DOM during close.`);
            }
            vsw_activeSearchContainerId = null;
            vsw_showBanner(); // Show banner when a category closes
        }
    }

    function vsw_toggleCategory(containerIdToShow) {
        const containerToShow = document.getElementById(containerIdToShow);
        if (!containerToShow) {
            console.error(`VSW Error: Target container ID ${containerIdToShow} not found.`);
            return;
        }

        const isAlreadyActive = (containerIdToShow === vsw_activeSearchContainerId);
        vsw_closeCurrentlyActiveCategory(); // Close any open category

        if (!isAlreadyActive) {
            containerToShow.classList.add('vsw-active-search-box');
            vsw_activeSearchContainerId = containerIdToShow;

            // Append video sections (ensure they exist)
            if (vsw_videoSliderContainer) containerToShow.appendChild(vsw_videoSliderContainer);
            if (vsw_videoDisplay) containerToShow.appendChild(vsw_videoDisplay);

            vsw_clearVideoResults();
            vsw_hideVideoSections(); // Start hidden
            vsw_hideBanner();
            vsw_itemsPerPage = vsw_calculateItemsPerPage(); // Recalculate contextually
            // Use scrollIntoView on the *container that was shown*
            containerToShow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        vsw_hideMessage();
    }

    // --- Click Outside Logic (Prefixed) ---
    function vsw_setupOutsideClickListener() {
        document.addEventListener('click', (event) => {
            if (!vsw_activeSearchContainerId) return;
            const activeContainer = document.getElementById(vsw_activeSearchContainerId);
            // Important: Check if the click originated *inside* the main widget container
            // OR on a category button OR the banner. If so, do nothing.
            if (mainVSWWidget.contains(event.target) ||
                event.target.closest('.vsw-category-buttons button') ||
                event.target.closest('#vsw-category-banner')) {
                return;
            }
            // If click is outside all relevant areas, close the active category
            vsw_closeCurrentlyActiveCategory();
        });
    }

    // --- YouTube API Interaction (Prefixed) ---
    async function vsw_fetchYouTubeData(searchTerm = '') {
        const apiKey = 'AIzaSyBYVKCeEIlBjCoS6Xy_mWatJywG3hUPv3Q'; // WARNING: Exposed Key!
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.length < 30) {
             console.error("VSW Error: Invalid or missing API Key configuration.");
             vsw_showMessage(vsw_getTextById('vsw-msgApiKeyError'), 5000);
             vsw_hideVideoSections();
             return;
        }
        const apiHost = 'youtube.googleapis.com';
        const maxResults = 30;
        const safeSearchTerm = searchTerm || 'शैक्षणिक वीडियो हिंदी';
        let apiUrl = `https://${apiHost}/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&key=${apiKey}&q=${encodeURIComponent(safeSearchTerm)}`;
        if (safeSearchTerm.includes("हिंदी") || safeSearchTerm.match(/[\u0900-\u097F]/)) {
             apiUrl += `&relevanceLanguage=hi`;
        }

        vsw_showMessage(vsw_getTextById('vsw-msgSearchingVideos'), 2500);
        vsw_hideVideoSections(); vsw_clearVideoResults();

        try {
            const response = await fetch(apiUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
            const data = await response.json();
            if (!response.ok) { /* ... (error handling as before) ... */
                console.error('VSW API Error Response:', data);
                let errorId = 'vsw-msgApiGenericErrorPrefix'; let errorDetails = `(${response.status})`;
                if (data.error?.message) {
                    errorDetails += `: ${data.error.message}`;
                    if (data.error.errors?.[0]?.reason === 'quotaExceeded') { errorId = 'vsw-msgApiQuotaError'; errorDetails = ''; }
                    else if (data.error.errors?.[0]?.reason === 'keyInvalid') { errorId = 'vsw-msgApiKeyInvalid'; errorDetails = ''; }
                }
                const apiError = new Error(vsw_getTextById(errorId) + errorDetails); apiError.statusCode = response.status; throw apiError;
            }
            if (!data?.items || data.items.length === 0) { /* ... (no videos handling) ... */
                 vsw_showMessage(vsw_getTextById('vsw-msgNoVideosFound'), 4000); vsw_hideVideoSections(); vsw_clearVideoResults(); vsw_currentVideoItems = []; return;
             }
            vsw_currentVideoItems = data.items.filter(item => item.id?.videoId && item.snippet);
            if (vsw_currentVideoItems.length === 0) { /* ... (no valid videos handling) ... */
                 vsw_showMessage(vsw_getTextById('vsw-msgNoVideosFound') + " (filtered)", 4000); vsw_hideVideoSections(); vsw_clearVideoResults(); return;
            }
            vsw_displayVideos(vsw_currentVideoItems); vsw_showVideoSections(); vsw_hideMessage();
        } catch (error) { /* ... (fetch error handling as before) ... */
            console.error('VSW Fetch Error:', error);
            let displayError = vsw_getTextById('vsw-msgInternalError');
            if (error.message) {
                 if (error.message.startsWith(vsw_getTextById('vsw-msgApiGenericErrorPrefix')) || error.message.startsWith(vsw_getTextById('vsw-msgApiQuotaError')) || error.message.startsWith(vsw_getTextById('vsw-msgApiKeyInvalid')) || error.message.startsWith(vsw_getTextById('vsw-msgApiKeyError'))) { displayError = error.message; }
                 else { displayError = `${vsw_getTextById('vsw-msgVideoLoadErrorPrefix')}: ${error.message}`; }
            }
            vsw_showMessage(displayError, 6000); vsw_hideVideoSections(); vsw_clearVideoResults(); vsw_currentVideoItems = [];
        }
    }

    // --- Video Display (Prefixed) ---
    function vsw_displayVideos(videos) {
        if (!vsw_videoSlider) return;
        vsw_videoSlider.innerHTML = ''; vsw_videoSlideIndex = 0;
        if (!videos || videos.length === 0) { /* ... (no videos message) ... */
             vsw_videoSlider.innerHTML = `<p style="color:#ccc; padding: 20px; text-align: center; width: 100%;">${vsw_getTextById('vsw-msgNoVideosFound')}</p>`;
             if (vsw_videoSliderNav) vsw_videoSliderNav.style.display = 'none';
             if (vsw_youtubeIframe) vsw_youtubeIframe.src = '';
             if (vsw_videoDisplay) vsw_videoDisplay.style.display = 'none';
             return;
         }
        videos.forEach((video, index) => { /* ... (create video item as before) ... */
            if (!video.id?.videoId || !video.snippet) { console.warn("VSW Skipping invalid item:", video); return; };
            const videoId = video.id.videoId; const videoTitle = video.snippet.title || 'Untitled';
            const thumbnailUrl = video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            const videoItem = document.createElement('div'); videoItem.classList.add('vsw-video-item'); videoItem.setAttribute('data-index', index); videoItem.setAttribute('data-videoid', videoId);
            const thumbnail = document.createElement('img'); thumbnail.src = thumbnailUrl; thumbnail.alt = videoTitle;
            thumbnail.onerror = function() { this.onerror=null; this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; console.warn(`VSW Thumb fail: ${thumbnailUrl}`); };
            const title = document.createElement('p'); const tempEl = document.createElement('textarea'); tempEl.innerHTML = videoTitle; title.textContent = tempEl.value;
            videoItem.appendChild(thumbnail); videoItem.appendChild(title);
            videoItem.addEventListener('click', () => { vsw_displayEmbeddedVideo(videoId); if (vsw_videoDisplay) { vsw_videoDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } });
            vsw_videoSlider.appendChild(videoItem);
        });
        if (videos.length > 0 && videos[0].id?.videoId) { vsw_displayEmbeddedVideo(videos[0].id.videoId); }
        else { if (vsw_youtubeIframe) vsw_youtubeIframe.src = ''; if (vsw_videoDisplay) vsw_videoDisplay.style.display = 'none'; }
        vsw_itemsPerPage = vsw_calculateItemsPerPage(); vsw_updateVideoSlider();
        if (vsw_videoSliderNav) { vsw_videoSliderNav.style.display = vsw_currentVideoItems.length > vsw_itemsPerPage ? 'flex' : 'none'; }
    }

    function vsw_displayEmbeddedVideo(videoId) { /* ... (function as before) ... */
        if (!vsw_youtubeIframe || !vsw_videoDisplay) return;
        if (!videoId) { vsw_youtubeIframe.src = ''; vsw_videoDisplay.style.display = 'none'; return; }
        vsw_youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&hl=hi`;
        vsw_videoDisplay.style.display = 'block';
        vsw_youtubeIframe.onerror = () => { console.error('VSW iFrame fail:', videoId); vsw_showMessage(vsw_getTextById('vsw-msgVideoLoadFailed'), 3000); if(vsw_videoDisplay) vsw_videoDisplay.style.display = 'none'; };
    }

    function vsw_clearVideoResults() { /* ... (function as before) ... */
        if (vsw_videoSlider) vsw_videoSlider.innerHTML = '';
        if (vsw_youtubeIframe) vsw_youtubeIframe.src = '';
        vsw_currentVideoItems = []; vsw_videoSlideIndex = 0;
    }

    // --- Video Slider Navigation (Prefixed) ---
    function vsw_calculateItemsPerPage() { /* ... (function as before) ... */
        if (!vsw_videoSliderContainer || !document.body.contains(vsw_videoSliderContainer)) { return 4; }
        const containerWidth = vsw_videoSliderContainer.offsetWidth - 20;
        const itemWidth = 150; const itemMargin = 12; const itemTotalWidth = itemWidth + itemMargin;
        if (containerWidth <= 0 || itemTotalWidth <= 0) { return 1; }
        const calculatedItems = Math.max(1, Math.floor(containerWidth / itemTotalWidth));
        return calculatedItems;
    }

    function vsw_slideVideo(direction) { /* ... (function as before) ... */
        const numVideoItems = vsw_currentVideoItems.length; vsw_itemsPerPage = vsw_calculateItemsPerPage();
        if (numVideoItems <= vsw_itemsPerPage) return;
        const maxIndex = numVideoItems - vsw_itemsPerPage;
        let newIndex = vsw_videoSlideIndex + direction;
        vsw_videoSlideIndex = Math.max(0, Math.min(maxIndex, newIndex));
        vsw_updateVideoSlider();
    }

    function vsw_updateVideoSlider() { /* ... (function as before) ... */
         if (!vsw_videoSlider || vsw_currentVideoItems.length === 0) { if (vsw_videoSlider) vsw_videoSlider.style.transform = `translateX(0px)`; return; };
        const itemWidth = 150; const itemMargin = 12;
        const slideAmount = -vsw_videoSlideIndex * (itemWidth + itemMargin);
        vsw_videoSlider.style.transform = `translateX(${slideAmount}px)`;
    }

    // Prefixed resize handler
    function vsw_handleResize() { /* ... (function as before) ... */
        clearTimeout(vsw_resizeTimeout);
        vsw_resizeTimeout = setTimeout(() => {
            if (vsw_videoSliderContainer && document.body.contains(vsw_videoSliderContainer)) {
                const oldItemsPerPage = vsw_itemsPerPage; vsw_itemsPerPage = vsw_calculateItemsPerPage();
                if (oldItemsPerPage !== vsw_itemsPerPage) {
                    const maxIndex = Math.max(0, vsw_currentVideoItems.length - vsw_itemsPerPage);
                    vsw_videoSlideIndex = Math.min(vsw_videoSlideIndex, maxIndex);
                    vsw_updateVideoSlider();
                    if (vsw_videoSliderNav) { vsw_videoSliderNav.style.display = vsw_currentVideoItems.length > vsw_itemsPerPage ? 'flex' : 'none'; }
                }
            }
        }, 250);
    }

    // --- Search Logic (Prefixed) ---
    // This function needs to be callable from the HTML (onclick), so it remains globally accessible *within the IIFE*.
    // To make it callable from inline HTML `onclick`, we need to attach it to the window object, but *only* if the widget exists.
    window.vsw_performSearch = function(searchBoxId) { // Attach to window
        const searchBox = document.getElementById(searchBoxId);
        if (!searchBox) { console.error("VSW Error: Search box not found:", searchBoxId); return; }
        let finalSearchTerm = ''; let dropdownSelectionMade = false; let dropdownSearchTerm = '';
        const selects = searchBox.querySelectorAll('select');
        const textInput = searchBox.querySelector('.vsw-custom-search-input');
        selects.forEach(select => { if (select.value?.trim()) { dropdownSearchTerm += select.value.trim() + ' '; dropdownSelectionMade = true; } });
        dropdownSearchTerm = dropdownSearchTerm.trim();
        const textValue = textInput ? textInput.value.trim() : '';
        if (textValue) { finalSearchTerm = textValue; } // Prioritize text input
        else if (dropdownSelectionMade) { finalSearchTerm = dropdownSearchTerm; }
        else { vsw_showMessage(vsw_getTextById('vsw-msgValidationError'), 4000); return; }
        vsw_hideMessage(); console.log(`VSW Performing search for: "${finalSearchTerm}"`);
        vsw_fetchYouTubeData(finalSearchTerm);
    }
    // Similarly for slideVideo if called from HTML onclick
    window.vsw_slideVideo = vsw_slideVideo; // Attach existing function to window


    // --- UI Helper Functions (Prefixed) ---
    function vsw_showVideoSections() { /* ... (function as before) ... */
        if (vsw_currentVideoItems.length > 0) {
            if (vsw_videoSliderContainer) vsw_videoSliderContainer.style.display = 'block';
            if (vsw_youtubeIframe && vsw_youtubeIframe.src && vsw_youtubeIframe.src !== 'about:blank' && vsw_videoDisplay) { vsw_videoDisplay.style.display = 'block'; }
            else { if (vsw_videoDisplay) vsw_videoDisplay.style.display = 'none'; }
            vsw_itemsPerPage = vsw_calculateItemsPerPage();
            if (vsw_videoSliderNav) { vsw_videoSliderNav.style.display = vsw_currentVideoItems.length > vsw_itemsPerPage ? 'flex' : 'none'; }
        } else { vsw_hideVideoSections(); }
    }

    function vsw_hideVideoSections() { /* ... (function as before) ... */
        if (vsw_videoSliderContainer) vsw_videoSliderContainer.style.display = 'none';
        if (vsw_videoDisplay) vsw_videoDisplay.style.display = 'none';
        if (vsw_videoSliderNav) vsw_videoSliderNav.style.display = 'none';
    }

    function vsw_showMessage(messageText, duration = 3000) { /* ... (function as before) ... */
        if (!vsw_messageBox) return; clearTimeout(vsw_messageTimeout);
        const textToShow = messageText || vsw_getTextById('vsw-msgInternalError');
        vsw_messageBox.textContent = textToShow; vsw_messageBox.style.display = 'block';
        vsw_messageTimeout = setTimeout(vsw_hideMessage, duration);
    }

    function vsw_hideMessage() { /* ... (function as before) ... */
        if (!vsw_messageBox) return; clearTimeout(vsw_messageTimeout);
        vsw_messageBox.style.display = 'none';
    }


    // --- Initialization Logic (Moved from DOMContentLoaded) ---
    // Assign DOM elements to IIFE-scoped variables
    // Note: mainVSWWidget is already assigned at the start of the IIFE
    vsw_categoryButtonsContainer = mainVSWWidget.querySelector('.vsw-category-buttons'); // Use querySelector within the widget
    vsw_categoryBanner = document.getElementById('vsw-category-banner'); // This might be outside main widget? Check HTML. If yes, document is fine.
    vsw_allSearchContainers = mainVSWWidget.querySelectorAll('.vsw-search-category-container'); // Use querySelectorAll within the widget
    vsw_videoSliderContainer = document.getElementById('vsw-video-slider-container'); // Get reference to the template/placeholder
    vsw_videoDisplay = document.getElementById('vsw-video-display'); // Get reference to the template/placeholder
    vsw_messageBox = document.getElementById('vsw-messageBox'); // Message box is likely outside main widget
    vsw_messageTexts = document.getElementById('vsw-message-texts'); // Hidden texts likely outside main widget

    // Check critical elements again *before* proceeding with setup that depends on them
    if (!vsw_categoryButtonsContainer || !vsw_messageTexts || !vsw_messageBox || !vsw_videoSliderContainer || !vsw_videoDisplay ) {
         console.error("VSW Error: One or more essential *internal* or related widget elements not found. Initialization aborted.");
         // Clean up functions attached to window if initialization fails
         if (window.vsw_performSearch === arguments.callee.vsw_performSearch) delete window.vsw_performSearch; // Avoid deleting if defined elsewhere
         if (window.vsw_slideVideo === arguments.callee.vsw_slideVideo) delete window.vsw_slideVideo;
         return; // Stop initialization
    }
    // Now get references to elements *inside* the placeholders
    vsw_videoSliderNav = vsw_videoSliderContainer.querySelector('#vsw-video-slider-nav');
    vsw_videoSlider = vsw_videoSliderContainer.querySelector('#vsw-video-slider');
    vsw_youtubeIframe = vsw_videoDisplay.querySelector('#vsw-youtube-iframe');


    // Initial setup
    if (vsw_videoSliderContainer) vsw_videoSliderContainer.remove(); // Remove placeholders from initial position
    if (vsw_videoDisplay) vsw_videoDisplay.remove();

    vsw_showBanner(); // Show banner initially
    vsw_itemsPerPage = vsw_calculateItemsPerPage(); // Calculate initial items per page
    vsw_setupCategoryButtons(); // Set up category button listeners
    vsw_setupOutsideClickListener(); // Set up listener to close category on outside click
    window.addEventListener('resize', vsw_handleResize); // Add resize listener

    vsw_hideVideoSections(); // Ensure video sections start hidden

    console.log("Search & Learn Widget (VSW) Initialized (deferred)."); // Confirmation message

})(); // End IIFE for Search & Learn widget
