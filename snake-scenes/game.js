;( function (w, d, Creature, Scene, SN){

	// inicializar el Juego, despues de que se cargue la jerarquia del DOM
	d.addEventListener('DOMContentLoaded', function(){
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

		//inicializar escenas de juego
		SN.mainScene = new Scene();
		SN.gameScene = new Scene();

		// inicializar variables del Juego
		// al inicializar o resetear el juego estara pausado y sin movimientos previos
		initGameVar();

		// inicializar FRAMESETS del Juego
		framePaintAsset();
		frameMoveAsset();
	}, false);
	
	// el navegador gestionara los recursos de la animacion del asset
	var requestAnimationFrame = 
			w.requestAnimationFrame ||
			w.webkitRequestAnimationFrame ||
			w.mozRequestAnimationFrame ||
			function(callback){ w.setTimeout(callback,17); };

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
		for (var i = 0, len = SN.asset.snake.body.length; i < len; i++) {
			SN.asset.snake.body[i].fillImage(ctx, SN.asset.snake.img, '#0f0');
		}

		//dibujar asset de comida
		SN.asset.food.apple.fillImage(ctx, SN.asset.food.img, '#f00');

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
				for (var i = SN.asset.snake.body.length - 1; i > 0; i--) {
					SN.asset.snake.body[i].posX = SN.asset.snake.body[i - 1].posX;
					SN.asset.snake.body[i].posY = SN.asset.snake.body[i - 1].posY;
					// la cabeza es la unica que cambia de posicion con respecto a la velocidad;
					// cuando alcanzemos el ultimo de los assets, e anterior a la cabeza, este recuperara la posicion anterior de la cabeza
				}

				// CHANGE DIRECTION (depending on SN.keyPress.lastPress head-snake)
				// colisiones con el cuerpo: NO CAMBIAR A DIRECCION A LA OPUESTA
				if(	SN.keyPress.lastPress == SN.keyPress.KEY_UP &&
						SN.asset.snake.body[0].dir !== 2){
								SN.asset.snake.body[0].dir = 0;
				} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_RIGHT &&
								SN.asset.snake.body[0].dir !== 3){
					SN.asset.snake.body[0].dir = 1;
				} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_DOWN &&
								SN.asset.snake.body[0].dir !== 0){
					SN.asset.snake.body[0].dir = 2;
				} else if ( SN.keyPress.lastPress == SN.keyPress.KEY_LEFT &&
								SN.asset.snake.body[0].dir !== 1){
					SN.asset.snake.body[0].dir = 3;
				}

				// MOVE SNAKE-HEAD (depending on SN.asset.snake.body.dir)
				if( SN.asset.snake.body[0].dir == 0){
					SN.asset.snake.body[0].posY -= SN.asset.snake.body[0].h;
				} else if ( SN.asset.snake.body[0].dir == 1){1
					SN.asset.snake.body[0].posX += SN.asset.snake.body[0].w;
				} else if ( SN.asset.snake.body[0].dir == 2){
					SN.asset.snake.body[0].posY += SN.asset.snake.body[0].h;
				} else if ( SN.asset.snake.body[0].dir == 3){
					SN.asset.snake.body[0].posX -= SN.asset.snake.body[0].w;
				}
				
				// SNAKE-HEAD OUT HORIZONTAL SCREEN
				if( (SN.asset.snake.body[0].posX + SN.asset.snake.body[0].w) > SN.canvas.width){
					SN.asset.snake.body[0].posX = 0;
				} else if ( SN.asset.snake.body[0].posX < 0 ){
					SN.asset.snake.body[0].posX = (SN.canvas.width - SN.asset.snake.body[0].w);
				}

				// // SNAKE-HEAD OUT VERTICAL SCREEN
				if( (SN.asset.snake.body[0].posY + SN.asset.snake.body[0].h) > SN.canvas.height){
					SN.asset.snake.body[0].posY = 0;
				} else if ( SN.asset.snake.body[0].posY < 0 ){
					SN.asset.snake.body[0].posY = (SN.canvas.height - SN.asset.snake.body[0].h);
				}

				// SNAKE-HEAD COLLISIONS SNAKE-BODY (gameover)
				// empezamos a comprovar las colisiones por delante de la cabeza
				// cabeza[1], cuello[1], cuerpo[2...], no comprobamos la interseccion de la cabeza con el cuello por colisiones continuas
				for (var j = 5, len = SN.asset.snake.body.length; j < len; j++) {
					if( SN.asset.snake.body[0].intersects(SN.asset.snake.body[j]) ){
						SN.gameover = true;
						SN.asset.snake.musicDie.play();
					}
				}

				// SNAKE-HEAD COLLISIONS FOOD (score + new snake-body + new food)
				if( SN.asset.snake.body[0].intersects( SN.asset.food.apple ) ){
					SN.score++;
					SN.asset.snake.body.push( new Creature( SN.asset.food.apple.posX, SN.asset.food.apple.posY, 10, 10, 1) );
					SN.asset.snake.musicEat.play();
					SN.asset.food.apple.posX = randomPosition( SN.canvas.width/10-1 )*10;
					SN.asset.food.apple.posY = randomPosition( SN.canvas.height/10-1 )*10;
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
		requestAnimationFrame(framePaintAsset);
		SN.scenes[ SN.currentScene ].paint(SN.ctx);
		resetCanvas(SN.canvas, 500, 300);
		paintAsset(SN.ctx);
	};

	// FRAMESET ( mover los asset )
	var frameMoveAsset = function (){
		w.setTimeout(frameMoveAsset, SN.vel);
		SN.scenes[ SN.currentScene ].act();
		moveAsset();
	};

	// iniciar parametros del Juego
	var initGameVar = function (){
		// resetear el cuerpo de la serpiente, y crear su cabeza
		SN.asset.snake.body.length = 0;
		SN.asset.snake.body.push( new Creature( null, null, 10, 10, 1 ) );
		
		// resetar la posicion de la comida
		SN.asset.food.apple.posX = randomPosition( SN.canvas.width/10-1 )*10;
	   SN.asset.food.apple.posY = randomPosition( SN.canvas.height/10-1 )*10;

		// resetear variables del juego
		SN.paused = true;
		SN.keyPress.lastPress = null;
		SN.score = 0;
	};
} (window, document, Creature, Scene, SN) );