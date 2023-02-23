import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(200,300,300);
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

const points = []
const oldPos = []
const newPos = []


function createNormalSprite(type) {
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      const material = new THREE.SpriteMaterial({
        map: getSprite()
      })
      const sprite = new THREE.Sprite(material)
      switch(type) {
        case 1:
          sprite.position.set(i * 10, j * 10, -50)
          break
        case 2:
          sprite.position.set(i * 10, j * 10, 50)
          break
        case 3:
          sprite.position.set(i * 10, 40, j * 10)
          break
        case 4:
          sprite.position.set(i * 10, -50, j * 10)
          break
        case 5:
          sprite.position.set(50, i * 10, j * 10)
          break
        case 6:
          sprite.position.set(-50, i * 10, j * 10)
          break
      }
      sprite.scale.set(2, 2, 2)
      points.push(sprite)
      oldPos.push([sprite.position.x, sprite.position.y, sprite.position.z])
      scene.add(sprite)
    }
  }
}

createNormalSprite(1)
createNormalSprite(2)
createNormalSprite(3)
createNormalSprite(4)
createNormalSprite(5)
createNormalSprite(6)

const range = 800

function randomPosition() {
  points.forEach(item => {
    const pos = [Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2]
    item.position.set(...pos)
    newPos.push(pos)
  })
}

randomPosition()

function open(open) {
  points.forEach((item, index) => {
    const pos = open ? newPos : oldPos
    gsap.to(item.position, {
      x: pos[index][0],
      y: pos[index][1],
      z: pos[index][2],
      duration: 2,
      repeat: 0,
      // yoyo: true,
      ease: 'power2'
    })
  })
}

const gui = new dat.GUI()

gui.add({
  san: true
}, 'san').onChange((value) => {
  open(value)
})

const animation = () => {
  // scene.rotation.y += 0.01
  orbitControls.update()

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
animation()
