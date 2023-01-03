let is;
let cs = 2000;
let nParticles = 30000;
//let particles = [];

let palette = ["#D84462", "#785496", "#F0CA35", "#C9C0BD", "#201728"];

function setSeeds(hash) {
    num = hash.split("").reduce((acc, cur) => acc * cur.charCodeAt(0), 1);
    num = num / 10 ** 90;
    randomSeed(num);
    noiseSeed(num);
}

function setup() {
    setSeeds(fxhash);
    let is = min(windowHeight, windowWidth);
    createCanvas(is, is);
    pg = createGraphics(cs, cs);
    pg.pixelDensity(2);
    pg.colorMode(HSB);
    angleMode(RADIANS);
    noLoop();

    palette = palette.map(c => pg.color(c))

    pg.background(palette[4])

}

function setImage() {
    clear();
    let is = min(windowHeight, windowWidth);
    resizeCanvas(is, is);
    img = pg.get();
    image(img, 0, 0, is, is);
}

// Defines a 1D wavefunction y = i * sin(fx) ^ t normalized between 0 and 1
function waveFx(x, f, i, t) {
    return i * Math.sin(f * x * TWO_PI) ** t;
}

// Grid-like probability density function given input z at coords (x,y)
function isValid(x, y, z) {
    // let p1 be the pdf of 1st wave in x axis
    let p1 = waveFx(x, 5, 10, 10);

    // let p2 by the pdf of 2nd wave in y axis
    let p2 = waveFx(y, 5, 10, 10);

    // Return true if z < average(p1, p2)
    return z < (p1 + p2) / 2;
}

function draw() {
    pg.stroke(0);
    pg.strokeWeight(5);
    pg.noFill();

    let exp = random(2);
    let rexp = 2 - exp;
    let ip = random(10);
    let tp = random(10);

    // Particle generator to generate grid using Monte Carlo method
    for (let i = 0; i < nParticles; i++) {
        let x = random(0, cs) / cs;
        let y = random(0, cs) / cs;
        let z = random();

        if (isValid(x, y, z)) {
            let rs = cs * (0.02 * (waveFx(y ** rexp, x ** rexp, ip, tp) + 0.01) + 0.001);
            rs = rs || 0.001 * cs;
            console.log(rs)
            pg.strokeWeight(waveFx(x ** exp, y ** exp, ip, tp) * 2 + 2);
            pg.stroke((random(palette)))
            pg.rect(x * cs, y * cs, rs, rs);
        }
    }

    setImage();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        save(`${inputHash}.png`);
    }
}

function windowResized() {
    setImage();
}
