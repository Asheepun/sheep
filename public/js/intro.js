import vec, * as v from "/js/lib/vector.js";
import * as text   from "/js/lib/text.js";

const introText = [
	//page1
	[
		"Joe dreams of one day",
		"owning a big house.",
		"He has no possessions but",
		"his hat, clothes and",
		"rifle.",
		"And he is determined to",
		"work his way up through",
		"life.",
	],
	//page2
	[
		"Luckily for him, the",
		"local farmer is going",
		"on his yearly 3 day",
		"semester.",
		"And needs someone to",
		"guard his sheep while",
		"he's away.",
	],
	//page3
	[
		"They need to be watched",
		"over from 12pm to 6am,",
		"and if all of them die",
		"the farmer will find out."
	]
];

let currentPage = 0;

let spaceCounter = 0;

const intro = (GAME, ctx) => {

	if(GAME.keys.w.down || GAME.keys.W.down) spaceCounter += 1;
	else spaceCounter = 0;

	if(spaceCounter >= 30){
		currentPage++;
		spaceCounter = 0;
		if(currentPage === 3){
			if(localStorage.tutorial === undefined) 
				GAME.fadeToState("setupTutorial");
			else 
				GAME.fadeToState("setupStart");
			return;
		}
	}
	

	ctx.save();
	ctx.scale(GAME.c.scale, GAME.c.scale);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, GAME.width, GAME.height);

	introText[currentPage].forEach((line, y) => {
		text.white15(line, 210, 50 + y * 20, ctx);
	})

	if(spaceCounter === 0) text.grey10("Hold W to continue", 250, 250, ctx);
	else{
		ctx.fillStyle = "grey";
		ctx.fillRect(285, 245, 30, 5);
		ctx.fillStyle = "white";
		ctx.fillRect(285, 245, spaceCounter, 5);
	}

	ctx.restore();

}

export default intro;
