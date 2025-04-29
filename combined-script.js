// ==========================================================
// पोस्ट फॉर्मेट स्क्रिप्ट (post-format.js) - Defer के साथ
// ==========================================================
// बाहरी DOMContentLoaded रैपर हटा दिया गया है क्योंकि 'defer' का उपयोग किया गया है

// --------------------------------------------------
// विजेट 1: सर्कल मेन्यू लॉजिक (Prefix: cm-)
// --------------------------------------------------
(function() {
    const menuWidget = document.getElementById('my-unique-circle-menu');
    if (!menuWidget) {
        // console.log("Circle Menu widget not found.");
        return;
    }

    const menuToggle = menuWidget.querySelector('.menu-toggle');
    const categoriesMenu = menuWidget.querySelector('.menu-categories');
    const linksMenu = menuWidget.querySelector('.menu-links');
    const linksTitle = linksMenu ? linksMenu.querySelector('.links-title') : null;
    const categoryTitleElement = categoriesMenu ? categoriesMenu.querySelector('.category-title') : null;
    const categories = menuWidget.querySelectorAll('.category');
    const linksContent = menuWidget.querySelectorAll('.links-content .links');

    const categoryIcons = { /* ... आपका आइकन मैपिंग ... */ };
    const gradientClasses = [ /* ... आपकी ग्रेडिएंट क्लासेज ... */ ];

    function removeGradientClasses(element) { /* ... आपका फ़ंक्शन ... */ }

    // इवेंट लिस्टनर्स (पहले जैसे ही)
    if (menuToggle && categoriesMenu && linksMenu && categoryTitleElement) {
        menuToggle.addEventListener('click', (event) => { /* ... टॉगल लॉजिक ... */ });
    }
    if (categories.length > 0 && linksMenu && linksTitle && categoriesMenu && categoryTitleElement) {
        categories.forEach((category, index) => {
            category.addEventListener('click', (event) => { /* ... कैटेगरी क्लिक लॉजिक ... */ });
        });
    }

    // डॉक्यूमेंट क्लिक लिस्नर (पहले जैसा ही)
    document.addEventListener('click', (event) => {
        if (menuToggle && categoriesMenu && linksMenu && categoryTitleElement) {
            if (!menuToggle.contains(event.target) && !categoriesMenu.contains(event.target) && !linksMenu.contains(event.target)) {
                categoriesMenu.classList.remove('active');
                linksMenu.classList.remove('show');
                categoryTitleElement.style.display = 'none';
            }
        }
    });

    console.log("Circle Menu Initialized.");

})(); // सर्कल मेन्यू IIFE समाप्त

// --------------------------------------------------
// विजेट 2: टेबल ऑफ कंटेंट्स (TOC) लॉजिक
// --------------------------------------------------
(function() {
    // कॉन्फ़िगरेशन (यह IIFE के अंदर रहेगा)
    const config = {
        postContainerSelector: ".post-body",
        headingsSelector: "h2, h3",
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

    // यदि मुख्य पोस्ट कंटेनर मौजूद नहीं है, तो इस विजेट के लिए कुछ न करें
    const postContent = document.querySelector(config.postContainerSelector);
    if (!postContent) {
        // console.warn("TOC: Container '" + config.postContainerSelector + "' not found.");
        return;
    }

    // हेल्पर फ़ंक्शंस (createSafeId, clearHighlights, applyHighlight, smoothScrollToTarget, controlButtonGlow, updateButtonContent)
    function createSafeId(heading, index) { /* ... */ }
    function clearHighlights(specificHeading = null, specificContent = []) { /* ... */ }
    function applyHighlight(targetHeading) { /* ... */ }
    function smoothScrollToTarget(element) { /* ... */ }
    function controlButtonGlow(buttonElement, shouldGlow) { /* ... */ }
    function updateButtonContent(isExpanded) { /* ... */ }

    // initializeToc और setupEventListeners फ़ंक्शंस
    function initializeToc() {
        const headings = Array.from(postContent.querySelectorAll(config.headingsSelector));
        // ... (बाकी initializeToc लॉजिक, जैसा पहले था) ...
        // सुनिश्चित करें कि postContent पहले से परिभाषित है (ऊपर देखें)

        const validHeadings = [];
        let firstValidHeading = null;
        headings.forEach(heading => { /* ... */ });

        if (validHeadings.length < config.minHeadingsForToc) return;

        tocContainer = document.createElement("div"); tocContainer.id = "toc-container";
        toggleButton = document.createElement("button"); toggleButton.id = "toc-toggle-button";
        updateButtonContent(false);
        toggleButton.setAttribute("aria-controls", "toc");
        controlButtonGlow(toggleButton, true);
        // ... (बाकी TOC HTML निर्माण लॉजिक) ...
         toc = document.createElement("div"); toc.id = "toc";
         const tocTitle = document.createElement("h2");
         tocTitle.textContent = config.tocTitleText;
         toc.appendChild(tocTitle);
         const tocList = document.createElement("ul");
         validHeadings.forEach((heading, index) => { /* ... लिस्ट आइटम बनाएं ... */ });
         toc.appendChild(tocList); tocContainer.appendChild(toggleButton); tocContainer.appendChild(toc);
         if (firstValidHeading?.parentNode) { firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading); }
         else if (postContent.firstChild) { postContent.insertBefore(tocContainer, postContent.firstChild); }
         else { postContent.appendChild(tocContainer); }


        setupEventListeners(); // initializeToc के अंत में कॉल करें
    }

    function setupEventListeners() {
        if (!tocContainer || !toc || !toggleButton) return;
        toggleButton.addEventListener('click', () => { /* ... */ });
        toc.addEventListener('click', (event) => { /* ... */ });
    }

    // विजेट इनिशियलाइज़ेशन
    try {
        initializeToc();
        console.log("Table of Contents Initialized.");
    } catch (error) {
        console.error("TOC Script Error:", error);
    }

})(); // TOC IIFE समाप्त

// --------------------------------------------------
// === अन्य विजेट/गैजेट यहाँ जोड़े जा सकते हैं ===
// --------------------------------------------------
// (function() {
//    // विजेट 3 का कोड
// })();

// --- अन्य सामान्य स्क्रिप्ट्स (जैसे स्क्रॉल-आधारित नेविगेशन अपडेट) ---
// इन्हें भी IIFE में रखा जा सकता है या सीधे यहाँ लिखा जा सकता है,
// क्योंकि defer सुनिश्चित करता है कि तत्व मौजूद हैं जब यह कोड चलता है।

const updateActiveLinkBasedOnScroll = () => {
    const sections = document.querySelectorAll('.akc-custom-div[id^="part"]');
    const navLinks = document.querySelectorAll('.akc-story-nav a[href^="#part"]');
    const navHeight = document.querySelector('.akc-story-nav') ? document.querySelector('.akc-story-nav').offsetHeight : 50;
    if (sections.length === 0 || navLinks.length === 0) return;
    // ... (बाकी स्क्रॉल लॉजिक जैसा पहले था) ...
};

// पेज लोड/रीफ्रेश पर प्रारंभिक जांच
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  updateActiveLinkBasedOnScroll();
} else {
  // दुर्लभ मामलों के लिए फॉलबैक
  document.addEventListener("DOMContentLoaded", updateActiveLinkBasedOnScroll);
}
window.addEventListener('scroll', updateActiveLinkBasedOnScroll);

// हैश आधारित स्क्रॉलिंग और लिंक एक्टिवेशन (पहले जैसा)
const hash = window.location.hash;
// ... (हैश प्रोसेसिंग लॉजिक) ...
if (hash && hash.startsWith("#part")) {
    // ... (लिंक एक्टिवेशन और स्क्रॉलिंग, थोड़ा विलंब के साथ) ...
    setTimeout(() => { /* ... */ }, 150);
} else {
     // ... (डिफ़ॉल्ट लिंक एक्टिवेशन) ...
}

// अंत में पुष्टि का संदेश
console.log("Post Format Script Loaded (deferred).");
