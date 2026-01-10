
const username = 'Kyaw-Min-lwin';
const container = document.getElementById('project-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-btn');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// --- 1. VISUAL EFFECTS ---

// Vanta.js (Background) - Optimized for Mobile
// If screen width is small, we reduce points to save battery
const isMobile = window.innerWidth < 768;

try {
    VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00f2ff,
        backgroundColor: 0x050505,
        points: isMobile ? 6.00 : 10.00, // Fewer points on mobile
        maxDistance: isMobile ? 18.00 : 22.00,
        spacing: isMobile ? 22.00 : 18.00,
        showDots: true
    });
} catch (e) {
    console.log("Vanta JS failed to load, falling back to CSS bg");
}

// AOS
AOS.init({
    once: true,
    offset: 50, // Trigger earlier on mobile
    duration: 800
});

// Typing Effect
const textElement = document.getElementById('typing-text');
const phrases = ['Scalable Backends.', 'Neural Networks.', 'Resilient Systems.', 'Automation Bots.'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);

// --- 2. MOBILE MENU LOGIC ---
function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// --- 3. GITHUB FETCH LOGIC ---

async function fetchProjects() {
    const fallbackProjects = [
        {
            name: "JARVIS-Personal-Assistant",
            description: "Automated voice-command assistant utilizing Python scripts for daily workflow optimization.",
            language: "Python",
            topics: ["automation", "voice-recognition", "productivity"],
            html_url: "https://github.com/Kyaw-Min-lwin"
        },
        {
            name: "Real-Time-Chat-Engine",
            description: "High-performance chat architecture using WebSockets for instant bidirectional communication.",
            language: "JavaScript",
            topics: ["websockets", "async", "backend"],
            html_url: "https://github.com/Kyaw-Min-lwin"
        },
        {
            name: "Neural-Net-Optimizer",
            description: "Custom implementation of backpropagation algorithms to test math-heavy optimization theories.",
            language: "Python",
            topics: ["ai", "math", "tensorflow"],
            html_url: "https://github.com/Kyaw-Min-lwin"
        }
    ];

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error("API Limit");

        const repos = await response.json();
        const featuredRepos = repos.filter(repo => repo.topics.includes('portfolio-featured'));

        container.innerHTML = '';
        const projectsToShow = featuredRepos.length > 0 ? featuredRepos : fallbackProjects;

        projectsToShow.forEach(repo => {
            createProjectCard(repo, featuredRepos.length > 0);
        });

    } catch (error) {
        container.innerHTML = '';
        fallbackProjects.forEach(repo => createProjectCard(repo, false));
    }

    // Tilt Effect - Only on Desktop to save battery on mobile
    if (!isMobile) {
        VanillaTilt.init(document.querySelectorAll(".card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
        });
    }
}

function createProjectCard(repo, isRealData) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-aos', 'fade-up');

    const description = repo.description || "Architectural implementation of backend logic.";
    const topics = repo.topics ? repo.topics.slice(0, 3).map(t => `<span>#${t}</span>`).join('') : '';

    const btnAction = isRealData
        ? `onclick="openReadme('${repo.name}')"`
        : `onclick="window.open('${repo.html_url}', '_blank')"`;

    const btnText = isRealData ? "View Architecture" : "View Source";

    card.innerHTML = `
                <div class="card-header">
                    <i class="far fa-folder" style="color:var(--primary)"></i>
                    <a href="${repo.html_url}" target="_blank" style="color:var(--text-muted)"><i class="fas fa-external-link-alt"></i></a>
                </div>
                <h3>${repo.name.replace(/-/g, ' ')}</h3>
                <p>${description}</p>
                <div class="tech-tags">${topics}</div>
                <button class="view-btn" ${btnAction}>${btnText}</button>
            `;

    container.appendChild(card);
}

// --- 4. MODAL LOGIC ---

async function openReadme(repoName) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
    modalBody.innerHTML = '<p style="color:var(--primary); font-family:var(--font-code);">> Fetching Documentation...</p>';

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`);
        const data = await response.json();

        if (data.content) {
            const decodedContent = atob(data.content);
            modalBody.innerHTML = marked.parse(decodedContent);
        } else {
            modalBody.innerHTML = '<p>No README.md found in repository.</p>';
        }
    } catch (error) {
        modalBody.innerHTML = '<p>Error retrieving documentation.</p>';
    }
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Run
fetchProjects();

