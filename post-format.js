// ============== JavaScript Code ==============
document.addEventListener("DOMContentLoaded", function() {

    // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
    const smoothScrollLinks = document.querySelectorAll(".custom-a[href^='#'], .story-nav a[href^='#']");
    const navHeight = document.querySelector('.story-nav') ? document.querySelector('.story-nav').offsetHeight : 50;
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
                         if (link.closest('.story-nav')) {
                             document.querySelectorAll('.story-nav a').forEach(nav => nav.classList.remove('active'));
                             link.classList.add('active');
                         } else { updateActiveLinkBasedOnScroll(); }
                     } catch(e) { console.error("Error updating active nav link:", e); }
                } else { console.warn(`Element with ID ${href} not found.`); }
            }
        });
    });
     const sections = document.querySelectorAll('.custom-div[id^="part"]');
     const navLinks = document.querySelectorAll('.story-nav a[href^="#part"]');
     const updateActiveLinkBasedOnScroll = () => {
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
     updateActiveLinkBasedOnScroll();
     window.addEventListener('scroll', updateActiveLinkBasedOnScroll);
     const hash = window.location.hash;
     if (hash && hash.startsWith("#part")) {
         const activeLink = document.querySelector(`.story-nav a[href$="${hash}"]`);
         if (activeLink) {
             document.querySelectorAll('.story-nav a').forEach(link => link.classList.remove('active'));
             activeLink.classList.add('active');
         }
         setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) { window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'smooth' }); }
         }, 100);
      } else {
          const defaultActiveLink = document.querySelector('.story-nav a[href$="#part1"]');
          if (defaultActiveLink) {
               document.querySelectorAll('.story-nav a').forEach(link => link.classList.remove('active'));
               defaultActiveLink.classList.add('active');
          }
      }
    // --- स्मूथ स्क्रॉल समाप्त ---

    // --- स्वचालित पेजिनेशन ---
    function setupPagination() {
        const paginationContainer = document.querySelector('.pagination-section');
        if (!paginationContainer) { console.warn("Pagination container not found."); return; }

        // ******** USER CONFIGURATION REQUIRED ********
        const totalPages = 6; // <-- अपनी कहानी के कुल भागों की संख्या यहाँ सेट करें
        const baseFilename = 'aranyani-kaushik-part'; // <-- अपनी फ़ाइल नामकरण योजना यहाँ सेट करें (बिना नंबर और एक्सटेंशन के)
        const fileExtension = '.html'; // <-- अपनी फ़ाइल का एक्सटेंशन यहाँ सेट करें
        // *******************************************

        let currentPageNumber = 1;
        try {
            const pathParts = window.location.pathname.split('/');
            const filename = pathParts.pop() || pathParts.pop() || '';
            const match = filename.match(/part(\d+)/i) || filename.match(/(\d+)(?:\.\w+)?$/); // 'partX' या अंत में अंक खोजें
            if (match && match[1]) {
                const parsedNum = parseInt(match[1], 10);
                if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= totalPages) { currentPageNumber = parsedNum; }
                 else { console.warn("Pagination: Page number from URL invalid/out of range."); }
            } else { console.warn("Pagination: Couldn't find page number in URL/filename: ", filename); }
        } catch (e) { console.error("Pagination: Error getting page number.", e); }
        if (isNaN(currentPageNumber) || currentPageNumber < 1 || currentPageNumber > totalPages) { currentPageNumber = 1; }

        paginationContainer.innerHTML = '';

        // पिछले 4 लिंक (या जितने उपलब्ध हों)
        for (let i = Math.max(1, currentPageNumber - 4); i < currentPageNumber; i++) {
            const link = document.createElement('a');
            link.href = `${baseFilename}${i}${fileExtension}`;
            link.textContent = i; link.classList.add('pagination-link');
            paginationContainer.appendChild(link);
        }
        // वर्तमान पेज
        const currentSpan = document.createElement('span');
        currentSpan.textContent = currentPageNumber;
        currentSpan.classList.add('pagination-link', 'current');
        paginationContainer.appendChild(currentSpan);
        // अगला 1 लिंक (यदि उपलब्ध हो)
        const nextPageIndex = currentPageNumber + 1;
        if (nextPageIndex <= totalPages) {
            const nextLink = document.createElement('a');
            nextLink.href = `${baseFilename}${nextPageIndex}${fileExtension}`;
            nextLink.textContent = nextPageIndex; nextLink.classList.add('pagination-link');
            paginationContainer.appendChild(nextLink);
        }

        // पार्ट नेविगेशन बटन अपडेट (ऊपर और नीचे दोनों के लिए)
         document.querySelectorAll('.part-navigation').forEach(nav => {
             const prevPartButton = nav.querySelector('.prev-part-link');
             const nextPartButton = nav.querySelector('.next-part-link');

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
    setupPagination();
    // --- स्वचालित पेजिनेशन समाप्त ---

    // --- TTS कार्यक्षमता ---
    function speakText(text, lang = "hi-IN") {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = lang; speech.volume = 1; speech.rate = 0.9; speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        } else { console.warn("Speech synthesis not supported."); }
    }
    const specialTermElements = document.querySelectorAll(".special-term-1, .special-term-2, .special-term-3");
    specialTermElements.forEach(term => {
        term.addEventListener("click", (event) => { event.stopPropagation(); speakText(term.textContent, "hi-IN"); });
        term.title = "सुनने के लिए क्लिक करें";
    });
    const paragraphElements = document.querySelectorAll(".custom-p");
    paragraphElements.forEach(paragraph => {
        // कहानी विवरण और विज्ञापन टेक्स्ट पर TTS न लगाएं
        if (!paragraph.closest('.story-description') && !paragraph.closest('.tv-ad-explanation')) {
            paragraph.addEventListener("click", () => speakText(paragraph.textContent, "hi-IN"));
            paragraph.title = "पूरा पैराग्राफ सुनने के लिए क्लिक करें";
            paragraph.addEventListener("mouseenter", () => { paragraph.style.color = "#C71585"; });
            paragraph.addEventListener("mouseout", () => { paragraph.style.color = ""; });
        } else { paragraph.style.cursor = "default"; }
    });

}); // DOMContentLoaded समाप्त
