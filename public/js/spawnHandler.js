import traitHolder, * as traits from "/js/lib/traits.js";

const spawnHandler = () => {
	const that = traitHolder();

	that.spawnCounter = 60;
	that.spawnDelay = 120;

	let spawner;
	let type;
	let enemy;

	that.spawn = ({ world: { topSpawners, bottomSpawners, add, player } }) => {
		that.spawnCounter--;

		if(that.spawnCounter === 0){
			that.spawnCounter = that.spawnDelay;

			if(Math.random() < 0.7)
				spawner = bottomSpawners[Math.floor(Math.random()*bottomSpawners.length)];
			else
				spawner = topSpawners[Math.floor(Math.random()*topSpawners.length)];

			type = spawner.types[Math.floor(Math.random()*spawner.types.length)];
			enemy = type(spawner.pos.copy());
			enemy.dir = spawner.dir;

			add(enemy, "enemies", 4);

			if(player.kills % 10 === 0)
				that.spawnDelay -= 5;
		}
	}

	that.addMethods("spawn");

	return that;
}

export default spawnHandler;
