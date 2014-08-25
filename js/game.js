// el navegador gestina los recursos de la animacion del asset
window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        function(callback){window.setTimeout(callback,17);};
})();

var SN = {
	canvas : document.querySelector('.snakeCanvas canvas'),
	ctx: null,
	asset: {
		posX: 0,
		posY: 0,
		w: 20,
		h: 20
	}
};

// resetear el layer cada vez que pintamos
var resetCanvas = function (c, w, h){
	c.width = w;
	c.height = h;
};

// dibujar layer de juego
var paintAsset = function (ctx){
	// dibujar background
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, SN.canvas.width, SN.canvas.height);
	// dibujar asset
	ctx.fillStyle = '#0f0';
	ctx.fillRect(SN.asset.posX, SN.asset.posY, SN.asset.w, SN.asset.h);
};

// mover la posicion del asset
var moveAsset = function (){
    SN.asset.posX += 2;
    if( SN.asset.posX > SN.canvas.width)
        SN.asset.posX = 0;
}

// animar al asset
var animateAsset = function (){
	window.requestAnimationFrame(animateAsset);
	resetCanvas(SN.canvas, 300, 150);
	moveAsset();
	paintAsset(SN.ctx);
};
	
;( function (w){
	// creamos el contexto del canvas
	SN.ctx = SN.canvas.getContext('2d');

	animateAsset();
} (window) );