import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
// 透明纹理
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const aoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')

doorColorTexture.minFilter = THREE.NearestFilter
doorColorTexture.magFilter = THREE.NearestFilter

// doorColorTexture.offset.set(0.4, 0.1)
// doorColorTexture.rotation = Math.PI / 4
// doorColorTexture.center.set(0.5, 0.5)

// // 设置重复
// doorColorTexture.repeat.set(2, 1)
// // 水平方向
// doorColorTexture.wrapS = THREE.MirroredRepeatWrapping // 镜像重复
// // 垂直方向
// doorColorTexture.wrapT = THREE.RepeatWrapping

// 透视相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    2000
)

camera.position.set(5, 5, 5)

scene.add(camera)

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

const cubeMaterial = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
    alphaMap: alphaTexture,
    transparent: true,
    side: THREE.DoubleSide,
    aoMap: aoTexture,
    aoMapIntensity: 1
})

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(cube)

/* --------------------- 灯光 ------------------- */
// 环境光
const light = new THREE.AmbientLight(0xfffffff, 0.3)

// 直线光
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1)

directionalLight.position.set(-10, 10, 10)

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
