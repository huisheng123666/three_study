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

const smallBall = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.2, 20, 20),
    new THREE.MeshBasicMaterial({ color: 'red' })
)
smallBall.position.set(-2, 2, 2)
scene.add(smallBall)

// 聚光灯
const pointLight = new THREE.PointLight(0xfff0000, 100)

smallBall.add(pointLight)

pointLight.position.set(-2, 2, 2)
// scene.add(pointLight)
pointLight.distance = 0
gui.add(pointLight, 'distance').min(0).max(100).step(0.01)
pointLight.decay = 2
gui.add(pointLight, 'decay').min(0).max(5).step(0.01)




/* ----------------------------- 阴影 ---------------------------- */
pointLight.castShadow = true
sphere.castShadow = true
// plane.castShadow = true
plane.receiveShadow = true
// 阴影模糊度
pointLight.shadow.radius = 20
// // 阴影清晰度
pointLight.shadow.mapSize.set(4096, 4096)
pointLight.target = sphere

gui
    .add(sphere.position, 'x')
    .min(-5)
    .max(5)
    .step(0.1)



/* ------------------------- 初始化渲染器 ---------------------------- */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

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

const clock = new THREE.Clock()

function render() {
    let time = clock.getElapsedTime()
    smallBall.position.x = Math.sin(time) * 3
    smallBall.position.z = Math.cos(time) * 3
    smallBall.position.y = 2 + Math.sin(time)

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
