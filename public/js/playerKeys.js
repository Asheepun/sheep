import trap from "/js/trap.js";

const handlePlayerKeys = ({ world: { player, add }, audio: { playOffSync }, progress, keys, audio }) => {
	//jump
	if(keys.W.downed || keys.w.downed || keys[" "].downed){
		player.jump();
	}
	if(keys.W.upped || keys.w.upped || keys[" "].upped){
		player.stopJump();
	}
	//move
	if(keys.A.down || keys.a.down){
		player.dir = -1;
	}
	if(keys.D.down || keys.d.down){
		player.dir = 1;
	}
	if(keys.D.down && keys.d.down
	&& keys.A.down && keys.a.down
	|| !keys.D.down && !keys.d.down
	&& !keys.A.down && !keys.a.down){
		player.dir = 0;
	}
	if(keys.S.down || keys.s.down){
		player.downing = true;
	}else{
		player.downing = false;
	}
	//shoot
	if(keys.O.down || keys.o.down){
		player.shooting = true;
	}else{
		player.shooting = false;
	}
	//reload
	if(keys.P.downed || keys.p.downed){
		player.gun.reload({audio});
	}
	//set trap
	if(keys.L.downed || keys.l.downed){
		if(progress.traps > 0){
			add(trap(player.pos.copy()), "traps", 4);
			playOffSync("set_trap");
			progress.traps--;
		}
	}
}

export default handlePlayerKeys;
