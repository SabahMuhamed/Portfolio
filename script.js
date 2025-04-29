document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const yearSpan = document.getElementById('year');

    // --- Theme Toggler ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) { body.classList.add(savedTheme); }
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { body.classList.add('dark-mode'); }
    themeToggle.addEventListener('click', () => { body.classList.toggle('dark-mode'); localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark-mode' : ''); });

    // --- Footer Year ---
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    // --- Intersection Observer for Animations ---
    const animateElements = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('section')) { // Animate Sections
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Unobserve section after animation
                }
                if (entry.target.classList.contains('skill-level')) { // Animate Skill Bars
                    const score = entry.target.getAttribute('data-score');
                    requestAnimationFrame(() => { entry.target.style.width = score + '%'; });
                    observer.unobserve(entry.target); // Unobserve skill bar after animation
                }
            }
        });
    };
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver(animateElements, observerOptions);
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));
    const skillLevels = document.querySelectorAll('.skill-level');
    skillLevels.forEach(level => observer.observe(level));

    // --- Modal Logic (Triggered by CLICK) ---
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) { // Check if modal container exists
        const modal = modalContainer.querySelector('.modal');
        const modalImage = document.getElementById('modal-image');
        const modalIconContainer = document.getElementById('modal-icon-container');
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const modalDescription = document.getElementById('modal-description');
        const modalExtraInfo = document.getElementById('modal-extra-info');
        const closeModalBtn = modalContainer.querySelector('.close-modal-btn');
        const triggerElements = document.querySelectorAll('.modal-trigger');

        function openModal(element) {
            if (!element || !modalContainer || !modal) return; // More checks

            const title = element.dataset.modalTitle || '';
            const subtitle = element.dataset.modalSubtitle || '';
            const description = element.dataset.modalDescription || '';
            const extra = element.dataset.modalExtra || '';
            const imageSrc = element.dataset.modalImage || '';
            const iconClass = element.dataset.modalIcon || '';

            modalTitle.textContent = title;
            modalSubtitle.textContent = subtitle;
            modalDescription.textContent = description;
            modalExtraInfo.textContent = extra;
            modalExtraInfo.style.display = extra ? 'block' : 'none';

            if (imageSrc && modalImage) {
                modalImage.src = imageSrc;
                modalImage.alt = title;
                modalImage.style.display = 'block';
                if(modalIconContainer) modalIconContainer.style.display = 'none';
            } else if (iconClass && modalIconContainer && modalIcon) {
                modalIcon.className = iconClass; // Set the icon class
                modalIconContainer.style.display = 'block';
                if(modalImage) modalImage.style.display = 'none';
                if(modalImage) modalImage.src = '';
            } else {
                if(modalImage) modalImage.style.display = 'none';
                if(modalImage) modalImage.src = '';
                if(modalIconContainer) modalIconContainer.style.display = 'none';
            }

            modalContainer.classList.add('visible');
            modal.scrollTop = 0; // Reset scroll position
        }

        function closeModal() {
            if(modalContainer) modalContainer.classList.remove('visible');
        }

        triggerElements.forEach(element => {
            element.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default action (like link navigation if it was an <a>)
                openModal(element);
            });
        });

        if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) { closeModal(); } // Close on overlay click
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalContainer.classList.contains('visible')) { closeModal(); } // Close on Escape key
        });
    } // End if(modalContainer) check

}); // End of DOMContentLoaded