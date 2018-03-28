import vec, * as v 				from "/js/lib/vector.js";
import player 	   				from "/js/player.js";
import traitHolder, * as traits from "/js/lib/traits.js";

const generateWorld = (map, { add }) => {
	let pos;
	map.forEach((row, y) => {
		strEach(row, (tile, x) => {
			pos = vec(x*20, y*20);

			if(tile === "@") add(player(pos.copy()), "player", 5, true);
			if(tile === "#") add(obstacle(pos.copy()), "obstacles", 2);
			if(tile === "_") add(platform(pos.copy()), "platforms", 2);
		});
	});
}

const obstacle = (pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(20, 20)
	})(that);

	traits.addSpriteTrait({
		color: "brown",
	})(that);

	return that;
}

const platform = (pos) => {
	const that = obstacle(pos);

	that.size = vec(20, 10);

	return that;
}

const strEach = (str, func) => {
	for(let i = 0; i < str.length; i++){
		func(str[i], i);
	}
}

export default generateWorld;