let particles = [];
var clouds = [];
var n = 10;

let drawing = false;
let btn1Click = 0;

let cnv1;

//DOM Elements
let div1, div2;
let btn1;

let circles = 20;
let circleSp = 20;

//variable for switch-case
let mode = 0;

let song;

function setup() {
  cnv1 = createCanvas(windowWidth, windowHeight);
  div1 = select('.sec');
  btn1 = select('.finishBtn');
  div2 = select('.sec2');
  div3 = select('.sec3');
  div4 = select('.sec4');
  div2.hide();
  div3.hide();
  div4.hide();
  song = loadSound('Assets/230104_Plucked_v1.mp3');
  
  for(let a = 0;a<n;a+=1){
    clouds[a] = new Cloud();
  }
  
  inputField = createInput();
  inputField.attribute('placeholder', '당신의 이름과, 궁금한 것을 적어보세요');
  inputField.parent(div2);
  
  submitButton = createButton('전송하기');
  submitButton.mousePressed(askGpt);
  submitButton.parent(div2);
  
  responseP = createP('');
  responseP.parent(div4);
}

function draw() {
  switch(mode) {
    case 0:
      background('#f0ead6');
      drawDragon();
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
      }
      particles = particles.filter(particle => !particle.isOutOfScreen());

      if(!drawing){
        for (let i = 0; i < particles.length; i++) {
          particles[i].wriggle();
        }
      }
   break;
   
   case 1:
    div1.remove();
    div2.show();
    background('#f0ead6');
    drawBody();
    drawDragon();
   break;
   
   case 2:
    background(240,234,214,20);
      
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].viz();
      clouds[i].move();
      clouds[i].update();
    }
    push();
      translate(width*0.3,height*0.2);    
      drawBody();
      drawDragon();
    pop();
   break;
  }
}

function drawBody() {
  stroke('orange');
   for(let i = 0; i<circles; i++){
      let color1 = color(255, 140, 0); // 주황색
      let color2 = color(65, 105, 225); // 파랑색
      let lerpedColor = color1; // 초기 색상은 주황색
      lerpedColor = lerpColor(color1, color2, sin(frameCount * 0.02) * 0.5 + 0.5);
      fill(lerpedColor);
       ellipse(width/2+20*sin(frameCount/30+i*0.2), height-i*circleSp+i,80+i*4,50);
       
       lerpedColor = lerpColor(color1, color2, cos(frameCount * 0.02) * 0.5 + 0.5);
       fill(lerpedColor);
       ellipse(width/2+20*sin(frameCount/30+i*0.2), height-i*circleSp+i,80,80)
     }
}
function drawDragon() {
  push();
    let t = frameCount;
    if(mode==0){
      translate(width/2, height/2+8*sin(t*0.02));
    }
    if(mode==1 || mode==2){
      translate(width/2+20*cos(t/30+0.2+0.4), height/2);
    }

  //Horn
    stroke('darkgrey');
    strokeWeight(20);
    line(0,0, -200,-100);
    line(-200,-100, -80,-10);
    line(0,0, 200,-100);
    line(200,-100, 80,-10);

  //Head
    let y = sin(t * 0.02 * 0.5);
    let color1 = color(255, 140, 0); // 주황색
    let color2 = color(65, 105, 225); // 파랑색
    let lerpedColor = color1; // 초기 색상은 주황색
    lerpedColor = lerpColor(color1, color2, sin(frameCount * 0.02) * 0.5 + 0.5);
    fill(lerpedColor);
    noStroke();
    ellipse(0, 0, 260, 200);
   //Ear
    triangle(0,-100, -200,2*sin(t*0.2), 0,0);
    triangle(0,-100, 200,0, 0,0);

   //Eyes
    fill('white');
    ellipse(-40,-30,80,80);
    ellipse(40,-30,80,80);
   //Eyeballs
    push();
      let xs = map(mouseY, 0, height, -20, 10);
      fill('darkblue');
      translate(20,-20);
      ellipse(2,xs,40,40);
      translate(-40,0);
      ellipse(-2,xs,40,40);
      if(mode==1 || mode==2){
        fill(255);
        ellipse(-10,xs-4,10,10);
        ellipse(30,xs-4,10,10);
      }
    pop();

   //mouth
    if(mode==0){
      let ms = map(mouseY, 0, height, 20, 50);
      ellipse(0,60,30,ms);
    }
    if(mode==1){
      push();
        rotate(radians(-28));
        arc(-18, 45, 60, 60, 0, PI + QUARTER_PI, CHORD);
      pop();
    }
    if(mode==2){
      push();
        rotate(radians(-28));
        arc(-18, 45, 60, 60-20*sin(frameCount*0.2), 0, PI + QUARTER_PI, CHORD);
      pop();
    }
    if(mode==1 || mode==2){
      fill(lerpedColor);
      ellipse(-50,0,80,20);
      ellipse(50,0,80,20);
    }
  //Nose
    lerpedColor = lerpColor(color1, color2, cos(frameCount * 0.02) * 0.5 + 0.5)
    fill(lerpedColor);
    ellipse(-20,20,50,50);
    ellipse(20,20,50,50);
    fill('white');
    ellipse(-20,20,20,20);
    ellipse(20,20,20,20);
  pop(); 
}

function mouseDragged() {
  drawing = true;
  let particle = new Particle(mouseX, mouseY);
  particles.push(particle);
}

function mouseReleased() {
  if(btn1Click>=1){
    btn1.remove();
  } else {
    drawing = false;
    buttonAppear();
  }
}

function buttonAppear() {
  btn1 = createButton('이대로 귤룡에게 주기');
  btn1.addClass("finishBtn");
  btn1.mousePressed(particleSpread);
}

function particleSpread() {
  btn1Click += 1;
  mode = 1;
}

function windowResized(){
  resizeCanvas( windowWidth, windowHeight );
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.size = random(28, 40);
    this.angle = random(TWO_PI);
    this.amplitude = random(2, 4);
    this.wriggleFactor = random(0.1, 0.5);
    this.stopped = false;
    this.color1 = color(255, 140, 0); // 주황색
    this.color2 = color(65, 105, 225); // 파랑색
    this.lerpedColor = lerpColor(this.color1, this.color2, sin(frameCount * 0.02) * 0.5 + 0.5);
  }

  update() {
    if(!this.stopped) {
      // this.position.add(this.velocity);
      this.position.x += cos(this.angle) * this.amplitude;
      this.position.y += sin(this.angle) * this.amplitude;

      // Increment the angle for the next frame
      this.angle += 0.1;

      // Dampen the oscillation effect
      this.amplitude *= 0.98;
    }
  }

  display() {
    strokeWeight(1);
    // stroke('darkorange');
    stroke('gold');
    fill(this.lerpedColor);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }

  isOutOfScreen() {
    return (this.position.x < 0 || this.position.x > width || this.position.y < 0 || this.position.y > height);
  }
  
   wriggle() {
    this.stopped = true;
    this.size = this.size+sin(frameCount * 0.02)*0.4;
  }
  
  goOut() {
    this.position.x += 3 + sin(this.angle) * this.amplitude;
    this.position.y += -3.5 + cos(this.angle) * this.amplitude;
  }
}

class Cloud {
  constructor() {
    this.di_1 = random(100,120);
    this.dim = random(20,60);
    this.x = random(-20,width);
    // this.y = random(height*0.2, height*0.8);
    this.y = random(height+100, height);
    this.xspeed = random(0.2, 1.2);
    this.yspeed = random(0.01,0.02);
  }
  
  viz() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.di_1+30, this.di_1);
    ellipse(this.x+30, this.y+40, this.di_1+10+this.dim, this.di_1);
    ellipse(this.x-this.dim, this.y+30, this.di_1+this.dim,this.di_1);
  }
  move() {
    // this.x += 1*this.xspeed;
    // this.y = this.y+sin(frameCount*this.yspeed);
    this.y -= 1*this.xspeed;
    this.x = this.x+sin(frameCount*this.yspeed);
  }
  update() {
    // if(this.x-20-(this.di_1+10)/2 > width){
    //   this.x = 0-(this.x+20 + (this.di_1+30)/2);
    // }
    if(this.y+this.di_1+this.dim<0) this.y=height;
  }
}