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
    1000
)

camera.position.set(5, 5, 5)

scene.add(camera)


/* ------------------------------ 物体 -------------------------------- */
const params = {
    count: 10000,
    size: 0.1,
    radius: 5,
    branch: 3,
    color: '#ff6030',
    rotateScale: 1,
    endColor: '#1b3984'
}

let geometry = null
let material = null
const particleLoader = new THREE.TextureLoader()
const particleTexture = particleLoader.load('/textures/particles/1.png')
const generateGalaxy = () => {
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)
    const centerColor = new THREE.Color(params.color)
    const endColor = new THREE.Color(params.endColor)

    for (let i = 0; i < params.count; i++) {
        const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)

        const distance = Math.random() * params.radius * Math.random()

        const current = i * 3

        const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
        const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
        const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5

        positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
        positions[current + 1] = randomY
        positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ

        const mixColor = centerColor.clone()
        mixColor.lerp(endColor, distance / params.radius)
        colors[current] = mixColor.r
        colors[current + 1] = mixColor.g
        colors[current + 2] = mixColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    material = new THREE.PointsMaterial({
        // color: new THREE.Color(params.color),
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        alphaMap: particleTexture,
        transparent: true,
        vertexColors: true
    })
    const points = new THREE.Points(geometry, material)

    scene.add(points)
}

generateGalaxy()


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


const clock = new THREE.Clock()

function render() {
    renderer.render(scene, camera)
    camera.updateProjectionMatrix()
    controls.update()

    window.requestAnimationFrame(render)
}

render()

window.addEventListener('dblclick', () => {
    // 全屏
    const fullScreenElement = document.fullscreenElement
    if (!fullScreenElement) {
        renderer.domElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
