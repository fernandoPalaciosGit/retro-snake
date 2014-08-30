;( function (w, d, Creature, Scene, SN){
	SN.highscoresScene.load = function (){};
	
	SN.highscoresScene.act = function (){
		if ( SN.keyPress.lastPress == SN.keyPress.KEY_ENTER ){
			SN.gameover = false;
			SN.keyPress.lastPress = null;
			SN.paused = !SN.paused;
			loadScene(SN.gameScene);
		}
	};

	SN.highscoresScene.paint = function (ctx){
		ctx.fillStyle = '#030';
		ctx.fillRect(0, 0, SN.canvas.width, SN.canvas.height);

		ctx.fillStyle = '#fff';
		ctx.textAlign='center';
		ctx.fillText('HIGH SCORES of '+SN.userScore.name, 150, 30);
		
		ctx.textAlign = 'right';
		for(var i = 0, l = SN.userScore.highscores.length; i < l ; i++){
			if( i == SN.userScore.posHighscore ){
				ctx.fillText('* '+SN.userScore.highscores[i], 180, 50+i*10);
			} else {
				ctx.fillText(SN.userScore.highscores[i]+' points.', 180, 50+i*10);
			}
		}
	};

} (window, document, Creature, Scene, SN) );