let camera, scene, renderer, geometry, material, line;

window.onload = init;


function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(20, 40, 50);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    geometry = getGeometry();
    material = new THREE.LineBasicMaterial({color: 'white'});
    line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    render();
}

function getGeometry() {
    const size = 20, step = 2, geometry = new THREE.Geometry();

    for (var i = -size; i <= size; i += step) {

        geometry.vertices.push(new THREE.Vector3(-size, 0, i));
        geometry.vertices.push(new THREE.Vector3(size, 0, i));

        geometry.vertices.push(new THREE.Vector3(i, 0, -size));
        geometry.vertices.push(new THREE.Vector3(i, 0, size));

    }

    return geometry;
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}