
let is;
let cs = 2000;


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
    noLoop();
}

function setImage() {
    clear();
    let is = min(windowHeight, windowWidth);
    resizeCanvas(is, is);
    img = pg.get();
    image(img, 0, 0, is, is);
}

function draw() {
    pg.stroke(0)
    pg.noFill()
    let w = 10;
    let ws = cs / w;
    for(let i = 0; i < 100; i++) {
        let x = i % 10;
        let y = Math.floor(i / 10);
        console.log(x,y)
        x += noise(x, y)
        y += noise(y, x)
        pg.rect(x * ws, y * ws, ws, ws)
    }
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