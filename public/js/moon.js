import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v				from "/js/lib/vector.js";

const moon = () => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos: vec(30, 150),
		size: vec(30, 30),
	})(that);

	traits.addSpriteTrait({
		img: "moon",
		imgSize: vec(30, 30),
	})(that);

	that.stages = [
		vec(30, 150),//1
		vec(44, 140),//2
		vec(58, 130),//3
		vec(72, 120),//4
		vec(86, 110),//5
		vec(100, 100),//6
		vec(114, 90),//7
		vec(128, 80),//8
		vec(142, 70),//9
		vec(156, 65),//10
		vec(170, 60),//11
		vec(184, 55),//12
		vec(198, 40),//13
		vec(212, 35),//14
		vec(226, 20),//15
		vec(240, 15),//16
		vec(254, 10),//17
		vec(268, 10),//18
		vec(282, 15),//19
		vec(296, 20),//20
		vec(310, 25),//21
		vec(328, 30),//22
		vec(342, 35),//23
		vec(356, 40),//24
		vec(370, 45),//25
		vec(384, 50),//26
		vec(398, 60),//27
		vec(412, 70),//28
		vec(426, 80),//29
		vec(440, 90),//30
		vec(454, 100),//31
		vec(468, 110),//32
		vec(480, 120),//33
		vec(496, 130),//34
		vec(510, 140),//35
		vec(524, 150),//36
	];

	that.move = ({ world: { clock } }) => {
		that.pos = that.stages[Math.floor((clock.count / 10) / 60)];
		if(that.pos === undefined) that.pos = vec(524, 150);
	}

	that.addMethods("move");

	return that;
}

export default moon;
