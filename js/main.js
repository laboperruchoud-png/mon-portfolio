/**
 * Montportfolio
 * Main JavaScript file
 * @author Raymond Perruchoud
 */

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const html = document.documentElement;

    // Theme toggle icons (single source, avoids HTML duplication)
    if (themeToggle) {
        themeToggle.innerHTML = `
            <svg class="theme-icon sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </g>
            </svg>
            <svg class="theme-icon moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>`;
    }

    // Theme toggle
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initTheme = () => {
        if (savedTheme) {
            if (savedTheme === 'light') {
                html.setAttribute('data-theme', 'light');
            }
        } else if (!prefersDark) {
            html.setAttribute('data-theme', 'light');
        }
    };

    initTheme();

    themeToggle.addEventListener('click', () => {
        const isLight = html.getAttribute('data-theme') === 'light';
        const newTheme = isLight ? 'dark' : 'light';

        if (newTheme === 'dark') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', 'light');
        }

        localStorage.setItem('theme', newTheme);
    });

    // Mobile menu toggle
    const toggleMenu = (open) => {
        const isOpen = open ?? !navMenu.classList.contains('active');
        navToggle.classList.toggle('active', isOpen);
        navMenu.classList.toggle('active', isOpen);
        body.classList.toggle('menu-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    };

    navToggle.addEventListener('click', () => toggleMenu());

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Load projects from JSON
    const loadProjects = async () => {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error(response.statusText);
            const projects = await response.json();

            grid.innerHTML = projects.map(project => `
                <article class="project-card">
                    <h3 class="project-card__title">${project.name}</h3>
                    <p class="project-card__description">${project.description}</p>
                    <div class="project-card__languages">
                        ${project.languages.map(lang => `<span class="project-card__tag">${lang}</span>`).join('')}
                    </div>
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-card__link">
                        Voir sur GitHub <span class="sr-only">(nouvelle fenêtre)</span>
                    </a>
                </article>
            `).join('');
        } catch (error) {
            console.error('Failed to load projects:', error);
            grid.innerHTML = '<p class="projects-error">Impossible de charger les projets.</p>';
        }
    };

    loadProjects();
});
