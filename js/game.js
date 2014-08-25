var SN = {
	canvas : document.querySelector('.snakeCanvas canvas'),
	ctx: null,
	asset: {
		posX: 0,
		posY: 0,
		w: 50,
		h: 50
	},
	assetX: 50,
	assetY: 50
};

// resetear el layer cada vez que pintamos
var resetCanvas = function (c, w, h){
	c.width = w;
	c.height = h;
};

// dibujar layer de juego
var paintRect = function (ctx){
	resetCanvas(SN.canvas, 300, 150);
	// dibujar background
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, SN.canvas.width, SN.canvas.height);
	// dibujar asset
	ctx.fillStyle = '#0f0';
	ctx.fillRect(SN.asset.posX, SN.asset.posY, SN.asset.w, SN.asset.h);
};

;( function (w){
	// creamos el contexto del canvas
	SN.ctx = SN.canvas.getContext('2d');

	paintRect(SN.ctx);
} (window) );