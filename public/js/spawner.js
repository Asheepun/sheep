import traitHolder, * as traits from "/js/lib/traits.js";

const spawner = ({ pos, types, delay }) => {
	const that = traitHolder();
	that.pos = pos;
	that.delay = delay;
	that.types = types;
		
	let counter = delay;	

	that.spawn = ({ world: { add } }) => {
		counter--;

		if(counter === 0){
			counter = that.delay + Math.floor(Math.random()*that.delay/2);
			add(that.types[Math.floor(Math.random()*that.types.length)](that.pos.copy()), "enemies", 4);
		}
	}

	that.addMethods("spawn");

	return that;
}

export default spawner;
