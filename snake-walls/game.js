// el objeto canvas lo necesitamos en mucho lugares inaccesibles
var canvasGame = document.querySelector('.snakeCanvas canvas');

// el navegador gestionara los recursos de la animacion del asset
window.requestAnimationFrame = ( function (w) {
    return w.requestAnimationFrame ||
        w.webkitRequestAnimationFrame ||
        w.mozRequestAnimationFrame ||
        function(callback){w.setTimeout(callback,17);};
})( window );

var randomPosition = function (max){
    return Math.floor(Math.random()*max);
};

var Creature = function ( x, y, width, height, d, v ){
	this.w = width || 20;
	this.h = height || this.w;
	this.posX = x || (SN.canvas.width / 2) - (this.w / 2);
	this.posY = y || (SN.canvas.height / 2) - (this.h / 2);
	this.dir = d; // direccion del asset: arriba(0), dch(1), abajo(2), izq(3)
	this.vel = v; // velocidad de direccion

	// conprobar colision con un asset del mismo tipo de constructor
	this.intersects = function (rect){
		if( !!rect ){
			return(	this.posX < (rect.posX + rect.w) &&
						(this.posX + this.w) > rect.posX &&
						this.posY < (rect.posY + rect.h) &&
						(this.posY + this.h) > rect.posY	);
		}1
	};

	// pintar el objeto con el contexto de canvas
	this.fill = function (ctx){
		if( !!ctx ){
			ctx.fillRect( this.posX, this.posY, this.w, this.h);
		}
	};
};

// variables estaticas del Juego
var SN = {
	canvas : canvasGame,
	ctx: canvasGame.getContext('2d'),
	// (posX, posY, w, h, dir, vel)
	asset: null,	// criatura del juagdor
	food: new Creature( 1, 1, 10, 10, null , null),		// criatura comida
	enemy: [ // criatura enemiga
		new Creature(100, 50, 10, 10, null , null),
		new Creature(100, 100, 10, 10, null , null),
		new Creature(200, 50, 10, 10, null , null),
		new Creature(200, 100, 10, 10, null , null),
	],
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
	gameover: false
};

// resetear el layer cada vez que pintamos
var resetCanvas = function (c, w, h){
	c.width = w;
	c.height = h;
};

// dibujar layer de juego y asset
var paintAsset = function (ctx){
	// dibujar background
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, SN.canvas.width, SN.canvas.height);
	
	// dibujar asset de juagador
	ctx.fillStyle = '#0f0';
	SN.asset.fill(ctx);

	//dibujar asset de comida
	ctx.fillStyle='#999';
	SN.food.fill(ctx);

	// dibujar asset de enemigos
	ctx.fillStyle='#f00';
	for (var i = 0, len = SN.enemy.length; i < len; i++) {
		SN.enemy[i].fill(ctx);
	};

	ctx.fillStyle = '#fff';
	if( !!SN.paused ){
		SN.ctx.textAlign = 'center';
		if( !!SN.gameover ){
			ctx.fillStyle='#f00';
			SN.ctx.fillText( 'GAME OVER', (SN.canvas.width/2), (SN.canvas.height/2) );
		}else{
			SN.ctx.fillText( 'PAUSE', (SN.canvas.width/2), (SN.canvas.height/2) );
		}
	} else {
		SN.ctx.textAlign = 'left';
		// ctx.fillText('Last Press: '+ SN.keyPress.lastPress, 0, 20); /*tecla presionada*/
		// ctx.fillText('Direction: '+ SN.asset.dir, 5, 20); /*direccion del asset*/
		ctx.fillText('Score: '+ SN.score, 5, 20); /*puntuacion*/
	}
};

// mover la posicion del asset
var moveAsset = function (){
	// MOVIMIENTO PAUSADO
	if ( SN.keyPress.lastPress == SN.keyPress.KEY_ENTER ){
		SN.gameover = false;
		SN.keyPress.lastPress = null; // anulamos la interaccion pero mantenemos la direcion (dir)
		SN.paused = !SN.paused; // invertimos la pausa cada vez que presionamos
	}

	// MOVIMIENTO NO PAUSADO
	if( !SN.paused ){
		// comprobar si hemos perdido
		if( SN.gameover ){
			// resetear variables del juego
			SN.gameover = true;
			initGameVar();
		}

		// definir la direccin del asset
		if( SN.keyPress.lastPress == SN.keyPress.KEY_UP){
			SN.asset.dir = 0;
		} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_RIGHT ){
			SN.asset.dir = 1;
		} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_DOWN ){
			SN.asset.dir = 2;
		} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_LEFT ){
			SN.asset.dir = 3;
		}

		// mover el asset dependiendo de la direccion
		if( SN.asset.dir == 0){
			SN.asset.posY -= SN.asset.vel;
		} else if ( SN.asset.dir == 1){
			SN.asset.posX += SN.asset.vel;
		} else if ( SN.asset.dir == 2){
			SN.asset.posY += SN.asset.vel;
		} else if ( SN.asset.dir == 3){
			SN.asset.posX -= SN.asset.vel;
		}

		// limitar el linde de movimiento horizontal
		if( (SN.asset.posX + SN.asset.w) > SN.canvas.width){
			SN.asset.posX = 0;
		} else if ( SN.asset.posX < 0 ){
			SN.asset.posX = (SN.canvas.width - SN.asset.w);
		}

		// limitar el linde de movimiento verticalmente
		if( (SN.asset.posY + SN.asset.h) > SN.canvas.height){
			SN.asset.posY = 0;
		} else if ( SN.asset.posY < 0 ){
			SN.asset.posY = (SN.canvas.height - SN.asset.h);
		}

		/* Comprobamos la colision con la comida
			score y cambiar la posicion de la comida */
		if( SN.asset.intersects( SN.food ) ){
			SN.score++;
			SN.food.posX = randomPosition( SN.canvas.width/10-1 )*10;
			SN.food.posY = randomPosition( SN.canvas.height/10-1 )*10;
		}

		// comprobar la intersecion con los enemigos
		for (var i = 0, len = SN.enemy.length; i < len; i++) {
			if( SN.food.intersects( SN.enemy[i] ) ){
				SN.food.posX = randomPosition( SN.canvas.width/10-1 )*10;
				SN.food.posY = randomPosition( SN.canvas.height/10-1 )*10;
			}

			// si colisionamos con algun muro, posteriormente reiniciaremos las variables
			if( SN.asset.intersects( SN.enemy[i] ) ){
				SN.gameover = true;
			}

		};

	}
};

// recuperamos la tecla de interaccion del usuario
var saveUserKey = function (evClick) {
	SN.keyPress.lastPress = evClick.keyCode;
};

// animar al asset
var animateAsset = function (){
	window.requestAnimationFrame(animateAsset);
	resetCanvas(SN.canvas, 500, 300);
	moveAsset();
	paintAsset(SN.ctx);
};

// iniciar parametros del Juego
var initGameVar = function (){
	// resetar la posicion de la comida y del asset
	SN.asset = new Creature( null, null, 15, 15, 1, 4);
	SN.food.posX = randomPosition( SN.canvas.width/10-1 )*10;
   SN.food.posY = randomPosition( SN.canvas.height/10-1 )*10;

	// resetear variables del juego
	SN.paused = true;
	SN.keyPress.lastPress = null;
	SN.score = 0;
};

// inicializar el Juego
;( function (w, d){
	d.addEventListener('keydown', saveUserKey, false);
	// inicializar variables del Juego
	initGameVar();
	// al inicializar el juego estara pausado
	animateAsset();
} (window, document) );