// ==================================================
// विजेट 1: टेबल ऑफ कंटेंट्स (TOC) लॉजिक
// (IIFE के भीतर सीधे निष्पादित, DOM रेडीनेस चेक के साथ)
// ==================================================
(function() { // Start IIFE for TOC widget

    // --- Configuration ---
    const config = {
        postContainerSelector: ".post-body", // *** महत्वपूर्ण: इसे अपनी थीम के अनुसार बदलें ***
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
    // --- End Configuration ---

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
        window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
    }

    function controlButtonGlow(buttonElement, shouldGlow) {
        if (!buttonElement) return;
        if (shouldGlow) {
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
                   if (!toc.classList.contains('toc-visible')) {
                       toc.classList.add('toc-visible');
                       tocContainer.classList.add('toc-is-shown');
                       updateButtonContent(true);
                       controlButtonGlow(toggleButton, false);
                   }
                   smoothScrollToTarget(targetHeading);
                   setTimeout(() => { applyHighlight(targetHeading); }, 500);
                } else { console.warn("TOC: Target '" + targetId + "' not found."); }
            }
        });
    }

    function initializeToc() {
        const postContent = document.querySelector(config.postContainerSelector);
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
             return;
        }

        tocContainer = document.createElement("div"); tocContainer.id = "toc-container";
        toggleButton = document.createElement("button"); toggleButton.id = "toc-toggle-button";
        updateButtonContent(false);
        toggleButton.setAttribute("aria-controls", "toc");
        controlButtonGlow(toggleButton, true);

        toc = document.createElement("div"); toc.id = "toc";
        const tocTitleElement = document.createElement("h2"); // Renamed from tocTitle to avoid conflict
        tocTitleElement.textContent = config.tocTitleText;
        toc.appendChild(tocTitleElement);
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

        if (firstValidHeading && firstValidHeading.parentNode) {
             firstValidHeading.parentNode.insertBefore(tocContainer, firstValidHeading);
         } else if (postContent.firstChild) {
             postContent.insertBefore(tocContainer, postContent.firstChild);
         } else {
             postContent.appendChild(tocContainer);
         }

        setupEventListeners();
        console.log("Table of Contents Initialized.");
    }

    // `defer` सुनिश्चित करता है कि DOM पार्स हो गया है।
    // तो, हम `initializeToc` को सीधे कॉल कर सकते हैं।
    // वैकल्पिक रूप से, अधिक सुरक्षित दृष्टिकोण के लिए:
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeToc);
    } else {
        initializeToc();
    }

})(); // End IIFE for TOC widget
// ==================================================
// विजेट 1: टेबल ऑफ कंटेंट्स (TOC) लॉजिक समाप्त
// ==================================================

// ==================================================
// विजेट 2: सर्कुलर मेन्यू लॉजिक शुरू
// (defer के कारण DOM तैयार होने पर सीधे निष्पादित)
// ==================================================
(function() { // IIFE for Circular Menu
    const menuToggle = document.querySelector('.cm__menu-toggle');
    const categoriesMenu = document.querySelector('.cm__menu-categories');
    const linksMenu = document.querySelector('.cm__menu-links');
    const linksTitle = linksMenu ? linksMenu.querySelector('.cm__links-title') : null;
    const categoryTitleElement = categoriesMenu ? categoriesMenu.querySelector('.cm__category-title') : null;

    const categories = document.querySelectorAll('.cm__category');
    const linksContent = document.querySelectorAll('.cm__links-content .cm__links');

    const categoryIcons = {
        'cm__class-1-5': '<i class="fas fa-book-reader"></i>', 'cm__class-6-8': '<i class="fas fa-graduation-cap"></i>',
        'cm__class-9-10': '<i class="fas fa-school"></i>', 'cm__class-11-12': '<i class="fas fa-university"></i>',
        'cm__competitive-exam': '<i class="fas fa-trophy"></i>', 'cm__news-channel': '<i class="fas fa-newspaper"></i>',
        'cm__yoga-ayurveda': '<i class="fas fa-heart"></i>', 'cm__marriage-links': '<i class="fas fa-ring"></i>',
        'cm__editorial-links': '<i class="fas fa-edit"></i>', 'cm__government-links': '<i class="fas fa-flag"></i>',
        'cm__astrology-links': '<i class="fas fa-star"></i>', 'cm__vaidik-links': '<i class="fas fa-om"></i>'
    };

    const gradientClasses = [
        'cm__gradient-1', 'cm__gradient-2', 'cm__gradient-3', 'cm__gradient-4', 'cm__gradient-5', 'cm__gradient-6',
        'cm__gradient-7', 'cm__gradient-8', 'cm__gradient-9', 'cm__gradient-10', 'cm__gradient-11', 'cm__gradient-12'
    ];

    function removeGradientClasses(element) {
         gradientClasses.forEach(cls => element.classList.remove(cls));
     }

    if (menuToggle && categoriesMenu && linksMenu) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isActive = categoriesMenu.classList.contains('cm__active');

            if (isActive) {
                categoriesMenu.classList.remove('cm__active');
                linksMenu.classList.remove('cm__show');
                if(categoryTitleElement) categoryTitleElement.style.display = 'none';
            } else {
                 linksMenu.classList.remove('cm__show');
                 categoriesMenu.classList.add('cm__active');
                 if(categoryTitleElement) {
                    categoryTitleElement.style.display = 'block';
                    removeGradientClasses(categoryTitleElement);
                    const randomGradientIndex = Math.floor(Math.random() * gradientClasses.length);
                    categoryTitleElement.classList.add(gradientClasses[randomGradientIndex]);
                    categoryTitleElement.innerHTML = '<i class="fas fa-hand-point-down"></i> अपनी पसंद पर क्लिक करें';
                 }
            }
        });

        categories.forEach((category, index) => {
             category.addEventListener('click', (event) => {
                 event.stopPropagation();
                 const categoryData = category.getAttribute('data-category');
                 const titleText = category.getAttribute('data-title');
                 const iconHtml = categoryIcons[categoryData] || '<i class="fas fa-link"></i>';

                 linksContent.forEach(linkBox => {
                     linkBox.style.display = 'none';
                 });

                 const targetLinks = linksMenu.querySelector(`.cm__links-content .${categoryData}`);
                 if (targetLinks) {
                     targetLinks.style.display = 'block';
                 } else {
                     console.warn(`CircularMenu: Links section for category '${categoryData}' not found.`);
                 }

                 if(linksTitle) {
                    linksTitle.innerHTML = `${iconHtml} ${titleText}`;
                    removeGradientClasses(linksTitle);
                    linksTitle.classList.add(gradientClasses[index % gradientClasses.length]);
                 }

                 if(categoriesMenu) categoriesMenu.classList.remove('cm__active');
                 if(linksMenu) linksMenu.classList.add('cm__show');
                 if(categoryTitleElement) categoryTitleElement.style.display = 'none';
             });
         });

        document.addEventListener('click', (event) => {
            if (menuToggle && categoriesMenu && linksMenu &&
                !menuToggle.contains(event.target) &&
                !categoriesMenu.contains(event.target) &&
                !linksMenu.contains(event.target)
            ) {
                categoriesMenu.classList.remove('cm__active');
                linksMenu.classList.remove('cm__show');
                if (categoryTitleElement) {
                     categoryTitleElement.style.display = 'none';
                 }
            }
        });
        console.log("Circular Menu Initialized.");
    } else {
        console.warn("Circular Menu: Essential elements not found. Widget not fully initialized.");
    }
})(); // End IIFE for Circular Menu
// ==================================================
// विजेट 2: सर्कुलर मेन्यू लॉजिक समाप्त
// ==================================================

// ==================================================
// विजेट 3: वीडियो सर्च विजेट (VSW) लॉजिक शुरू
// (defer के कारण DOM तैयार होने पर सीधे निष्पादित)
// ==================================================
(function() { // IIFE for VSW
    /*
    विजेट का परिचय: ... (शेष टिप्पणियां वैसी ही रहेंगी)
    */
    let vsw_mainWidget,vsw_categoryButtonsContainer,vsw_categoryBanner,vsw_allSearchContainers,vsw_videoSliderContainer,vsw_videoDisplay,vsw_videoSliderNav,vsw_messageBox,vsw_videoSlider,vsw_youtubeIframe,vsw_messageTexts;
    let vsw_currentVideoItems=[],vsw_videoSlideIndex=0,vsw_itemsPerPage=4,vsw_activeSearchContainerId=null,vsw_messageTimeout,vsw_resizeTimeout,vsw_scrollTimeout;

    vsw_mainWidget=document.getElementById('vsw-main-widget');
    vsw_categoryButtonsContainer=document.getElementById('vsw-category-buttons');
    vsw_categoryBanner=document.getElementById('vsw-category-banner');
    vsw_allSearchContainers=document.querySelectorAll('.vsw-search-category-container');
    vsw_videoSliderContainer=document.getElementById('vsw-video-slider-container');
    vsw_videoDisplay=document.getElementById('vsw-video-display');
    vsw_videoSliderNav=document.getElementById('vsw-video-slider-nav');
    vsw_messageBox=document.getElementById('vsw-messageBox');
    vsw_videoSlider=document.getElementById('vsw-video-slider');
    vsw_youtubeIframe=document.getElementById('vsw-youtube-iframe');
    vsw_messageTexts=document.getElementById('vsw-message-texts');

    if(vsw_mainWidget&&vsw_categoryButtonsContainer&&vsw_messageTexts&&vsw_messageBox){
        vsw_setupCategoryButtons();
        vsw_setupBackButtons();
        vsw_setupOutsideClickListener();
        window.addEventListener('resize',vsw_handleResize);
        window.addEventListener('scroll',vsw_handleScroll);
        vsw_mainWidget.addEventListener('change',vsw_handleInputChange);
        vsw_mainWidget.addEventListener('input',vsw_handleInputChange);
        vsw_mainWidget.addEventListener('click',vsw_handleSearchButtonClick);
        vsw_showCategoriesAndBanner();
        vsw_allSearchContainers.forEach(container=>{container.style.display='none';container.classList.remove('vsw-active-search-box');container.style.opacity=0;});
        vsw_hideVideoSections();
        console.log("Video Search Widget Initialized.");
    }else{
        console.error("VSW Error: Essential elements missing. Widget not fully initialized.");
        if(vsw_messageBox){
             vsw_messageBox.textContent="VSW Initialization Error: Essential elements missing.";
             vsw_messageBox.style.display='block';
        }
    }

    function vsw_handleSearchButtonClick(event){
         const target=event.target;const searchButton=target.closest('.vsw-search-button');
         if(searchButton){
             const searchBox=searchButton.closest('.vsw-search-box');const categoryContainer=searchBox?searchBox.closest('.vsw-search-category-container'):null;
             if(categoryContainer&&categoryContainer.id===vsw_activeSearchContainerId){
                 if(searchButton.disabled){
                     event.preventDefault();event.stopPropagation();vsw_showMessage(vsw_getTextById('vsw-msgMinInputRequired'),4000);
                 }
             }
         }
    }
    function vsw_handleInputChange(event){
         const target=event.target;
         if(target.tagName==='SELECT'||(target.tagName==='INPUT'&&target.classList.contains('vsw-custom-search-input'))){
             const searchBox=target.closest('.vsw-search-box');const categoryContainer=searchBox?searchBox.closest('.vsw-search-category-container'):null;
             if(searchBox&&categoryContainer&&categoryContainer.id===vsw_activeSearchContainerId){
                  vsw_checkInputsAndToggleSearchButton(searchBox);vsw_hideMessage();
             }
         }
    }
    function vsw_checkInputsAndToggleSearchButton(searchBoxElement){
         const searchButton=searchBoxElement.querySelector('.vsw-search-button');if(!searchButton)return;
         let inputCount=0;const selects=searchBoxElement.querySelectorAll('select');const textInput=searchBoxElement.querySelector('.vsw-custom-search-input');
         selects.forEach(select=>{if(select.value?.trim()&&select.value!==""){inputCount++;}});
         if(textInput&&textInput.value.trim()){inputCount++;}
         const minInputsRequired=2;
         if(inputCount>=minInputsRequired){searchButton.disabled=false;}else{searchButton.disabled=true;}
    }
    function vsw_showCategoriesAndBanner(){
         if(vsw_categoryButtonsContainer){
              vsw_categoryButtonsContainer.style.display='flex';
              setTimeout(()=>{vsw_categoryButtonsContainer.classList.remove('vsw-hidden');vsw_categoryButtonsContainer.style.opacity=1;},10);
         }
         if(vsw_categoryBanner){
             vsw_categoryBanner.style.display='block';
             setTimeout(()=>{vsw_categoryBanner.classList.remove('vsw-hidden');vsw_categoryBanner.style.opacity=1;},10);
         }
    }
    function vsw_hideCategoriesAndBanner(){
        if(vsw_categoryButtonsContainer){
             vsw_categoryButtonsContainer.style.opacity=0;
             const catBtnHandler=function(){this.style.display='none';this.removeEventListener('transitionend',catBtnHandler);};
             if(vsw_categoryButtonsContainer.style.opacity !== "" && parseFloat(getComputedStyle(vsw_categoryButtonsContainer).opacity)>0){vsw_categoryButtonsContainer.addEventListener('transitionend',catBtnHandler,{once:true});}
             else{vsw_categoryButtonsContainer.style.display='none';}
             vsw_categoryButtonsContainer.classList.add('vsw-hidden');
        }
         if(vsw_categoryBanner){
             vsw_categoryBanner.style.opacity=0;
             const bannerHandler=function(){this.style.display='none';this.removeEventListener('transitionend',bannerHandler);};
             if(vsw_categoryBanner.style.opacity !== "" && parseFloat(getComputedStyle(vsw_categoryBanner).opacity)>0){vsw_categoryBanner.addEventListener('transitionend',bannerHandler,{once:true});}
             else{vsw_categoryBanner.style.display='none';}
              vsw_categoryBanner.classList.add('vsw-hidden');
         }
    }
    function vsw_getTextById(id){
        if(!vsw_messageTexts){console.error("VSW Error: Message text container not found.");return`[${id}]`;}
        const element=vsw_messageTexts.querySelector(`#${id}`);
        if(element){return element.textContent||`[${id}]`;}else{console.warn(`VSW Warning: Message ID "${id}" not found.`);return`[${id}]`;}
    }
    function vsw_setupCategoryButtons(){
        if(!vsw_categoryButtonsContainer)return;
        const buttons=vsw_categoryButtonsContainer.querySelectorAll('button[data-target]');
        buttons.forEach(button=>{
            button.addEventListener('click',(event)=>{
                event.stopPropagation();const targetId=button.getAttribute('data-target');
                if(targetId){vsw_toggleCategory(targetId);}else{console.warn("VSW Warning: Button missing data-target.");}
            });
        });
    }
    function vsw_setupBackButtons(){
        const backButtons=document.querySelectorAll('.vsw-back-button');
        backButtons.forEach(button=>{
            button.addEventListener('click',(event)=>{event.stopPropagation();vsw_closeCurrentlyActiveCategory();});
        });
    }
    function vsw_closeCurrentlyActiveCategory(){
         if(vsw_activeSearchContainerId){
             const currentActiveContainer=document.getElementById(vsw_activeSearchContainerId);
             if(currentActiveContainer){
                 const searchButton=currentActiveContainer.querySelector('.vsw-search-button');if(searchButton){searchButton.disabled=true;}
                  currentActiveContainer.style.opacity=0;
                  const containerHandler=function(){this.style.display='none';this.classList.remove('vsw-active-search-box');
                       const selects=this.querySelectorAll('select');const textInput=this.querySelector('.vsw-custom-search-input');
                       selects.forEach(select=>select.value="");if(textInput)textInput.value="";
                       this.removeEventListener('transitionend',containerHandler);};
                  if(currentActiveContainer.style.opacity !== "" && parseFloat(getComputedStyle(currentActiveContainer).opacity)>0){currentActiveContainer.addEventListener('transitionend',containerHandler,{once:true});}
                  else{currentActiveContainer.style.display='none';currentActiveContainer.classList.remove('vsw-active-search-box');
                       const selects=currentActiveContainer.querySelectorAll('select');const textInput=currentActiveContainer.querySelector('.vsw-custom-search-input');
                       selects.forEach(select=>select.value="");if(textInput)textInput.value="";}
                 vsw_hideVideoSections();vsw_clearVideoResults();
             }else{console.warn(`VSW Warning: Active container ID ${vsw_activeSearchContainerId} not found.`);}
             vsw_activeSearchContainerId=null;vsw_showCategoriesAndBanner();
         }vsw_hideMessage();
    }
    function vsw_toggleCategory(containerIdToShow){
        const containerToShow=document.getElementById(containerIdToShow);
        if(!containerToShow){console.error(`VSW Error: Target container ID ${containerIdToShow} not found.`);return;}
        if(containerIdToShow===vsw_activeSearchContainerId){vsw_closeCurrentlyActiveCategory();return;}
        if(vsw_activeSearchContainerId){
            const currentActiveContainer=document.getElementById(vsw_activeSearchContainerId);
             if(currentActiveContainer){
                  const searchButton=currentActiveContainer.querySelector('.vsw-search-button');if(searchButton){searchButton.disabled=true;}
                  currentActiveContainer.style.opacity=0;
                  const oldContainerHandler=function(){this.style.display='none';this.classList.remove('vsw-active-search-box');
                       const selects=this.querySelectorAll('select');const textInput=this.querySelector('.vsw-custom-search-input');
                       selects.forEach(select=>select.value="");if(textInput)textInput.value="";
                      this.removeEventListener('transitionend',oldContainerHandler);};
                  if(currentActiveContainer.style.opacity !== "" && parseFloat(getComputedStyle(currentActiveContainer).opacity)>0){currentActiveContainer.addEventListener('transitionend',oldContainerHandler,{once:true});}
                  else{currentActiveContainer.style.display='none';currentActiveContainer.classList.remove('vsw-active-search-box');
                       const selects=currentActiveContainer.querySelectorAll('select');const textInput=currentActiveContainer.querySelector('.vsw-custom-search-input');
                       selects.forEach(select=>select.value="");if(textInput)textInput.value="";}
             }
        }vsw_hideCategoriesAndBanner();
        containerToShow.style.display='block';
        setTimeout(()=>{
             containerToShow.classList.add('vsw-active-search-box');containerToShow.style.opacity=1;
             const searchBoxElement=containerToShow.querySelector('.vsw-search-box');if(searchBoxElement){vsw_checkInputsAndToggleSearchButton(searchBoxElement);}
             setTimeout(()=>{if(vsw_mainWidget){const widgetRect=vsw_mainWidget.getBoundingClientRect();const targetScrollTop=window.pageYOffset+widgetRect.top;window.scrollTo({top:targetScrollTop,behavior:'smooth'});}},400);
        },10);
        vsw_activeSearchContainerId=containerIdToShow;vsw_clearVideoResults();vsw_hideVideoSections();vsw_itemsPerPage=vsw_calculateItemsPerPage();vsw_hideMessage();
    }
    function vsw_setupOutsideClickListener(){
        if(!vsw_mainWidget)return;
        document.addEventListener('click',(event)=>{
            if(!vsw_activeSearchContainerId)return;
             if(vsw_mainWidget.contains(event.target)){
                 return;
             }
            vsw_closeCurrentlyActiveCategory();
        });
    }
    function vsw_handleScroll(){
         clearTimeout(vsw_scrollTimeout);
         vsw_scrollTimeout=setTimeout(()=>{
             if(vsw_activeSearchContainerId&&vsw_mainWidget){
                 if(vsw_videoDisplay&&getComputedStyle(vsw_videoDisplay).display!=='none'){
                      return;
                 }
                 const widgetRect=vsw_mainWidget.getBoundingClientRect();const threshold=Math.min(widgetRect.height*.3,window.innerHeight*.3);
                 const isOutOfView=(widgetRect.bottom<threshold||widgetRect.top>window.innerHeight-threshold);
                 if(isOutOfView){vsw_closeCurrentlyActiveCategory();}
             }
         },100);
    }
    async function vsw_fetchYouTubeData(searchTerm=''){
        const apiKey='AIzaSyBYVKCeEIlBjCoS6Xy_mWatJywG3hUPv3Q'; /* DEMO KEY - REPLACE IN PRODUCTION! */
        if(!apiKey||apiKey==='YOUR_API_KEY_HERE'||apiKey.length<30||apiKey.startsWith('AIzaSyB')){
             console.error("VSW Error: API Key config missing/invalid.");vsw_showMessage(vsw_getTextById('vsw-msgApiKeyError'),8000);
             vsw_hideVideoSections();vsw_clearVideoResults();return;
        }
        const apiHost='youtube.googleapis.com';const maxResults=30;const safeSearchTerm=searchTerm||'educational videos in Hindi';
        let apiUrl=`https://${apiHost}/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&key=${apiKey}`;
        apiUrl+=`&q=${encodeURIComponent(safeSearchTerm)}`;
         const hasHindiChars=/[\u0900-\u097F]/.test(safeSearchTerm);const hasCommonHindiWords=/\b(हिंदी|कक्षा|परीक्षा|विज्ञान|गणित|इतिहास|भूगोल|समाचार|लाइव|कहानी|कविता)\b/i.test(safeSearchTerm);
        if(hasHindiChars||hasCommonHindiWords||safeSearchTerm.toLowerCase().includes("hindi")){apiUrl+=`&relevanceLanguage=hi`;}
        vsw_showMessage(vsw_getTextById('vsw-msgSearchingVideos'),2500);vsw_hideVideoSections();vsw_clearVideoResults();
        try{
            const response=await fetch(apiUrl,{method:'GET',headers:{'Accept':'application/json'}});
            const data=await response.json();
            if(!response.ok){
                console.error('VSW API Error Response:',data);let errorId='vsw-msgApiGenericErrorPrefix';let errorDetails=`(${response.status})`;
                if(data.error?.message){
                    if(data.error.errors?.[0]?.reason==='quotaExceeded'){errorId='vsw-msgApiQuotaError';errorDetails='';}
                    else if(data.error.errors?.[0]?.reason==='keyInvalid'){errorId='vsw-msgApiKeyInvalid';errorDetails='';}
                    else{errorDetails=`:${data.error.message}`;}
                }else{errorDetails=`(${response.status})`;}
                const apiError=new Error(vsw_getTextById(errorId)+errorDetails);apiError.statusCode=response.status;throw apiError;
            }
            if(!data?.items||data.items.length===0){
                vsw_showMessage(vsw_getTextById('vsw-msgNoVideosFound'),4000);vsw_hideVideoSections();vsw_clearVideoResults();vsw_currentVideoItems=[];return;
            }
            vsw_currentVideoItems=data.items.filter(item=>item.id?.videoId&&item.snippet);
            if(vsw_currentVideoItems.length===0){
                 vsw_showMessage(vsw_getTextById('vsw-msgNoVideosFound')+" (valid items not found)",4000);
                vsw_hideVideoSections();vsw_clearVideoResults();return;
            }
            vsw_displayVideos(vsw_currentVideoItems);vsw_showVideoSections();vsw_hideMessage();
        }catch(error){
            console.error('VSW Fetch Error:',error);let displayError=vsw_getTextById('vsw-msgInternalError');
            if(error.message&&(error.message.startsWith(vsw_getTextById('vsw-msgApiGenericErrorPrefix'))||error.message.startsWith(vsw_getTextById('vsw-msgApiQuotaError'))||error.message.startsWith(vsw_getTextById('vsw-msgApiKeyInvalid'))||error.message.startsWith(vsw_getTextById('vsw-msgApiKeyError')))){
                 displayError=error.message;
             }else if(error.message){displayError=`${vsw_getTextById('vsw-msgVideoLoadErrorPrefix')}: ${error.message.substring(0,100)}...`;}
            vsw_showMessage(displayError,6000);vsw_hideVideoSections();vsw_clearVideoResults();vsw_currentVideoItems=[];
        }
    }
    function vsw_displayVideos(videos){
        if(!vsw_videoSlider||!vsw_videoSliderContainer||!vsw_videoDisplay||!vsw_youtubeIframe){console.error("VSW Video display elements not found.");return;}
        vsw_videoSlider.innerHTML='';vsw_videoSlideIndex=0;vsw_currentVideoItems=videos;
        if(!vsw_currentVideoItems||vsw_currentVideoItems.length===0){
            if(vsw_videoSliderContainer){vsw_videoSlider.innerHTML=`<p style="color:#ccc; padding: 20px; text-align: center; width: 100%;">${vsw_getTextById('vsw-msgNoVideosFound')}</p>`;vsw_videoSliderContainer.style.display='block';}
            if(vsw_videoSliderNav)vsw_videoSliderNav.style.display='none';if(vsw_youtubeIframe)vsw_youtubeIframe.src='';if(vsw_videoDisplay)vsw_videoDisplay.style.display='none';return;
        }
        vsw_currentVideoItems.forEach((video,index)=>{
            if(!video.id?.videoId||!video.snippet){console.warn("VSW Skipping invalid video item:",video);return;}
            const videoId=video.id.videoId;const videoTitle=video.snippet.title||'Untitled Video';
            const thumbnailUrl=video.snippet.thumbnails?.medium?.url||video.snippet.thumbnails?.default?.url||'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            const videoItem=document.createElement('div');videoItem.classList.add('vsw-video-item');videoItem.setAttribute('data-index',index);videoItem.setAttribute('data-videoid',videoId);
            const thumbnail=document.createElement('img');thumbnail.src=thumbnailUrl;thumbnail.alt=videoTitle;
            thumbnail.onerror=function(){this.onerror=null;this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';console.warn(`VSW Thumbnail failed for ${videoId}`);};
            const titleElement=document.createElement('p'); // Renamed from title to avoid conflict
            const tempEl=document.createElement('textarea');tempEl.innerHTML=videoTitle;titleElement.textContent=tempEl.value;
            videoItem.appendChild(thumbnail);videoItem.appendChild(titleElement);
            videoItem.addEventListener('click',()=>{vsw_displayEmbeddedVideo(videoId);
                if(vsw_videoDisplay&&getComputedStyle(vsw_videoDisplay).display!=='none'){const playerRect=vsw_videoDisplay.getBoundingClientRect();if(playerRect.top<20){window.scrollTo({top:window.pageYOffset+playerRect.top-20,behavior:'smooth'});}}
            });
            vsw_videoSlider.appendChild(videoItem);
        });
        if(vsw_currentVideoItems.length>0&&vsw_currentVideoItems[0].id?.videoId){vsw_displayEmbeddedVideo(vsw_currentVideoItems[0].id.videoId);}
        else{if(vsw_youtubeIframe)vsw_youtubeIframe.src='';if(vsw_videoDisplay)vsw_videoDisplay.style.display='none';}
        vsw_itemsPerPage=vsw_calculateItemsPerPage();vsw_updateVideoSlider();
        if(vsw_videoSliderContainer)vsw_videoSliderContainer.style.display='block';
        if(vsw_videoSliderNav){vsw_videoSliderNav.style.display=vsw_currentVideoItems.length>vsw_itemsPerPage?'flex':'none';}
    }
    function vsw_displayEmbeddedVideo(videoId){
        if(!vsw_youtubeIframe||!vsw_videoDisplay)return;
        if(!videoId){vsw_youtubeIframe.src='';vsw_videoDisplay.style.display='none';return;}
        vsw_youtubeIframe.src=`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&hl=hi`;
        vsw_videoDisplay.style.display='block';
        vsw_youtubeIframe.onerror=()=>{console.error('VSW iFrame failed to load video ID:',videoId);vsw_showMessage(vsw_getTextById('vsw-msgVideoLoadFailed'),3000);vsw_videoDisplay.style.display='none';};
        vsw_youtubeIframe.onload=()=>{console.log(`VSW iFrame loaded ID: ${videoId}`);if(vsw_youtubeIframe.src.includes(videoId)){vsw_videoDisplay.style.display='block';}};
        if(!vsw_youtubeIframe.src||vsw_youtubeIframe.src==='about:blank'){vsw_videoDisplay.style.display='none';}
    }
    function vsw_clearVideoResults(){
        if(vsw_videoSlider)vsw_videoSlider.innerHTML='';
        if(vsw_youtubeIframe){if(vsw_youtubeIframe.contentWindow){try{vsw_youtubeIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');}catch(e){/*ignore*/}}vsw_youtubeIframe.src='';}
        vsw_currentVideoItems=[];vsw_videoSlideIndex=0;
    }
    function vsw_calculateItemsPerPage(){
        if(!vsw_videoSliderContainer||vsw_videoSliderContainer.offsetWidth<=0){
             const itemWidth=150;const itemMargin=12;const itemTotalWidth=itemWidth+itemMargin;
             const containerWidthFallback=vsw_mainWidget?vsw_mainWidget.offsetWidth*.95-50:window.innerWidth*.95-50;
             const calculated=Math.max(1,Math.floor(containerWidthFallback/itemTotalWidth));return calculated;
        }
        const containerWidth=vsw_videoSliderContainer.offsetWidth-20;const itemWidth=150;const itemMargin=12;const itemTotalWidth=itemWidth+itemMargin;
        if(containerWidth<=0||itemTotalWidth<=0){return 1;}
        const calculatedItems=Math.max(1,Math.floor(containerWidth/itemTotalWidth));return calculatedItems;
    }
    function vsw_slideVideoInternal(direction){ // Renamed to avoid conflict if window.vsw_slideVideo is already set by HTML
        const numVideoItems=vsw_currentVideoItems.length;vsw_itemsPerPage=vsw_calculateItemsPerPage();
        if(numVideoItems<=vsw_itemsPerPage)return;
        const maxIndex=Math.max(0,numVideoItems-vsw_itemsPerPage);let newIndex=vsw_videoSlideIndex+direction;
        vsw_videoSlideIndex=Math.max(0,Math.min(maxIndex,newIndex));vsw_updateVideoSlider();
    }
    window.vsw_slideVideo = vsw_slideVideoInternal;

    function vsw_updateVideoSlider(){
        if(!vsw_videoSlider||vsw_currentVideoItems.length===0){if(vsw_videoSlider)vsw_videoSlider.style.transform='translateX(0px)';return;}
        const itemWidth=150;const itemMargin=12;const slideAmount=-vsw_videoSlideIndex*(itemWidth+itemMargin);
        vsw_videoSlider.style.transform=`translateX(${slideAmount}px)`;
    }
    function vsw_handleResize(){
        clearTimeout(vsw_resizeTimeout);
        vsw_resizeTimeout=setTimeout(()=>{
            if(vsw_videoSliderContainer&&getComputedStyle(vsw_videoSliderContainer).display!=='none'){
                const oldItemsPerPage=vsw_itemsPerPage;vsw_itemsPerPage=vsw_calculateItemsPerPage();
                if(oldItemsPerPage!==vsw_itemsPerPage){
                    const maxIndex=Math.max(0,vsw_currentVideoItems.length-vsw_itemsPerPage);
                    vsw_videoSlideIndex=Math.min(vsw_videoSlideIndex,maxIndex);vsw_updateVideoSlider();
                    if(vsw_videoSliderNav){vsw_videoSliderNav.style.display=vsw_currentVideoItems.length>vsw_itemsPerPage?'flex':'none';}
                }
            }
             if(vsw_activeSearchContainerId){
                  const activeContainer=document.getElementById(vsw_activeSearchContainerId);
                  if(activeContainer){const searchBoxElement=activeContainer.querySelector('.vsw-search-box');if(searchBoxElement){vsw_checkInputsAndToggleSearchButton(searchBoxElement);}}
             }
        },250);
    }
    function vsw_performSearchInternal(searchBoxId){ // Renamed
        const searchBox=document.getElementById(searchBoxId);if(!searchBox){console.error("VSW Error: Search box not found:",searchBoxId);vsw_showMessage(vsw_getTextById('vsw-msgInternalError'),4000);return;}
         const searchButton=searchBox.querySelector('.vsw-search-button');if(searchButton&&searchButton.disabled){console.warn("VSW: performSearch called on disabled button.");vsw_showMessage(vsw_getTextById('vsw-msgMinInputRequired'),4000);return;}
        let finalSearchTerm='';let inputCount=0;let dropdownSearchTerm='';
        const selects=searchBox.querySelectorAll('select');const textInput=searchBox.querySelector('.vsw-custom-search-input');
        selects.forEach(select=>{if(select.value?.trim()&&select.value!==""){dropdownSearchTerm+=select.value.trim()+' ';inputCount++;}});
        dropdownSearchTerm=dropdownSearchTerm.trim();const textValue=textInput?textInput.value.trim():'';
        if(textValue){inputCount++;}
        const minInputsRequired=2;
        if(inputCount<minInputsRequired){console.warn("VSW: performSearch called with insufficient inputs (fallback).");vsw_showMessage(vsw_getTextById('vsw-msgMinInputRequired'),4000);return;}
         if(textValue){finalSearchTerm=(dropdownSearchTerm+' '+textValue).trim();}else{finalSearchTerm=dropdownSearchTerm;}
        vsw_hideMessage();console.log(`VSW Performing search for: "${finalSearchTerm}"`);vsw_fetchYouTubeData(finalSearchTerm);
    }
    window.vsw_performSearch = vsw_performSearchInternal;

    function vsw_showVideoSections(){
        if(vsw_currentVideoItems&&vsw_currentVideoItems.length>0){
            if(vsw_videoSliderContainer&&getComputedStyle(vsw_videoSliderContainer).display==='none'){vsw_videoSliderContainer.style.display='block';}
            if(vsw_youtubeIframe&&vsw_youtubeIframe.src&&vsw_youtubeIframe.src!=='about:blank'&&vsw_videoDisplay&&getComputedStyle(vsw_videoDisplay).display==='none'){vsw_videoDisplay.style.display='block';}
            vsw_itemsPerPage=vsw_calculateItemsPerPage();
            if(vsw_videoSliderNav){vsw_videoSliderNav.style.display=vsw_currentVideoItems.length>vsw_itemsPerPage?'flex':'none';}
        }else{vsw_hideVideoSections();}
    }
    function vsw_hideVideoSections(){
        if(vsw_videoSliderContainer)vsw_videoSliderContainer.style.display='none';if(vsw_videoDisplay)vsw_videoDisplay.style.display='none';if(vsw_videoSliderNav)vsw_videoSliderNav.style.display='none';
    }
    function vsw_showMessage(messageText,duration=3000){
        if(!vsw_messageBox)return;
        clearTimeout(vsw_messageTimeout);
        const textToShow=messageText||vsw_getTextById('vsw-msgInternalError');
        vsw_messageBox.textContent=textToShow;vsw_messageBox.style.display='block';
        if(duration>0){vsw_messageTimeout=setTimeout(vsw_hideMessage,duration);}
    }
    function vsw_hideMessage(){if(!vsw_messageBox)return;clearTimeout(vsw_messageTimeout);vsw_messageBox.style.display='none';}

})(); // End IIFE for VSW
// ==================================================
// विजेट 3: वीडियो सर्च विजेट (VSW) लॉजिक समाप्त
// ==================================================
