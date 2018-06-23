import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import bullet					from "/js/bullet.js";

const gun = ({ img = "gun", pos, size, shotDelay, reloadTime, ammoCapacity, bulletSpec, sound, knockback, screenshake = false }) => {
	const that = traitHolder({
		shotDelay,
		reloadTime,
		ammoCapacity,
		bulletSpec,
		sound,
		knockback,
	});
	
	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		img,
		imgSize: that.size.copy(),
	})(that);

	that.canShoot = true;

	that.reloading = false;
	that.shooting = false;
	that.ammo = that.ammoCapacity;
	let bulletPos;
	let bulletVel;

	that.shoot = (holder, add, audio, offset) => {
		if(that.reloading && !that.shooting && that.canShoot){
			that.shooting = true;
			that.shotDelayCounter = that.shotDelay;
			audio.playOffSync("no_ammo");
		}
		if(!that.reloading && !that.shooting && that.canShoot){
			that.shooting = true;
			that.shotDelayCounter = that.shotDelay;
			
			that.ammo--;
			if(that.ammo <= 0) that.reload({audio});

			//make bullet
			bulletPos = v.add(that.pos, v.mul(holder.aiming, that.size.x / 2));
			bulletVel = v.mul(holder.aiming, bulletSpec.speed)
			.add(v.rVec(-bulletSpec.spread/1.5, bulletSpec.spread));

			add(bullet(Object.assign(bulletSpec, {
				pos: bulletPos,
				velocity: bulletVel,
			})), "bullets", 3);

			audio.playOffSync(that.sound);

			//kickback
			that.pos.sub(v.mul(holder.aiming, 6));

			if(holder.arm) holder.arm.knockback = -holder.aiming.x*2;
			
			//knockback
			holder.pos.sub(v.mul(holder.aiming, 3));

			if(screenshake){
				offset.x -= holder.aiming.x*Math.random()*3;
				offset.y += Math.random()*2-1;
			}
		}
	}

	that.reload = ({ audio: { play } }) => {
		play("no_ammo");
		if(!that.reloading && that.canShoot){
			that.reloading = true;
			that.reloadCounter = that.reloadTime;
			that.ammo = 0;
		}
	}

	that.shotDelayCounter = 0;
	that.reloadCounter = 0;
	that.canReload = true;

	that.handleDelays = ({ audio: { play, sounds } }) => {
		if(that.canReload){
			that.reloadCounter--;
		}
		that.shotDelayCounter--;

		if(that.shotDelayCounter === 0) that.shooting = false;

		if(that.reloadCounter === 0){
			that.reloading = false;
			that.ammo = that.ammoCapacity;
			play("reload");
		}
	}

	that.addMethods("handleDelays");

	return that;
}


export default gun;
