let gravityEffect = false;

function setupControls() {
    document.getElementById('planet-left').addEventListener('click', () => {
        planetRotationY += 0.02;
        planetAutoRotate = false;
    });
    
    document.getElementById('planet-right').addEventListener('click', () => {
        planetRotationY -= 0.02;
        planetAutoRotate = false;
    });
    
    document.getElementById('planet-up').addEventListener('click', () => {
        planetRotationX += 0.02;
        planetAutoRotate = false;
    });
    
    document.getElementById('planet-down').addEventListener('click', () => {
        planetRotationX -= 0.02;
        planetAutoRotate = false;
    });
    
    document.getElementById('planet-rotate').addEventListener('click', () => {
        planetAutoRotate = true;
    });
    
    document.getElementById('planet-stop').addEventListener('click', () => {
        planetAutoRotate = false;
        planetRotationX = 0;
        planetRotationY = 0;
    });
    
    document.getElementById('toggle-gravity').addEventListener('click', () => {
        gravityEffect = !gravityEffect;
        document.getElementById('gravity-effect').style.opacity = gravityEffect ? 0.5 : 0;
        document.getElementById('toggle-gravity').style.backgroundColor = gravityEffect ? '#f44336' : '#4CAF50';
        document.getElementById('toggle-gravity').textContent = gravityEffect ? 
            "Gravidade Normal" : "Gravidade 10x";
    });
    
    document.getElementById('car-faster').addEventListener('click', () => {
        if (targetSpeed >= 0) {
            targetSpeed = Math.min(targetSpeed + 0.1, maxForwardSpeed);
        } else {
            targetSpeed = Math.min(targetSpeed + 0.1, 0);
        }
        isCarMoving = true;
    });
    
    document.getElementById('car-slower').addEventListener('click', () => {
        if (targetSpeed <= 0) {
            targetSpeed = Math.max(targetSpeed - 0.1, maxReverseSpeed);
        } else {
            targetSpeed = Math.max(targetSpeed - 0.1, 0);
        }
        isCarMoving = true;
    });
    
    document.getElementById('car-forward').addEventListener('click', () => {
        targetSpeed = maxForwardSpeed;
        isCarMoving = true;
    });
    
    document.getElementById('car-backward').addEventListener('click', () => {
        targetSpeed = maxReverseSpeed;
        isCarMoving = true;
    });
    
    document.getElementById('car-stop').addEventListener('click', () => {
        targetSpeed = 0;
        isCarMoving = false;
    });
    
    document.getElementById('reset').addEventListener('click', () => {
        camera.position.z = 30;
        planetGroup.rotation.set(0, 0, 0);
        planetAutoRotate = true;
        planetRotationSpeed = 0.001;
        carLongitude = 0;
        targetSpeed = 0;
        currentSpeed = 0;
        isCarMoving = false;
        gravityEffect = false;
        document.getElementById('gravity-effect').style.opacity = 0;
        document.getElementById('toggle-gravity').style.backgroundColor = '#4CAF50';
        document.getElementById('toggle-gravity').textContent = "Gravidade 10x";
        updateCarPosition();
    });
}

function setupEventListeners() {
    document.addEventListener('mousedown', (event) => {
        isDragging = true;
        document.body.classList.add('grabbing');
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };
            
            planetGroup.rotation.y += deltaMove.x * 0.01;
            planetGroup.rotation.x += deltaMove.y * 0.01;
            planetAutoRotate = false;
            
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.classList.remove('grabbing');
    });
    
    document.addEventListener('mouseleave', () => {
        isDragging = false;
        document.body.classList.remove('grabbing');
    });
    
    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        camera.position.z = THREE.MathUtils.clamp(
            camera.position.z + (event.deltaY * 0.1),
            15,
            50
        );
    });
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('background').style.width = window.innerWidth + 'px';
        document.getElementById('background').style.height = window.innerHeight + 'px';
    });
}