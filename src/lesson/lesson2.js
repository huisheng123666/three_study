import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { BufferGeometry } from 'three'

const scene = new THREE.Scene()

// 透视相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0, 0, 10)
scene.add(camera)

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

/* ------------------------------------ Clock跟踪时间(performance.now) -------------------------------------------------- */
const clock = new THREE.Clock()

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

    controls.update()

    // 使用渲染器，通过相机将场景渲染出来
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

/* ------------------------------------ BufferGeometry --------------------------------------------- */
// const geometry = new BufferGeometry()
// // 两个三角形组成一个矩形
// const vertces = new Float32Array([
//     -1.0, -1.0, 1.0,
//     1.0, -1.0, 1.0,
//     1.0, 1.0, 1.0,

//     1.0, 1.0, 1.0,
//     -1.0, 1.0, 1.0,
//     -1.0, -1.0, 1.0
// ])

// geometry.setAttribute('position', new THREE.BufferAttribute(vertces, 3))
// const material = new THREE.MeshBasicMaterial({ color: 'orange' })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

for (let i = 0; i < 50; i++) {
    const geometry = new BufferGeometry()
    const positionArr = new Float32Array(9)
        
    for (let j = 0; j < 9; j++) {
        positionArr[j] = Math.random() * 5 
    }


    const color = new THREE.Color(Math.random(), Math.random(), Math.random())

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3))
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
}