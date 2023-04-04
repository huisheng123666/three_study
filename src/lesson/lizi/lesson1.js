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
const particleGeometry = new THREE.BufferGeometry()
const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = Math.random() * 30 - 15
    colors[i] = Math.random()
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const pointMaterial = new THREE.PointsMaterial({
    size: 0.2,
    color: 0xfff000,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

pointMaterial.vertexColors = true

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/particles/1.png')
pointMaterial.map = texture
pointMaterial.alphaMap = texture
pointMaterial.transparent = true

const points = new THREE.Points(particleGeometry, pointMaterial)

scene.add(points)


/* ------------------------- 初始化渲染器 ---------------------------- */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
// renderer.physicallyCorrectLights = true
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
