// constructor de propiedades privadas de assets
var Creature = function ( x, y, width, height, d ){
	this.w = width || 20;
	this.h = height || this.w;
	this.posX = x || (SN.canvas.width / 2) - (this.w / 2);
	this.posY = y || (SN.canvas.height / 2) - (this.h / 2);
	this.dir = d; // direccion del asset: arriba(0), dch(1), abajo(2), izq(3)
};

// conprobar colision con un asset del mismo tipo de constructor
Creature.prototype.intersects = function (rect){
	if( !!rect ){
		return(	this.posX < (rect.posX + rect.w) &&
					(this.posX + this.w) > rect.posX &&
					this.posY < (rect.posY + rect.h) &&
					(this.posY + this.h) > rect.posY	);
	}
};

// pintar el objeto con el contexto de canvas
Creature.prototype.fillImage = function (ctx, img, color){
	// comprobar que la imagen ya esta cargada por el frameset
	if( !!img.width ){
		ctx.drawImage(img, this.posX, this.posY, this.w, this.h);
	} else {
			ctx.strokeStyle = color;
			SN.ctx.strokeRect(this.posX, this.posY, this.w, this.h);
	}
};

// prototipo de escenas y asignarlas a las escenas del juego
var Scene = function (){
	this.id = SN.scenes.length;
	SN.scenes.push(this);
};

Scene.prototype.load = function (){};
Scene.prototype.act = function (){};
Scene.prototype.paint = function (ctx){};

// variables estaticas del Juego
var SN = {
	vel: 30, // velocidad del frameset de movimiento
	canvas : document.querySelector('.snakeCanvas canvas'),
	ctx: document.querySelector('.snakeCanvas canvas').getContext('2d'),
	currentScene: 0,
	scenes: [],
	snakeBody: [],	// criatura del juagdor
	// (posX, posY, w, h, dir)
	food: new Creature( 1, 1, 10, 10, null),	// criatura comida
	keyPress: {		// interaccion del usuario
		lastPress : null,
		KEY_LEFT : 37,
		KEY_UP : 38,
		KEY_RIGHT : 39,
		KEY_DOWN : 40,
		KEY_ENTER: 13
	},
	paused: null,
	score: null,
	gameover: false,
	asset: {
		snake: {
			img: new Image(),
			musicEat: new Audio(),
			musicDie: new Audio(),
			animate: function(){
				this.img.src = 'assets/body.png';
				this.musicEat.src = 'assets/chomp.oga';
				this.musicDie.src = 'assets/dies.oga';
			}
		},
		food: {
			img: new Image(),
			animate: function(){
				this.img.src = 'assets/fruit.png';
			}
		}
	}
};