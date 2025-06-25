let carLongitude = 0;
let targetSpeed = 0;
let currentSpeed = 0;
let isCarMoving = false;
const maxForwardSpeed = 0.5;
const maxReverseSpeed = -0.3;
const acceleration = 0.005;
const deceleration = 0.01;

function updateCarPosition() {
    const radius = 8.2;
    const phi = (90 - 0) * (Math.PI / 180);
    
    if (isCarMoving) {
        if (currentSpeed < targetSpeed) {
            currentSpeed = Math.min(currentSpeed + acceleration, targetSpeed);
        } else if (currentSpeed > targetSpeed) {
            currentSpeed = Math.max(currentSpeed - acceleration, targetSpeed);
        }
    } else {
        if (currentSpeed > 0) {
            currentSpeed = Math.max(0, currentSpeed - deceleration);
        } else if (currentSpeed < 0) {
            currentSpeed = Math.min(0, currentSpeed + deceleration);
        }
    }
    
    const effectiveSpeed = gravityEffect ? currentSpeed * 0.3 : currentSpeed;
    carLongitude += effectiveSpeed;
    
    if (carLongitude > 360) carLongitude -= 360;
    if (carLongitude < 0) carLongitude += 360;
    
    const theta = (carLongitude + 180) * (Math.PI / 180);
    
    redCar.position.x = -radius * Math.sin(phi) * Math.cos(theta);
    redCar.position.y = radius * Math.cos(phi);
    redCar.position.z = radius * Math.sin(phi) * Math.sin(theta);
    
    const normal = new THREE.Vector3(
        redCar.position.x,
        redCar.position.y,
        redCar.position.z
    ).normalize();
    
    const tangentDirection = currentSpeed >= 0 ? 1 : -1;
    const tangent = new THREE.Vector3(
        radius * Math.sin(phi) * Math.sin(theta) * tangentDirection,
        0,
        -radius * Math.sin(phi) * Math.cos(theta) * tangentDirection
    ).normalize();
    
    const tangentQuat = new THREE.Quaternion();
    tangentQuat.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        tangent
    );
    
    const upQuat = new THREE.Quaternion();
    upQuat.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal
    );
    
    redCar.quaternion.multiplyQuaternions(upQuat, tangentQuat);
    
    const wheelRotationSpeed = effectiveSpeed * 10;
    redCar.children.forEach(child => {
        if (child.geometry?.type === "CylinderGeometry") {
            child.rotation.x += wheelRotationSpeed;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (planetAutoRotate) {
        planetGroup.rotation.y += planetRotationSpeed;
    } else {
        planetGroup.rotation.x += planetRotationX;
        planetGroup.rotation.y += planetRotationY;
    }
    
    moon.position.x = 20 * Math.cos(Date.now() * 0.0005);
    moon.position.z = -15 * Math.sin(Date.now() * 0.0005);
    
    updateCarPosition();
    
    renderer.render(scene, camera);
}