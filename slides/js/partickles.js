const _options = {
        width: 400,
        height: 135,
        density: 9,
        densityText: 5,
        minDist: 8,
    },
    _particles = [];

let _stage, _renderer;

function addText() {
    const canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 300;
    context.fillStyle = "#000000";
    context.font = "110px 'Open Sans', sans-serif";
    context.fillText("fractal", 0, 80);
    addTextParticlesToStage(context);
}

function addTextParticlesToStage(context) {
    const imageData = context.getImageData(0, 0, 400, 400);
    data = imageData.data;

    // Iterate each row and column
    for (let i = 0; i < imageData.height; i += _options.densityText) {
        for (let j = 0; j < imageData.width; j += _options.densityText) {

            // Get the color of the pixel
            const color = data[((j * (imageData.width * 4)) + (i * 4)) - 1];

            // If the color is black, draw pixels
            if (color === 255) {
                const newPar = particle(true);
                newPar.setPosition(i, j);
                _particles.push(newPar);
                _stage.addChild(newPar)
            }
        }
    }
}

function particle(text) {
    const particle = new PIXI.Graphics();
    if (text === true) particle.text = true;

    particle.beginFill(0Xffffff);

    particle.radius = particle.text ? Math.random() * 3.5 : Math.random() * 10.5;

    particle.drawCircle(0, 0,  particle.radius);

    particle.size = this.radius;
    particle.x = -this.width;
    particle.y = -this.height;
    particle.free = false;

    particle.timer = randomInt(0, 100);
    particle.v = randomPlusMinus() * random(.5, 1);

    particle.alpha = randomInt(10, 100) / 100;

    particle.vy = -5 + parseInt(Math.random() * 10) / 2;
    particle.vx = -4 + parseInt(Math.random() * 8);

    particle.setPosition = function (x, y) {
        if (particle.text) {
            particle.x = x + (_options.width / 2 - 165);
            particle.y = y + 10;
        }
    };
    return particle;
}

function updateParticles() {
    for (i = 0; i < _particles.length; i++) {
        const p = _particles[i];

        p.x = p.x + .2 * Math.sin(p.timer * .15);
        p.y = p.y + .2 * Math.cos(p.timer * .15);
        p.timer = p.timer + p.v;
    }
}

function update() {
    _renderer.render(_stage);
    updateParticles();
    window.requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', function () {
    initRenderer();
    addText();
    update()
});

function initRenderer() {
    const canvas = document.getElementById('canvasOne');
    _renderer = new PIXI.autoDetectRenderer(_options.width, _options.height, {view: canvas,  transparent: true});
    _stage = new PIXI.Stage("0Xffffff");
    document.getElementById('c1').appendChild(_renderer.view);
}

function random(t, n) {
    return Math.random() * (n - t) + t;
}

function randomPlusMinus(t) {
    t = t ? t : .5;
    return Math.random() > t ? -1 : 1;
}

function randomInt(t, n) {
    n += 1;
    return Math.floor(Math.random() * (n - t) + t);
}

function distance(t, n, r, a) {
    return Math.sqrt((r - t) * (r - t) + (a - n) * (a - n));
}