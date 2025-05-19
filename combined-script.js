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
let mw,cbc,cb,asc,vsc,vd,vsn,mb,vs,yi,mt;let cvi=[],vsi=0,ipp=4,asci=null,mtm,rtm,stm;
mw=document.getElementById('vsw-main-widget');cbc=document.getElementById('vsw-category-buttons');cb=document.getElementById('vsw-category-banner');asc=document.querySelectorAll('.vsw-search-category-container');vsc=document.getElementById('vsw-video-slider-container');vd=document.getElementById('vsw-video-display');vsn=document.getElementById('vsw-video-slider-nav');mb=document.getElementById('vsw-messageBox');vs=document.getElementById('vsw-video-slider');yi=document.getElementById('vsw-youtube-iframe');mt=document.getElementById('vsw-message-texts');
if(mw&&cbc&&mt&&mb){
    suc();sub();soc();window.addEventListener('resize',hr);window.addEventListener('scroll',hs);
    mw.addEventListener('change',hii);mw.addEventListener('input',hii);mw.addEventListener('click',hsb);
    scb();
    asc.forEach(c=>{c.style.display='none';c.classList.remove('vsw-active-search-box');c.style.opacity=0;});
    hvs();
}else{
    console.error("VSW Error: Essential elements missing.");
    if(mb){mb.textContent="VSW Initialization Error: Essential elements missing.";mb.style.display='block';}
}
function hsb(e){const t=e.target;const s=t.closest('.vsw-search-button');if(s){const sb=s.closest('.vsw-search-box');const cc=sb?sb.closest('.vsw-search-category-container'):null;if(cc&&cc.id===asci){if(s.disabled){e.preventDefault();e.stopPropagation();sm(gtx('vsw-msgMinInputRequired'),4000);}}}}
function hii(e){const t=e.target;if(t.tagName==='SELECT'||(t.tagName==='INPUT'&&t.classList.contains('vsw-custom-search-input'))){const sb=t.closest('.vsw-search-box');const cc=sb?sb.closest('.vsw-search-category-container'):null;if(sb&&cc&&cc.id===asci){cit(sb);hm();}}}
function cit(s){const b=s.querySelector('.vsw-search-button');if(!b)return;let ic=0;const sl=s.querySelectorAll('select');const ti=s.querySelector('.vsw-custom-search-input');sl.forEach(select=>{if(select.value?.trim()&&select.value!==""){ic++;}});if(ti&&ti.value.trim()){ic++;}
const mir=2;if(ic>=mir){b.disabled=false;}else{b.disabled=true;}}
function scb(){if(cbc){cbc.style.display='flex';setTimeout(()=>{cbc.classList.remove('vsw-hidden');cbc.style.opacity=1;},10);}if(cb){cb.style.display='block';setTimeout(()=>{cb.classList.remove('vsw-hidden');cb.style.opacity=1;},10);}}
function hcb(){if(cbc){cbc.style.opacity=0;const ch=function(){this.style.display='none';this.removeEventListener('transitionend',ch);};if(parseFloat(cbc.style.opacity)>0){cbc.addEventListener('transitionend',ch,{once:true});}else{cbc.style.display='none';}cbc.classList.add('vsw-hidden');}if(cb){cb.style.opacity=0;const bh=function(){this.style.display='none';this.removeEventListener('transitionend',bh);};if(parseFloat(cb.style.opacity)>0){cb.addEventListener('transitionend',bh,{once:true});}else{cb.style.display='none';}cb.classList.add('vsw-hidden');}}
function gtx(id){if(!mt){console.error("VSW Error: Message text container not found.");return`[${id}]`;}const e=mt.querySelector(`#${id}`);if(e){return e.textContent||`[${id}]`;}else{console.warn(`VSW Warning: Message ID "${id}" not found.`);return`[${id}]`;}}
function suc(){if(!cbc)return;const b=cbc.querySelectorAll('button[data-target]');b.forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();const tid=btn.getAttribute('data-target');if(tid){tc(tid);}else{console.warn("VSW Warning: Button missing data-target.");}});});}
function sub(){const b=document.querySelectorAll('.vsw-back-button');b.forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();cca();});});}
function cca(){if(asci){const c=document.getElementById(asci);if(c){const b=c.querySelector('.vsw-search-button');if(b){b.disabled=true;}c.style.opacity=0;const ch=function(){this.style.display='none';this.classList.remove('vsw-active-search-box');const sl=this.querySelectorAll('select');const ti=this.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";this.removeEventListener('transitionend',ch);};if(parseFloat(c.style.opacity)>0){c.addEventListener('transitionend',ch,{once:true});}else{c.style.display='none';c.classList.remove('vsw-active-search-box');const sl=c.querySelectorAll('select');const ti=c.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";}hvs();cvr();}else{console.warn(`VSW Warning: Active container ID ${asci} not found.`);}}asci=null;scb();hm();}
function tc(cs){const ct=document.getElementById(cs);if(!ct){console.error(`VSW Error: Target container ID ${cs} not found.`);return;}if(cs===asci){cca();return;}if(asci){const cc=document.getElementById(asci);if(cc){const b=cc.querySelector('.vsw-search-button');if(b){b.disabled=true;}cc.style.opacity=0;const och=function(){this.style.display='none';this.classList.remove('vsw-active-search-box');const sl=this.querySelectorAll('select');const ti=this.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";this.removeEventListener('transitionend',och);};if(parseFloat(cc.style.opacity)>0){cc.addEventListener('transitionend',och,{once:true});}else{cc.style.display='none';cc.classList.remove('vsw-active-search-box');const sl=cc.querySelectorAll('select');const ti=cc.querySelector('.vsw-custom-search-input');sl.forEach(s=>s.value="");if(ti)ti.value="";}}}hcb();
ct.style.display='block';setTimeout(()=>{ct.classList.add('vsw-active-search-box');ct.style.opacity=1;const sb=ct.querySelector('.vsw-search-box');if(sb){cit(sb);}setTimeout(()=>{const wr=mw.getBoundingClientRect();const tst=window.scrollY+wr.top;window.scrollTo({top:tst,behavior:'smooth'});},400);},10);
asci=cs;cvr();hvs();ipp=cip();hm();}
function soc(){if(!mw)return;document.addEventListener('click',e=>{if(!asci)return;if(mw.contains(e.target)){return;}cca();});}
function hs(){clearTimeout(stm);stm=setTimeout(()=>{if(asci&&mw){if(vd&&vd.style.display!=='none'){return;}const wr=mw.getBoundingClientRect();const th=Math.min(wr.height*.3,window.innerHeight*.3);const ioo=(wr.bottom<th||wr.top>window.innerHeight-th);if(ioo){cca();}}},100);}
async function fyd(st=''){const ak='AIzaSyBYVKCeEIlBjCoS6Xy_mWatJywG3hUPv3Q';if(!ak||ak==='YOUR_API_KEY_HERE'||ak.length<30||ak.startsWith('AIzaSyB')){console.error("VSW Error: API Key config missing/invalid.");sm(gtx('vsw-msgApiKeyError'),8000);hvs();cvr();return;}
const ah='youtube.googleapis.com';const mr=30;const sst=st||'educational videos in Hindi';let au=`https://${ah}/youtube/v3/search?part=snippet&type=video&maxResults=${mr}&key=${ak}`;au+=`&q=${encodeURIComponent(sst)}`;const hhc=/[\u0900-\u097F]/.test(sst);const hchw=/\b(हिंदी|कक्षा|परीक्षा|विज्ञान|गणित|इतिहास|भूगोल|समाचार|लाइव|कहानी|कविता)\b/i.test(sst);if(hhc||hchw||sst.toLowerCase().includes("hindi")){au+=`&relevanceLanguage=hi`;}
sm(gtx('vsw-msgSearchingVideos'),2500);hvs();cvr();
try{const r=await fetch(au,{method:'GET',headers:{'Accept':'application/json'}});const d=await r.json();
if(!r.ok){console.error('VSW API Error Response:',d);let eid='vsw-msgApiGenericErrorPrefix';let ed=`(${r.status})`;if(d.error?.message){if(d.error.errors?.[0]?.reason==='quotaExceeded'){eid='vsw-msgApiQuotaError';ed='';}else if(d.error.errors?.[0]?.reason==='keyInvalid'){eid='vsw-msgApiKeyInvalid';ed='';}else{ed=`:${d.error.message}`;}}else{ed=`(${r.status})`;}const ae=new Error(gtx(eid)+ed);ae.statusCode=r.status;throw ae;}
if(!d?.items||d.items.length===0){sm(gtx('vsw-msgNoVideosFound'),4000);hvs();cvr();cvi=[];return;}
cvi=d.items.filter(i=>i.id?.videoId&&i.snippet);if(cvi.length===0){sm(gtx('vsw-msgNoVideosFound')+" (valid items not found)",4000);hvs();cvr();return;}
dv(cvi);svs();hm();}catch(e){console.error('VSW Fetch Error:',e);let de=gtx('vsw-msgInternalError');if(e.message&&(e.message.startsWith(gtx('vsw-msgApiGenericErrorPrefix'))||e.message.startsWith(gtx('vsw-msgApiQuotaError'))||e.message.startsWith(gtx('vsw-msgApiKeyInvalid'))||e.message.startsWith(gtx('vsw-msgApiKeyError')))){de=e.message;}else if(e.message){de=`${gtx('vsw-msgVideoLoadErrorPrefix')}: ${e.message.substring(0,100)}...`;}
sm(de,6000);hvs();cvr();cvi=[];}}
function dv(v){if(!vs||!vsc||!vd||!yi){console.error("VSW Video display elements not found.");return;}vs.innerHTML='';vsi=0;cvi=v;
if(!cvi||cvi.length===0){if(vsc){vs.innerHTML=`<p style="color:#ccc; padding: 20px; text-align: center; width: 100%;">${gtx('vsw-msgNoVideosFound')}</p>`;vsc.style.display='block';}if(vsn)vsn.style.display='none';if(yi)yi.src='';if(vd)vd.style.display='none';return;}
cvi.forEach((video,i)=>{if(!video.id?.videoId||!video.snippet){console.warn("VSW Skipping invalid video item:",video);return;}const vid=video.id.videoId;const vt=video.snippet.title||'Untitled Video';const tu=video.snippet.thumbnails?.medium?.url||video.snippet.thumbnails?.default?.url||'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const vi=document.createElement('div');vi.classList.add('vsw-video-item');vi.setAttribute('data-index',i);vi.setAttribute('data-videoid',vid);
const th=document.createElement('img');th.src=tu;th.alt=vt;th.onerror=function(){this.onerror=null;this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';console.warn(`VSW Thumbnail failed for ${vid}`);};
const t=document.createElement('p');const te=document.createElement('textarea');te.innerHTML=vt;t.textContent=te.value;
vi.appendChild(th);vi.appendChild(t);
vi.addEventListener('click',()=>{dev(vid);if(vd&&vd.style.display!=='none'){const pr=vd.getBoundingClientRect();if(pr.top<20){window.scrollTo({top:window.scrollY+pr.top-20,behavior:'smooth'});}}});
vs.appendChild(vi);});
if(cvi.length>0&&cvi[0].id?.videoId){dev(cvi[0].id.videoId);}else{if(yi)yi.src='';if(vd)vd.style.display='none';}
ipp=cip();uvs();if(vsc)vsc.style.display='block';if(vsn){vsn.style.display=cvi.length>ipp?'flex':'none';}}
function dev(vid){if(!yi||!vd)return;if(!vid){yi.src='';vd.style.display='none';return;}yi.src=`https://www.youtube.com/embed/${vid}?autoplay=0&rel=0&modestbranding=1&hl=hi`;vd.style.display='block';yi.onerror=()=>{console.error('VSW iFrame failed to load video ID:',vid);sm(gtx('vsw-msgVideoLoadFailed'),3000);vd.style.display='none';};yi.onload=()=>{console.log(`VSW iFrame loaded ID: ${vid}`);if(yi.src.includes(vid)){vd.style.display='block';}};if(!yi.src||yi.src==='about:blank'){vd.style.display='none';}}
function cvr(){if(vs)vs.innerHTML='';if(yi){if(yi.contentWindow){try{yi.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');}catch(e){}}yi.src='';}cvi=[];vsi=0;}
function cip(){if(!vsc||vsc.offsetWidth<=0){const iw=150;const im=12;const itw=iw+im;const cwf=mw?mw.offsetWidth*.95-50:window.innerWidth*.95-50;const cal=Math.max(1,Math.floor(cwf/itw));return cal;}const cw=vsc.offsetWidth-20;const iw=150;const im=12;const itw=iw+im;if(cw<=0||itw<=0){return 1;}const ci=Math.max(1,Math.floor(cw/itw));return ci;}
function sv(d){const nvi=cvi.length;ipp=cip();if(nvi<=ipp)return;const mi=Math.max(0,nvi-ipp);let ni=vsi+d;vsi=Math.max(0,Math.min(mi,ni));uvs();}
function uvs(){if(!vs||cvi.length===0){if(vs)vs.style.transform='translateX(0px)';return;}const iw=150;const im=12;const sa=-vsi*(iw+im);vs.style.transform=`translateX(${sa}px)`;}
function hr(){clearTimeout(rtm);rtm=setTimeout(()=>{if(vsc&&vsc.style.display!=='none'){const oipp=ipp;ipp=cip();if(oipp!==ipp){const mi=Math.max(0,cvi.length-ipp);vsi=Math.min(vsi,mi);uvs();if(vsn){vsn.style.display=cvi.length>ipp?'flex':'none';}}}if(asci){const ac=document.getElementById(asci);if(ac){const sb=ac.querySelector('.vsw-search-box');if(sb){cit(sb);}}}},250);}
function ps(sbid){const sb=document.getElementById(sbid);if(!sb){console.error("VSW Error: Search box not found:",sbid);sm(gtx('vsw-msgInternalError'),4000);return;}const sbtn=sb.querySelector('.vsw-search-button');if(sbtn&&sbtn.disabled){console.warn("VSW: performSearch called on disabled button.");sm(gtx('vsw-msgMinInputRequired'),4000);return;}
let fst='';let ic=0;let dst='';const sl=sb.querySelectorAll('select');const ti=sb.querySelector('.vsw-custom-search-input');
sl.forEach(s=>{if(s.value?.trim()&&s.value!==""){dst+=s.value.trim()+' ';ic++;}});dst=dst.trim();const tv=ti?ti.value.trim():'';if(tv){ic++;}
const mir=2;if(ic<mir){console.warn("VSW: performSearch called with insufficient inputs (fallback).");sm(gtx('vsw-msgMinInputRequired'),4000);return;}
if(tv){fst=(dst+' '+tv).trim();}else{fst=dst;}hm();console.log(`VSW Performing search for: "${fst}"`);fyd(fst);}
function svs(){if(cvi&&cvi.length>0){if(vsc&&vsc.style.display==='none'){vsc.style.display='block';}if(yi&&yi.src&&yi.src!=='about:blank'&&vd&&vd.style.display==='none'){vd.style.display='block';}ipp=cip();if(vsn){vsn.style.display=cvi.length>ipp?'flex':'none';}}else{hvs();}}
function hvs(){if(vsc)vsc.style.display='none';if(vd)vd.style.display='none';if(vsn)vsn.style.display='none';}
function sm(mtxt,d=3000){if(!mb)return;clearTimeout(mtm);const tts=mtxt||gtx('vsw-msgInternalError');mb.textContent=tts;mb.style.display='block';if(d>0){mtm=setTimeout(hm,d);}}
function hm(){if(!mb)return;clearTimeout(mtm);mb.style.display='none';}
})(); /*
अंत: यह 'खोजें और सीखें' विजेट स्क्रिप्ट का अंत है।
*/
