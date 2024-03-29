import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";

EffectComposer

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(0,50,200);
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

  c.fillStyle = '#00ff00'
  c.arc(size, size, size / 1.5, 0, Math.PI * 2)
  c.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const spriteList = []

function createNormalSprite() {
  const material = new THREE.SpriteMaterial({
    color: 0x008800,
    map: getSprite()
  })
  for (let i = -total; i < total; i++) {
    for (let j = -total; j < total; j++) {
      const sprite = new THREE.Sprite(material)
      sprite.position.set(i * 10, 0, j * 10)
      scene.add(sprite)
      spriteList.push(sprite)
    }
  }
}

createNormalSprite()

const speed = 0.1
const height = 5
const step = 0.3

let status = 0;

const animation = () => {
  orbitControls.update()

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);
  requestAnimationFrame(animation);

  let index = -1
  for (let x = 0; x < total * 2; x++) {
    for (let y = 0; y < total * 2; y++) {
      index++
      spriteList[index].position.y = (Math.sin(x + status) * step) * height + (Math.sin(y + status) * step) * height
      const scaleValue = Math.sin(x + status) * step + 1
      spriteList[index].scale.set(scaleValue, scaleValue, scaleValue)
    }
  }
  status += speed
}
animation()
