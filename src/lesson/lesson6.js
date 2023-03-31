import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
])

const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('/textures/hdr/round_platform_1k.hdr').then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})

/* ----------------------- 场景 ----------------------------- */
const scene = new THREE.Scene()
// 环境贴图
// scene.background = envMapTexture
// scene.environment = envMapTexture

/* ------------------- 相机 ------------------------------ */
// 透视相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    2000
)

camera.position.set(5, 5, 5)

scene.add(camera)


/* ---------------- 物体 ------------------- */
const sphereGeometry = new THREE.SphereGeometry(1, 30, 30)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.1,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(sphere)


/* --------------------- 灯光 ------------------- */
// 环境光
const light = new THREE.AmbientLight(0xfffffff, 0.5)

// 直线光
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1)

directionalLight.position.set(10, 10, 10)

scene.add(directionalLight)

scene.add(light)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
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
    // if (animation1.isActive()) {
    //     animation1.pause()
    // } else {
    //     animation1.resume()
    // }

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

    window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
