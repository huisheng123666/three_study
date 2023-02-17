import * as THREE from 'three'
import { initControls } from '../../common/controls'

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

const vertices = new Float32Array( [
  -1.0, -1.0,  1.0,
  5.0, -1.0,  1.0
] );

const lines = new THREE.BufferGeometry();

lines.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

// 创建材质
// const material = new THREE.LineBasicMaterial({
//   color: 0xff0000,
// })

const material = new THREE.LineDashedMaterial({
  color: 0xff0000,
  dashSize: 1,
  gapSize: 1
})

const line = new THREE.Line(lines, material)
line.computeLineDistances()

// 添加到场景里
scene.add(line);

// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10,10,90);
scene.add(spotLight);
spotLight.shadowMapWidth = 4096;
spotLight.shadowMapHeight = 4096;

initControls(material, camera);
const animation = () => {
  // 渲染
  renderer.render(scene, camera);

  requestAnimationFrame(animation);
}
animation()
