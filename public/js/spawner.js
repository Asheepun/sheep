import traitHolder, * as traits from "/js/lib/traits.js";

const spawner = ({ pos, types, delay, dir }) => {
	const that = traitHolder();
	that.pos = pos;
	that.delay = delay;
	that.types = types;
	that.dir = dir;
		
	let counter = delay;
	let entity;

	that.spawn = ({ world: { add } }) => {
		counter--;

		if(counter === 0){
			counter = that.delay + Math.floor(Math.random()*that.delay/2);
			entity = that.types[Math.floor(Math.random()*that.types.length)](that.pos.copy());
			entity.dir = dir;
			add(entity, "enemies", 4);
		}
	}

	that.addMethods("spawn");

	return that;
}

export default spawner;
