function Terrain(detail) {
    this.size = Math.pow(2, detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
}

Terrain.prototype.get = function (x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    return this.map[x + this.size * y];
};

Terrain.prototype.set = function (x, y, val) {
    const position = x + this.size * y;
    this.map[position] = val;

    console.log(`${x},${y}    this.map[${position}] = ${val}`);
};

Terrain.prototype.generate = function (roughness) {
    const self = this;

    this.set(0, 0, self.max);
    this.set(this.max, 0, self.max);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, self.max / 2);

    console.log(`---------------------------------------`);

    divide(this.max);

    function divide(size) {
        const half = size / 2,
            scale = roughness * size;

        let x, y;

        if (half < 1) return;

        for (y = half; y < self.max; y += size) {
            for (x = half; x < self.max; x += size) {
                const offset = Math.random() * scale * 2 - scale,
                    average = getSquareAverage(x, y, half);
                self.set(x, y, average + offset);
            }
        }

        for (y = 0; y <= self.max; y += half) {
            for (x = (y + half) % size; x <= self.max; x += size) {
                const offset = Math.random() * scale * 2 - scale,
                    average = getDiamondAverage(x, y, half);
                self.set(x, y, average + offset);
            }
        }

        divide(size / 2);
    }

    function getSquareAverage(x, y, size) {
        const average = getAverage([
            self.get(x - size, y - size),   // upper left
            self.get(x + size, y - size),   // upper right
            self.get(x + size, y + size),   // lower right
            self.get(x - size, y + size)    // lower left
        ]);
        return average;
    }

    function getDiamondAverage(x, y, size) {
        const average = getAverage([
            self.get(x, y - size),      // top
            self.get(x + size, y),      // right
            self.get(x, y + size),      // bottom
            self.get(x - size, y)       // left
        ]);
        return average;
    }

    function getAverage(values) {
        const valid = values.filter((val) => val !== -1),
            total = valid.reduce((sum, val) => sum + val, 0);

        return total / valid.length;
    }
};

Terrain.prototype.draw = function () {
    const self = this;

    const material = new THREE.LineBasicMaterial({color: 0x00ff00}),
        geometry = getGeometry(width),
        line = new THREE.PointCloud(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);


    function getGeometry(width) {
        const geometry = new THREE.Geometry(),
            scale = (width / self.size)/3;

        for (let y = 0; y < self.size; y++) {
            for (let x = 0; x < self.size; x++) {
                const val = self.get(x, y);
                geometry.vertices.push(new THREE.Vector3(x*1.5, 0, y*1.5));
            }
        }

        return geometry;
    }
};

function getCamera(width, height) {
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 10000);
    camera.position.set((width / 2)-150, 200, 500);
    return camera;
}
function getLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 250, 500);
    return light;
}

function getRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('scene')});
    renderer.setClearColor(0x3F3F3F);
    renderer.setSize(width, height);
    return renderer;
}

function clear(){
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
}

function init(detail = 7, roughness = 0.7) {
    clear();

    const terrain = new Terrain(detail); // 3, 5, 9, 17, 33, 65, 129, 257 ...
    terrain.generate(roughness);
    terrain.draw(renderer, scene, camera, width);
}

const width = window.innerWidth - 20,
    height = window.innerHeight - 20,
    scene = new THREE.Scene(),
    renderer = getRenderer(width, height),
    camera = getCamera(width, height);

scene.add(getLight());
scene.add(camera);

init();
