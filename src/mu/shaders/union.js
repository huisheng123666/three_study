import * as THREE from 'three'
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js'

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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// 创建材质
const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
const basic = new THREE.MeshBasicMaterial({ wireframe: true })

const cube = createMultiMaterialObject(cubeGeometry, [lambert, basic]);


// 添加到场景里
scene.add(cube);

// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10,10,90);
scene.add(spotLight);
spotLight.shadowMapWidth = 4096;
spotLight.shadowMapHeight = 4096;

const animation = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);

  requestAnimationFrame(animation);
}
animation()
