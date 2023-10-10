import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {CSG} from "three-csg-ts";

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

const geometry1 = new THREE.CylinderGeometry( 2, 2, 1, 32, 1, false, 0, Math.PI * 1.5);
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
const pieOut = new THREE.Mesh( geometry1, material );

const geometry2 = new THREE.CylinderGeometry( 1.5, 1.5, 1, 32, 1, false, 0, Math.PI * 1.5);
const pieIn = new THREE.Mesh( geometry2, material );
// scene.add( cylinder );

pieOut.updateMatrix()
pieIn.updateMatrix()

const subRes = CSG.subtract(pieOut, pieIn);

scene.add(subRes)

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
