import traitHolder, * as traits  from "/js/lib/traits.js";
import vec, * as v   			 from "/js/lib/vector.js";

const obstacle = ({ pos, size, img }) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		img,
		imgSize: that.size.copy(),
	})(that);

	return that;
}

export const topPlatform = (pos) => obstacle({
	pos,
	size: vec(600, 10),
	img: "top_platform",
});

export const bottomPlatfrom = (pos) => obstacle({
	pos,
	size: vec(180, 10),
	img: "bottom_platform",
});

export const ground = (pos) => obstacle({
	pos,
	size: vec(600, 20),
	img: "ground",
})

export const grass = (pos) => obstacle({
	pos,
	size: vec(600, 20),
	img: "grass",
})
