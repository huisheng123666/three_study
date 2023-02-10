import * as THREE from 'three'
import { initControls } from '../common/controls'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGL1Renderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// wireframe 是否线框
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false })

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: false })

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.x = 3
sphere.position.y = 3

scene.add(cube)
scene.add(sphere)

// 添加一个平面，用来接收阴影
const planeGeometry = new THREE.PlaneGeometry(20, 30)
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 })

const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotateZ(20)
plane.position.z = -10
plane.position.x = 3

scene.add(plane)

// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-10, 10, 90)

// initControls(spotLight)

scene.add(spotLight)

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(-10, 10, 90)

scene.add(directionalLight)

initControls(directionalLight)

// 让两个三维物体产生阴影，球体立方体
cube.castShadow = true
sphere.castShadow = true
// 使用平面接受阴影
plane.receiveShadow = true
// 设置灯光开启阴影
directionalLight.castShadow = true
renderer.shadowMap.enabled = true

directionalLight.shadow.camera.left = -50
directionalLight.shadow.camera.right = 50
directionalLight.shadow.camera.top = 50
directionalLight.shadow.camera.bottom = -50
directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.far = 200

directionalLight.shadow.mapSize.width = 4096
directionalLight.shadow.mapSize.height = 4096

const animation = () => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}

animation()
