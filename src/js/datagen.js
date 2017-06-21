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

    console.log('---------- position = x + size * y');
    console.log('---------- this.map[position] = val');

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
                const magnitude = square(x, y, half, Math.random() * scale * 2 - scale);
                self.set(x, y, magnitude);
            }
        }

        divide(size / 2);
    }

    function average(values) {
        const valid = values.filter(function (val) {
            return val !== -1;
        });

        const total = valid.reduce(function (sum, val) {
            return sum + val;
        }, 0);

        return total / valid.length;
    }

    function square(x, y, size, offset) {
        const ave = average([
            self.get(x - size, y - size),   // upper left
            self.get(x + size, y - size),   // upper right
            self.get(x + size, y + size),   // lower right
            self.get(x - size, y + size)    // lower left
        ]);

        return ave + offset;
    }
};

const terrain = new Terrain(2);
terrain.generate(0.7);