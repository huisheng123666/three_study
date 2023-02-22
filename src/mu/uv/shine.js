import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass.js";

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(10,10,0);
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


const geometry1 = new THREE.BoxGeometry()
const geometry2 = new THREE.BoxGeometry()
const material1 = new THREE.MeshBasicMaterial({
  color: 0x00ff00
})
const material2 = new THREE.MeshBasicMaterial({
  color: 0xff0000
})

const c1 = new THREE.Mesh(geometry1, material1)
const c2 = new THREE.Mesh(geometry2, material2)

c1.position.z = -2
c2.position.z = 2

scene.add(c1)
scene.add(c2)

const renderScene = new RenderPass(scene, camera)

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, [c2, c1])

outlinePass.renderToScreen = true;
outlinePass.edgeStrength = 10 // 边框尺寸
outlinePass.edgeGlow = 3 // 发光强度
outlinePass.edgeThickness = 2 // 光晕大小
outlinePass.pulsePeriod = 1 // 闪烁速度
outlinePass.visibleEdgeColor.set('orange')

const bloom = new EffectComposer(renderer)
bloom.setSize(window.innerWidth, window.innerHeight)

bloom.addPass(renderScene)
bloom.addPass(outlinePass)

const animation = () => {
  orbitControls.update()

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);
  bloom.render()

  requestAnimationFrame(animation);
}
animation()
