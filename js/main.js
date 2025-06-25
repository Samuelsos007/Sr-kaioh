let scene;
let camera;
let renderer;
let planetGroup;
let planet;
let moon;
let redCar;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let planetRotationSpeed = 0.001;
let planetAutoRotate = true;
let planetRotationX = 0;
let planetRotationY = 0;

function init() {
    createScene();
    createCamera();
    createRenderer();
    setupLighting();
    createPlanetSystem();
    setupControls();
    setupEventListeners();
    animate();
}

function createScene() {
    scene = new THREE.Scene();
}

function createCamera() {
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 30);
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function setupLighting() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
}

function createPlanetSystem() {
    planetGroup = new THREE.Group();
    scene.add(planetGroup);
    
    createPlanet();
    createMoon();
    populatePlanet();
}

document.addEventListener('DOMContentLoaded', init);