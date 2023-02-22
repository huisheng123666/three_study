import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(0,30,100);
camera.lookAt(new THREE.Vector3(0, 0, 0))

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(2000,8000,4000);
scene.add(spotLight);

const orbitControls = new OrbitControls(camera, renderer.domElement)


const total = 20


function getSprite() {
  const canvas = document.createElement('canvas')
  const size = 8

  canvas.width = size * 2
  canvas.height = size * 2

  const c = canvas.getContext('2d')

  const gradient = c.createRadialGradient(size, size, 0, size, size, size)
  gradient.addColorStop(0.1, 'rgba(0, 255, 255, 1)')

  c.fillStyle = gradient
  c.arc(size, size, size / 2, 0, Math.PI * 2)
  c.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

let geometry = new THREE.BoxGeometry(10 , 10, 10, 10, 10, 10)

function createPointCloud() {

  geometry.deleteAttribute( 'normal' );
  geometry.deleteAttribute( 'uv' );

  geometry = BufferGeometryUtils.mergeVertices(geometry);

  const material = new THREE.PointsMaterial({
    size: 2,
    transparent: true,
    map: getSprite()
  })

  const cloud = new THREE.Points(geometry, material)

  scene.add(cloud)

  console.log(geometry)
}

createPointCloud()

const animation = () => {
  scene.rotation.y += 0.01
  orbitControls.update()

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
animation()
