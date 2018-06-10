const handlePlayerKeys = (GAME) => {
	//jump
	if(GAME.keys.W.downed || GAME.keys.w.downed || GAME.keys[" "].downed){
		GAME.world.player.jump();
	}
	if(GAME.keys.W.upped || GAME.keys.w.upped || GAME.keys[" "].upped){
		GAME.world.player.stopJump();
	}
	//move
	if(GAME.keys.A.down || GAME.keys.a.down){
		GAME.world.player.dir = -1;
	}
	if(GAME.keys.D.down || GAME.keys.d.down){
		GAME.world.player.dir = 1;
	}
	if(GAME.keys.D.down && GAME.keys.d.down
	&& GAME.keys.A.down && GAME.keys.a.down
	|| !GAME.keys.D.down && !GAME.keys.d.down
	&& !GAME.keys.A.down && !GAME.keys.a.down){
		GAME.world.player.dir = 0;
	}
	if(GAME.keys.S.down || GAME.keys.s.down){
		GAME.world.player.downing = true;
	}else{
		GAME.world.player.downing = false;
	}
	//shoot
	if(GAME.keys.O.down || GAME.keys.o.down){
		GAME.world.player.shooting = true;
	}else{
		GAME.world.player.shooting = false;
	}
	//reload
	if(GAME.keys.P.downed || GAME.keys.p.downed){
		GAME.world.player.gun.reload();
	}
}

export default handlePlayerKeys;
