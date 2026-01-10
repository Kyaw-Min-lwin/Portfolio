const username = 'Kyaw-Min-lwin';
const container = document.getElementById('project-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-btn');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-item');

// --- 1. VISUAL EFFECTS ---

// Vanta.js (Background)
const isMobile = window.innerWidth < 768;

try {
    if (window.VANTA) {
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
            points: isMobile ? 6.00 : 10.00,
            maxDistance: isMobile ? 18.00 : 22.00,
            spacing: isMobile ? 22.00 : 18.00,
            showDots: true
        });
    }
} catch (e) {
    console.log("Bg fallback active");
}

// AOS Init
AOS.init({
    once: true,
    offset: 50,
    duration: 800
});

// Typing Effect
const textElement = document.getElementById('typing-text');
const phrases = [
    'Intelligent Backends.',
    'Neural Networks.',
    'System Automation.',
    'Efficient Algorithms.'
];
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
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);

// --- 2. NAVIGATION LOGIC (Scroll Spy & Mobile) ---

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
}

// Close menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) toggleMenu();
    });
});

hamburger.addEventListener('click', toggleMenu);

// Active Link Highlighter using IntersectionObserver
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));


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
        // Filter for specific portfolio tag or show top repos
        const featuredRepos = repos.filter(repo => repo.topics.includes('portfolio-featured'));

        // If no tagged repos, pick the ones with descriptions
        const finalRepos = featuredRepos.length > 0
            ? featuredRepos
            : repos.filter(r => r.description && !r.fork).slice(0, 6);

        container.innerHTML = '';
        const displayList = finalRepos.length > 0 ? finalRepos : fallbackProjects;

        displayList.forEach(repo => {
            createProjectCard(repo, repo.html_url.includes('github.com')); // Simple check if real
        });

    } catch (error) {
        console.error("GitHub Fetch Failed, using fallback");
        container.innerHTML = '';
        fallbackProjects.forEach(repo => createProjectCard(repo, false));
    }

    // Initialize 3D Tilt for cards (Desktop only)
    if (!isMobile && window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
            scale: 1.02
        });
    }
}

function createProjectCard(repo, isRealData) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-aos', 'fade-up');

    const description = repo.description || "Architectural implementation of backend logic.";
    // Limit to 3 tags
    const topics = repo.topics ? repo.topics.slice(0, 3).map(t => `<span>#${t}</span>`).join('') : '';

    const btnAction = isRealData
        ? `onclick="openReadme('${repo.name}')"`
        : `onclick="window.open('${repo.html_url}', '_blank')"`;

    const btnText = isRealData ? "View Architecture" : "View Source";

    card.innerHTML = `
        <div class="card-header">
            <i class="far fa-folder" style="color:var(--primary); font-size: 1.2rem;"></i>
            <a href="${repo.html_url}" target="_blank" aria-label="Link to repo" style="color:var(--text-muted)"><i class="fas fa-external-link-alt"></i></a>
        </div>
        <h3>${repo.name.replace(/-/g, ' ')}</h3>
        <p>${description}</p>
        <div class="tech-tags">${topics}</div>
        <button class="view-btn" ${btnAction}>${btnText}</button>
    `;

    container.appendChild(card);
}

// --- 4. MODAL LOGIC (With UTF-8 Fix) ---

// Helper to decode Base64 correctly (handling emojis/special chars)
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

async function openReadme(repoName) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    modalBody.innerHTML = '<p style="color:var(--primary); font-family:var(--font-code);">> Fetching Documentation...</p>';

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`);
        const data = await response.json();

        if (data.content) {
            // Clean newlines before decoding
            const cleanContent = data.content.replace(/\n/g, '');
            const decodedContent = b64DecodeUnicode(cleanContent);
            modalBody.innerHTML = marked.parse(decodedContent);
        } else {
            modalBody.innerHTML = '<p>No README.md found in repository.</p>';
        }
    } catch (error) {
        console.error(error);
        modalBody.innerHTML = '<p style="color:var(--accent)">Error retrieving documentation. API limit may be reached.</p>';
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

// Start
fetchProjects();