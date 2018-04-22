import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";

const bullet = ({ pos, velocity, size, friendly }) => {
	const that = traitHolder(); 

	that.friendly = friendly;

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		color: "yellow",	
		rotation: v.angle(vec(0, 0), velocity) - 4.7,
	})(that);

	traits.addMoveTrait({
		velocity,
	})(that);

	traits.addOubTrait({
		oubArea: [0, 0, 600, 300]	
	})(that);

	traits.addCheckColTrait({})(that);
	if(that.friendly) that.colSets.push("enemies");
	else {
		that.colSingles.push("player");
		that.colSets.push("sheep");
	}

	that.enemiesCol = that.playerCol = that.sheepCol = (entity) => {
		entity.hit = true;
		entity.hitVelocity = that.velocity.copy();
		that.hit = true;
	}

	that.handleColX = 
	that.handleOubX = () => {
		that.hit = true;
	}

	that.handleHit = ({ world: { remove } }) => {
		if(that.hit){
			remove(that);
		}
	}

	that.addMethods("handleHit")

	return that;
}

export default bullet;

