import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机 视点
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// 设置相机的位置
camera.position.set(0,0,40);

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// 添加一个立方体
// 定义了一个立方体的对象
const geometry = new THREE.BoxGeometry(10, 10, 10)

// 创建材质

const loader = new THREE.TextureLoader()
loader.load('/plaster.jpg', (texture) => {
  const lambert = new THREE.MeshPhongMaterial({
    map: texture
  })

  const mesh = new THREE.Mesh(geometry, lambert)
  mesh.rotation.y = -0.1
  mesh.position.x = -8
  scene.add(mesh);
})

loader.load('/plaster.jpg', (texture) => {
  loader.load('/plaster-normal.jpg', (normal) => {
    const lambert = new THREE.MeshPhongMaterial({
      map: texture,
      normalMap: normal
    })

    const mesh = new THREE.Mesh(geometry, lambert)
    mesh.rotation.y = -0.5
    mesh.position.x = 8
    scene.add(mesh);
  })
})

renderer.setClearColor(0xffffff)

const orbitControls = new OrbitControls(camera, renderer.domElement)

// 添加到场景里
// 添加灯光
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10,10,90);
scene.add(spotLight);
spotLight.shadowMapWidth = 4096;
spotLight.shadowMapHeight = 4096;

const animation = () => {

  orbitControls.update()
  camera.updateProjectionMatrix()
  // 渲染
  renderer.render(scene, camera);

  requestAnimationFrame(animation);
}
animation()
