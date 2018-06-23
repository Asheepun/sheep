import vec, * as v 					  from "/js/lib/vector.js";
import { wolf, squirrel, fox, eagle } from "/js/enemy.js";

const nights = [
	//1
	[
		{
			pos: vec(-60, 210),
			types: [wolf],
			dir: 1,
			place: "bottomSpawners",
		}, 

		{
			pos: vec(630, 210),
			types: [wolf],
			dir: -1,
			place: "bottomSpawners",
		}, 

		{
			pos: vec(20, 0),	
			types: [squirrel],
			dir: 1,
			place: "topSpawners",
		}, 

		{
			pos: vec(560, 0),	
			types: [squirrel],
			dir: -1,
			place: "topSpawners",
		}, 
	],
	//2
	[
		{
			pos: vec(-60, 210),
			types: [wolf, fox],
			dir: 1,
			place: "bottomSpawners",
		}, 

		{
			pos: vec(630, 210),
			types: [wolf, fox],
			dir: -1,
			place: "bottomSpawners",
		}, 

		{
			pos: vec(20, 0),	
			types: [squirrel],
			dir: 1,
			place: "topSpawners",
		}, 

		{
			pos: vec(560, 0),	
			types: [squirrel],
			dir: -1,
			place: "topSpawners",
		}, 
	],
	//3	
	[
		{
			pos: vec(-60, 210),
			types: [wolf, fox],
			dir: 1,
			place: "bottomSpawners",
		},
		{
			pos: vec(630, 210),
			types: [wolf, fox],
			dir: -1,
			place: "bottomSpawners",
		},

		{
			pos: vec(20, 0),	
			types: [squirrel, eagle],
			dir: 1,
			place: "topSpawners",
		}, 

		{
			pos: vec(560, 0),	
			types: [squirrel, eagle],
			dir: -1,
			place: "topSpawners",
		}, 
	],
];

export default nights;
