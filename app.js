document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);

    fetch('portfolio.json')
        .then(response => response.json())
        .then(data => {
            populateUI(data);
            populateProjects(data.projects);
            setupEventListeners(data);
        });
});

function populateUI(data) {

    document.querySelector('.logo').textContent = data.user.logo;
    typeWriterEffect(document.getElementById('main-title'), data.user.title, 100);
    document.getElementById('location').textContent = data.user.location;
    document.getElementById('bio').textContent = data.user.bio;

    // Player Card
    document.getElementById('user-name').textContent = data.user.name;
    document.getElementById('user-bio').textContent = data.user.bio;

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    data.skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.classList.add('skill');
        skillElement.innerHTML = `
            <p>${skill.name}</p>
            <div class="skill-bar"><div class="skill-level" style="width: ${skill.level};"></div></div>
        `;
        skillsContainer.appendChild(skillElement);

    });

    // Social Links (Player Card)
    const socialLinksContainer = document.getElementById('social-links-container');
    socialLinksContainer.innerHTML = '';
    for (const [key, value] of Object.entries(data.contact.social)) {
        const socialLink = document.createElement('a');
        socialLink.href = value;
        socialLink.target = '_blank';
        socialLink.innerHTML = `<i class='bx bxl-${key}'></i>`;
        socialLinksContainer.appendChild(socialLink);
    }

    // Contact Info
    document.getElementById('email-link').href = `mailto:${data.contact.email}`;
    document.getElementById('email-link').textContent = data.contact.email;
    document.getElementById('phone-link').href = `tel:${data.contact.phone}`;
    document.getElementById('phone-link').textContent = data.contact.phone;
    const locationLink = document.getElementById('location-link');
    locationLink.textContent = data.contact.location;
    locationLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.contact.location)}`;

    // Footer
    document.getElementById('footer-text').textContent = `©️ ${new Date().getFullYear()}, Made with ❤️ by ${data.user.name}`;
    const footerSocialLinks = document.getElementById('footer-social-links');
    footerSocialLinks.innerHTML = '';
    for (const [key, value] of Object.entries(data.contact.social)) {
        const socialLink = document.createElement('a');
        socialLink.href = value;
        socialLink.target = '_blank';
        socialLink.innerHTML = `<i class='bx bxl-${key}'></i>`;
        footerSocialLinks.appendChild(socialLink);
    }

}

function typeWriterEffect(element, text, delay) {
    let i = 0;
    element.textContent = ''; // Clear existing text
    element.setAttribute('data-text', text);

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }
    type();
}



function populateProjects(projects) {
    const microGamesProjectsContainer = document.getElementById('completed-games-projects');
    const techDemosProjectsContainer = document.getElementById('tech-demos-projects');
    const experimentalProjectsContainer = document.getElementById('experimental-projects-slider');
    const failureProjectsContainer = document.getElementById('failure-projects-slider');

    microGamesProjectsContainer.innerHTML = '';
    techDemosProjectsContainer.innerHTML = '';
    experimentalProjectsContainer.innerHTML = '';
    failureProjectsContainer.innerHTML = '';

    projects['completed-games'].forEach(project => {
        microGamesProjectsContainer.appendChild(createProjectElement(project));
    });

    projects['tech-demos'].forEach(project => {
        techDemosProjectsContainer.appendChild(createProjectElement(project));
    });

    projects['personal-projects'].experimental.forEach(project => {
        experimentalProjectsContainer.appendChild(createProjectElement(project));
    });

    projects['personal-projects'].failure.forEach(project => {
        failureProjectsContainer.appendChild(createProjectElement(project));
    });
}

function createProjectElement(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    projectElement.dataset.projectId = project.id;

    projectElement.innerHTML = `
        <video src="${project.video}" muted loop></video>
        <div class="overlay">
            <h3>${project.title}</h3>
        </div>
    `;
    return projectElement;
}

function setupEventListeners(data) {
    // Hamburger Menu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav a').forEach(anchor => {
        anchor.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    // Parallax effect for hero section
    const hero = document.getElementById('hero');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });

    // Project Tabs
    const mainTabLinks = document.querySelectorAll('.project-tabs:not(.sub-tabs) .tab-link');
    const mainTabContents = document.querySelectorAll('.tab-content:not(.sub-tab-content)');

    mainTabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tab = link.dataset.tab;
            mainTabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            mainTabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
        });
    });

    const subTabLinks = document.querySelectorAll('.sub-tabs .tab-link');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subTabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tab = link.dataset.tab;
            subTabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            subTabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
        });
    });

    // Project hover effect
    document.querySelectorAll('.project').forEach(project => {
        const video = project.querySelector('video');
        project.addEventListener('mouseenter', () => {
            video.play();
        });
        project.addEventListener('mouseleave', () => {
            video.pause();
        });
    });

    // Project Modal Logic
    const projectModal = document.getElementById('project-detail-modal');
    const modalVideo = document.getElementById('modal-detail-video');
    const modalTitle = document.getElementById('modal-detail-title');
    const modalDescription = document.getElementById('modal-detail-description');
    const modalTechStack = document.getElementById('modal-detail-tech-stack');
    const repoLink = document.getElementById('repo-link');
    const liveLink = document.getElementById('live-link');
    const closeButton = projectModal.querySelector('.close-button');

    document.querySelectorAll('.project').forEach(projectElement => {
        projectElement.addEventListener('click', () => {
            const projectId = projectElement.dataset.projectId;
            const project = findProjectById(data.projects, projectId);

            if (project) {
                modalVideo.src = project.video;
                modalTitle.textContent = project.title;
                
                const descriptionContainer = document.getElementById('modal-detail-description-content');
                descriptionContainer.innerHTML = ''; // Clear previous content

                if (project.description && Array.isArray(project.description)) {
                    // First item as introductory paragraph
                    if (project.description[0]) {
                        const introPara = document.createElement('p');
                        introPara.textContent = project.description[0];
                        descriptionContainer.appendChild(introPara);
                    }

                    // Second item as sub-heading
                    if (project.description[1]) {
                        const subHeading = document.createElement('h4');
                        subHeading.textContent = project.description[1];
                        descriptionContainer.appendChild(subHeading);
                    }

                    // Remaining items as bullet points
                    if (project.description.length > 2) {
                        const ul = document.createElement('ul');
                        for (let i = 2; i < project.description.length; i++) {
                            const li = document.createElement('li');
                            li.textContent = project.description[i].replace(/^●\s*/, ''); // Remove bullet point character
                            ul.appendChild(li);
                        }
                        descriptionContainer.appendChild(ul);
                    }
                }
                modalTechStack.innerHTML = '';
                project.tech.forEach(tech => {
                    const techBox = document.createElement('span');
                    techBox.classList.add('tech-box');
                    techBox.textContent = tech;
                    modalTechStack.appendChild(techBox);
                });

                repoLink.href = project.repo || '#';
                liveLink.href = project.live || '#';
                repoLink.style.display = project.repo ? 'inline-block' : 'none';
                liveLink.style.display = project.live ? 'inline-block' : 'none';

                projectModal.classList.add('show');
                modalVideo.play();
            }
        });
    });

    const closeModal = () => {
        projectModal.classList.remove('show');
        modalVideo.pause();
        modalVideo.currentTime = 0;
    };

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            closeModal();
        }
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const sendMessageBtn = document.getElementById('send-message-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = encodeURIComponent(document.getElementById('name').value);
        const email = encodeURIComponent(document.getElementById('email').value);
        const message = encodeURIComponent(document.getElementById('message').value);
        
        const mailtoLink = `mailto:aagstyasing500@gmail.com?subject=Message from ${name} (${email})&body=${message}`;
        
        sendMessageBtn.disabled = true;
        sendMessageBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Please wait...";

        window.location.href = mailtoLink;

        setTimeout(() => {
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';
            contactForm.reset();
            sendMessageBtn.disabled = false;
            sendMessageBtn.innerHTML = "<i class='bx bx-send'></i> Send Message";
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }, 1000);
    });

    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.src = 'audio/start_screen_road_to_nowhere.mp3';
    backgroundMusic.play();

    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="bx bx-volume-full"></i>';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="bx bx-volume-mute"></i>';
        }
    });



    // Vanta.js background
    let vantaEffect; // Declare a variable to hold the Vanta effect
    vantaEffect = VANTA.BIRDS({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x0f0f1a,
        color1: 0x00ffe0,
        color2: 0xff0055,
        quantity: 3
    });

    // Audio Visualizer for Vanta.js color pulsing
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(backgroundMusic);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function interpolateColors(colorA, colorB, factor) {
        const rA = (colorA >> 16) & 0xff;
        const gA = (colorA >> 8) & 0xff;
        const bA = colorA & 0xff;

        const rB = (colorB >> 16) & 0xff;
        const gB = (colorB >> 8) & 0xff;
        const bB = colorB & 0xff;

        const r = Math.round(rA + factor * (rB - rA));
        const g = Math.round(gA + factor * (gB - gA));
        const b = Math.round(bA + factor * (bB - bA));

        return (r << 16) + (g << 8) + b;
    }

    function renderVantaColorPulse() {
        requestAnimationFrame(renderVantaColorPulse);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength / 4; i++) { // Use lower frequencies for beat detection
            sum += dataArray[i];
        }
        const average = sum / (bufferLength / 4);

        const blendFactor = average / 255; // 0 to 1
        let newColor1;

        if (blendFactor < 0.5) {
            newColor1 = interpolateColors(0x1e1e2f, 0x00ffe0, blendFactor * 2);
        } else {
            newColor1 = interpolateColors(0x00ffe0, 0xff0055, (blendFactor - 0.5) * 2);
        }

        let newColor2 = 0xff0055; // Default color2
        const beatThreshold = 0.8;
        if (blendFactor > beatThreshold) {
            newColor2 = 0xffffff; // Blink with white on strong beats
        }

        if (vantaEffect) {
            vantaEffect.setOptions({
                color1: newColor1,
                color2: newColor2
            });
        }
    }

    backgroundMusic.addEventListener('play', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });

    renderVantaColorPulse();

    // Mouse trail
    const canvas = document.getElementById("mouseTrailCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let stars = [];

    document.addEventListener("mousemove", e => {
        stars.push({
            x: e.clientX,
            y: e.clientY,
            radius: Math.random() * 2 + 1,
            alpha: 1,
            twinkle: Math.random() * 0.05 + 0.01
        });
    });

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((s, i) => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 224, ${s.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            ctx.fill();
            s.alpha -= s.twinkle;
        });
        stars = stars.filter(s => s.alpha > 0);
        requestAnimationFrame(drawStars);
    }
    drawStars();
}


function findProjectById(projects, projectId) {
    for (const category in projects) {
        if (Array.isArray(projects[category])) {
            const project = projects[category].find(p => p.id === projectId);
            if (project) return project;
        } else {
            for (const subCategory in projects[category]) {
                const project = projects[category][subCategory].find(p => p.id === projectId);
                if (project) return project;
            }
        }
    }
    return null;
}