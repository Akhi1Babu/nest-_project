// Kinetic Brutalist Particle System using Three.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pitch Black

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // KINETIC PARTICLES (FLOWING DOTS)
    const objects = [];
    const geometry = new THREE.SphereGeometry(0.2, 8, 8); // Small dots
    const material = new THREE.MeshBasicMaterial({
        color: 0x00d2ff, // Cyan Blue
    });

    const rows = 20;
    const cols = 40;
    const spacing = 3;

    // Create a grid of dots
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Center the grid
            mesh.position.x = (j - cols / 2) * spacing;
            mesh.position.y = (i - rows / 2) * spacing;
            mesh.position.z = 0;

            scene.add(mesh);
            objects.push({
                mesh: mesh,
                initialX: mesh.position.x,
                initialY: mesh.position.y,
                offset: Math.random() * Math.PI * 2 // Random phase
            });
        }
    }

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        objects.forEach((obj) => {
            // Fluid Wave Equation
            // z = sin(x + time) + cos(y + time)
            const waveX = Math.sin(obj.initialX * 0.1 + time) * 2;
            const waveY = Math.cos(obj.initialY * 0.1 + time) * 2;

            // Mouse Interaction (Magnetic Ripples)
            const dx = (mouseX * 5) - obj.mesh.position.x;
            const dy = (-mouseY * 5) - obj.mesh.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let mouseEffect = 0;
            if (dist < 30) {
                mouseEffect = (30 - dist) * 0.5;
            }

            obj.mesh.position.z = waveX + waveY + mouseEffect;

            // Dynamic Styling based on depth
            const scale = (obj.mesh.position.z + 5) / 5; // Scale with height
            obj.mesh.scale.setScalar(Math.max(0.5, scale));

            // Color shift based on mouse proximity
            if (dist < 20) {
                obj.mesh.material.color.setHex(0xffffff); // Highlight white
            } else {
                obj.mesh.material.color.setHex(0x00d2ff); // Back to Cyan
            }
        });

        // Camera gentle float
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
