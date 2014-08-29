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

// resetear el layer cada vez que pintamos
var resetCanvas = function (c, w, h){
	c.width = w;
	c.height = h;
};

var loadScene = function (sn){
	SN.currentScene = sn.id;
	SN.scenes[ SN.currentScene ].load(); // sn.load()
};

// dibujar layer de juego y asset
var paintAsset = function (ctx){
	// dibujar background
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, SN.canvas.width, SN.canvas.height);
	
	// dibujar cada asset del juagador (cuerpo de serpiente)
	for (var i = 0, len = SN.snakeBody.length; i < len; i++) {
		SN.snakeBody[i].fillImage(ctx, SN.asset.snake.img, '#0f0');
	}

	//dibujar asset de comida
	SN.food.fillImage(ctx, SN.asset.food.img, '#f00');

	// mostrar el estado del Juego
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
			// MOVE SNAKE-BODY ( don´t move the first asset; that´s the head)
			/* Movemos los assets desde el ultimo hasta el antertior a la cabeza de serpiente, 
				Efecto de oruga -> la cola va “empujando” al resto del cuerpo, asi evitamos la colision de la cabeza lcon el cuerpo*/
			for (var i = SN.snakeBody.length - 1; i > 0; i--) {
				SN.snakeBody[i].posX = SN.snakeBody[i - 1].posX;
				SN.snakeBody[i].posY = SN.snakeBody[i - 1].posY;
				// la cabeza es la unica que cambia de posicion con respecto a la velocidad;
				// cuando alcanzemos el ultimo de los assets, e anterior a la cabeza, este recuperara la posicion anterior de la cabeza
			}

			// CHANGE DIRECTION (depending on SN.keyPress.lastPress head-snake)
			// colisiones con el cuerpo: NO CAMBIAR A DIRECCION A LA OPUESTA
			if(	SN.keyPress.lastPress == SN.keyPress.KEY_UP &&
					SN.snakeBody[0].dir !== 2){
				SN.snakeBody[0].dir = 0;
			} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_RIGHT &&
							SN.snakeBody[0].dir !== 3){
				SN.snakeBody[0].dir = 1;
			} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_DOWN &&
							SN.snakeBody[0].dir !== 0){
				SN.snakeBody[0].dir = 2;
			} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_LEFT &&
							SN.snakeBody[0].dir !== 1){
				SN.snakeBody[0].dir = 3;
			}

			// MOVE SNAKE-HEAD (depending on SN.snakeBody.dir)
			if( SN.snakeBody[0].dir == 0){
				SN.snakeBody[0].posY -= SN.snakeBody[0].h;
			} else if ( SN.snakeBody[0].dir == 1){1
				SN.snakeBody[0].posX += SN.snakeBody[0].w;
			} else if ( SN.snakeBody[0].dir == 2){
				SN.snakeBody[0].posY += SN.snakeBody[0].h;
			} else if ( SN.snakeBody[0].dir == 3){
				SN.snakeBody[0].posX -= SN.snakeBody[0].w;
			}
			
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
			for (var j = 5, len = SN.snakeBody.length; j < len; j++) {
				if( SN.snakeBody[0].intersects(SN.snakeBody[j]) ){
					SN.gameover = true;
					SN.asset.snake.musicDie.play();
				}
			}

			// SNAKE-HEAD COLLISIONS FOOD (score + new snake-body + new food)
			if( SN.snakeBody[0].intersects( SN.food ) ){
				SN.score++;
				SN.snakeBody.push( new Creature( SN.food.posX, SN.food.posY, 10, 10, 1) );
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

// FRAMESET ( dibujar los asset )
var framePaintAsset = function (){
	window.requestAnimationFrame(framePaintAsset);
	resetCanvas(SN.canvas, 500, 300);
	paintAsset(SN.ctx);
};

// FRAMESET ( mover los asset )
var frameMoveAsset = function (){
	window.setTimeout(frameMoveAsset, SN.vel);
	moveAsset();
};

// iniciar parametros del Juego
var initGameVar = function (){
	// resetear el cuerpo de la serpiente
	SN.snakeBody.length = 0;
	// alinear tres partes del cuerpo de serpiente
	SN.snakeBody.push( new Creature( null, null, 10, 10, 1 ) );
	
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
	// captuarar la interaccion del usuario
	d.addEventListener('keydown', saveUserKey, false);
	
	// inicializar la animacion de los assets del juego
	SN.asset.snake.animate();
	SN.asset.food.animate();

	// acpturar la velocidad con slider
	var speed = d.querySelector('#speedGame');
	speed.value = speed.max - SN.vel;
	speed.addEventListener('change', function (evChange){
		SN.vel = this.max - this.value;
		this.blur(); //perder el foco para continuar jugando
	}, false);


	// inicializar variables del Juego
	// al inicializar o resetear el juego estara pausado y sin movimientos previos
	initGameVar();

	// inicializar FRAMESETS del Juego
	framePaintAsset();
	frameMoveAsset();
} (window, document) );