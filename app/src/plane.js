import * as THREE from 'three';
import Colors from './styles/colors';
import Pilot from 'pilot';

var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;

var AirPlane = function() {

    this.mesh = new THREE.Object3D();

    // Create the cabin
    // Cockpit

    var geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});

    // we can access a specific vertex of a shape through
    // the vertices array, and then move its x, y and z property:
    geomCockpit.vertices[4].y -= 10;
    geomCockpit.vertices[4].z += 20;
    geomCockpit.vertices[5].y -= 10;
    geomCockpit.vertices[5].z -= 20;
    geomCockpit.vertices[6].y += 30;
    geomCockpit.vertices[6].z += 20;
    geomCockpit.vertices[7].y += 30;
    geomCockpit.vertices[7].z -= 20;

    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);

    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // Create the engine
    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1),
        matEngine = new THREE.MeshPhongMaterial({ color: Colors.white, shading: THREE.FlatShading }),
        engine = new THREE.Mesh(geomEngine, matEngine);

    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create the tail
    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create the wing
    var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // propeller
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // blades
    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading: THREE.FlatShading});

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    var wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
    var wheelProtecMat = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
    wheelProtecR.position.set(25, -20, 25);
    this.mesh.add(wheelProtecR);

    var wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
    var wheelTireMat = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading: THREE.FlatShading});
    var wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    wheelTireR.position.set(25, -28, 25);

    var wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
    var wheelAxisMat = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
    var wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
    wheelTireR.add(wheelAxis);

    this.mesh.add(wheelTireR);

    var wheelProtecL = wheelProtecR.clone();
    wheelProtecL.position.z = -wheelProtecR.position.z;
    this.mesh.add(wheelProtecL);

    var wheelTireL = wheelTireR.clone();
    wheelTireL.position.z = -wheelTireR.position.z;
    this.mesh.add(wheelTireL);

    var wheelTireB = wheelTireR.clone();
    wheelTireB.scale.set(.5, .5, .5);
    wheelTireB.position.set(-35, -5, 0);
    this.mesh.add(wheelTireB);

    var suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
    suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0))
    var suspensionMat = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
    suspension.position.set(-35, -5, 0);
    suspension.rotation.z = -.3;
    this.mesh.add(suspension);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10, 27, 0);
    this.mesh.add(this.pilot.mesh);
};

var airplane;

function updatePlane() {

    let targetY = normalize(mousePos.y, -.75, .75, 25, 175),
        targetX = normalize(mousePos.x, -.75, .75, -100, 100);

    // Move the plane at each frame by adding a fraction of the remaining distance
    airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1;

    // Rotate the plane proportionally to the remaining distance
    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128;
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064;

    airplane.propeller.rotation.x += 0.3;
}

function normalize(v, vmin, vmax, tmin, tmax) {

    let nv = Math.max(Math.min(v, vmax), vmin),
        dv = vmax - vmin,
        pc = (nv - vmin) / dv,
        dt = tmax - tmin,
        tv = tmin + (pc * dt);

    return tv;

}

var mousePos = {
    x: 0,
    y: 0
};

// now handle the mousemove event

function handleMouseMove(event) {

    // here we are converting the mouse position value received
    // to a normalized value varying between -1 and 1;
    // this is the formula for the horizontal axis:

    var tx = -1 + (event.clientX / WIDTH) * 2;

    // for the vertical axis, we need to inverse the formula
    // because the 2D y-axis goes the opposite direction of the 3D y-axis

    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = {
        x: tx,
        y: ty
    };

}

export default function createPlane() {
    airplane = new AirPlane();
    let pilot = new Pilot();

    airplane.mesh.scale.set(.25, .25, .25);
    airplane.mesh.position.y = 100;

    airplane.updatePlane = updatePlane;
    document.addEventListener('mousemove', handleMouseMove, false);

    return airplane;
};
