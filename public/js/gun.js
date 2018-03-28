import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import bullet					from "/js/bullet.js";

const gun = ({ pos, size, shotDelay, reloadTime, ammoCapacity, bulletSpec }) => {
	const that = traitHolder({
		shotDelay,
		reloadTime,
		ammoCapacity,
		bulletSpec,
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

	that.shoot = (holder, add) => {
		if(!that.reloading && !that.shooting){
			that.shooting = true;
			that.shotDelayCounter = that.shotDelay;
			
			that.ammo--;
			if(that.ammo <= 0) that.reload();

			//make bullet
			bulletPos = that.pos.copy();
			bulletVel = v.mul(holder.aiming, bulletSpec.speed).add(v.rVec(-0.5, 1));

			add(bullet(Object.assign(bulletSpec, {
				pos: bulletPos,
				velocity: bulletVel,
			})), "bullets", 3);
			
		}
	}

	that.reload = () => {
		that.reloading = true;
		that.reloadCounter = that.reloadTime;
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
