///////////////////////////
// CONSTRUCTOR DE ASSETS //
///////////////////////////

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

/////////////////////////
// CONSTRUCTOR ESCENAS //
/////////////////////////

var Scene = function (){
	this.id = this.constructor.addScenes.length;
	this.constructor.addScenes.push(this);
};

// Propiedades estaticas de constructor (this.contructor)
Scene.addScenes = [];
Scene.currentScene = 0;

// propiedades publicas de instancias (implementacion particular de cada escena)
Scene.prototype.act = function (){};
Scene.prototype.paint = function (ctx){};
Scene.prototype.load = function (){};


///////////////////////
// CONSTRUCTOR SCORE //
///////////////////////

var Score = function (){
	this.highscores = ( !!localStorage.highscores ) ?
							localStorage.highscores.split(',') : []; //best scores
	this.name = ( !!localStorage.name ) ?
					localStorage.name : '';
	this.posHighscore = 10;
	this.setUser = function (n){
		this.name = n;
		localStorage.name = n;
	};
};

//set score when game over
Score.prototype.setHighscores = function (score){
	this.posHighscore = 0;
	//calcular la posicion dentro de nuestra lista de puntajes
	while(	this.highscores[this.posHighscore] > score
				&& this.posHighscore < this.highscores.length ){
		this.posHighscore++;
	}
	//añadir nuestro score al array
	this.highscores.splice( this.posHighscore, 0, score);
	//limitamos nuestra lista a diez elementos
	if ( this.highscores.length > 10 ){
		this.highscores.length = 10;
	}
	// almacenarlo en localstorage (string)
	localStorage.highscores = this.highscores.join(',');
};

////////////////////////
// VARIABLES GLOBALES //
////////////////////////

var SN = {
	// LIENZO del Juego
	canvas : document.querySelector('.snakeCanvas canvas'),
	ctx: document.querySelector('.snakeCanvas canvas').getContext('2d'),
	scenes: [],
	mainScene: new Scene(),
   gameScene: new Scene(),
   highscoresScene: new Scene(),
   userScore: new Score(),
	// ASSETS del Juego (posX, posY, w, h, dir)
	asset: {
		snake: {
			body: [],
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
			apple: new Creature( 1, 1, 10, 10, null),
			img: new Image(),
			animate: function(){
				this.img.src = 'assets/fruit.png';
			}
		}
	},
	// parametros globales de Juego
	vel: 30, // velocidad del frameset de movimiento
	keyPress: {
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
};