import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";

const particle = ({ pos, size, velocity, img, imgSize, fade = 0, gravity }) => {
	const that = traitHolder();
	that.fade = fade;

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		img,
		imgSize,
	})(that);

	traits.addMoveTrait({
		velocity,
	})(that);

	traits.addPhysicsTrait({
		gravity,
	})(that);
	
	traits.addColTrait({})(that);

	that.handleColY = (obstacle) => {
		that.velocity.set(0, 0),
		that.pos.y = obstacle.pos.y - that.size.y;
	}

	that.handlePlatformCol = (platform) => {
		if(that.velocity.y > 0 && !that.downing){
			that.pos.y = platform.pos.y - that.size.y;
			that.velocity.y = 0;
			that.acceleration.y = 0;
			that.velocity.x = 0;
		}
	}

	that.fadeOut = ({ world: { remove } }) => {
		that.alpha -= that.fade;
		if(that.alpha <= 0){
			remove(that);
		}
	}

	that.checkPerformance = ({ world: { remove, particles } }) => {
		if(particles.length > 30 && particles.filter(p => p.fade === 0).length > 30){
			that.fade = 0.01;
		}
	}

	that.addMethods("fadeOut", "checkPerformance");

	return that;
}

export const bloodEffect = ({ pos, dir, world }) => {
	let p;
	let sizeVar;

	for(let i = 0; i < 1 + Math.random()*2; i++){
		sizeVar = Math.random()*4;
		p = particle({
			pos: pos.copy(),
			size: vec(2 + sizeVar, 2 + sizeVar),
			velocity: v.add(v.mul(dir, 6), vec(Math.random()*2-1, Math.random()*2-1)),
			img: "blood_particle",
			imgSize: vec(5, 5),
			gravity: 0.02,
		});

		world.add(p, "particles", 7);
		
	}
}
