// प्रतीक्षा करें जब तक पूरा HTML लोड और पार्स न हो जाए
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM पूरी तरह से लोड और पार्स हो गया है। स्क्रिप्ट शुरू हो रही है...");

    // --- स्मूथ स्क्रॉल और नेविगेशन अपडेट ---
    try {
        const smoothScrollLinks = document.querySelectorAll(".akc-custom-a[href^='#'], .akc-story-nav a[href^='#']");
        const navElement = document.querySelector('.akc-story-nav');
        const navHeight = navElement ? navElement.offsetHeight : 50; // यदि नेव नहीं मिलता है तो डिफ़ॉल्ट ऊंचाई

        smoothScrollLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");
                if (href && href.startsWith("#") && href.length > 1) {
                     try {
                         const targetElement = document.querySelector(href);
                         if (targetElement) {
                            event.preventDefault(); // केवल तभी रोकें जब लक्ष्य मौजूद हो
                            const offsetTop = targetElement.offsetTop;
                            window.scrollTo({ top: offsetTop - navHeight - 15, behavior: 'smooth' });
                            // यदि लिंक नेविगेशन बार का हिस्सा है तो सक्रिय स्थिति अपडेट करें
                            if (link.closest('.akc-story-nav')) {
                                 document.querySelectorAll('.akc-story-nav a').forEach(nav => nav.classList.remove('akc-active'));
                                 link.classList.add('akc-active');
                            }
                        } else {
                             console.warn(`Smooth scroll target element with ID ${href} not found.`);
                             // यदि तत्व नहीं मिलता है, तो डिफ़ॉल्ट व्यवहार होने दें (शायद पेज रीलोड)
                        }
                    } catch (e) {
                        console.error(`Error finding smooth scroll target ${href}:`, e);
                    }
                }
            });
        });

        const sections = document.querySelectorAll('.akc-custom-div[id^="part"]');
        const navLinks = document.querySelectorAll('.akc-story-nav a[href^="#part"]');

        const updateActiveLinkBasedOnScroll = () => {
            if (sections.length === 0 || navLinks.length === 0) return;

            let currentSectionId = '';
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const triggerOffset = navHeight + 50; // सक्रिय करने के लिए ऑफसेट

            sections.forEach(section => {
                const sectionTop = section.offsetTop - triggerOffset;
                const sectionBottom = sectionTop + section.offsetHeight;

                // यदि सेक्शन का ऊपरी भाग व्यूपोर्ट में है या उससे ऊपर है
                // और सेक्शन का निचला भाग व्यूपोर्ट के टॉप से नीचे है (थोड़ी मार्जिन के साथ)
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            // यदि कोई सेक्शन सक्रिय नहीं है (जैसे, पेज के बहुत ऊपर या नीचे)
             if (!currentSectionId && sections.length > 0) {
                if (scrollPosition < (sections[0].offsetTop - triggerOffset)) {
                    // पहले सेक्शन से ऊपर
                    currentSectionId = sections[0].getAttribute('id');
                } else if ((windowHeight + scrollPosition) >= document.body.offsetHeight - 100) {
                    // पेज के बिल्कुल नीचे
                    currentSectionId = sections[sections.length - 1].getAttribute('id');
                }
             }

            // नेविगेशन लिंक्स को अपडेट करें
            navLinks.forEach(link => {
                link.classList.remove('akc-active');
                // लिंक के हैश (#partX) की तुलना वर्तमान सेक्शन आईडी से करें
                if (link.hash === `#${currentSectionId}`) {
                    link.classList.add('akc-active');
                }
            });
        };

        // प्रारंभिक लोड पर और स्क्रॉल पर सक्रिय लिंक अपडेट करें
        updateActiveLinkBasedOnScroll();
        window.addEventListener('scroll', updateActiveLinkBasedOnScroll, { passive: true }); // बेहतर प्रदर्शन के लिए पैसिव

        // यदि URL में हैश है तो प्रारंभिक स्क्रॉल करें
        const hash = window.location.hash;
        if (hash && hash.startsWith("#part")) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                console.log(`Initial scroll to hash: ${hash}`);
                // थोड़ी देर बाद स्क्रॉल करें ताकि लेआउट स्थिर हो जाए
                setTimeout(() => {
                   window.scrollTo({ top: targetElement.offsetTop - navHeight - 15, behavior: 'auto' });
                   // संबंधित नेव लिंक को तुरंत सक्रिय करें
                   const activeLink = document.querySelector(`.akc-story-nav a[href$="${hash}"]`);
                   if (activeLink) {
                       document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active'));
                       activeLink.classList.add('akc-active');
                   }
                }, 100); // 100ms विलंब
             } else {
                 console.warn(`Element for initial hash ${hash} not found.`);
             }
         } else {
             // यदि कोई हैश नहीं है और पेज टॉप पर है, तो पहले लिंक को सक्रिय करें
             if ((window.pageYOffset || document.documentElement.scrollTop) < 100 && sections.length > 0) {
                const defaultActiveLink = document.querySelector('.akc-story-nav a[href$="#part1"]');
                if(defaultActiveLink) {
                    console.log("Setting initial active link to #part1");
                    document.querySelectorAll('.akc-story-nav a').forEach(link => link.classList.remove('akc-active'));
                    defaultActiveLink.classList.add('akc-active');
                }
             }
         }
         console.log("Smooth scroll and Nav update setup complete.");
    } catch (error) {
        console.error("Error setting up smooth scroll or nav update:", error);
    }

    // --- स्वचालित पेजिनेशन और भाग नेविगेशन ---
    // **यह फ़ंक्शन HTML बॉडी टैग में data-* एट्रिब्यूट्स पर निर्भर करता है!**
    function setupPaginationAndNav() {
        try {
            const paginationContainer = document.querySelector('.akc-pagination-section');
            if (!paginationContainer) {
                console.warn("Pagination container (.akc-pagination-section) not found. Skipping pagination setup.");
                return; // यदि कंटेनर नहीं है तो आगे न बढ़ें
            }

            // --- HTML बॉडी टैग से कॉन्फ़िगरेशन डेटा पढ़ें ---
            const bodyData = document.body.dataset;
            const currentPageNumber = parseInt(bodyData.currentPage || '1', 10); // data-current-page से पढ़ें
            const totalPages = parseInt(bodyData.totalPages || '1', 10);       // data-total-pages से पढ़ें
            const baseFilename = bodyData.baseFilename || 'aranyani-kaushik-part'; // data-base-filename से पढ़ें
            const fileExtension = bodyData.fileExtension || '.html';            // data-file-extension से पढ़ें

            // डीबगिंग लॉग
            console.log(`Pagination Setup: Current=${currentPageNumber}, Total=${totalPages}, Base=${baseFilename}, Ext=${fileExtension}`);

            // सुनिश्चित करें कि मान मान्य हैं
            if (isNaN(currentPageNumber) || isNaN(totalPages) || currentPageNumber < 1 || totalPages < 1 || currentPageNumber > totalPages) {
                console.error("Invalid page numbers detected in body data attributes. Aborting pagination.", {currentPageNumber, totalPages});
                paginationContainer.innerHTML = '<p style="color: red;">पेजिनेशन लोड करने में त्रुटि।</p>';
                return;
            }

            paginationContainer.innerHTML = ''; // कंटेनर साफ़ करें
            const maxVisibleLinks = 5; // एक बार में कितने पेज लिंक दिखाने हैं
            let startPage, endPage;

            // गणना करें कि कौन से पेज नंबर लिंक दिखाने हैं
            if (totalPages <= maxVisibleLinks) {
                startPage = 1;
                endPage = totalPages;
            } else {
                const maxBefore = Math.floor((maxVisibleLinks - 1) / 2);
                const maxAfter = Math.ceil((maxVisibleLinks - 1) / 2);
                if (currentPageNumber <= maxBefore + 1) { // थोड़ा एडजस्टमेंट ताकि शुरुआत में ज़्यादा दिखें
                    startPage = 1;
                    endPage = maxVisibleLinks;
                } else if (currentPageNumber + maxAfter >= totalPages) {
                    startPage = totalPages - maxVisibleLinks + 1;
                    endPage = totalPages;
                } else {
                    startPage = currentPageNumber - maxBefore;
                    endPage = currentPageNumber + maxAfter;
                }
            }

            // पहला पेज और इलिप्सिस (...) जोड़ें यदि आवश्यक हो
            if (startPage > 1) {
                const firstLink = document.createElement('a');
                firstLink.href = `${baseFilename}1${fileExtension}`;
                firstLink.textContent = '1';
                firstLink.classList.add('akc-pagination-link');
                paginationContainer.appendChild(firstLink);
                if (startPage > 2) {
                    const ellipsisStart = document.createElement('span');
                    ellipsisStart.textContent = '...';
                    ellipsisStart.classList.add('akc-pagination-label');
                    paginationContainer.appendChild(ellipsisStart);
                }
            }

            // मध्य पेज लिंक्स जोड़ें
            for (let i = startPage; i <= endPage; i++) {
                if (i === currentPageNumber) {
                    const currentSpan = document.createElement('span');
                    currentSpan.textContent = i;
                    currentSpan.classList.add('akc-pagination-link', 'akc-current');
                    paginationContainer.appendChild(currentSpan);
                } else {
                    const link = document.createElement('a');
                    link.href = `${baseFilename}${i}${fileExtension}`;
                    link.textContent = i;
                    link.classList.add('akc-pagination-link');
                    paginationContainer.appendChild(link);
                }
            }

            // अंतिम पेज और इलिप्सिस (...) जोड़ें यदि आवश्यक हो
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsisEnd = document.createElement('span');
                    ellipsisEnd.textContent = '...';
                    ellipsisEnd.classList.add('akc-pagination-label');
                    paginationContainer.appendChild(ellipsisEnd);
                }
                const lastLink = document.createElement('a');
                lastLink.href = `${baseFilename}${totalPages}${fileExtension}`;
                lastLink.textContent = totalPages;
                lastLink.classList.add('akc-pagination-link');
                paginationContainer.appendChild(lastLink);
            }

            // Previous/Next बटन के href अपडेट करें
            const prevPartLinks = document.querySelectorAll('.akc-part-navigation .akc-prev-part-link');
            const nextPartLinks = document.querySelectorAll('.akc-part-navigation .akc-next-part-link');

            prevPartLinks.forEach(btn => {
                if (btn) { // सुनिश्चित करें कि बटन मौजूद है
                    if (currentPageNumber > 1) {
                        btn.href = `${baseFilename}${currentPageNumber - 1}${fileExtension}`;
                        btn.classList.remove('akc-disabled');
                        btn.removeAttribute('aria-disabled'); // एक्सेसिबिलिटी
                    } else {
                        btn.href = '#'; // या इसे पूरी तरह से छिपा सकते हैं CSS से
                        btn.classList.add('akc-disabled');
                        btn.setAttribute('aria-disabled', 'true'); // एक्सेसिबिलिटी
                    }
                }
            });

            nextPartLinks.forEach(btn => {
                if (btn) { // सुनिश्चित करें कि बटन मौजूद है
                    if (currentPageNumber < totalPages) {
                        btn.href = `${baseFilename}${currentPageNumber + 1}${fileExtension}`;
                        btn.classList.remove('akc-disabled', 'akc-hidden-on-last');
                        btn.removeAttribute('aria-disabled'); // एक्सेसिबिलिटी
                    } else {
                        btn.href = '#';
                        btn.classList.add('akc-disabled', 'akc-hidden-on-last');
                         btn.setAttribute('aria-disabled', 'true'); // एक्सेसिबिलिटी
                    }
                }
            });
            console.log("Pagination and Nav buttons setup complete.");
        } catch (error) {
            console.error("Error setting up pagination and navigation:", error);
             // उपयोगकर्ता को बताने के लिए एरर मैसेज दिखाएं
             const paginationContainer = document.querySelector('.akc-pagination-section');
             if(paginationContainer) {
                paginationContainer.innerHTML = '<p style="color: red;">पेजिनेशन लोड करने में त्रुटि हुई।</p>';
             }
        }
    }
    setupPaginationAndNav(); // फ़ंक्शन कॉल करें
    // --- पेजिनेशन समाप्त ---

    // --- TTS कार्यक्षमता ---
    try {
        let currentSpeech = null;
        let speechApiAvailable = ('speechSynthesis' in window);

        function speakText(text, lang = "hi-IN") {
            if (!speechApiAvailable) {
                console.warn("Speech synthesis not supported by this browser.");
                // आप चाहें तो यहाँ एक बार alert दिखा सकते हैं
                // alert("क्षमा करें, टेक्स्ट-टू-स्पीच इस ब्राउज़र में समर्थित नहीं है।");
                // speechApiAvailable = false; // दोबारा अलर्ट न दिखाएं
                return;
            }

            // यदि कुछ बोला जा रहा है, तो उसे रोकें
            if (currentSpeech && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                // यदि वही टेक्स्ट दोबारा क्लिक किया गया है, तो बस रुकें
                if (currentSpeech.text === text) {
                    currentSpeech = null;
                    return;
                }
            }

            // नया भाषण ऑब्जेक्ट बनाएं
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = lang;
            speech.volume = 1; // 0 से 1
            speech.rate = 0.9; // 0.1 से 10 (1 सामान्य)
            speech.pitch = 1; // 0 से 2 (1 सामान्य)

            currentSpeech = speech; // ट्रैक करें कि क्या बोला जा रहा है

            // जब बोलना समाप्त हो जाए तो currentSpeech को रीसेट करें
            speech.onend = () => {
                console.log("Speech finished.");
                currentSpeech = null;
            };
            // एरर हैंडलिंग
            speech.onerror = (event) => {
                console.error("Speech synthesis error:", event.error);
                currentSpeech = null;
                 alert("क्षमा करें, टेक्स्ट बोलने में त्रुटि हुई।");
            };

            // बोलें
            window.speechSynthesis.speak(speech);
        }

        // विशेष शब्दों पर TTS जोड़ें
        document.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(term => {
            term.style.cursor = 'help'; // कर्सर बदलें
            const originalTitle = term.title; // मौजूदा टाइटल सहेजें
            term.title = (originalTitle ? originalTitle + " - " : "") + "सुनने के लिए क्लिक करें"; // टाइटल जोड़ें
            term.setAttribute('role', 'button'); // एक्सेसिबिलिटी
            term.setAttribute('aria-label', `सुनें: ${term.textContent}`); // एक्सेसिबिलिटी

            term.addEventListener("click", (event) => {
                event.stopPropagation(); // पैरेंट पैराग्राफ का क्लिक न हो
                speakText(term.textContent.trim(), "hi-IN"); // ट्रिम करके बोलें
            });
        });

        // मुख्य पैराग्राफ पर TTS जोड़ें
        document.querySelectorAll("p.akc-custom-p").forEach(paragraph => {
            paragraph.style.cursor = 'pointer'; // कर्सर बदलें
            paragraph.title = "पैराग्राफ सुनने के लिए क्लिक करें";
            paragraph.setAttribute('role', 'button'); // एक्सेसिबिलिटी
            paragraph.setAttribute('aria-label', 'यह पैराग्राफ सुनें'); // एक्सेसिबिलिटी

            paragraph.addEventListener("click", () => {
                // क्लोन बनाएं ताकि मूल DOM न बदले
                let clonedNode = paragraph.cloneNode(true);
                // क्लोन से सभी विशेष शब्द स्पैन हटा दें ताकि वे दोबारा न बोलें जाएं
                clonedNode.querySelectorAll(".akc-special-term-1, .akc-special-term-2, .akc-special-term-3").forEach(span => span.remove());
                // टेक्स्ट निकालें, व्हाइटस्पेस सामान्य करें
                let textToSpeak = (clonedNode.textContent || clonedNode.innerText || "").trim().replace(/\s+/g, ' ');
                if (textToSpeak) {
                    speakText(textToSpeak, "hi-IN");
                }
            });

            // होवर प्रभाव (CSS में भी हो सकता है, लेकिन यहाँ भी जोड़ा गया)
            paragraph.addEventListener("mouseenter", () => { if (!paragraph.classList.contains('tts-active')) paragraph.style.backgroundColor = "#fffacd"; });
            paragraph.addEventListener("mouseleave", () => { if (!paragraph.classList.contains('tts-active')) paragraph.style.backgroundColor = ""; }); // CSS डिफ़ॉल्ट पर वापस जाएं
        });

        // अन्य पैराग्राफ जिन्हें TTS नहीं चाहिए, उनका कर्सर डिफ़ॉल्ट करें
        document.querySelectorAll(".akc-story-description p, .akc-tv-ad-explanation, .akc-video-caption-below").forEach(p => {
            p.style.cursor = 'default';
            p.title = ""; // TTS टाइटल हटाएं
        });


        // पेज छोड़ने से पहले TTS रोकें
        window.addEventListener('beforeunload', () => {
            if (speechApiAvailable && window.speechSynthesis.speaking) {
                console.log("Stopping speech before unload.");
                window.speechSynthesis.cancel();
            }
        });
        console.log("TTS functionality setup complete.");
    } catch (error) {
        console.error("Error setting up TTS:", error);
    }
    // --- TTS समाप्त ---

    /* ===== START: Screen Focus Cosmos Widget JS (v1.4 - Prefix: sfcw-) ===== */
    // निर्देश: यह विजेट का कोड है, इसे ऐसे ही रखें।
    try {
        const sfcwYearSpan = document.getElementById('sfcw-current-year');
        if (sfcwYearSpan) {
            sfcwYearSpan.textContent = " " + new Date().getFullYear(); // वर्तमान वर्ष सेट करें
        } else {
            console.warn("Cosmos Widget: sfcw-current-year element not found!");
        }

        const sfcwCanvas = document.getElementById('sfcw-particle-canvas');
        if (!sfcwCanvas) {
            console.error("Cosmos Widget: Particle canvas element (#sfcw-particle-canvas) not found!");
        } else {
            const sfcwCtx = sfcwCanvas.getContext('2d');
            if (!sfcwCtx) {
                 console.error("Cosmos Widget: Could not get 2D context for canvas.");
            } else {
                let sfcwParticles = [];
                let sfcwAnimationFrameId = null;
                let sfcwIsVisible = !document.hidden; // ट्रैक करें कि टैब दिखाई दे रहा है या नहीं

                // कैनवास का आकार बदलें
                function sfcwResizeCanvas() {
                    if (!sfcwCanvas || !sfcwCtx) return;
                    sfcwCanvas.width = sfcwCanvas.offsetWidth;
                    sfcwCanvas.height = sfcwCanvas.offsetHeight;
                    console.log(`Cosmos Widget: Canvas resized to ${sfcwCanvas.width}x${sfcwCanvas.height}`);
                }

                // कण क्लास
                class SFCW_Particle {
                   constructor(x, y) {
                       if (!sfcwCanvas) return;
                       this.canvasWidth = sfcwCanvas.width;
                       this.canvasHeight = sfcwCanvas.height;
                       this.x = x || Math.random() * this.canvasWidth;
                       this.y = y || Math.random() * this.canvasHeight;
                       this.size = Math.random() * 2.5 + 1;
                       this.speedX = (Math.random() * 1 - 0.5) * 0.3; // थोड़ा धीमा
                       this.speedY = (Math.random() * 1 - 0.5) * 0.3; // थोड़ा धीमा
                       const rootStyle = getComputedStyle(document.documentElement);
                       const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)';
                       const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)';
                       this.color = Math.random() > 0.1 ? starColor : particleColor;
                       this.opacity = Math.random() * 0.5 + 0.1; // थोड़ी कम ओपेसिटी
                       this.initialOpacity = this.opacity;
                       this.maxLife = Math.random() * 4 + 2; // थोड़ा ज़्यादा जीवनकाल
                       this.life = this.maxLife * Math.random(); // जीवनकाल रैंडम शुरू करें
                   }

                   update(deltaTime) {
                       if (!sfcwCanvas) return;
                       this.x += this.speedX * deltaTime * 60; // डेल्टाटाइम के आधार पर गति
                       this.y += this.speedY * deltaTime * 60;
                       this.life -= deltaTime;

                       // ओपेसिटी को जीवनकाल के आधार पर फ़ेड करें
                       if (this.life <= 0) {
                           this.opacity = 0;
                           // यदि पूरी तरह से फ़ेड हो गया है, तो रीसेट करें
                           if (this.life < -1) { // थोड़ी देर रुकें रीसेट से पहले
                              this.reset();
                           }
                       } else {
                           // जीवनकाल के दौरान धीरे-धीरे फ़ेड इन/आउट करें
                           const lifeRatio = Math.max(0, this.life / this.maxLife);
                           this.opacity = this.initialOpacity * (Math.sin(lifeRatio * Math.PI)); // साइन वेव फ़ेड
                       }

                       // कैनवास की सीमाओं से बाहर जाने पर रीसेट करें
                       if (this.x < -this.size || this.x > this.canvasWidth + this.size || this.y < -this.size || this.y > this.canvasHeight + this.size) {
                          this.reset();
                       }
                   }

                   reset() {
                        if (!sfcwCanvas) return;
                        // कैनवास के किनारों से शुरू करें
                        const edge = Math.floor(Math.random() * 4);
                        if (edge === 0) { // Top
                            this.x = Math.random() * this.canvasWidth; this.y = -this.size;
                        } else if (edge === 1) { // Right
                            this.x = this.canvasWidth + this.size; this.y = Math.random() * this.canvasHeight;
                        } else if (edge === 2) { // Bottom
                            this.x = Math.random() * this.canvasWidth; this.y = this.canvasHeight + this.size;
                        } else { // Left
                            this.x = -this.size; this.y = Math.random() * this.canvasHeight;
                        }
                        this.opacity = this.initialOpacity;
                        this.life = this.maxLife;
                        this.speedX = (Math.random() * 1 - 0.5) * 0.3;
                        this.speedY = (Math.random() * 1 - 0.5) * 0.3;
                    }

                   draw() {
                       if (!sfcwCtx || this.opacity <= 0 || this.size <= 0) return;
                       sfcwCtx.globalAlpha = this.opacity;
                       sfcwCtx.fillStyle = this.color;
                       sfcwCtx.beginPath();
                       sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                       sfcwCtx.fill();
                   }
                }

                // कणों को इनिशियलाइज़ करें
                function sfcwInitParticles() {
                    sfcwParticles = [];
                    if (!sfcwCanvas || sfcwCanvas.width === 0 || sfcwCanvas.height === 0) return;
                    // कणों की संख्या घनत्व पर आधारित करें
                    let numberOfParticles = Math.floor(sfcwCanvas.width * sfcwCanvas.height / 12000); // घनत्व थोड़ा बढ़ाएं
                    numberOfParticles = Math.max(70, Math.min(numberOfParticles, 200)); // सीमाएं सेट करें
                    console.log(`Cosmos Widget: Initializing ${numberOfParticles} particles.`);
                    for (let i = 0; i < numberOfParticles; i++) {
                        sfcwParticles.push(new SFCW_Particle());
                    }
                }

                let sfcwLastTime = 0;
                // एनिमेशन लूप
                function sfcwAnimateParticles(timestamp) {
                    // यदि कैनवास नहीं है या टैब छिपा हुआ है तो एनिमेशन रोकें
                    if (!sfcwCtx || !sfcwCanvas || !sfcwIsVisible) {
                        sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); // फिर भी लूप जारी रखें
                        return;
                    }

                    const deltaTime = (timestamp - (sfcwLastTime || timestamp)) / 1000; // डेल्टा टाइम सेकंड में
                    sfcwLastTime = timestamp;

                    // बहुत बड़े डेल्टा टाइम को अनदेखा करें (जैसे टैब बदलने के बाद)
                    if (deltaTime > 0.1) {
                         sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
                         return;
                    }

                    // कैनवास साफ़ करें
                    sfcwCtx.clearRect(0, 0, sfcwCanvas.width, sfcwCanvas.height);

                    // कणों को अपडेट और ड्रा करें
                    sfcwParticles.forEach(p => {
                        p.update(deltaTime);
                        p.draw();
                    });

                    // डिफ़ॉल्ट अल्फा रीसेट करें
                    sfcwCtx.globalAlpha = 1.0;

                    // अगला फ्रेम अनुरोध करें
                    sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles);
                }

                // एनिमेशन शुरू करें
                function sfcwStartAnimation() {
                    console.log("Cosmos Widget: Starting animation...");
                    if (!sfcwCanvas || !sfcwCtx) {
                         console.error("Cosmos Widget: Cannot start animation, canvas or context missing.");
                         return;
                    }
                    sfcwResizeCanvas(); // आकार सेट करें
                    sfcwInitParticles(); // कण बनाएं

                    // मौजूदा एनिमेशन फ्रेम रद्द करें यदि कोई हो
                    if (sfcwAnimationFrameId) {
                        cancelAnimationFrame(sfcwAnimationFrameId);
                    }
                    sfcwLastTime = performance.now(); // समय रीसेट करें
                    sfcwAnimationFrameId = requestAnimationFrame(sfcwAnimateParticles); // लूप शुरू करें
                }

                // दृश्यता परिवर्तन को हैंडल करें
                document.addEventListener('visibilitychange', () => {
                    sfcwIsVisible = !document.hidden;
                    if (sfcwIsVisible) {
                        console.log("Cosmos Widget: Tab became visible, resetting animation time.");
                        sfcwLastTime = performance.now(); // समय रीसेट करें जब टैब वापस आए
                        // यदि एनिमेशन नहीं चल रहा है, तो शुरू करें (वैकल्पिक)
                        if (!sfcwAnimationFrameId) {
                            sfcwStartAnimation();
                        }
                    } else {
                         console.log("Cosmos Widget: Tab hidden, pausing animation updates.");
                    }
                });


                // थोड़ी देर बाद एनिमेशन शुरू करें ताकि पेज लोड स्थिर हो जाए
                const sfcwStartDelay = setTimeout(sfcwStartAnimation, 200);

                // विंडो रीसाइज़ हैंडलर (डिबाउंस के साथ)
                let sfcwResizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(sfcwResizeTimeout);
                    sfcwResizeTimeout = setTimeout(() => {
                        console.log("Cosmos Widget: Window resized, restarting animation...");
                        // एनिमेशन को पूरी तरह से रीस्टार्ट करें
                        if (sfcwAnimationFrameId) {
                            cancelAnimationFrame(sfcwAnimationFrameId);
                            sfcwAnimationFrameId = null;
                        }
                        sfcwStartAnimation();
                    }, 300); // 300ms प्रतीक्षा करें रीसाइज़ के बाद
                });

                // पेज छोड़ने से पहले संसाधनों को साफ करें
                window.addEventListener('beforeunload', () => {
                    console.log("Cosmos Widget: Cleaning up before page unload.");
                    if (sfcwAnimationFrameId) {
                        cancelAnimationFrame(sfcwAnimationFrameId);
                    }
                    clearTimeout(sfcwStartDelay);
                    clearTimeout(sfcwResizeTimeout);
                });
            } // context check end
        } // canvas check end
        console.log("Cosmos Widget setup complete.");
    } catch (error) {
        console.error("Error setting up Cosmos Widget:", error);
    }
    /* ===== END: Screen Focus Cosmos Widget JS ===== */

    console.log("All scripts executed.");
}); // DOMContentLoaded समाप्त
