import * as THREE from 'three'
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js'
import {indices, initControls, vertices} from "../../common/controls";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

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

const loader = new FontLoader();

loader.load('/font/helvetiker_regular.typeface.json', (font) => {
  const geometry = new TextGeometry( 'THREE', {
    font: font,
    size: 1,
    height: 0.5,
    curveSegments: 12
  });

  // 创建材质
  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  const cube = {
    pointer: createMultiMaterialObject(geometry, [lambert, basic])
  }


// 添加到场景里
  scene.add(cube.pointer);
// 添加灯光
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-10,10,90);
  scene.add(spotLight);
  spotLight.shadowMapWidth = 4096;
  spotLight.shadowMapHeight = 4096;

  // initControls(geometry, camera, cube, scene)
  const animation = () => {
    cube.pointer.rotation.x += 0.01;
    cube.pointer.rotation.y += 0.01;

    camera.updateProjectionMatrix()
    // 渲染
    renderer.render(scene, camera);

    requestAnimationFrame(animation);
  }
  animation()
})
