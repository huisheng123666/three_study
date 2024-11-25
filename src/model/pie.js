import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import {CSG} from "three-csg-ts";

import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

// 创建一个场景
var scene = new THREE.Scene();

// 创建一个摄像机
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 10;

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const box = new THREE.Mesh(
//   new THREE.BoxGeometry(2, 2, 2),
//   new THREE.MeshNormalMaterial()
// );
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32));
//
// // Make sure the .matrix of each mesh is current
// box.updateMatrix();
// sphere.updateMatrix();
//
// // Perform CSG operations
// // The result is a THREE.Mesh that you can add to your scene...
// const subRes = CSG.subtract(box, sphere);
// const uniRes = CSG.union(box, sphere);
// const intRes = CSG.intersect(box, sphere);

// scene.add(subRes)

const geometry2 = new THREE.CylinderGeometry( 1.3, 1.3, 2, 32, 10);

const material = new THREE.MeshNormalMaterial(  );

const brush2 = new Brush(geometry2, material);
brush2.updateMatrixWorld();

const evaluator = new Evaluator();

const shape = new THREE.Shape();
shape.moveTo( 0,0 );
shape.absarc(0, 0, 2, 0, Math.PI * 1.8)
shape.lineTo( 0,  0);

const extrudeSettings = {
  curveSegments: 48,
  steps: 1,
  depth: 0.6,
  bevelEnabled: false,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 12,
};

const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
geometry.rotateX(Math.PI/2)
const brush3 = new Brush( geometry, material ) ;
brush3.position.y = 1
brush3.updateMatrixWorld();
const result2 = evaluator.evaluate( brush3, brush2, SUBTRACTION );
scene.add(result2);

const orbitControls = new OrbitControls(camera, renderer.domElement)

// 渲染场景
function animate() {
  requestAnimationFrame( animate );
  // outerCylinder.rotation.x += 0.01;
  // outerCylinder.rotation.y += 0.01;
  // innerCylinder.rotation.x += 0.01;
  // innerCylinder.rotation.y += 0.01;
  renderer.render( scene, camera );
}
animate();
