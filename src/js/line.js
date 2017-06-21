function Fractal(detail) {
    this.size = Math.pow(2, detail) + 1;
    this.lineWidth = this.size - 1;
    this.map = new Float32Array(this.size);
}

Fractal.prototype.get = function (x) {
    if (x < 0 || x > this.lineWidth) return -1;
    return this.map[x];
};

Fractal.prototype.set = function (x, val) {
    this.map[x] = val;
    console.log(`${x},    this.map[${x}] = ${val}`);
};

Fractal.prototype.draw = function (renderer, scene, camera, width) {
    const self = this;

    const material = new THREE.LineBasicMaterial({color: 0x00ff00}),
        geometry = getGeometry(width),
        line = new THREE.Line(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);


    function getGeometry(width) {
        const geometry = new THREE.Geometry(),
            scale = width / self.lineWidth;

        for (let x = 0; x <= self.lineWidth; x++) {
            const val = self.get(x);
            geometry.vertices.push(new THREE.Vector3(x * scale, val * 20, 0));
        }

        return geometry;
    }
};

function getCamera(width, height) {
    const camera = new THREE.PerspectiveCamera(27, width / height, 1, 10000);
    camera.position.set((width / 2), 0, 1000);
    return camera;
}

function getRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('scene')});
    renderer.setClearColor(0x3F3F3F);
    renderer.setSize(width, height);
    return renderer;
}

function clear() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

Fractal.prototype.generate = function (roughness) {
    const self = this;
    roughness = roughness / (this.size / 20);

    this.set(0, 0);
    this.set(this.lineWidth, 0);

    divide(this.lineWidth);

    function divide(lineWidth) {
        const halfLineWidth = lineWidth / 2,
            scale = (roughness * lineWidth) * 2;

        if (halfLineWidth < 1) return;

        for (let x = halfLineWidth; x < self.lineWidth; x += lineWidth) {
            const offset = Math.random() * scale - (scale / 2),
                average = getAverage(x, halfLineWidth);
            self.set(x, average + offset);
        }
        divide(halfLineWidth);
    }

    function getAverage(x, size) {
        const total = [self.get(x - size), self.get(x + size)].reduce((sum, val) => sum + val, 0);
        return total / 2;
    }
};

function init(detail = 3, roughness = 0.5) {
    clear();

    console.log('---- init ----');

    const terrain = new Fractal(detail); // 3, 5, 9, 17, 33, 65, 129, 257 ...
    terrain.generate(roughness);
    terrain.draw(renderer, scene, camera, width);
}

const width = window.innerWidth - 20,
    height = window.innerHeight - 20,
    scene = new THREE.Scene(),
    renderer = getRenderer(width, height),
    camera = getCamera(width, height);

scene.add(camera);

window.addEventListener('mousemove', function (e) {
    const detail = Math.round(e.clientX / 150),
        roughness = e.clientY / 500;

    init(detail, roughness);
});

init();
