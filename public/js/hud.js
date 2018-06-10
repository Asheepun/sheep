import vec, * as v 				from "/js/lib/vector.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import * as text			    from "/js/lib/text.js";

export const ammoBar = (pos) => {
	const that = traitHolder({
		pos,
	});

	that.ammo;
	that.reloadCounter;
	that.ammoCapacity;

	that.checkPlayerStatus = ({ world: { player } }) => {
		that.ammo = player.gun.ammo;
		that.reloadCounter = player.gun.reloadCounter;
		that.ammoCapacity = player.gun.ammoCapacity;
	}

	that.draw = (ctx, sprites) => {
		ctx.globalAlpha = 1;
		ctx.fillStyle = "grey";
		ctx.drawImage(sprites.ammobar, 0, 0, 205, 20);

		ctx.fillStyle = "yellow";
		for(let i = 0; i < that.ammo; i++){
			ctx.drawImage(sprites.ammo, that.pos.x + i*9, that.pos.y, 7, 10)
		}

		ctx.font = "15px game"
		if(that.reloadCounter > 0){
			ctx.fillStyle = "orange";
			ctx.fillText(Math.floor((that.reloadCounter-1)/60)+1, 189, 16)
		}else{
			ctx.fillStyle = "white";
			ctx.fillText("P", 189, 16)
		}
	}

	that.addMethods("checkPlayerStatus");

	return that;
}

export const coinCounter = (pos) => {
	const that = traitHolder();
	that.pos = pos;

	that.coins;

	that.checkStatus = ({ progress: { coins } }) => {
		that.coins = coins;
	}

	that.draw = (ctx) => {
		text.white15("$" + that.coins, that.pos.x - ("" + that.coins).length*8, that.pos.y, ctx);
	}

	that.addMethods("checkStatus");

	return that;
}

export const combo = () => {
	const that = traitHolder();

	that.pos = vec();
	that.counter = 0;
	
	that.checkStatus = ({ world: { player } }) => {
		that.pos.x = player.pos.x + 4;
		that.pos.y = player.pos.y - 5;
	}

	let countTimer = 0;
	let lastCounter = 0;

	that.count = ({ progress, audio: { play } }) => {
		countTimer--;
		if(that.counter > lastCounter) countTimer = 70;

		if(countTimer === 0){
			progress.coins += 10 * Math.pow(2, that.counter);

			for(let i = 0; i < that.counter; i++){
				setTimeout(() => play("combo1"), 70*i);
			}
			that.counter = 0;
		}

		lastCounter = that.counter;
	}

	that.draw = (ctx) => {
		if(that.counter > 0){
			ctx.fillStyle = "white";
			ctx.font = "15px game";
			ctx.fillText(that.counter, that.pos.x, that.pos.y);
		}
	}
	
	that.addMethods("checkStatus", "count");

	return that;
}
