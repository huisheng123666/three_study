import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {Color} from "three";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";

const scene = new THREE.Scene()

// 透视相机
let camera = new THREE.PerspectiveCamera(
  39.59775192067671,
  window.innerWidth/window.innerHeight,
  0.10000000149011612,
  1000
)

// camera.position.set(0, 0, 10)
scene.add(camera)

scene.background = new Color(255, 255, 255)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

document.body.append(renderer.domElement)

const pmremGenerator = new THREE.PMREMGenerator(renderer);

scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04 ).texture;

/* ------------------------------------ 轨道控制器 -------------------------------------------------- */
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼（需要render是update）
controls.enableDamping = true

/* ------------------------------------ 坐标轴辅助器 -------------------------------------------------- */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const light = new THREE.AmbientLight( 0xffffffff, 0.1); // soft white light
light.castShadow = true
light.isAmbientLight = true
scene.add( light );

const rectLight = new THREE.RectAreaLight( 0xffffff, 1,  1000, 800 );
rectLight.position.set( -9.221277236938477, 22.67266082763672, 15.849824905395508 );
rectLight.rotation.set(-0.972167614202523, -0.4671676571889083, 0.16007455360987222)
rectLight.isRectAreaLight = true
rectLight.castShadow = true
scene.add( rectLight )

const rectLightHelper = new RectAreaLightHelper( rectLight );
scene.add( rectLightHelper );

const loader = new GLTFLoader();

loader.load( '/gold-coin.glb', function ( gltf ) {
  const model = gltf.scene
  scene.add(model);
  model.traverse( function ( object ) {
    // console.log(object)
    if ( object.isMesh ) {
      object.castShadow = true;
      object.receiveShadow = true
    }
  });

  const { x, y, z } = gltf.cameras[0].position
  camera.position.set(x, y, z)
  camera.updateProjectionMatrix()
}, undefined, function ( error ) {
  console.error( error );
});

function render() {
  renderer.render(scene, camera)
  controls.update()

  window.requestAnimationFrame(render)
}

render()

// window.addEventListener('resize', () => {
//   // camera.aspect = window.innerWidth / window.innerHeight
//   // camera.updateProjectionMatrix()
//
//   renderer.setSize(window.innerWidth, window.innerHeight)
//   renderer.setPixelRatio(window.devicePixelRatio)
// })
