;( function (w, d, Creature, Scene, SN){
	// iniciar parametros del Juego
	SN.gameScene.load = function (){
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

	// mover la posicion del asset
	SN.gameScene.act = function (){
		if ( SN.keyPress.lastPress == SN.keyPress.KEY_ENTER ){
			SN.paused = !SN.paused;
			SN.keyPress.lastPress = null;
		}

		if( !SN.paused ){

			// CHECK GAMEOVER (reset game variables)
			if( SN.gameover ){
				//ahora la actividad que se ejecutara sera la de gameScene
				// loadScene(SN.mainScene);
				loadScene(SN.highscoresScene);
			} else {
				// MOVE SNAKE-BODY ( don´t move the first asset; that´s the head)
				for (var i = SN.asset.snake.body.length - 1; i > 0; i--) {
					SN.asset.snake.body[i].posX = SN.asset.snake.body[i - 1].posX;
					SN.asset.snake.body[i].posY = SN.asset.snake.body[i - 1].posY;
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
						SN.userScore.setHighscores(SN.score);
					}
				}

				// SNAKE-HEAD COLLISIONS FOOD (score + new snake-body + new food)
				if( SN.asset.snake.body[0].intersects( SN.asset.food.apple ) ){
					SN.score++;
					SN.asset.snake.body.push(
						new Creature(
							SN.asset.food.apple.posX, SN.asset.food.apple.posY, 10, 10, 1) );
					SN.asset.snake.body.push(
						new Creature(
							SN.asset.food.apple.posX*2, SN.asset.food.apple.posY*2, 10, 10, 1) );
					SN.asset.snake.musicEat.play();
					SN.asset.food.apple.posX = randomPosition( SN.canvas.width/10-1 )*10;
					SN.asset.food.apple.posY = randomPosition( SN.canvas.height/10-1 )*10;
				}
			}

		}
	};

	// dibujar layer de juego y asset
	SN.gameScene.paint = function (ctx){
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
			SN.ctx.fillText( 'PAUSE', (SN.canvas.width/2), (SN.canvas.height/2) );
		} else {
			SN.ctx.textAlign = 'left';
			ctx.fillText('Score: '+ SN.score, 5, 20); /*puntuacion*/
		}
	};

} (window, document, Creature, Scene, SN) );