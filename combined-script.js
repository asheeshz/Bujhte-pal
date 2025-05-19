// --------------------------------------------------
// विजेट 1: Circle Menu लॉजिक (संयोजित फ़ाइल के लिए)
// --------------------------------------------------
(function() { // Circle Menu विजेट के लिए IIFE शुरू

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

    // मेन्यू टॉگل बटन पर क्लिक इवेंट जोड़ें
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

    // console.log("Circle Menu Initialized."); // Optional confirmation

})(); // Circle Menu विजेट के लिए IIFE समाप्त


// --------------------------------------------------
// विजेट 2: Table of Contents (TOC) लॉजिक (संयोजित फ़ाइल के लिए)
// --------------------------------------------------
(function() { // TOC विजेट के लिए IIFE शुरू

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

    // --- Variables (scoped within this IIFE - using minified names to match original structure) ---
    let cht = null; // currentHighlightTimeout
    let tc = null;  // tocContainer
    let tb = null;  // toggleButton
    const pc = document.querySelector(config.postContainerSelector); // postContent

    // --- Functions (scoped within this IIFE - using minified names to match original structure) ---
    function csi(h, i) { // createSafeId
        let tid = (h.textContent || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-).replace(/^-+|-+$/g, '');
        let id = "toc-h-" + (tid || i);
        let cntr = 1; const oid = id;
        while (document.getElementById(id)) { id = oid + '-' + cntr; cntr++; }
        return id;
    }

    function ch(sh = null, sc = []) { // clearHighlights
        if (cht) { clearTimeout(cht); cht = null; }
        if (sh) { sh.classList.remove('highlight-target'); }
        if (sc.length > 0) { sc.forEach(el => el.classList.remove('highlight-content')); }
        else if (!sh && !sc.length) {
            document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
            document.querySelectorAll('.highlight-content').forEach(el => el.classList.remove('highlight-content'));
        }
    }

    function ah(th) { // applyHighlight
        ch();
        th.classList.add('highlight-target');
        const hc = []; // highlightedContent
        let sib = th.nextElementSibling;
        while (sib && !sib.matches(config.headingsSelector) && !sib.matches('#toc-container')) {
            if (sib.nodeType === 1) { sib.classList.add('highlight-content'); hc.push(sib); }
            sib = sib.nextElementSibling;
        }
        cht = setTimeout(() => { ch(th, hc); }, config.highlightDuration);
    }

    function ss(e) { // smoothScrollToTarget
        const er = e.getBoundingClientRect();
        const aet = er.top + window.pageYOffset;
        const off = window.innerHeight * 0.28;
        const tsp = aet - off;
        window.scrollTo({ top: tsp, behavior: 'smooth' });
    }

    function cbg(be, sg) { // controlButtonGlow
        if (!be) return;
        if (sg) {
            setTimeout(() => {
                if (toc && !toc.classList.contains('toc-visible')) {
                     be.classList.add('toc-closed-effect');
                }
            }, 700);
        } else {
            be.classList.remove('toc-closed-effect');
        }
    }

    function ubc(ie) { // updateButtonContent
        if (!tb) return;
        const t = ie ? config.hideButtonBaseText : config.showButtonBaseText;
        const icl = ie ? config.hideIconClass : config.showIconClass;
        tb.innerHTML = `${t} <i class="${icl}" aria-hidden="true" style="margin-left: 8px;"></i>`;
        tb.setAttribute('aria-expanded', String(ie));
    }

    function sel() { // setupEventListeners
        if (!tc || !toc || !tb) return;

        tb.addEventListener('click', () => {
            const ie = toc.classList.toggle('toc-visible');
            ubc(ie);
            tc.classList.toggle('toc-is-shown', ie);
            cbg(tb, !ie);
        });

        toc.addEventListener('click', (e) => {
            const l = e.target.closest('a'); // linkElement
            if (l && l.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const tid = l.getAttribute('href').substring(1); // targetId
                const th = document.getElementById(tid); // targetHeading
                if (th) {
                   if (!toc.classList.contains('toc-visible')) {
                       toc.classList.add('toc-visible');
                       tc.classList.add('toc-is-shown');
                       ubc(true);
                       cbg(tb, false);
                   }
                   ss(th);
                   setTimeout(() => { ah(th); }, 500); // Delay might need adjustment
                } else { console.warn("TOC: Target '" + tid + "' not found."); }
            }
        });
    }

    function it() { // initializeToc
        if (!pc) { console.warn("TOC: Container '" + config.postContainerSelector + "' not found."); return; }
        const h = Array.from(pc.querySelectorAll(config.headingsSelector)); // headings
        const vh = []; // validHeadings
        let fvh = null; // firstValidHeading

        h.forEach(hd => { // heading
            if (!hd.closest('#toc-container') && hd.textContent.trim()) {
                vh.push(hd);
                if (!fvh) fvh = hd;
            }
        });

        if (vh.length < config.minHeadingsForToc) {
             // console.log("TOC: Not enough headings found to generate TOC."); // Optional message
             return; // Exit if not enough headings
        }

        tc = document.createElement("div"); tc.id = "toc-container";
        tb = document.createElement("button"); tb.id = "toc-toggle-button";
        ubc(false); // Initial state: collapsed
        tb.setAttribute("aria-controls", "toc");
        cbg(tb, true); // Initial glow

        toc = document.createElement("div"); toc.id = "toc"; // toc box
        const tt = document.createElement("h2"); // tocTitle
        tt.textContent = config.tocTitleText;
        toc.appendChild(tt);
        const tl = document.createElement("ul"); // tocList

        vh.forEach((hd, i) => { // heading
            let id = hd.getAttribute("id");
            if (!id) { id = csi(hd, i); hd.setAttribute("id", id); }
            const li = document.createElement("li"); // listItem
            const hl = hd.tagName.toLowerCase(); // headingLevel
            li.classList.add('toc-level-' + hl.replace('h',''));
            const lnk = document.createElement("a"); lnk.setAttribute("href", "#" + id); // link

            let icl = ""; // iconClass
            if (config.useIcons) {
                if (hl === 'h2' && config.h2IconClass) icl = config.h2IconClass;
                else if (hl === 'h3' && config.h3IconClass) icl = config.h3IconClass;
                if (icl) {
                    const ie = document.createElement("i"); // iconElement
                    icl.split(' ').forEach(cls => { if (cls) ie.classList.add(cls); });
                    ie.setAttribute("aria-hidden", "true");
                    lnk.appendChild(ie);
                }
            }
            lnk.appendChild(document.createTextNode((hd.textContent || '').trim()));
            li.appendChild(lnk); tl.appendChild(li);
        });

        toc.appendChild(tl); tc.appendChild(tb); tc.appendChild(toc);

        // Insert TOC before the first valid heading found
        if (fvh && fvh.parentNode) {
             fvh.parentNode.insertBefore(tc, fvh);
         } else if (pc.firstChild) { // Fallback: Insert at the beginning of post content
             pc.insertBefore(tc, pc.firstChild);
         } else { // Fallback: Append if post content is empty
             pc.appendChild(tc);
         }

        sel(); // Setup listeners after elements are in the DOM
        // console.log("Table of Contents Initialized."); // Confirmation message
    }

    // --- Initialization ---
    // Execute the initialization logic for this widget
    try {
        it();
    } catch (error) {
        console.error("TOC Script Error:", error);
    }

})(); // End IIFE for TOC widget


// --------------------------------------------------
// विजेट 3: खोजें और सीखें विजेट लॉजिक (संयोजित फ़ाइल के लिए)
// (यह भाग मूल कोड के मिनीफाइड स्ट्रक्चर को बनाए रखता है)
// --------------------------------------------------
(function() { // Search and Learn (VSW) विजेट के लिए IIFE शुरू

    let mwVSW,cbcVSW,cbVSW,ascVSW,vscVSW,vdVSW,vsnVSW,mbVSW,vsVSW,yiVSW,mtVSW; // मेन एलिमेंट्स
    let cviVSW=[],vsiVSW=0,ippVSW=4,asciVSW=null,mtmVSW,rtmVSW,stmVSW; // वीडियो डेटा और राज्य वेरिएबल्स

    // DOM एलिमेंट्स प्राप्त करना (मूल मिनीफाइड कोड के अनुसार वेरिएबल नाम)
    mwVSW=document.getElementById('vsw-main-widget');
    cbcVSW=document.getElementById('vsw-category-buttons');
    cbVSW=document.getElementById('vsw-category-banner');
    ascVSW=document.querySelectorAll('.vsw-search-category-container');
    vscVSW=document.getElementById('vsw-video-slider-container');
    vdVSW=document.getElementById('vsw-video-display');
    vsnVSW=document.getElementById('vsw-video-slider-nav');
    mbVSW=document.getElementById('vsw-messageBox'); // मैसेज बॉक्स एलिमेंट
    vsVSW=document.getElementById('vsw-video-slider'); // वीडियो स्लाइडर एलिमेंट
    yiVSW=document.getElementById('vsw-youtube-iframe'); // यूट्यूब iframe एलिमेंट
    mtVSW=document.getElementById('vsw-message-texts'); // मैसेज टेक्स्ट कंटेनर (छिपे हुए टेक्स्ट)

    // मुख्य इनिशियलाइज़ेशन चेक
    if(mwVSW&&cbcVSW&&mtVSW&&mbVSW){
        sucVSW(); // सेटअप कैटेगरी बटन
        subVSW(); // सेटअप बैक बटन
        socVSW(); // सेटअप आउटसाइड क्लिक लिसनर

        window.addEventListener('resize',hrVSW); // हैंडल रीसाइज
        window.addEventListener('scroll',hsVSW); // हैंडल स्क्रॉल

        // मुख्य विजेट कंटेनर पर इवेंट लिसनर डेलिगेशन
        mwVSW.addEventListener('change',hiiVSW); // इनपुट/सेलेक्ट चेंज पर हैंडल इनपुट इम्पटिटि
        mwVSW.addEventListener('input',hiiVSW);  // इनपुट/सेलेक्ट इनपुट पर हैंडल इनपुट इम्पटिटि
        mwVSW.addEventListener('click',hsbVSW); // बटन क्लिक पर हैंडल सर्च बटन

        // प्रारंभिक UI राज्य सेटअप
        scbVSW(); // शो कैटेगरी बटन और बैनर
        ascVSW.forEach(c=>{c.style.display='none';c.classList.remove('vsw-active-search-box');c.style.opacity=0;}); // सभी सर्च कंटेनर्स को छिपाएं
        hvsVSW(); // वीडियो सेक्शन छिपाएं
        // console.log("Search and Learn Widget Initialized."); // Optional confirmation
    }else{
        console.error("VSW Error: Essential elements missing.");
        // यदि मैसेज बॉक्स मौजूद है, तो त्रुटि दिखाएं
        if(mbVSW){mbVSW.textContent="VSW Initialization Error: Essential elements missing.";mbVSW.style.display='block';}
    }

    // --- फंक्शन डेफिनेशन (मूल मिनीफाइड कोड के अनुसार वेरिएबल नाम) ---

    // हैंडल सर्च बटन क्लिक
    function hsbVSW(e){const t=e.target;const s=t.closest('.vsw-search-button');if(s){const sb=s.closest('.vsw-search-box');const cc=sb?sb.closest('.vsw-search-category-container'):null;if(cc&&cc.id===asciVSW){if(s.disabled){e.preventDefault();e.stopPropagation();smVSW(gtxVSW('vsw-msgMinInputRequired'),4000);}}}}

    // हैंडल इनपुट/सेलेक्ट इनपुट/चेंज
    function hiiVSW(e){const t=e.target;if(t.tagName==='SELECT'||(t.tagName==='INPUT'&&t.classList.contains('vsw-custom-search-input'))){const sb=t.closest('.vsw-search-box');const cc=sb?sb.closest('.vsw-search-category-container'):null;if(sb&&cc&&cc.id===asciVSW){citVSW(sb);hmVSW();}}}

    // चेक इनपुट टोगल बटन स्टेट (सर्च बटन को सक्षम/अक्षम करें)
    function citVSW(s){const b=s.querySelector('.vsw-search-button');if(!b)return;let ic=0;const sl=s.querySelectorAll('select');const ti=s.querySelector('.vsw-custom-search-input');sl.forEach(select=>{if(select.value?.trim()&&select.value!==""){ic++;}});if(ti&&ti.value.trim()){ic++;}
    const mir=2; // आवश्यक न्यूनतम इनपुट फ़ील्ड की संख्या
    if(ic>=mir){b.disabled=false;}else{b.disabled=true;}}

    // शो कैटेगरी बटन और बैनर
    function scbVSW(){if(cbcVSW){cbcVSW.style.display='flex';setTimeout(()=>{cbcVSW.classList.remove('vsw-hidden');cbcVSW.style.opacity=1;},10);}if(cbVSW){cbVSW.style.display='block';setTimeout(()=>{cbVSW.classList.remove('vsw-hidden');cbVSW.style.opacity=1;},10);}}

    // हाइड कैटेगरी बटन और बैनर
    function hcbVSW(){if(cbcVSW){cbcVSW.style.opacity=0;const ch=function(){this.style.display='none';this.removeEventListener('transitionend',ch);};if(parseFloat(cbcVSW.style.opacity)>0){cbcVSW.addEventListener('transitionend',ch,{once:true});}else{cbcVSW.style.display='none';}cbcVSW.classList.add('vsw-hidden');}if(cbVSW){cbVSW.style.opacity=0;const bh=function(){this.style.display='none';this.removeEventListener('transitionend',bh);};if(parseFloat(cbVSW.style.opacity)>0){cbVSW.addEventListener('transitionend',bh,{once:true});}else{cbVSW.style.display='none';}cbVSW.classList.add('vsw-hidden');}}

    // आईडी द्वारा मैसेज टेक्स्ट प्राप्त करें (छिपे हुए #vsw-message-texts से)
    function gtxVSW(id){if(!mtVSW){console.error("VSW Error: Message text container not found.");return`[${id}]`;}const e=mtVSW.querySelector(`#${id}`);if(e){return e.textContent||`[${id}]`;}else{console.warn(`VSW Warning: Message ID "${id}" not found.`);return`[${id}]`;}}

    // सेटअप कैटेगरी बटन क्लिक लिसनर्स
    function sucVSW(){if(!cbcVSW)return;const b=cbcVSW.querySelectorAll('button[data-target]');b.forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();const tid=btn.getAttribute('data-target');if(tid){tcVSW(tid);}else{console.warn("VSW Warning: Button missing data-target.");}});});}

    // सेटअप बैक बटन क्लिक लिसनर्स
    function subVSW(){const b=document.querySelectorAll('.vsw-back-button');b.forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();ccaVSW();});});}

    // क्लोज करंट एक्टिव विजेट (सर्च बॉक्स)
    function ccaVSW(){if(asciVSW){const c=document.getElementById(asciVSW);if(c){const b=c.querySelector('.vsw-search-button');if(b){b.disabled=true;}c.style.opacity=0;const ch=function(){this.style.display='none';this.classList.remove('vsw-active-search-box');const sl=this.querySelectorAll('select');const ti=this.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";this.removeEventListener('transitionend',ch);};if(parseFloat(c.style.opacity)>0){c.addEventListener('transitionend',ch,{once:true});}else{c.style.display='none';c.classList.remove('vsw-active-search-box');const sl=c.querySelectorAll('select');const ti=c.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";}hvsVSW();cvrVSW();}else{console.warn(`VSW Warning: Active container ID ${asciVSW} not found.`);}}asciVSW=null;scbVSW();hmVSW();}

    // टोगल कैटेगरी विजेट्स (एक को खोलें, बाकी को बंद करें)
    function tcVSW(cs){const ct=document.getElementById(cs);if(!ct){console.error(`VSW Error: Target container ID ${cs} not found.`);return;}if(cs===asciVSW){ccaVSW();return;}if(asciVSW){const cc=document.getElementById(asciVSW);if(cc){const b=cc.querySelector('.vsw-search-button');if(b){b.disabled=true;}cc.style.opacity=0;const och=function(){this.style.display='none';this.classList.remove('vsw-active-search-box');const sl=this.querySelectorAll('select');const ti=this.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";this.removeEventListener('transitionend',och);};if(parseFloat(cc.style.opacity)>0){cc.addEventListener('transitionend',och,{once:true});}else{cc.style.display='none';cc.classList.remove('vsw-active-search-box');const sl=cc.querySelectorAll('select');const ti=cc.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";}}}hcbVSW();
    ct.style.display='block';setTimeout(()=>{ct.classList.add('vsw-active-search-box');ct.style.opacity=1;const sb=ct.querySelector('.vsw-search-box');if(sb){citVSW(sb);}setTimeout(()=>{const wr=mwVSW.getBoundingClientRect();const tst=window.scrollY+wr.top;window.scrollTo({top:tst,behavior:'smooth'});},400);},10);
    asciVSW=cs;cvrVSW();hvsVSW();ippVSW=cipVSW();hmVSW();}

    // सेटअप आउटसाइड क्लिक लिसनर (विजेट के बाहर क्लिक होने पर बंद करें)
    function socVSW(){if(!mwVSW)return;document.addEventListener('click',e=>{if(!asciVSW)return;if(mwVSW.contains(e.target)){return;}ccaVSW();});}

    // हैंडल स्क्रॉल (विजेट के व्यू से बाहर जाने पर बंद करें)
    function hsVSW(){clearTimeout(stmVSW);stmVSW=setTimeout(()=>{if(asciVSW&&mwVSW){if(vdVSW&&vdVSW.style.display!=='none'){return;}const wr=mwVSW.getBoundingClientRect();const th=Math.min(wr.height*.3,window.innerHeight*.3);const ioo=(wr.bottom<th||wr.top>window.innerHeight-th);if(ioo){ccaVSW();}}},100);}

    // यूट्यूब डेटा प्राप्त करें (सर्च करें)
    async function fydVSW(st=''){
        // API Key को अपने असली Key से बदलें (लेकिन इस फ़ंक्शन के बाहर नहीं जैसा कि अनुरोध किया गया है)
        const ak='AIzaSyBYVKCeEIlBjCoS6Xy_mWatJywG3hUPv3Q'; // <-- यहाँ अपनी API कुंजी डालें
        if(!ak||ak==='YOUR_API_KEY_HERE'||ak.length<30||ak.startsWith('AIzaSyB')){console.error("VSW Error: API Key config missing/invalid.");smVSW(gtxVSW('vsw-msgApiKeyError'),8000);hvsVSW();cvrVSW();return;}
        const ah='youtube.googleapis.com';const mr=30;const sst=st||'educational videos in Hindi';let au=`https://${ah}/youtube/v3/search?part=snippet&type=video&maxResults=${mr}&key=${ak}`;au+=`&q=${encodeURIComponent(sst)}`;const hhc=/[\u0900-\u097F]/.test(sst);const hchw=/\b(हिंदी|कक्षा|परीक्षा|विज्ञान|गणित|इतिहास|भूगोल|समाचार|लाइव|कहानी|कविता)\b/i.test(sst);if(hhc||hchw||sst.toLowerCase().includes("hindi")){au+=`&relevanceLanguage=hi`;}
        smVSW(gtxVSW('vsw-msgSearchingVideos'),2500);hvsVSW();cvrVSW();
        try{const r=await fetch(au,{method:'GET',headers:{'Accept':'application/json'}});const d=await r.json();
        if(!r.ok){console.error('VSW API Error Response:',d);let eid='vsw-msgApiGenericErrorPrefix';let ed=`(${r.status})`;if(d.error?.message){if(d.error.errors?.[0]?.reason==='quotaExceeded'){eid='vsw-msgApiQuotaError';ed='';}else if(d.error.errors?.[0]?.reason==='keyInvalid'){eid='vsw-msgApiKeyInvalid';ed='';}else{ed=`:${d.error.message}`;}}else{ed=`(${r.status})`;}const ae=new Error(gtxVSW(eid)+ed);ae.statusCode=r.status;throw ae;}
        if(!d?.items||d.items.length===0){smVSW(gtxVSW('vsw-msgNoVideosFound'),4000);hvsVSW();cvrVSW();cviVSW=[];return;}
        cviVSW=d.items.filter(i=>i.id?.videoId&&i.snippet);if(cviVSW.length===0){smVSW(gtxVSW('vsw-msgNoVideosFound')+" (valid items not found)",4000);hvsVSW();cvrVSW();return;}
        dvVSW(cviVSW);svsVSW();hmVSW();}catch(e){console.error('VSW Fetch Error:',e);let de=gtxVSW('vsw-msgInternalError');if(e.message&&(e.message.startsWith(gtxVSW('vsw-msgApiGenericErrorPrefix'))||e.message.startsWith(gtxVSW('vsw-msgApiQuotaError'))||e.message.startsWith(gtxVSW('vsw-msgApiKeyInvalid'))||e.message.startsWith(gtxVSW('vsw-msgApiKeyError')))){de=e.message;}else if(e.message){de=`${gtxVSW('vsw-msgVideoLoadErrorPrefix')}: ${e.message.substring(0,100)}...`;}
        smVSW(de,6000);hvsVSW();cvrVSW();cviVSW=[];}}

    // डिस्प्ले वीडियो (स्लाइडर और प्लेयर में)
    function dvVSW(v){if(!vsVSW||!vscVSW||!vdVSW||!yiVSW){console.error("VSW Video display elements not found.");return;}vsVSW.innerHTML='';vsiVSW=0;cviVSW=v;
    if(!cviVSW||cviVSW.length===0){if(vscVSW){vsVSW.innerHTML=`<p style="color:#ccc; padding: 20px; text-align: center; width: 100%;">${gtxVSW('vsw-msgNoVideosFound')}</p>`;vscVSW.style.display='block';}if(vsnVSW)vsnVSW.style.display='none';if(yiVSW)yiVSW.src='';if(vdVSW)vdVSW.style.display='none';return;}
    cviVSW.forEach((video,i)=>{if(!video.id?.videoId||!video.snippet){console.warn("VSW Skipping invalid video item:",video);return;}const vid=video.id.videoId;const vt=video.snippet.title||'Untitled Video';const tu=video.snippet.thumbnails?.medium?.url||video.snippet.thumbnails?.default?.url||'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const vi=document.createElement('div');vi.classList.add('vsw-video-item');vi.setAttribute('data-index',i);vi.setAttribute('data-videoid',vid);
    const th=document.createElement('img');th.src=tu;th.alt=vt;th.onerror=function(){this.onerror=null;this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';console.warn(`VSW Thumbnail failed for ${vid}`);};
    const t=document.createElement('p');const te=document.createElement('textarea');te.innerHTML=vt;t.textContent=te.value;
    vi.appendChild(th);vi.appendChild(t);
    vi.addEventListener('click',()=>{devVSW(vid);if(vdVSW&&vdVSW.style.display!=='none'){const pr=vdVSW.getBoundingClientRect();if(pr.top<20){window.scrollTo({top:window.scrollY+pr.top-20,behavior:'smooth'});}}});
    vsVSW.appendChild(vi);});
    if(cviVSW.length>0&&cviVSW[0].id?.videoId){devVSW(cviVSW[0].id.videoId);}else{if(yiVSW)yiVSW.src='';if(vdVSW)vdVSW.style.display='none';}
    ippVSW=cipVSW();uvsVSW();if(vscVSW)vscVSW.style.display='block';if(vsnVSW){vsnVSW.style.display=cviVSW.length>ippVSW?'flex':'none';}}

    // डिस्प्ले एम्बेडेड वीडियो
    function devVSW(vid){if(!yiVSW||!vdVSW)return;if(!vid){yiVSW.src='';vdVSW.style.display='none';return;}yiVSW.src=`https://www.youtube.com/embed/${vid}?autoplay=0&rel=0&modestbranding=1&hl=hi`;vdVSW.style.display='block';yiVSW.onerror=()=>{console.error('VSW iFrame failed to load video ID:',vid);smVSW(gtxVSW('vsw-msgVideoLoadFailed'),3000);vdVSW.style.display='none';};yiVSW.onload=()=>{console.log(`VSW iFrame loaded ID: ${vid}`);if(yiVSW.src.includes(vid)){vdVSW.style.display='block';}};if(!yiVSW.src||yiVSW.src==='about:blank'){vdVSW.style.display='none';}}

    // क्लियर वीडियो रिजल्ट्स
    function cvrVSW(){if(vsVSW)vsVSW.innerHTML='';if(yiVSW){if(yiVSW.contentWindow){try{yiVSW.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');}catch(e){}}yiVSW.src='';}cviVSW=[];vsiVSW=0;}

    // कैलकुलेट आइटम्स पर पेज (स्लाइडर में)
    function cipVSW(){if(!vscVSW||vscVSW.offsetWidth<=0){const iw=150;const im=12;const itw=iw+im;const cwf=mwVSW?mwVSW.offsetWidth*.95-50:window.innerWidth*.95-50;const cal=Math.max(1,Math.floor(cwf/itw));return cal;}const cw=vscVSW.offsetWidth-20;const iw=150;const im=12;const itw=iw+im;if(cw<=0||itw<=0){return 1;}const ci=Math.max(1,Math.floor(cw/itw));return ci;}

    // स्लाइड वीडियो स्लाइडर
    function svVSW(d){const nvi=cviVSW.length;ippVSW=cipVSW();if(nvi<=ippVSW)return;const mi=Math.max(0,nvi-ippVSW);let ni=vsiVSW+d;vsiVSW=Math.max(0,Math.min(mi,ni));uvsVSW();}

    // अपडेट वीडियो स्लाइडर ट्रांसफॉर्म
    function uvsVSW(){if(!vsVSW||cviVSW.length===0){if(vsVSW)vsVSW.style.transform='translateX(0px)';return;}const iw=150;const im=12;const sa=-vsiVSW*(iw+im);vsVSW.style.transform=`translateX(${sa}px)`;}

    // हैंडल रीसाइज (वीडियो स्लाइडर और सर्च बटन स्टेट अपडेट करें)
    function hrVSW(){clearTimeout(rtmVSW);rtmVSW=setTimeout(()=>{if(vscVSW&&vscVSW.style.display!=='none'){const oipp=ippVSW;ippVSW=cipVSW();if(oipp!==ippVSW){const mi=Math.max(0,cviVSW.length-ippVSW);vsiVSW=Math.min(vsiVSW,mi);uvsVSW();if(vsnVSW){vsnVSW.style.display=cviVSW.length>ippVSW?'flex':'none';}}}if(asciVSW){const ac=document.getElementById(asciVSW);if(ac){const sb=ac.querySelector('.vsw-search-box');if(sb){citVSW(sb);}}}},250);}

    // ग्लोबल फ़ंक्शन्स (onclick एट्रीब्यूट से कॉल के लिए)
    window.performVswSearch = function(searchBoxId){
         const sb=document.getElementById(searchBoxId);if(!sb){console.error("VSW Error: Search box not found:",searchBoxId);smVSW(gtxVSW('vsw-msgInternalError'),4000);return;}const sbtn=sb.querySelector('.vsw-search-button');if(sbtn&&sbtn.disabled){console.warn("VSW: performSearch called on disabled button.");smVSW(gtxVSW('vsw-msgMinInputRequired'),4000);return;}
        let fst='';let ic=0;let dst='';const sl=sb.querySelectorAll('select');const ti=sb.querySelector('.vsw-custom-search-input');
        sl.forEach(s=>{if(s.value?.trim()&&s.value!==""){dst+=s.value.trim()+' ';ic++;}});dst=dst.trim();const tv=ti?ti.value.trim():'';if(tv){ic++;}
        const mir=2;if(ic<mir){console.warn("VSW: performSearch called with insufficient inputs (fallback).");smVSW(gtxVSW('vsw-msgMinInputRequired'),4000);return;}
        if(tv){fst=(dst+' '+tv).trim();}else{fst=dst;}hmVSW();console.log(`VSW Performing search for: "${fst}"`);fydVSW(fst);
    }

    window.slideVswVideo = function(direction){
         svVSW(direction);
     }

    // आंतरिक फ़ंक्शन (बाहरी कॉल से बचें) - ये ऊपर परिभाषित ग्लोबल फ़ंक्शन्स को कॉल करते हैं
     function psVSW(sbid){ window.performVswSearch(sbid); }
     function svVSW_internal(d){ window.slideVswVideo(d); } // This one seems unused but keeping original structure


    // शो वीडियो स्लाइडर/प्लेयर
    function svsVSW(){if(cviVSW&&cviVSW.length>0){if(vscVSW&&vscVSW.style.display==='none'){vscVSW.style.display='block';}if(yiVSW&&yiVSW.src&&yiVSW.src!=='about:blank'&&vdVSW&&vdVSW.style.display==='none'){vdVSW.style.display='block';}ippVSW=cipVSW();if(vsnVSW){vsnVSW.style.display=cviVSW.length>ippVSW?'flex':'none';}}else{hvsVSW();}}

    // हाइड वीडियो स्लाइडर/प्लेयर
    function hvsVSW(){if(vscVSW)vscVSW.style.display='none';if(vdVSW)vdVSW.style.display='none';if(vsnVSW)vsnVSW.style.display='none';}

    // शो मैसेज
    function smVSW(mtxt,d=3000){if(!mbVSW)return;clearTimeout(mtmVSW);const tts=mtxt||gtxVSW('vsw-msgInternalError');mbVSW.textContent=tts;mbVSW.style.display='block';if(d>0){mtmVSW=setTimeout(hmVSW,d);}else{mtmVSW=null;}} // Added else to clear timeout handle if duration is 0

    // हाइड मैसेज
    function hmVSW(){if(!mbVSW)return;clearTimeout(mtmVSW);mtmVSW=null;mbVSW.style.display='none';} // Added null assignment


})(); // Search and Learn (VSW) विजेट के लिए IIFE समाप्त

/*
अंत: यह संयोजित विजेट स्क्रिप्ट फ़ाइल का अंत है।
*/
