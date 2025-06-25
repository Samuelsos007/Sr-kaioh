function populatePlanet() {
    const road = createStraightRoad();
    planetGroup.add(road);
    
    const kaiohHouse = createKaiohHouse();
    placeOnSurface(kaiohHouse, 30, 0, 0.5);
    
    const kaioh = createKaioh();
    placeOnSurface(kaioh, 28, -10, 0.5);
    
    const bubblesMonkey = createBubblesMonkey();
    placeOnSurface(bubblesMonkey, 32, -8, 0.5);
    
    for (let index = 0; index < 15; index++) {
        const bubble = createBubble(
            [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00][Math.floor(Math.random() * 4)],
            0.1 + Math.random() * 0.2
        );
        let latitude, longitude;
        
        do {
            latitude = Math.random() * 60 - 30;
            longitude = Math.random() * 360 - 180;
        } while (isNearRoad(latitude, longitude));
        
        placeOnSurface(bubble, latitude, longitude, 0.2 + Math.random() * 0.3);
    }
    
    for (let index = 0; index < 10; index++) {
        const tree = createTree();
        let latitude, longitude;
        
        do {
            latitude = Math.random() * 60 - 30;
            longitude = Math.random() * 360 - 180;
        } while (isNearRoad(latitude, longitude));
        
        placeOnSurface(tree, latitude, longitude, 0.3);
    }
    
    redCar = createDetailedCar();
    placeOnSurface(redCar, 0, 0, 0.2);
}

function isNearRoad(latitude, longitude) {
    return Math.abs(latitude) < 5;
}

function createStraightRoad() {
    const roadGroup = new THREE.Group();
    const segments = 100;
    const width = 0.8;
    const height = 0.1;
    
    for (let index = 0; index < segments; index++) {
        const longitude = (index / segments) * 360;
        
        const segmentGeometry = new THREE.PlaneGeometry(width, height);
        const segmentMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            side: THREE.DoubleSide,
            metalness: 0.2,
            roughness: 0.7
        });
        const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
        
        const radius = 8.05;
        const phi = (90 - 0) * (Math.PI / 180);
        const theta = (longitude + 180) * (Math.PI / 180);
        
        segment.position.x = -radius * Math.sin(phi) * Math.cos(theta);
        segment.position.y = radius * Math.cos(phi);
        segment.position.z = radius * Math.sin(phi) * Math.sin(theta);
        
        const normal = new THREE.Vector3(
            segment.position.x,
            segment.position.y,
            segment.position.z
        ).normalize();
        
        segment.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            normal
        );
        
        segment.rotateX(Math.PI/2);
        segment.rotateZ(Math.PI/2);
        
        if (index % 10 === 0) {
            const markGeometry = new THREE.PlaneGeometry(width * 0.6, height * 0.5);
            const markMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFFF00,
                side: THREE.DoubleSide
            });
            const mark = new THREE.Mesh(markGeometry, markMaterial);
            
            mark.position.copy(segment.position);
            mark.quaternion.copy(segment.quaternion);
            mark.rotateX(Math.PI/2);
            mark.rotateZ(Math.PI/2);
            mark.translateY(0.01);
            
            roadGroup.add(mark);
        }
        
        roadGroup.add(segment);
    }
    
    return roadGroup;
}

function createDetailedCar() {
    const carGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.3, 1.2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        metalness: 0.3,
        roughness: 0.5
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    const topGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.8);
    const top = new THREE.Mesh(topGeometry, bodyMaterial);
    top.position.y = 0.25;
    
    const windshieldGeometry = new THREE.BoxGeometry(0.48, 0.1, 0.3);
    const windshieldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x88CCFF,
        transparent: true,
        opacity: 0.7
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 0.4, 0.2);
    
    const wheelGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 24);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.3
    });
    const wheelTireGeometry = new THREE.TorusGeometry(0.12, 0.05, 8, 24);
    const wheelTireMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.1,
        roughness: 0.9
    });
    
    const wheelPositions = [
        [-0.3, -0.2, -0.5],
        [0.3, -0.2, -0.5],
        [-0.3, -0.2, 0.5],
        [0.3, -0.2, 0.5]
    ];
    
    wheelPositions.forEach(position => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(position[0], position[1], position[2]);
        wheel.rotation.z = Math.PI / 2;
        
        const tire = new THREE.Mesh(wheelTireGeometry, wheelTireMaterial);
        tire.position.set(position[0], position[1], position[2]);
        tire.rotation.z = Math.PI / 2;
        
        carGroup.add(wheel);
        carGroup.add(tire);
    });
    
    const lightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const lightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFAA,
        emissive: 0xFFFF00,
        emissiveIntensity: 0.5
    });
    const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
    const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
    
    leftLight.position.set(-0.25, 0.1, -0.6);
    rightLight.position.set(0.25, 0.1, -0.6);
    
    const tailLightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const tailLightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF8888,
        emissive: 0xFF0000,
        emissiveIntensity: 0.3
    });
    const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    
    leftTailLight.position.set(-0.25, 0.1, 0.6);
    rightTailLight.position.set(0.25, 0.1, 0.6);
    
    carGroup.add(body);
    carGroup.add(top);
    carGroup.add(windshield);
    carGroup.add(leftLight);
    carGroup.add(rightLight);
    carGroup.add(leftTailLight);
    carGroup.add(rightTailLight);
    
    return carGroup;
}

function createKaiohHouse() {
    const houseGroup = new THREE.Group();
    
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 6);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        metalness: 0.2,
        roughness: 0.6
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    houseGroup.add(base);
    
    const roofGeometry = new THREE.ConeGeometry(0.6, 0.5, 6);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        metalness: 0.1,
        roughness: 0.8
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.4;
    houseGroup.add(roof);
    
    const topGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFF00,
        emissive: 0xFFAA00,
        emissiveIntensity: 0.5
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.8;
    houseGroup.add(top);
    
    const signGeometry = new THREE.PlaneGeometry(0.4, 0.1);
    const signMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0x8888FF,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 0.1, -0.5);
    sign.rotation.y = Math.PI;
    houseGroup.add(sign);
    
    const poleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0.6, 0.25, -0.3);
    
    const poleSphereGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const poleSphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00FF00,
        emissive: 0x00AA00,
        emissiveIntensity: 0.3
    });
    const poleSphere = new THREE.Mesh(poleSphereGeometry, poleSphereMaterial);
    poleSphere.position.set(0.6, 0.5, -0.3);
    
    houseGroup.add(pole);
    houseGroup.add(poleSphere);
    
    return houseGroup;
}

function createKaioh() {
    const kaiohGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0000FF,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    kaiohGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 0.5;
    kaiohGroup.add(head);
    
    const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.55, 0.18);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.55, 0.18);
    
    kaiohGroup.add(leftEye);
    kaiohGroup.add(rightEye);
    
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF });
    
    const leftAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    leftAntenna.position.set(-0.15, 0.7, 0);
    leftAntenna.rotation.z = -0.5;
    
    const rightAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    rightAntenna.position.set(0.15, 0.7, 0);
    rightAntenna.rotation.z = 0.5;
    
    const antennaBallGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const antennaBallMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    
    const leftBall = new THREE.Mesh(antennaBallGeometry, antennaBallMaterial);
    leftBall.position.set(-0.25, 0.85, 0);
    
    const rightBall = new THREE.Mesh(antennaBallGeometry, antennaBallMaterial);
    rightBall.position.set(0.25, 0.85, 0);
    
    kaiohGroup.add(leftAntenna);
    kaiohGroup.add(rightAntenna);
    kaiohGroup.add(leftBall);
    kaiohGroup.add(rightBall);
    
    return kaiohGroup;
}

function createBubblesMonkey() {
    const monkeyGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    monkeyGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 0.3;
    monkeyGroup.add(head);
    
    const earGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(-0.15, 0.35, 0);
    
    const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
    rightEar.position.set(0.15, 0.35, 0);
    
    monkeyGroup.add(leftEar);
    monkeyGroup.add(rightEar);
    
    const eyeGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.05, 0.35, 0.13);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.05, 0.35, 0.13);
    
    monkeyGroup.add(leftEye);
    monkeyGroup.add(rightEye);
    
    return monkeyGroup;
}

function createBubble(color = 0xFFFFFF, size = 0.2) {
    const bubbleGeometry = new THREE.SphereGeometry(size, 16, 16);
    const bubbleMaterial = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        metalness: 0.3,
        roughness: 0.1
    });
    return new THREE.Mesh(bubbleGeometry, bubbleMaterial);
}

function createTree() {
    const treeGroup = new THREE.Group();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.15;
    treeGroup.add(trunk);
    
    const leavesGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 0.3;
    treeGroup.add(leaves);
    
    treeGroup.position.y = -0.15;
    
    return treeGroup;
}