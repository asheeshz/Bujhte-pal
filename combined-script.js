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
