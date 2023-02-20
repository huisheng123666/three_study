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

const imgs = [
  '/sky/front.jpg',
  '/sky/back.jpg',
  '/sky/top.jpg',
  '/sky/bottom.jpg',
  '/sky/left.jpg',
  '/sky/right.jpg',
]

const mats = []

let cubeCamera = null

async function loadTexture() {
  for (let i = 0; i < imgs.length; i++) {
    mats.push(new THREE.MeshBasicMaterial({
      map: await loadImgTexture(imgs[i]),
      side: THREE.DoubleSide
    }))
  }

  const mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), mats)

  scene.add(mesh)

  const sphereGeometry = new THREE.SphereGeometry(4, 15, 15)
  const boxGeometry = new THREE.BoxGeometry(5, 5, 5)

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256);

  cubeCamera = new THREE.CubeCamera(0.1, 2000, cubeRenderTarget)

  scene.add(cubeCamera)

  const sphereMaterial = new THREE.MeshBasicMaterial({
    envMap: cubeCamera.renderTarget.texture
  })

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  const cube = new THREE.Mesh(boxGeometry, mats)
  sphere.position.x = 5
  cube.position.x = -5

  scene.add(sphere)
  scene.add(cube)

  return cube
}


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

let timer = 0

const animation = async () => {
  let cube = null
  if (!cubeCamera) {
    cube = await loadTexture()
  }

  if (cubeCamera) {
    orbitControls.update()
    cubeCamera.update(renderer, scene)

    //
    camera.updateProjectionMatrix()
    // 渲染
    renderer.render(scene, camera);


    requestAnimationFrame(animation);
  }
}
animation()
