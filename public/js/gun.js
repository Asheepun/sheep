import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import bullet					from "/js/bullet.js";

const gun = ({ pos, size, shotDelay, reloadTime, ammoCapacity, bulletSpec, sound }) => {
	const that = traitHolder({
		shotDelay,
		reloadTime,
		ammoCapacity,
		bulletSpec,
		sound,
	});
	
	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		color: "grey",
	})(that);

	that.reloading = false;
	that.shooting = false;
	that.ammo = that.ammoCapacity;
	let bulletPos;
	let bulletVel;

	that.shoot = (holder, add, audio) => {
		if(!that.reloading && !that.shooting){
			that.shooting = true;
			that.shotDelayCounter = that.shotDelay;
			
			that.ammo--;
			if(that.ammo <= 0) that.reload();

			//make bullet
			bulletPos = that.pos.copy();
			bulletVel = v.mul(holder.aiming, bulletSpec.speed)
			.add(v.rVec(-bulletSpec.spread/2, bulletSpec.spread));

			add(bullet(Object.assign(bulletSpec, {
				pos: bulletPos,
				velocity: bulletVel,
			})), "bullets", 3);

			audio.play(that.sound);
		}
	}

	that.reload = () => {
		if(!that.reloading){
			that.reloading = true;
			that.reloadCounter = that.reloadTime;
			that.ammo = 0;
		}
	}

	that.shotDelayCounter = 0;
	that.reloadCounter = 0;

	that.handleDelays = () => {
		that.shotDelayCounter--;
		that.reloadCounter--;

		if(that.shotDelayCounter === 0) that.shooting = false;

		if(that.reloadCounter === 0){
			that.reloading = false;
			that.ammo = that.ammoCapacity;
		}
	}

	that.addMethods("handleDelays");

	return that;
}

export default gun;
