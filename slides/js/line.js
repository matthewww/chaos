function init() {
    const width = window.innerWidth,
        height = window.innerHeight,
        niceWidth = Math.ceil((width - 200) / 100) * 100;

    const material = new THREE.LineBasicMaterial({color: 0x00ff00}),
        line = new THREE.Line(getGeometry(niceWidth), material);

    const renderer = getRenderer(width, height),
        scene = new THREE.Scene(),
        light = getLight(),
        camera = getCamera(width, height);

    scene.add(light);
    scene.add(camera);
    scene.add(line);

    renderer.render(scene, camera);
}

function getGeometry(lineLength) {
    const geometry = new THREE.Geometry();
    divide(lineLength);
    geometry.vertices.push(
        new THREE.Vector3( 0, 20, 0 ),
        new THREE.Vector3( 3, 400, 0 ));
    return geometry;
}

function divide(max) {

}

function getCamera(width, height) {
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.set(0, 0, 500);
    return camera;
}

function getLight() {
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 250, 500);
    return light;
}
function getRenderer(width, height) {
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('scene')});
    renderer.setClearColor(0x3F3F3F);
    renderer.setSize(width, height);
    return renderer;
}

window.onmousemove = init;
init();