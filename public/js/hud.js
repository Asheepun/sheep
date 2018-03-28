import vec, * as v 				from "/js/lib/vector.js";
import traitHolder, * as traits from "/js/lib/traits.js";

export const ammoBar = (pos) => {
	const that = traitHolder();
	that.pos = pos;

	that.ammo;
	that.reloadCounter;
	that.ammoCapacity;

	that.checkPlayerAmmo = ({ world: { player } }) => {
		that.ammo = player.gun.ammo;
		that.reloadCounter = player.gun.reloadCounter;
		that.ammoCapacity = player.gun.ammoCapacity;
	}

	that.draw = (ctx) => {
		ctx.fillStyle = "grey";
		ctx.fillRect(0, 0, that.ammoCapacity*9 + 25, 20)

		ctx.fillStyle = "yellow";
		for(let i = 0; i < that.ammo; i++){
			ctx.fillRect(that.pos.x + i*9, that.pos.y, 7, 10)
		}
		if(that.reloadCounter > 0){
			ctx.fillStyle = "orange";
			ctx.font = "15px Arial"
			ctx.fillText(Math.floor((that.reloadCounter-1)/60)+1, 7 + 9*that.ammoCapacity, 16)
		}
	}

	that.addMethods("checkPlayerAmmo");

	return that;
}
