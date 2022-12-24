
let is;
let cs = 2000;
let nParticles = 200000;
//let particles = [];

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
    angleMode(RADIANS)
    noLoop();
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
    return i * (Math.sin(f * x * TWO_PI)) ** t;
}

// Grid-like probability density function given input z at coords (x,y)
function isValid(x, y, z) {

    // let p1 be the pdf of 1st wave in x axis
    let p1 = waveFx(x, 5, 1, 10);

    // let p2 by the pdf of 2nd wave in y axis
    let p2 = waveFx(y, 5, 1, 10);

    // Return true if z < average(p1, p2)
    return z < (p1 + p2) / 2;
}

function draw() {
    pg.stroke(0);
    pg.strokeWeight(5);
    pg.noFill();

    // Particle generator to generate grid using Monte Carlo method
    for (let i = 0; i < nParticles; i++) {
        let x = random(0, cs) / cs;
        let y = random(0, cs) / cs;
        let z = random();

        if (isValid(x, y, z)){
            pg.point(x * cs, y * cs)
        } 
    }
    //let w = 10;
    //let ws = cs / w;
    // for(let i = 0; i < 100; i++) {
    //     let x = i % 10;
    //     let y = Math.floor(i / 10);
    //     console.log(x,y)
    //     x += noise(x, y)
    //     y += noise(y, x)
    //     pg.rect(x * ws, y * ws, ws, ws)
    // }
    setImage()
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        save(`${inputHash}.png`);
    }
}

function windowResized() {
    setImage();
}