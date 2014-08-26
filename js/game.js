// el navegador gestionara los recursos de la animacion del asset
window.requestAnimationFrame = ( function (w) {
    return w.requestAnimationFrame ||
        w.webkitRequestAnimationFrame ||
        w.mozRequestAnimationFrame ||
        function(callback){w.setTimeout(callback,17);};
})( window );

// variables estaticas del Juego
var SN = {
	// objeto del DOM
	canvas : document.querySelector('.snakeCanvas canvas'),
	ctx: null,
	// protagonista del Juego
	asset: {
		// posicion respecto el canvas
		posX: null,
		posY: null,
		// dimensiones del asset
		w: 20,
		h: 20,
		// direccion del asset: arriba(0), dch(1), abajo(2), izq(3)
		dir: null,
		// velocidad de direccion
		vel : 4
	},
	// interaccion del usuario
	keyPress: {
		lastPress : null,
		KEY_LEFT : 37,
		KEY_UP : 38,
		KEY_RIGHT : 39,
		KEY_DOWN : 40,
		KEY_ENTER: 13
	},
	paused: null
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
	
	// dibujar asset
	ctx.fillStyle = '#0f0';
	ctx.fillRect(SN.asset.posX, SN.asset.posY, SN.asset.w, SN.asset.h);

	ctx.fillStyle = '#fff';
	if( !!SN.paused ){
		SN.ctx.textAlign='center';
		SN.ctx.fillText( 'PAUSE', (SN.canvas.width/2), (SN.canvas.height/2) );
		SN.ctx.textAlign='left';
	} else {
		// mostrar la tecla presionada
		// ctx.fillText('Last Press: '+ SN.keyPress.lastPress, 0, 20);
		
		// mostrar direccion del asset
		ctx.fillText('Direction: '+ SN.asset.dir, 5, 20);
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
			// definir la direccoin del asset
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
	// iniciamos la posicion del asset
	SN.asset.posX = (SN.canvas.width / 2) - (SN.asset.w / 2);
	SN.asset.posY = (SN.canvas.height / 2) - (SN.asset.h / 2);
	SN.asset.dir = 1; //empezara a correr hacia la derecha
	SN.keyPress.lastPress = null;
	SN.paused = false;
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