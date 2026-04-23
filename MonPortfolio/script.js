import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import firebaseConfig from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Real-time message counter listener
const updateMessageCounter = () => {
    const counterElement = document.getElementById('messageCounter');
    if (counterElement) {
        onSnapshot(collection(db, "contacts"), (snapshot) => {
            counterElement.textContent = snapshot.size;
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateMessageCounter();
    // 1. Loader
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
    }

    // 2. Typing Animation
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const professions = ['Développeur Web', 'Designer UI/UX', 'Développeur Mobile', 'Expert Graphic Design'];
        let profIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentProf = professions[profIndex];
            if (isDeleting) {
                typingText.textContent = currentProf.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentProf.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentProf.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                profIndex = (profIndex + 1) % professions.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 4. Reveal Animation on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // 5. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });

        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    // 6. Mobile Menu Logic
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuIcon.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuIcon.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }
    
    // 7. Firebase Contact Form
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Form data
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            // UI Feedback: Loading
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Envoi...';
            if (btnLoader) btnLoader.style.display = 'inline-block';

            try {
                // Send to Firestore
                await addDoc(collection(db, "contacts"), {
                    nom: name,
                    email: email,
                    message: message,
                    date: serverTimestamp()
                });

                // Success
                showToast("Message envoyé avec succès !", "success");
                contactForm.reset();
            } catch (error) {
                console.error("Erreur d'envoi : ", error);
                showToast("Une erreur est survenue lors de l'envoi.", "error");
            } finally {
                // UI Feedback: Reset
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Envoyer';
                if (btnLoader) btnLoader.style.display = 'none';
            }
        });
    }

    // Toast helper
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `glass toast ${type}`;
            toast.style.display = 'block';

            setTimeout(() => {
                toast.style.display = 'none';
            }, 5000);
        }
    }
});
