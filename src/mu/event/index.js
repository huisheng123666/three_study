import * as THREE from 'three'
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js'
import gsap from 'gsap'

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(0,0,20);

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// 添加一个立方体
// 定义了一个立方体的对象
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const sphereGeometry = new THREE.SphereGeometry(2, 10, 10)

// 创建材质
const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })

const cube = new THREE.Mesh(cubeGeometry, lambert);
const sphere = new THREE.Mesh(sphereGeometry, lambert);

cube.name = 'cube'
sphere.name = 'sphere'

cube.rotation.set(0.4, 0.4, 0)
cube.position.x = -2

sphere.position.x = 4

// 添加到场景里
scene.add(cube);
scene.add(sphere);

// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10,10,90);
scene.add(spotLight);
spotLight.shadowMapWidth = 4096;
spotLight.shadowMapHeight = 4096;

document.onclick = (event) => {
  const x = event.clientX / window.innerWidth * 2 - 1
  const y = -event.clientY / window.innerHeight * 2 + 1

  const standardVector = new THREE.Vector3(x, y, 0.5)
  const wordVector = standardVector.unproject(camera)

  const ray = wordVector.sub(camera.position).normalize()

  const rayCaster = new THREE.Raycaster(camera.position, ray)

  const intersects = rayCaster.intersectObjects(scene.children, true)
  let point3d = null
  if (intersects.length) {
    point3d = intersects[0]
  }
  if (point3d) {
    console.log(point3d.object.name)
  }
}


const animation = () => {
  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);

  requestAnimationFrame(animation);
}
animation()
