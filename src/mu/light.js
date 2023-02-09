import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGL1Renderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 立方体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
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

// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-10, 10, 10)

scene.add(spotLight)

renderer.render(scene, camera)

const animation = () => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}

animation()
