import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from "dat.gui";

const gui = new GUI()

/* ----------------------- 场景 ----------------------------- */
const scene = new THREE.Scene()


/* ------------------- 相机 ------------------------------ */
// 透视相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    2000
)

camera.position.set(5, 5, 5)

scene.add(camera)


/* ------------------------------ 物体 -------------------------------- */
const sphereGeometry = new THREE.SphereGeometry(1, 30, 30)
const sphereMaterial = new THREE.MeshStandardMaterial({})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(sphere)


const planGeometry = new THREE.PlaneBufferGeometry(50, 50)
const plane = new THREE.Mesh(planGeometry, sphereMaterial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2

scene.add(plane)




/* ------------------------------- 灯光 ------------------------------ */
// 环境光
const light = new THREE.AmbientLight(0xfffffff, 0.5)
scene.add(light)

// 直线光
const spotLight = new THREE.SpotLight(0xfffffff, 1)

spotLight.position.set(-10, 10, 10)
scene.add(spotLight)
spotLight.angle = Math.PI / 6
gui.add(spotLight, 'angle').min(0).max(Math.PI / 2)
spotLight.distance = 0
gui.add(spotLight, 'distance').min(0).max(100).step(0.01)


/* ------------------------- 初始化渲染器 ---------------------------- */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)



/* ----------------------------- 阴影 ---------------------------- */
renderer.shadowMap.enabled = true
spotLight.castShadow = true
sphere.castShadow = true
// plane.castShadow = true
plane.receiveShadow = true
// 阴影模糊度
spotLight.shadow.radius = 20
// // 阴影清晰度
spotLight.shadow.mapSize.set(4096, 4096)
spotLight.target = sphere

gui
    .add(sphere.position, 'x')
    .min(-5)
    .max(5)
    .step(0.1)

/* ------------------------------------ 轨道控制器 -------------------------------------------------- */
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼（需要render是update）
controls.enableDamping = true

/* ------------------------------------ 坐标轴辅助器 -------------------------------------------------- */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

window.addEventListener('dblclick', () => {
    // 全屏
    const fullScreenElement = document.fullscreenElement
    if (!fullScreenElement) {
        renderer.domElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})


function render() {
    renderer.render(scene, camera)
    camera.updateProjectionMatrix()
    controls.update()

    window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
