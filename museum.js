const artifactData = {
    surveyor3: {
        title: "Surveyor 3",
        tag: "MOON LANDER",
        date: "Landing: April 20, 1967 (Oceanus Procellarum)",
        mission: "To demonstrate soft-landing techniques on the Moon and analyze lunar soil.",
        details: "Surveyor 3 successfully landed in a lunar crater. Two and a half years later, the crew of Apollo 12 landed nearby and walked over to Surveyor 3, removing parts of it (including its TV camera) to bring back to Earth for analysis of how space environment affects human-made materials.",
        source: "https://science.nasa.gov/"
    },
    lunarrover: {
        title: "Apollo Lunar Roving Vehicle (LRV)",
        tag: "MOON VEHICLE",
        date: "Deployed: July 31, 1971 (Apollo 15)",
        mission: "To extend the range of lunar surface explorations by astronauts.",
        details: "The Lunar Rover was a battery-powered four-wheel vehicle used on the Moon during the Apollo 15, 16, and 17 missions. It allowed astronauts to travel much further from their lunar modules to collect diverse geological samples. Three of them remain parked on the Moon.",
        source: "https://science.nasa.gov/"
    },
    alsep: {
        title: "Apollo Lunar Surface Experiments Package (ALSEP)",
        tag: "SCIENTIFIC STATION",
        date: "Deployed: 1969–1972 (Various Apollo Missions)",
        mission: "Long-term automated scientific measurements of the lunar environment.",
        details: "Powered by radioisotope thermoelectric generators, ALSEP stations measured moonquakes, solar wind, magnetic fields, and atmosphere. Data was transmitted back to Earth continuously until transmissions were intentionally shut down in 1977 due to budget constraints.",
        source: "https://science.nasa.gov/"
    },
    spirit: {
        title: "Mars Exploration Rover - Spirit (MER-A)",
        tag: "MARS ROVER",
        date: "Landing: January 4, 2004 (Gusev Crater)",
        mission: "To search for and characterize a wide range of rocks and soils holding clues to past water activity.",
        details: "Though designed for a 90-sol mission, Spirit operated for over six years. In 2009, its wheels became embedded in soft Martian sand. Attempts to free it failed, and it transitioned into a stationary research platform until its final communication in March 2010.",
        source: "https://science.nasa.gov/"
    },
    opportunity: {
        title: "Mars Exploration Rover - Opportunity (MER-B)",
        tag: "MARS ROVER",
        date: "Landing: January 25, 2005 (Meridiani Planum)",
        mission: "Geological analysis of Martian terrain and search for signs of ancient liquid water.",
        details: "Spirit's twin, Opportunity far outlived its planned 90-day duration, traversing 45 kilometers across the Martian surface. It uncovered conclusive evidence of past water action before a massive planet-encircling dust storm cut off its solar power in June 2018.",
        source: "https://science.nasa.gov/"
    }
};

const cards = document.querySelectorAll('.artifact-card');
const modal = document.getElementById('artifactModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.dataset.id;
        const data = artifactData[id];
        const imgSrc = card.querySelector('img').src;

        if (data) {
            modalBody.innerHTML = `
                <div class="modal-img">
                    <img src="${imgSrc}" alt="${data.title}">
                </div>
                <div class="modal-text">
                    <span class="artifact-tag">${data.tag}</span>
                    <h2>${data.title}</h2>
                    <p class="modal-date"><strong>${data.date}</strong></p>
                    <div class="info-row">
                        <span>MISSION GOAL</span>
                        <strong>${data.mission}</strong>
                    </div>
                    <div class="info-row">
                        <span>DETAILED OVERVIEW</span>
                        <strong>${data.details}</strong>
                    </div>
                    <a href="${data.source}" target="_blank" class="nasa-link">VIEW OFFICIAL SOURCE ↗</a>
                </div>
            `;
            modal.classList.add('active');
        }
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});