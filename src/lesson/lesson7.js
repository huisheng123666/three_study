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


const planGeometry = new THREE.PlaneBufferGeometry(10, 10)
const plane = new THREE.Mesh(planGeometry, sphereMaterial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2

scene.add(plane)

/* ------------------------------- 灯光 ------------------------------ */
// 环境光
const light = new THREE.AmbientLight(0xfffffff, 0.5)

// 直线光
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1)

directionalLight.position.set(-10, 10, 10)

scene.add(directionalLight)

scene.add(light)



/* ------------------------- 初始化渲染器 ---------------------------- */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)



/* ----------------------------- 阴影 ---------------------------- */
renderer.shadowMap.enabled = true
directionalLight.castShadow = true
sphere.castShadow = true
// plane.castShadow = true
plane.receiveShadow = true
// 阴影模糊度
directionalLight.shadow.radius = 20
// 阴影清晰度
directionalLight.shadow.mapSize.set(4096, 4096)
// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -5
directionalLight.shadow.camera.right = 5

gui
    .add(directionalLight.shadow.camera, 'near')
    .min(0)
    .max(19)
    .step(0.1)
    .onChange((val) => {
        directionalLight.shadow.camera.updateProjectionMatrix()
    })

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
