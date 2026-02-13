// 3D Food Scene using Three.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if the container exists
    const container = document.querySelector('.hero-3d-element');
    if (!container) return;

    // Clear any previous content
    container.innerHTML = '';

    // Create Scene
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x0a0a0a); // Match site background or transparent

    // Create Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 25;
    camera.position.y = 5;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Create a Procedural "Burger" ---
    const burgerGroup = new THREE.Group();

    // 1. Bottom Bun
    const bunGeometry = new THREE.CylinderGeometry(8, 8, 3, 32);
    const bunMaterial = new THREE.MeshStandardMaterial({ color: 0xcfaa5f, roughness: 0.8 }); // Bread color
    const bottomBun = new THREE.Mesh(bunGeometry, bunMaterial);
    bottomBun.position.y = -4;
    burgerGroup.add(bottomBun);

    // 2. Lettuce (Wavy disk)
    const lettuceGeometry = new THREE.CylinderGeometry(8.5, 8.5, 0.5, 16);
    const lettuceMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 });
    const lettuce = new THREE.Mesh(lettuceGeometry, lettuceMaterial);
    lettuce.position.y = -2;
    lettuce.scale.set(1.1, 1, 1.1); // Make it stick out
    burgerGroup.add(lettuce);

    // 3. Patty (Meat)
    const pattyGeometry = new THREE.CylinderGeometry(7.8, 7.8, 2, 32);
    const pattyMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9, color: 0x3e2723 }); // Dark Meat
    const patty = new THREE.Mesh(pattyGeometry, pattyMaterial);
    patty.position.y = -0.5;
    burgerGroup.add(patty);

    // 4. Cheese (Yellow box or thin cylinder)
    const cheeseGeometry = new THREE.BoxGeometry(13, 0.2, 13);
    const cheeseMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5, metalness: 0.1 });
    const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
    cheese.position.y = 0.8;
    cheese.rotation.y = Math.PI / 4; // Rotate for visual interest
    burgerGroup.add(cheese);

    // 5. Tomato (Red cylinder)
    const tomatoGeometry = new THREE.CylinderGeometry(7.5, 7.5, 0.8, 32);
    const tomatoMaterial = new THREE.MeshStandardMaterial({ color: 0xff3d00, roughness: 0.2, metalness: 0.1 }); // Shiny Tomato
    const tomato = new THREE.Mesh(tomatoGeometry, tomatoMaterial);
    tomato.position.y = 1.6;
    burgerGroup.add(tomato);

    // 6. Top Bun (Sphere Top + Cylinder Bottom)
    // Create a half sphere for the top bun
    const topBunGeo = new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topBun = new THREE.Mesh(topBunGeo, bunMaterial);
    topBun.position.y = 2.2;
    burgerGroup.add(topBun);

    // 7. Sesame Seeds (Small white spheres scattered on top bun)
    const seedsGroup = new THREE.Group();
    const seedGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0xfff8e1 });

    for (let i = 0; i < 40; i++) {
        const seed = new THREE.Mesh(seedGeo, seedMat);

        // Random spherical coordinates on the top surface
        const phi = Math.acos(-1 + (2 * i) / 40); // distribute
        const theta = Math.sqrt(40 * Math.PI) * phi;

        // Use spherical coords to place on top bun surface
        // Simplifying placement: just random
        const u = Math.random();
        const v = Math.random();

        const theta_seed = 2 * Math.PI * u;
        const phi_seed = Math.acos(2 * v - 1);

        // Only upper hemisphere
        if (Math.cos(phi_seed) > 0.2) {
            const r = 8.1; // slightly above surface
            seed.position.x = r * Math.sin(phi_seed) * Math.cos(theta_seed);
            seed.position.y = r * Math.cos(phi_seed) + 2.2; // Adjust relative to bun center
            seed.position.z = r * Math.sin(phi_seed) * Math.sin(theta_seed);
            seedsGroup.add(seed);
        }
    }
    burgerGroup.add(seedsGroup);

    // Center the group
    burgerGroup.position.set(0, -2, 0);
    // Tilt it slightly
    burgerGroup.rotation.x = 0.3;
    burgerGroup.rotation.y = -0.5;

    scene.add(burgerGroup);


    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff007f, 0.8, 100); // Neon accent
    pointLight2.position.set(-10, -5, 10);
    scene.add(pointLight2);


    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the burger
        burgerGroup.rotation.y += 0.005;

        // Make it float/bob slightly
        burgerGroup.position.y = -2 + Math.sin(Date.now() * 0.001) * 0.5;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix(); // Important!

        renderer.setSize(width, height);
    });

});
