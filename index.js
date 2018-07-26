var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    easeInOutSin: function (t) {
        return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
    },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
    bounce: function(pos) {
        if (pos < (1/2.75)) {
            return (7.5625*pos*pos);
        } else if (pos < (2/2.75)) {
            return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
        } else if (pos < (2.5/2.75)) {
            return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
        } else {
            return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
        }
    },
    
    bouncePast: function(pos) {
        if (pos < (1/2.75)) {
            return (7.5625*pos*pos);
        } else if (pos < (2/2.75)) {
            return 2 - (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
        } else if (pos < (2.5/2.75)) {
            return 2 - (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
        } else {
            return 2 - (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
        }
    },
	easeInOutBounce: function (t) {
		if (t < 0.5) return this.bounce (t) * .5;
		return this.bouncePast (t) * .5;
	}
}

var app = new PIXI.Application(1000, 800, {resolution: 1, autoStart: false, antialias: true  });
document.body.appendChild(app.view);
app.stop();
const canvas = document.createElement('canvas')
canvas.width = 25
canvas.height = 25
let ctx = canvas.getContext('2d')
ctx.beginPath()
ctx.arc(12.5, 12.5, 12.5, 0, 2 * Math.PI, false)
ctx.fillStyle = '#ffffff';
ctx.fill();
ctx.fillStyle = '#666666';
ctx.fillRect(11.5, 3, 2, 2);


PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
var camera = new PIXI.projection.Camera3d();
camera.setPlanes(2400, 30, 10000);
camera.position.set(app.view.width/2, app.view.height/2);
// camera.position3d.x = -250
// camera.position3d.y = -150
app.stage.addChild(camera);

const rowDelay = 20
const sprites = []
let x = -app.view.width/3
let y = -app.view.height/2
const text = PIXI.Texture.from(canvas)
let mainLayer = new PIXI.projection.Container3d();
var filter = new PIXI.filters.ColorMatrixFilter();
for (let j = 0; j < 25; j++) {
    y = y + 30
    const row = []
    for (let i = 0; i < 25; i++) {
        let sprite = new PIXI.projection.Sprite3d(text)
        //var sprite = new PIXI.projection.Sprite3d(PIXI.Texture.fromImage('assets/neven7.jpg'))
        sprite.tint = j > 12 ? 0x7777ff : 0xffff00; //Change with the color wanted
        sprite.width = 25;
        sprite.height = 25;
        sprite.meta = {
            turn: 0,
            speed: 0.008,
            isAnimating: false,
            animationDelay: i * rowDelay,
            color: j > 12 ? 0x7777ff : 0xffff00,
            lightFactor: 0,
            factor: 0
        }

        sprite.position.set(x, y)
        sprite.anchor.set(0.5,0.1)
        x = x + 30
        row.push(sprite)
        mainLayer.addChild(sprite)
    }
    x = -app.view.width/3
    sprites.push(row)
}
gredientRadial(sprites, 15, 12, 8)
applyLightTintToAll()
camera.addChild(mainLayer)

app.stage.addChild(camera);

//sprite.pivot3d.set(sprite.width * 0.5, sprite.height * 0.5, 0)
app.start();


console.log(PIXI.filters)
const limmit = Math.PI / 6
let allAnimationsStarted = false
const start = performance.now()

const ticker = app.ticker.add((delta) => {
    //sprite.euler.x = sprite.euler.x + 0.01 * delta;
    for (let i = 0; i < sprites.length; i++) {
        var row = sprites[i]
        runAnimation(row)
    }
});

function applyLightTintToAll() {
    for (let i = 0; i < sprites.length; i++) {
        var row = sprites[i]
        for (let i = 0; i < row.length; i++) {
            applyLightOnTint(row[i])
        }
    }
}

function runAnimation(row) {
    for (let i = 0; i < row.length; i++) {
        if (!row[i].meta.isAnimating) {
            if (performance.now() - start > row[i].meta.animationDelay) {
                row[i].meta.isAnimating = true
            }
            return
        }
        row[i].meta.turn += row[i].meta.speed;
        row[i].euler.y = EasingFunctions.bounce(row[i].meta.turn * 1/ limmit)
        row[i].tint = parseInt(shadeBlendConvert(-row[i].meta.factor * 0.75, '#'+row[i].meta.color.toString(16)), 16)
        applyLightOnTint(row[i])
        row[i].meta.factor += row[i].meta.speed
        if (row[i].meta.turn >= limmit) {
            row[i].meta.turn = limmit
            row[i].meta.speed = -row[i].meta.speed
        } else if (row[i].meta.turn <= 0) {
            row[i].meta.turn = 0
            row[i].meta.speed = -row[i].meta.speed
            row[i].tint = row[i].meta.color
            applyLightOnTint(row[i])
            row[i].meta.factor = 0
        }
        row[i].euler.x = EasingFunctions.bounce(row[i].meta.turn * 1/ limmit) / 3
    }
}

function shadeBlendConvert (p, from, to) {
    if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(to&&typeof(to)!="string"))return null; //ErrorCheck
    if(!this.sbcRip)this.sbcRip=(d)=>{
        let l=d.length,RGB={};
        if(l>9){
            d=d.split(",");
            if(d.length<3||d.length>4)return null;//ErrorCheck
            RGB[0]=i(d[0].split("(")[1]),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
        }else{
            if(l==8||l==6||l<4)return null; //ErrorCheck
            if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 or 4 digit
            d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=-1;
            if(l==9||l==5)RGB[3]=r((RGB[2]/255)*10000)/10000,RGB[2]=RGB[1],RGB[1]=RGB[0],RGB[0]=d>>24&255;
        }
    return RGB;}
    var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=this.sbcRip(from),t=this.sbcRip(to);
    if(!f||!t)return null; //ErrorCheck
    if(h)return "rgb"+(f[3]>-1||t[3]>-1?"a(":"(")+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
    else return (0x100000000+r((t[0]-f[0])*p+f[0])*0x1000000+r((t[1]-f[1])*p+f[1])*0x10000+r((t[2]-f[2])*p+f[2])*0x100+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)).toString(16).slice(1,f[3]>-1||t[3]>-1?undefined:-2);
}

function applyLightOnTint(sprite) {
    sprite.tint = parseInt(shadeBlendConvert((0.1 * sprite.meta.lightFactor), '#'+sprite.tint.toString(16)), 16)
}

function gredientRadial(matrix, centerX, centerY, radius) {
    const maxRadius = radius + 1
    while(radius > 0) {
        drawCircle(matrix, centerX, centerY, radius, maxRadius);
        angle = 0;
        radius --;
    }
    if (matrix[centerY] && matrix[centerY][centerX]) {
        applyLight(matrix[centerY][centerX], maxRadius - radius)
    }
}

function drawCircle(matrix, centerX, centerY, r, maxRadius) {
    let angle = 0
    while(angle < 360) {
        x = Math.round(centerX + r * Math.cos(angle));
        y = Math.round(centerY + r * Math.sin(angle));
        if (!matrix[y] || !matrix[y][x]) {
            angle += 1;
            continue
        }
        applyLight(matrix[y][x], maxRadius - r);
        angle += 1;
    }
}

function applyLight(sprite, lightFactor) {
    sprite.meta.lightFactor = lightFactor
}
