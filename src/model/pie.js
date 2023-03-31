import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 2000 );
camera.position.set(5, 5, 5)

scene.add(camera)

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var shape = new THREE.Shape();

var outerRadius = 10;
var startAngle = 0;
var endAngle = Math.PI;
var outerShape = new THREE.Shape();
outerShape.moveTo(outerRadius, 0);
outerShape.absarc(0, 0, outerRadius, startAngle, endAngle, false);

shape.add(outerShape);

var innerRadius = 5;
var innerShape = new THREE.Shape();
innerShape.moveTo(innerRadius, 0);
innerShape.absarc(0, 0, innerRadius, startAngle, endAngle, true);
shape.holes.push(innerShape);

var geometry = new THREE.ShapeGeometry(shape);
var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const orbitControls = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function animate() {
  requestAnimationFrame( animate );
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  renderer.render( scene, camera );
}
animate();
