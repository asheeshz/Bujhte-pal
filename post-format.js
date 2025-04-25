// ============== Prefixed JavaScript Code (kaalpath-script.js) ==============
document.addEventListener("DOMContentLoaded", function() {

    // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
    const smoothScrollLinks = document.querySelectorAll(".kaalpath-custom-a[href^='#'], .kaalpath-story-nav a[href^='#']");
    const navElement = document.querySelector('.kaalpath-story-nav');
    const navHeight = navElement ? navElement.offsetHeight : 50;

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
                         } else { kaalpath_updateActiveLinkBasedOnScroll(); } // Prefixed function call
                     } catch(e) { console.error("Error updating active nav link:", e); }
                } else { console.warn(`Element with ID ${href} not found.`); }
            }
        });
    });

     const sections = document.querySelectorAll('.kaalpath-custom-div[id^="part"]');
     const navLinks = document.querySelectorAll('.kaalpath-story-nav a[href^="#part"]');

     // Prefixed function definition
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

     kaalpath_updateActiveLinkBasedOnScroll(); // Initial call
     window.addEventListener('scroll', kaalpath_updateActiveLinkBasedOnScroll); // Event listener

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
    // --- स्मूथ स्क्रॉल समाप्त ---

    // --- स्वचालित पेजिनेशन ---
    // Prefixed function definition
    function kaalpath_setupPagination() {
        const paginationContainer = document.querySelector('.kaalpath-pagination-section'); // Prefixed selector
        if (!paginationContainer) { console.warn("Pagination container not found."); return; }

        // ******** USER CONFIGURATION REQUIRED ********
        const totalPages = 6; // <-- अपनी कहानी के कुल भागों की संख्या यहाँ सेट करें
        const baseFilename = 'aranyani-kaushik-part'; // <-- अपनी फ़ाइल नामकरण योजना यहाँ सेट करें
        const fileExtension = '.html'; // <-- अपनी फ़ाइल का एक्सटेंशन यहाँ सेट करें
        // *******************************************

        let currentPageNumber = 1;
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

        paginationContainer.innerHTML = '';

        for (let i = Math.max(1, currentPageNumber - 4); i < currentPageNumber; i++) {
            const link = document.createElement('a');
            link.href = `${baseFilename}${i}${fileExtension}`;
            link.textContent = i; link.classList.add('kaalpath-pagination-link'); // Prefixed class
            paginationContainer.appendChild(link);
        }
        const currentSpan = document.createElement('span');
        currentSpan.textContent = currentPageNumber;
        currentSpan.classList.add('kaalpath-pagination-link', 'current'); // Prefixed class
        paginationContainer.appendChild(currentSpan);
        const nextPageIndex = currentPageNumber + 1;
        if (nextPageIndex <= totalPages) {
            const nextLink = document.createElement('a');
            nextLink.href = `${baseFilename}${nextPageIndex}${fileExtension}`;
            nextLink.textContent = nextPageIndex; nextLink.classList.add('kaalpath-pagination-link'); // Prefixed class
            paginationContainer.appendChild(nextLink);
        }

         // पार्ट नेविगेशन बटन अपडेट (प्रीफ़िक्स्ड क्लास)
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
    kaalpath_setupPagination(); // Prefixed function call
    // --- स्वचालित पेजिनेशन समाप्त ---

    // --- TTS कार्यक्षमता ---
    // Prefixed function definition
    function kaalpath_speakText(text, lang = "hi-IN") {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = lang; speech.volume = 1; speech.rate = 0.9; speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        } else { console.warn("Speech synthesis not supported."); }
    }
    // Prefixed selectors for special terms
    const specialTermElements = document.querySelectorAll(".kaalpath-special-term-1, .kaalpath-special-term-2, .kaalpath-special-term-3");
    specialTermElements.forEach(term => {
        term.addEventListener("click", (event) => { event.stopPropagation(); kaalpath_speakText(term.textContent, "hi-IN"); }); // Prefixed function call
        term.title = "सुनने के लिए क्लिक करें";
    });
    // Prefixed selector for paragraphs
    const paragraphElements = document.querySelectorAll(".kaalpath-custom-p");
    paragraphElements.forEach(paragraph => {
        // Prefixed selector for ad explanation
        if (!paragraph.closest('.kaalpath-story-description') && !paragraph.closest('.kaalpath-tv-ad-explanation')) {
            paragraph.addEventListener("click", () => kaalpath_speakText(paragraph.textContent, "hi-IN")); // Prefixed function call
            paragraph.title = "पूरा पैराग्राफ सुनने के लिए क्लिक करें";
            paragraph.addEventListener("mouseenter", () => { paragraph.style.color = "#C71585"; });
            paragraph.addEventListener("mouseout", () => { paragraph.style.color = ""; });
        } else { paragraph.style.cursor = "default"; }
    });

}); // DOMContentLoaded समाप्त
