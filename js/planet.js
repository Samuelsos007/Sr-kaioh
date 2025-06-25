function createPlanet() {
    const planetGeometry = new THREE.SphereGeometry(8, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
        color: 0x00FF00,
        roughness: 0.5,
        metalness: 0.3,
        emissive: 0x00AA00,
        emissiveIntensity: 0.2
    });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(planet);
    
    const atmosphereGeometry = new THREE.SphereGeometry(8.2, 64, 64);
    const atmosphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planetGroup.add(atmosphere);
    
    const planetLight = new THREE.PointLight(0x00FF00, 0.5, 50);
    planetLight.position.set(0, 0, 0);
    planetGroup.add(planetLight);
}

function createMoon() {
    const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xDDDDDD,
        roughness: 0.8,
        metalness: 0.1
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(20, 10, -15);
    scene.add(moon);
}

function placeOnSurface(object, latitude, longitude, elevation = 0) {
    const radius = 8 + elevation;
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);
    
    object.position.x = -radius * Math.sin(phi) * Math.cos(theta);
    object.position.y = radius * Math.cos(phi);
    object.position.z = radius * Math.sin(phi) * Math.sin(theta);
    
    const normal = new THREE.Vector3(
        object.position.x,
        object.position.y,
        object.position.z
    ).normalize();
    
    object.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal
    );
    
    planetGroup.add(object);
    return object;
}