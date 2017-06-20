let _width, _height,
    _detail, _roughness,
    _scene, _renderer, _camera;

function init(detail, roughness) {
    _detail = detail;
    _roughness = roughness;
    _width = window.innerWidth;
    _height = window.innerHeight;


    _scene = new THREE.Scene();

    _renderer = getRenderer(_width, _height);
    _camera = getCamera(_width, _height);

    _scene.add(getLight());
    _scene.add(camera);

    drawLine();
}

function drawLine() {
    const material = new THREE.LineBasicMaterial({color: 0x00ff00}),
        niceWidth = Math.ceil((_width - 200) / 100) * 100;

    line = new THREE.Line(getGeometry(niceWidth, _detail, _roughness), material);

    _scene.add(line);
    _renderer.render(_scene, camera);
}

function getGeometry(lineLength, detail, roughness) {
    const geometry = new THREE.Geometry(),
        points = getPoints(lineLength, detail, roughness);

    console.log(JSON.stringify(points, null, 2));

    points.forEach(point => geometry.vertices.push(new THREE.Vector3(point.position, point.magnitude, 0)));
    return geometry;
}

function getPoints(width, detail, roughness) {
    const points = [];
    points.push({position: width, magnitude: 0});
    splitLine(points, width, detail, roughness);
    points.push({position: 0, magnitude: 0});
    return points;
}

function splitLine(points, width, detail, roughness) {
    const halfWidth = Math.floor(width / 2),
        scale = (roughness * width) / 3;

    if (halfWidth <= detail) return;

    const magnitude = Math.random() * scale;
    points.push({position: halfWidth, magnitude: magnitude});

    splitLine(points, halfWidth, detail, roughness); // recursion!
}

function getCamera(width, height) {
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.set(width / 2, 0, 500);
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

window.onmousemove = drawLine;
init(1, 0.7);