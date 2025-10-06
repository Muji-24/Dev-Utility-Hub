class ThreeJSBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.init();
        this.animate();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('threejs-container').appendChild(this.renderer.domElement);

        // Create floating geometric shapes
        this.geometries = [
            new THREE.OctahedronGeometry(1),
            new THREE.TorusGeometry(1, 0.4, 16, 100),
            new THREE.IcosahedronGeometry(1),
            new THREE.SphereGeometry(1, 32, 32)
        ];

        this.materials = [
            new THREE.MeshBasicMaterial({ 
                color: 0x00ffff, 
                wireframe: true,
                transparent: true,
                opacity: 0.3
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0xff00ff, 
                wireframe: true,
                transparent: true,
                opacity: 0.3
            })
        ];

        this.meshes = [];
        
        // Create multiple floating objects
        for (let i = 0; i < 15; i++) {
            const geometry = this.geometries[Math.floor(Math.random() * this.geometries.length)];
            const material = this.materials[Math.floor(Math.random() * this.materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 50;
            mesh.position.y = (Math.random() - 0.5) * 50;
            mesh.position.z = (Math.random() - 0.5) * 50;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            mesh.userData = {
                speed: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 2 + 1
            };
            
            this.meshes.push(mesh);
            this.scene.add(mesh);
        }

        // Position camera
        this.camera.position.z = 15;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse interaction
        this.mouseX = 0;
        this.mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
            this.mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate meshes
        this.meshes.forEach((mesh, index) => {
            mesh.rotation.x += mesh.userData.speed * 0.5;
            mesh.rotation.y += mesh.userData.speed;
            
            // Floating animation
            mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            mesh.position.x += Math.cos(Date.now() * 0.001 + index) * 0.01;
        });

        // Camera movement based on mouse
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThreeJSBackground();
});