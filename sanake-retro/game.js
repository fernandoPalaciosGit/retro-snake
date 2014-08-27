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

var Creature = function ( x, y, width, height, d ){
	this.w = width || 20;
	this.h = height || this.w;
	this.posX = x || (SN.canvas.width / 2) - (this.w / 2);
	this.posY = y || (SN.canvas.height / 2) - (this.h / 2);
	this.dir = d; // direccion del asset: arriba(0), dch(1), abajo(2), izq(3)

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
	vel: 35, // velocidad de direccion
	// ecuacion de movimiento (exponencial)
	getHeadSnakePos: function ( step ){
		return ( (SN.vel/100) + (step / 100)) + 1 ;
	}, 
	canvas : canvasGame,
	ctx: canvasGame.getContext('2d'),
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
			imgSrc: 'assets/body.png',
			musicEat: new Audio(),
			eatSrc: 'assets/chomp.oga',
			musicDie: new Audio(),
			dieSrc: 'assets/dies.oga'
		},
		food: {
			img: new Image(),
			imgSrc: 'assets/fruit.png',
		}
	}
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
	
	// dibujar cada asset del juagador (cuerpo de serpiente)
	ctx.fillStyle = '#0f0';
	for (var i = 0, len = SN.snakeBody.length; i < len; i++) {
		// SN.snakeBody[i].fill(ctx);
		SN.ctx.drawImage(SN.asset.snake.img, SN.snakeBody[i].posX, SN.snakeBody[i].posY);
	};

	//dibujar asset de comida
	ctx.fillStyle='#999';
	// SN.food.fill(ctx);
	SN.ctx.drawImage(SN.asset.food.img, SN.food.posX, SN.food.posY);

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
		// ctx.fillText('Direction: '+ SN.snakeBody.dir, 5, 20); /*direccion del asset*/
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
			
		// CHECK GAMEOVER (reset game variables)
		if( SN.gameover ){
			SN.gameover = true;
			initGameVar();
		} else {

			// CHANGE DIRECTION (depending on SN.keyPress.lastPress head-snake)
			// colisiones con el cuerpo: NO CAMBIAR A DIRECCION A LA OPUESTA
			if(	SN.keyPress.lastPress == SN.keyPress.KEY_UP
					&& SN.snakeBody[0].dir !== 2){
				SN.snakeBody[0].dir = 0;
			} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_RIGHT
							&& SN.snakeBody[0].dir !== 3){
				SN.snakeBody[0].dir = 1;
			} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_DOWN
							&& SN.snakeBody[0].dir !== 0){
				SN.snakeBody[0].dir = 2;
			} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_LEFT
							&& SN.snakeBody[0].dir !== 1){
				SN.snakeBody[0].dir = 3;
			}

			// MOVE SNAKE-HEAD (depending on SN.snakeBody.dir)
			if( SN.snakeBody[0].dir == 0){
				SN.snakeBody[0].posY -= SN.getHeadSnakePos(SN.snakeBody[0].posY);

			} else if ( SN.snakeBody[0].dir == 1){1
				SN.snakeBody[0].posX += SN.getHeadSnakePos(SN.snakeBody[0].posX);

			} else if ( SN.snakeBody[0].dir == 2){
				SN.snakeBody[0].posY += SN.getHeadSnakePos(SN.snakeBody[0].posY);

			} else if ( SN.snakeBody[0].dir == 3){
				SN.snakeBody[0].posX -= SN.getHeadSnakePos(SN.snakeBody[0].posX);
			}

			// MOVE SNAKE-BODY ( don´t move the first asset; that´s the head)
			/* Movemos los assets desde el ultimo hasta el antertior a la cabeza de serpiente, 
				Efecto de oruga -> la cola va “empujando” al resto del cuerpo, asi evitamos la colision de la cabeza lcon el cuerpo*/
			for (var i = SN.snakeBody.length - 1; i > 0; i--) {
				SN.snakeBody[i].posX = SN.snakeBody[i - 1].posX;
				SN.snakeBody[i].posY = SN.snakeBody[i - 1].posY;
				// la cabeza es la unica que cambia de posicion con respecto a la velocidad;
				// cuando alcanzemos el ultimo de los assets, e anterior a la cabeza, este recuperara la posicion anterior de la cabeza
			};

			// SNAKE-HEAD OUT HORIZONTAL SCREEN
			if( (SN.snakeBody[0].posX + SN.snakeBody[0].w) > SN.canvas.width){
				SN.snakeBody[0].posX = 0;
			} else if ( SN.snakeBody[0].posX < 0 ){
				SN.snakeBody[0].posX = (SN.canvas.width - SN.snakeBody[0].w);
			}

			// // SNAKE-HEAD OUT VERTICAL SCREEN
			if( (SN.snakeBody[0].posY + SN.snakeBody[0].h) > SN.canvas.height){
				SN.snakeBody[0].posY = 0;
			} else if ( SN.snakeBody[0].posY < 0 ){
				SN.snakeBody[0].posY = (SN.canvas.height - SN.snakeBody[0].h);
			}

			// SNAKE-HEAD COLLISIONS SNAKE-BODY (gameover)
			// empezamos a comprovar las colisiones por delante de la cabeza
			// cabeza[1], cuello[1], cuerpo[2...], no comprobamos la interseccion de la cabeza con el cuello por colisiones continuas
			for (var i = 20, len = SN.snakeBody.length; i < len; i++) {
			    if( SN.snakeBody[0].intersects(SN.snakeBody[i]) ){
			    	SN.gameover = true;
			    	SN.asset.snake.musicDie.play();
			    }
			};

			// SNAKE-HEAD COLLISIONS FOOD (score + new snake-body + new food)
			if( SN.snakeBody[0].intersects( SN.food ) ){
				SN.score++;
				SN.snakeBody.push( new Creature( SN.food.posX, SN.food.posY, 15, 10, 1) );
				SN.asset.snake.musicEat.play();
				SN.food.posX = randomPosition( SN.canvas.width/10-1 )*10;
				SN.food.posY = randomPosition( SN.canvas.height/10-1 )*10;
			}
		}

	}
};

// recuperamos la tecla de interaccion del usuario
var saveUserKey = function (evClick) {
	SN.keyPress.lastPress = evClick.keyCode;
};

// FRAMESET (animar al asset )
var animateAsset = function (){
	window.requestAnimationFrame(animateAsset);
	resetCanvas(SN.canvas, 300, 150);
	moveAsset();
	paintAsset(SN.ctx);
};

// iniciar parametros del Juego
var initGameVar = function (){
	// resetear el cuerpo de la serpiente
	SN.snakeBody.length = 0;
	// alinear tres partes del cuerpo de serpiente
	SN.snakeBody.push( 
		new Creature( null, null, 15, 10, 1 ) );
	
	// resetar la posicion de la comida
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
	// musica de Juego
	SN.asset.snake.img.src = SN.asset.snake.imgSrc;
	SN.asset.food.img.src = SN.asset.food.imgSrc;
	SN.asset.snake.musicEat.src = SN.asset.snake.eatSrc;
	SN.asset.snake.musicDie.src = SN.asset.snake.dieSrc;

	// inicializar variables del Juego
	initGameVar();
	// al inicializar el juego estara pausado
	animateAsset();
} (window, document) );