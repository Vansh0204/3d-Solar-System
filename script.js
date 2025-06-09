import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'; // Removed
// import { OBJLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/OBJLoader.js'; // Removed
// import { gsap } from 'https://unpkg.com/gsap@3.9.1/dist/gsap.min.js'; // Removed for now

// Function to create a text sprite for labels
function createTextSprite(message, color = 'white', fontSize = 100) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set font to measure text accurately
    context.font = `Bold ${fontSize}px Arial`;
    const metrics = context.measureText(message);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    // Set canvas dimensions with padding
    canvas.width = textWidth + 60;
    canvas.height = textHeight + 60;

    // Redraw text on the resized canvas
    context.font = `Bold ${fontSize}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2 + 5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // Scale the sprite more appropriately based on desired world units height
    const spriteAspect = canvas.width / canvas.height;
    const spriteHeightInWorldUnits = 4; // Further reduced visual height of labels
    sprite.scale.set(spriteHeightInWorldUnits * spriteAspect, spriteHeightInWorldUnits, 1);

    return sprite;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0);

// Sun - Reverted to SphereGeometry
const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/sun_texture.jpg') });
let sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.userData = { type: 'star', name: 'Sun', data: { name: 'Sun', size: 20, description: `The star at the center of the Solar System.` } }; // Add description for Sun
scene.add(sun);

// Add text label below the Sun
const sunNameSprite = createTextSprite('Sun');
sunNameSprite.position.set(0, -sunGeometry.parameters.radius - 4, 0); // Position below the Sun
sun.add(sunNameSprite);

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.position.set(0, 0, 0);
sun.add(pointLight); // Light emanates from the sun

// Function to create a starfield
function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Call the function to add stars
addStars();


// Planet Creation Explanation


const planets = [
    { name: 'Mercury', size: 1.5, distance: 40, orbitalSpeed: 0.047, texture: 'images/mercury_texture.jpg', description: `The smallest and innermost planet in the Solar System.` },
    { name: 'Venus', size: 2.5, distance: 55, orbitalSpeed: 0.035, texture: 'images/venus_texture.jpg', description: `The second planet from the Sun and the sixth in the Solar System.` },
    { name: 'Earth', size: 3, distance: 70, orbitalSpeed: 0.029, texture: 'images/earth_texture.jpg', description: `The third planet from the Sun and the only astronomical object known to harbor life.` },
    { name: 'Mars', size: 2, distance: 85, orbitalSpeed: 0.024, texture: 'images/texture_mars.jpg', description: `The fourth planet from the Sun and the second smallest planet in the Solar System.` },
    { name: 'Jupiter', size: 8, distance: 110, orbitalSpeed: 0.013, texture: 'images/jupiter_texture.jpg', description: `The fifth planet from the Sun and the largest in the Solar System.` },
    { name: 'Saturn', size: 7, distance: 140, orbitalSpeed: 0.009, texture: 'images/texture_saturn.jpg', description: `The sixth planet from the Sun and the second largest in the Solar System.` },
    { name: 'Uranus', size: 5, distance: 165, orbitalSpeed: 0.006, texture: 'images/uranus_texture.jpg', description: `The seventh planet from the Sun and the third largest in the Solar System.` },
    { name: 'Neptune', size: 5, distance: 190, orbitalSpeed: 0.005, texture: 'images/texture_neptune.jpg', description: `The eighth and farthest known Solar planet from the Sun.` }
];

// Add moon data to specific planets
planets.find(p => p.name === 'Earth').moons = [
    { name: 'The Moon', size: 0.5, distance: 8, orbitalSpeed: 0.05, texture: 'images/Moon_texture.jpg', description: `Earth's only permanent natural satellite.` } // You'll need to provide moon_texture.jpg
];

planets.find(p => p.name === 'Jupiter').moons = [
    { name: 'Io', size: 0.7, distance: 10, orbitalSpeed: 0.06, texture: 'images/io_texture.jpg', description: `The most volcanically active world in the Solar System.` }, // Provide io_texture.jpg
    { name: 'Europa', size: 0.6, distance: 12, orbitalSpeed: 0.04, texture: 'images/europa_texture.jpg', description: `Likely harbors a subsurface ocean.` }, // Provide europa_texture.jpg
    { name: 'Ganymede', size: 0.9, distance: 15, orbitalSpeed: 0.03, texture: 'images/ganymede_texture.webp', description: `The largest moon in the Solar System.` }, // Provide ganymede_texture.jpg
    { name: 'Callisto', size: 0.8, distance: 18, orbitalSpeed: 0.02, texture: 'images/callisto.jpg', description: `One of Jupiter's Galilean moons.` } // Provide callisto_texture.jpg
];

planets.find(p => p.name === 'Saturn').moons = [
    { name: 'Titan', size: 0.8, distance: 12, orbitalSpeed: 0.04, texture: 'images/titan_texture.jpg', description: `Saturn's largest moon, with a dense atmosphere and liquid methane lakes.` } // Provide titan_texture.jpg
];

const planetMeshes = {};
const moonMeshes = {}; // New object to store moon meshes
const textureLoader = new THREE.TextureLoader();


// Create planet meshes and add to scene (simplified to always use SphereGeometry)


planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(planet.texture)
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(planet.distance, 0, 0);
    scene.add(mesh);
    planetMeshes[planet.name] = mesh;
    mesh.userData = { type: 'planet', name: planet.name, data: planet }; // Store data for info panel

    // Add text label below the planet
    const planetNameSprite = createTextSprite(planet.name);
    // Position relative to the planet's center, below its surface
    // Adjusted Y offset: planet.size + a small constant gap
    planetNameSprite.position.set(0, -planet.size - 0.8, 0); // A small fixed offset
    mesh.add(planetNameSprite);

    // Add moons if defined for this planet
    if (planet.moons) {
        planet.moons.forEach(moon => {
            const moonGeometry = new THREE.SphereGeometry(moon.size, 32, 32);
            const moonMaterial = new THREE.MeshStandardMaterial({
                map: textureLoader.load(moon.texture)
            });
            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
            moonMesh.position.set(moon.distance, 0, 0); // Initial position relative to planet
            mesh.add(moonMesh); // Add moon as a child of the planet
            moonMeshes[moon.name] = moonMesh; // Store moon mesh globally for animation
            moonMesh.userData = { type: 'moon', name: moon.name, data: moon }; // Store data for info panel

            // Add text label below the moon
            const moonNameSprite = createTextSprite(moon.name, 'lightgray', 40); // Smaller font for moons
            moonNameSprite.position.set(0, -moon.size - 0.5, 0); // Position below the moon
            moonMesh.add(moonNameSprite);
        });
    }
});

let controlsDiv;
let pauseResumeBtn;
let tooltip;
let themeToggleBtn;
let body;

// New dropdown elements
let toggleControlsBtn;
let controlsContentDiv;

// Info Panel elements
let infoPanel;
let infoPanelTitle;
let infoPanelSize;
let infoPanelDistance;
let infoPanelOrbitalSpeed;
let infoPanelDescription;
let closeInfoPanelBtn;

let orbitControls; // Declare orbitControls in a higher scope

let animationPaused = false;
let isDarkTheme = true;

// Animation Loop (defined globally)
let lastTime = 0;
function animate(currentTime) {
    if (animationPaused) {
        return;
    }
    requestAnimationFrame(animate);

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Sun rotation
    sun.rotation.y += 0.002;


    // Planet orbits and self-rotation


    planets.forEach(planet => {
        const mesh = planetMeshes[planet.name];
        mesh.position.x = Math.cos(currentTime * 0.001 * planet.orbitalSpeed) * planet.distance;
        mesh.position.z = Math.sin(currentTime * 0.001 * planet.orbitalSpeed) * planet.distance;
        mesh.rotation.y += 0.01; // Basic self-rotation

        // Animate moons around their parent planet
        if (planet.moons && mesh) {
            planet.moons.forEach(moon => {
                const moonMesh = moonMeshes[moon.name];
                if (moonMesh) {
                    moonMesh.position.x = Math.cos(currentTime * 0.001 * moon.orbitalSpeed * 5) * moon.distance; // Adjusted moon orbital speed
                    moonMesh.position.z = Math.sin(currentTime * 0.001 * moon.orbitalSpeed * 5) * moon.distance; // Adjusted moon orbital speed
                    moonMesh.rotation.y += 0.02; // Moon self-rotation
                }
            });
        }
    });

    renderer.render(scene, camera);
}

// Raycaster and mouse setup (global scope)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// onMouseMove function (global scope)
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allCelestialBodies = [...Object.values(planetMeshes), ...Object.values(moonMeshes)];
    const intersects = raycaster.intersectObjects(allCelestialBodies, true); // true for recursive check

    if (intersects.length > 0) {
        let intersectedObject = intersects[0].object;
        // Traverse up the hierarchy to find the main planet/moon mesh, if a sub-part was clicked
        while (intersectedObject && !intersectedObject.userData.type) {
            intersectedObject = intersectedObject.parent;
        }

        if (intersectedObject && intersectedObject.userData.type) {
            tooltip.style.display = 'block';
            tooltip.innerHTML = intersectedObject.userData.data.name;
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY + 10}px`;
        }
    } else {
        tooltip.style.display = 'none';
    }
}

// onClick function (global scope)
function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allCelestialBodies = [...Object.values(planetMeshes), ...Object.values(moonMeshes)];
    const intersects = raycaster.intersectObjects(allCelestialBodies, true); // true for recursive check

    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        // Traverse up the hierarchy to find the main planet/moon mesh, if a sub-part was clicked
        while (clickedObject && !clickedObject.userData.type) {
            clickedObject = clickedObject.parent;
        }

        if (clickedObject && clickedObject.userData.type) {
            const clickedData = clickedObject.userData.data;

            const targetPosition = new THREE.Vector3();
            clickedObject.getWorldPosition(targetPosition);

            const offset = 10; // Distance from the object to position the camera
            const cameraTargetX = targetPosition.x + offset;
            const cameraTargetY = targetPosition.y + offset;
            const cameraTargetZ = targetPosition.z + offset;

            // Use gsap directly as it's globally available
            gsap.to(camera.position, {
                duration: 1.5,
                x: cameraTargetX,
                y: cameraTargetY,
                z: cameraTargetZ,
                ease: "power3.out",
                onUpdate: () => {
                    camera.lookAt(targetPosition);
                    orbitControls.target.copy(targetPosition); // Make orbit controls focus on the object
                }
            });

            // Display info panel
            infoPanelTitle.textContent = clickedData.name;
            // If it's a moon, its distance is relative to its planet, not the Sun.
            if (clickedObject.userData.type === 'moon') {
                infoPanelSize.textContent = `Size: ${clickedData.size} units`;
                infoPanelDistance.textContent = `Distance from parent planet: ${clickedData.distance} units`;
                infoPanelOrbitalSpeed.textContent = `Orbital Speed (relative to parent): ${clickedData.orbitalSpeed} (relative)`;
            } else { // It's a planet or the Sun
                infoPanelSize.textContent = `Size: ${clickedData.size} units`;
                infoPanelDistance.textContent = `Distance from Sun: ${clickedData.distance !== undefined ? clickedData.distance + ' units' : 'N/A'}`; // Sun has 0 distance
                infoPanelOrbitalSpeed.textContent = `Orbital Speed: ${clickedData.orbitalSpeed !== undefined ? clickedData.orbitalSpeed + ' (relative)' : 'N/A'}`; // Sun has 0 orbital speed
            }
            infoPanelDescription.textContent = clickedData.description || 'No description available.';
            infoPanel.style.display = 'flex';
        }
    } else {
        // If clicked outside any celestial body, hide the info panel
        infoPanel.style.display = 'none';
    }
}

// DOMContentLoaded event listener for UI and canvas appending
document.addEventListener('DOMContentLoaded', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // OrbitControls for camera movement
    orbitControls = new OrbitControls(camera, renderer.domElement); // Assign to the globally declared variable
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.screenSpacePanning = false;
    orbitControls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

    // Assign global variables once DOM is ready
    pauseResumeBtn = document.getElementById('pauseResumeBtn');
    tooltip = document.getElementById('tooltip');
    themeToggleBtn = document.getElementById('themeToggleBtn');
    body = document.body;

    // Get new dropdown elements
    toggleControlsBtn = document.getElementById('toggle-controls-btn');
    controlsContentDiv = document.getElementById('controls-content');

    // Get Info Panel elements
    infoPanel = document.getElementById('info-panel');
    infoPanelTitle = infoPanel.querySelector('h2');
    infoPanelSize = infoPanel.querySelector('p.size');
    infoPanelDistance = infoPanel.querySelector('p.distance');
    infoPanelOrbitalSpeed = infoPanel.querySelector('p.orbital-speed');
    infoPanelDescription = infoPanel.querySelector('p.description');
    closeInfoPanelBtn = document.getElementById('close-info-panel');

    // Toggle functionality for the dropdown
    toggleControlsBtn.addEventListener('click', () => {
        controlsContentDiv.classList.toggle('show');
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        body.classList.toggle('light-theme');

        // Update sun color based on theme
        if (isDarkTheme) {
            sun.material.color.set(0xffff00); // Bright yellow for dark theme
            themeToggleBtn.textContent = 'Switch to Dark Theme';
        } else {
            sun.material.color.set(0xffd700); // Darker yellow for light theme
            themeToggleBtn.textContent = 'Switch to Light Theme';
        }
    });

    // Initialize theme button text
    themeToggleBtn.textContent = 'Switch to Dark Theme';

    // Event Listeners (now using named functions defined globally)
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Close info panel event listener
    closeInfoPanelBtn.addEventListener('click', () => {
        infoPanel.style.display = 'none';
    });

    // Create control for each planet
    planets.forEach(planet => {
        const planetControlDiv = document.createElement('div');
        planetControlDiv.className = 'planet-control';
        planetControlDiv.innerHTML = `
            <label for="${planet.name}-speed">${planet.name} Speed:</label>
            <input type="range" id="${planet.name}-speed" min="0" max="50" value="${planet.orbitalSpeed * 100}" step="0.1">
        `;
        controlsContentDiv.appendChild(planetControlDiv); // Append to new controlsContentDiv

        const speedSlider = document.getElementById(`${planet.name}-speed`);
        speedSlider.addEventListener('input', (event) => {
            planet.orbitalSpeed = parseFloat(event.target.value) / 100; // Adjust for reasonable speed
        });
    });

    pauseResumeBtn.addEventListener('click', () => {
        animationPaused = !animationPaused;
        if (animationPaused) {
            pauseResumeBtn.textContent = 'Resume Animation';
        } else {
            pauseResumeBtn.textContent = 'Pause Animation';
            requestAnimationFrame(animate); // Restart animation if it was paused
        }
    });

    // Initial animation call
    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Update orbit controls in animation loop
    // This ensures orbitControls.update() is called continuously.
    renderer.setAnimationLoop(() => {
        orbitControls.update();
        // renderer.render(scene, camera); // Render is already called by animate()
    });
});
