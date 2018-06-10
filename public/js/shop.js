import * as text from "/js/lib/text.js";

const setupShop = (GAME) => {
	GAME.progress.sheep = GAME.world.sheep.length;

	GAME.world.clearAll();

	GAME.state = shop;
}

const shop = (GAME, ctx) => {
	ctx.save();
	ctx.scale(GAME.c.scale, GAME.c.scale);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, GAME.width, GAME.height);

	text.white40("Shop", 250, 50, ctx);
	text.white15("Sheep: " + GAME.progress.sheep + "/3", 250, 100, ctx);

	ctx.restore();
}

export default setupShop;
