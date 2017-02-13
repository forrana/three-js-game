import * as THREE from 'three';
import Colors from './styles/colors';

let Cloud = function(){
	// Create an empty container that will hold the different parts of the cloud
	this.mesh = new THREE.Object3D();

	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	var geom = new THREE.BoxGeometry(20,20,20);

	// create a material; a simple white material will do the trick
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,
	});

	// duplicate the geometry a random number of times
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){

		// create the mesh by cloning the geometry
		var m = new THREE.Mesh(geom, mat);

		// set the position and the rotation of each cube randomly
		m.position.x = Math.random()*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;

		// set the size of the cube randomly
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);

		// allow each cube to cast and to receive shadows
		m.castShadow = true;
		m.receiveShadow = true;

		// add the cube to the container we first created
		this.mesh.add(m);
	}
}

// Define a Sky Object
let Sky = function(){
	// Create an empty container
	this.mesh = new THREE.Object3D();

	// choose a number of clouds to be scattered in the sky
	this.nClouds = 20;

	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nClouds;

	// create the clouds
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();

		// set the rotation and the position of each cloud;
		// for that we use a bit of trigonometry
		var a = stepAngle*i; // this is the final angle of the cloud
		var h = 900 + Math.random()*200; // this is the distance between the center of the axis and the cloud itself

		// Trigonometry!!! I hope you remember what you've learned in Math :)
		// in case you don't:
		// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;

		// rotate the cloud according to its position
		c.mesh.rotation.z = a + Math.PI/2;

		// for a better result, we position the clouds
		// at random depths inside of the scene
		c.mesh.position.z = -400-Math.random()*400;

		// we also set a random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		// do not forget to add the mesh of each cloud in the scene
		this.mesh.add(c.mesh);
	}
}

// Now we instantiate the sky and push its center a bit
// towards the bottom of the screen

var sky;

export function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;

    return sky;
}

// First let's define a Sea object :
var Sea = function(){
	// var geom = new THREE.CylinderGeometry(600,600,800,40,10);
    var geom = new THREE.SphereGeometry( 600, 50, 32 );

	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	// important: by merging vertices we ensure the continuity of the waves
	geom.mergeVertices();

	// get the vertices
	var l = geom.vertices.length;

	// create an array to store new data associated to each vertex
	this.waves = [];

	for (var i=0; i<l; i++){
		// get each vertex
		var v = geom.vertices[i];

		// store some data associated to it
		this.waves.push({y:v.y,
										 x:v.x,
										 z:v.z,
										 // a random angle
										 ang:Math.random()*Math.PI*2,
										 // a random distance
										 amp:5 + Math.random()*15,
										 // a random speed between 0.016 and 0.048 radians / frame
										 speed:0.016 + Math.random()*0.032
										});
	};
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent:true,
		opacity:.8,
		shading:THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;

}

// now we create the function that will be called in each frame
// to update the position of the vertices to simulate the waves

Sea.prototype.moveWaves = function (){

	// get the vertices
	var verts = this.mesh.geometry.vertices;
	var l = verts.length;

	for (var i=0; i<l; i++){
		var v = verts[i];

		// get the data associated to it
		var vprops = this.waves[i];

		// update the position of the vertex
		v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
		v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

		// increment the angle for the next frame
		vprops.ang += vprops.speed;

	}

	// Tell the renderer that the geometry of the sea has changed.
	// In fact, in order to maintain the best level of performance,
	// three.js caches the geometries and ignores any changes
	// unless we add this line
	this.mesh.geometry.verticesNeedUpdate=true;

	sea.mesh.rotation.z += .005;
}

// Instantiate the sea and add it to the scene:

var sea;

export function createSea(){
	sea = new Sea();

	// push it a little bit at the bottom of the scene
	sea.mesh.position.y = -550;

	// add the mesh of the sea to the scene
	return sea;
}

export default {createSky, createSea}
