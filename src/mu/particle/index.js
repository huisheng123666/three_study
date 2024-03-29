import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass.js";

EffectComposer

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(0,0,200);
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

renderer.setClearColor(0xffffff)

function createNormalSprite() {
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      const material = new THREE.SpriteMaterial({
        color: Math.random() * 0xffffff
      })
      const sprite = new THREE.Sprite(material)
      sprite.position.set(i * 10, j * 10, 0)
      sprite.scale.set(2, 2, 2)
      scene.add(sprite)
    }
  }
}

createNormalSprite()

const animation = () => {
  orbitControls.update()

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
animation()
