// inicializar el Juego, despues de que se cargue la jerarquia del DOM
document.addEventListener('DOMContentLoaded', function(){

	// recupear datos de Jugador
	if( !!localStorage.name ){
		playGame();
	} else {
		document.querySelector('.snakePlayer input[type="button"]').
			addEventListener('click', function(evClick){
				var userName = document.getElementById('snakePlayerName').value;
				if( userName !== "" ){
					SN.userScore.setUser(userName);
					playGame();
				} else { window.alert('Pon tu nombre para recordar tu puntuacion!!!'); }
			}, false);
	}

}, false);

var playGame = function(){
	document.querySelector('.snakePlayer').classList.toggle('hidenLayer');
	document.querySelector('.snakeCanvas').classList.toggle('hidenLayer');

	// captuarar la interaccion del usuario
	document.addEventListener('keydown', saveUserKey, false);
	
	// inicializar la animacion de los assets del juego
	SN.asset.snake.animate();
	SN.asset.food.animate();

	// acpturar la velocidad con slider
	var speed = document.querySelector('#speedGame');
	speed.value = speed.max - SN.vel;
	speed.addEventListener('change', function (evChange){
		SN.vel = this.max - this.value;
		this.blur(); //perder el foco para continuar jugando
	}, false);

	// inicializar FRAMESETS del Juego
	framePaintAsset();
	frameMoveAsset();
};

// el navegador gestionara los recursos de la animacion del asset
var	requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){ window.setTimeout(callback,17); };

// recuperamos la tecla de interaccion del usuario
var saveUserKey = function (evClick) {
	SN.keyPress.lastPress = evClick.keyCode;
};

// FRAMESET ( dibujar los asset )
var framePaintAsset = function (){
	requestAnimFrame(framePaintAsset);
	resetCanvas(SN.canvas, 500, 300);
	Scene.addScenes[ Scene.currentScene ].paint(SN.ctx); //SN.mainScene
};

// FRAMESET ( mover los asset )
var frameMoveAsset = function (){
	window.setTimeout(frameMoveAsset, SN.vel);
	Scene.addScenes[ Scene.currentScene ].act(); //SN.mainScene
};

var randomPosition = function (max){
	return Math.floor(Math.random()*max);
};

// resetear el layer cada vez que pintamos
var resetCanvas = function (c, w, h){
	c.width = w;
	c.height = h;
};

var loadScene = function (sn){
	Scene.currentScene = sn.id;
	// al inicializar o resetear el juego estara pausado y sin movimientos previos
	Scene.addScenes[ Scene.currentScene ].load(); // sn.load()
};