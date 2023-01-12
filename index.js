let is;
let cs = 2000;
let nParticles = 30000;
var noiseScale = 10;

// initialize wave params
let waveF, waveI, waveT;

let palette;
let palettes = [
    ["#22162b", "#451f55", "#724e91", "#e54f6d", "#f8c630", "#c4bbb8"],
    ["#1a535c", "#fdad0d", "#ff4747", "#ffeb85", "#7b1714", "#f9f1f6"],
    ["#1a535c", "#fdad0d", "#ff4747", "#ffeb85", "#7b1714", "#f9f1f6"],
    ["#002642", "#840032", "#e59500", "#e5dada", "#02040f", "#ff6978"],
    ["#b5d6b2", "#53131e", "#5a464c", "#fffacc", "#ffefbd", "#103900"],
];

function setSeeds(hash) {
    num = hash.split("").reduce((acc, cur) => acc * cur.charCodeAt(0), 1);
    num = num / 10 ** 90;
    randomSeed(num);
    noiseSeed(num);
}

function setup() {
    palette = random(palettes)
    palette = shuffle(palette);
    setSeeds(fxhash);
    let is = min(windowHeight, windowWidth);
    createCanvas(is, is);
    pg = createGraphics(cs, cs);
    pg.pixelDensity(2);
    pg.colorMode(HSB);
    angleMode(RADIANS);
    noLoop();

    palette = palette.map((c) => pg.color(c));

    pg.background(palette[4]);

    // Randomize wave params
    waveF = floor(5 + random() * 5); // 5 to 10
    waveI = 1 + floor(random() * 5); // 1 to 5
    waveT = floor(random() * 2 + 1) * 10; // 10 or 20
    noiseScale = 5 * 10 ** (random() * 2 - 1); // 0.5 to 50

    console.log(waveF, waveI, waveT);
    console.log(noiseScale);
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

// Grid-like probability density function given input z at coords (x,y) for waves of (f, i, t)
function isValid(x, y, z, f, i, t) {
    // let p1 be the pdf of 1st wave in x axis
    let p1 = waveFx(x, f, i, t);

    // let p2 by the pdf of 2nd wave in y axis
    let p2 = waveFx(y, f, i, t);

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
        let z = noise(x * noiseScale, y * noiseScale);

        if (isValid(x, y, z, waveF, waveI, waveT)) {
            let rs =
                cs *
                (0.02 * (waveFx(y ** rexp, x ** rexp, ip, tp) + 0.01) + 0.001);
            rs = rs || 0.001 * cs;
            //console.log(rs)
            pg.strokeWeight(waveFx(x ** exp, y ** exp, ip, tp) * 2 + 2);
            pg.stroke(
                palette[
                    floor(
                        noise(x * noiseScale, y * noiseScale) * palette.length
                    )
                ]
            );
            pg.rect(x * cs, y * cs, rs, rs);
        }
    }

    setImage();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        save(`img.png`);
    }
}

function windowResized() {
    setImage();
}
