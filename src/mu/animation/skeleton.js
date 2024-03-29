import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(100,100,0);
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


const geometry = new THREE.CylinderGeometry(2, 2, 40, 8, 12)
const material = new THREE.MeshPhongMaterial()

// 蒙皮
const mesh = new THREE.SkinnedMesh(geometry, material)

scene.add(mesh)

// 创建节点
const b1 = new THREE.Bone()
b1.position.set(0, -20, 0)

const b2 = new THREE.Bone()
b1.add(b2)
b2.position.set(0, 10, 0)

const b3 = new THREE.Bone()
b2.add(b3)
b3.position.set(0, 10, 0)

const b4 = new THREE.Bone()
b3.add(b4)
b4.position.set(0, 10, 0)

const b5 = new THREE.Bone()
b4.add(b5)
b5.position.set(0, 10, 0)

// 创建骨架
const skeleton = new THREE.Skeleton([b1, b2, b3, b4, b5])
mesh.add(b1)
mesh.bind(skeleton)

let step = 0.1

// 索引
const indexs = []
// 权重
const wight = []

const arr = geometry.attributes.position.array
for (let i = 0; i < arr.length; i+=3) {
  const y = arr[i + 1] + 20

  const index = Math.floor(y / 10)
  const wightValue = y % 10 / 10
  indexs.push(Math.floor(y / 10), Math.floor(y / 10) + 1, 0, 0)
  wight.push(1 - wightValue, wightValue, 0, 0)
}

geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indexs, 4))
geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(wight, 4))

const animation = () => {
  orbitControls.update()

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);

  if (mesh.skeleton.bones[0].rotation.x > 0.3 || mesh.skeleton.bones[0].rotation.x < -0.3) {
    step = -step
  }

  for (let i = 0; i < mesh.skeleton.bones.length; i++) {
    mesh.skeleton.bones[i].rotation.x += step * Math.PI / 180
  }

  requestAnimationFrame(animation);
}
animation()
