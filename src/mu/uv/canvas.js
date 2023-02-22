import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {loadImgTexture} from "../../common/util";

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(0,0,600);

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry()

function getSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 160

  const c = canvas.getContext('2d')

  c.fillStyle = 'red'
  c.arc(80, 80, 32, 0, Math.PI * 2)
  c.fill()
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const cubeMaterial = new THREE.MeshBasicMaterial({
  map: getSprite()
})

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(cube)

renderer.setClearColor(0xffffff)

const orbitControls = new OrbitControls(camera, renderer.domElement)

orbitControls.minDistance = 1
orbitControls.maxDistance = 50

// 添加到场景里
// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10,10,90);
scene.add(spotLight);
spotLight.shadowMapWidth = 4096;
spotLight.shadowMapHeight = 4096;


renderer.setAnimationLoop( animation );

async function animation() {
  orbitControls.update();
  renderer.render( scene, camera );
}
