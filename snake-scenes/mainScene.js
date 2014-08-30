;( function (w, d, Creature, Scene, SN){
	SN.mainScene.load = function (){};
	
	SN.mainScene.act = function (){
		if ( SN.keyPress.lastPress == SN.keyPress.KEY_ENTER ){
			SN.gameover = false;
			SN.keyPress.lastPress = null; // anulamos la interaccion pero mantenemos la direcion (dir)
			SN.paused = !SN.paused; // invertimos la pausa cada vez que presionamos
			//ahora la actividad que se ejecutara sera la de gameScene
			loadScene(SN.highscoresScene);
		}
	};
	
	SN.mainScene.paint = function(ctx){
		ctx.fillStyle='#030';
		ctx.fillRect(0, 0, SN.canvas.width, SN.canvas.height);

		ctx.fillStyle = '#fff';
		ctx.fillText('THE RETRO SNAKE', 150, 60);
		ctx.fillText('Press Enter to Start',150,90);

		ctx.textAlign = 'center';
		if( !!SN.gameover ){
			ctx.fillStyle = '#f00';
			SN.ctx.fillText( 'GAME OVER', (SN.canvas.width/2), (SN.canvas.height/2) );
		} else {
			ctx.fillStyle = '#fff';
			SN.ctx.fillText( '¡¡¡ COME ON !!!', (SN.canvas.width/2), (SN.canvas.height/2) );
		}
	};
	
} (window, document, Creature, Scene, SN) );