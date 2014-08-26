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
		}
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
	canvas : document.querySelector('.snakeCanvas canvas'),
	ctx: null,
	asset: null,	// criatura del juagdor
	enemy: [],		// criatura enemiga
	keyPress: {		// interaccion del usuario
		lastPress : null,
		KEY_LEFT : 37,
		KEY_UP : 38,
		KEY_RIGHT : 39,
		KEY_DOWN : 40,
		KEY_ENTER: 13
	},
	paused: null,
	score: null
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
	
	// dibujar assets
	ctx.fillStyle = '#0f0';
	SN.asset.fill(ctx);
	ctx.fillStyle='#f00';
   SN.enemy[0].fill(ctx);

	ctx.fillStyle = '#fff';
	if( !!SN.paused ){
		SN.ctx.textAlign='center';
		SN.ctx.fillText( 'PAUSE', (SN.canvas.width/2), (SN.canvas.height/2) );
		SN.ctx.textAlign='left';
	} else {
		// mostrar la tecla presionada
		// ctx.fillText('Last Press: '+ SN.keyPress.lastPress, 0, 20);
		
		// mostrar direccion del asset
		// ctx.fillText('Direction: '+ SN.asset.dir, 5, 20);

		//mostrar puntuacion
		ctx.fillText('Score: '+ SN.score, 5, 20);
	}
};

// mover la posicion del asset
var moveAsset = function (){
	// MOVIMIENTO PAUSADO
	if ( SN.keyPress.lastPress == SN.keyPress.KEY_ENTER ){
		SN.keyPress.lastPress = null; // anulamos la interaccion pero mantenemos la direcion (dir)
		SN.paused = !SN.paused; // invertimos la pausa cada vez que presionamos
	}

	// MOVIMIENTO NO PAUSADO
	if( !SN.paused ){
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

		// Comprobamos la interseccion de los assrts, score y cambiar la posicion de la comida
		if( SN.asset.intersects( SN.enemy[0] ) ){
			SN.score++;
			SN.enemy[0].posX = randomPosition( SN.canvas.width/10-1 )*10;
			SN.enemy[0].posY = randomPosition( SN.canvas.height/10-1 )*10;
		}
	}
};

// recuperamos la tecla de interaccion del usuario
var saveUserKey = function (evClick) {
	SN.keyPress.lastPress = evClick.keyCode;
};

// animar al asset
var animateAsset = function (){
	window.requestAnimationFrame(animateAsset);
	resetCanvas(SN.canvas, 300, 150);
	moveAsset();
	paintAsset(SN.ctx);
};

// iniciar parametros del Juego
var initGameVar = function (){
	// creamos el contexto del canvas
	SN.ctx = SN.canvas.getContext('2d');

	// iniciamos asset de juagador y enemigo (posX, posY, w, h, dir, vel)
	SN.asset = new Creature( null, null, 15, 15, 1, 4);
	SN.enemy.push( new Creature( 40, 40, 15, 15, null , null) );

	// resetear variables del juego
	SN.keyPress.lastPress = null;
	SN.paused = false;
	SN.score = 0;
};

// inicializar el Juego cuando cargue el http	
;( function (w, d){
	d.addEventListener('keydown', saveUserKey, false);

	//inicializar variables
	initGameVar();

	// inicializar Juego
	d.querySelector('.btnStartGame button')
		.addEventListener('click', function (evClick){
			this.disabled = true;
			this.querySelector('.played').classList.toggle('show');
			this.querySelector('.paused').classList.toggle('show');
			animateAsset();
		}, false);
} (window, document) );