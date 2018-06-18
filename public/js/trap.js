import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v				from "/js/lib/vector.js";
import particle					from "/js/particles.js";

const trap = (pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(20, 5),
	})(that);

	traits.addSpriteTrait({
		img: "trap",
		imgSize: that.size.copy(),
	})(that);

	traits.addMoveTrait({})(that);

	traits.addColTrait({})(that);

	traits.addPlatformColTrait({})(that);

	traits.addPhysicsTrait({
		gravity: 0.05,
	})(that);

	traits.addCheckColTrait({
		sets: ["enemies"],
	})(that)

	that.enemiesCol = (enemy, { world: { add, remove }, audio: { play, playOffSync } }) => {
		enemy.hit = true;
		enemy.damage = 3;
		enemy.hitVelocity = vec(-enemy.velocity.x, 5);
		remove(that);
		add(particle({
			pos: vec(that.pos.x, that.pos.y-5),
			velocity: vec(0, -7),
			size: vec(20, 10),
			img: "used_trap",
			imgSize: vec(20, 10),
			gravity: 1,
		}), "particles", 2);
		playOffSync("hit");
		setTimeout(() => playOffSync("kill"), 70);
	}

	return that;
}

export default trap;
