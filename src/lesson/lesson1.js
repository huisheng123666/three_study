import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'
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

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// 根据几何体和材质创建物体
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// scene.add(cube)

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

/* ------------------------------------ 物体变换 -------------------------------------------------- */
// cube.position.set(1, 0, 0)

// cube.scale.set(3, 2, 1)

// cube.rotation.set(Math.PI / 4, 0, 0, 'XZY')

/* ------------------------------------ Clock跟踪时间(performance.now) -------------------------------------------------- */
const clock = new THREE.Clock()

/* ------------------------------------ 动画 -------------------------------------------------- */
// gsap.to(cube.position, { x: 5, duration: 5, ease: 'power2', onComplete: () => {}, onStart: () => {} })
// const animation1 = gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: 'power2', repeat: -1, yoyo: true })

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
    // console.log(time);
    // let t = time / 1000 % 5
    // cube.position.x = t
    // if (cube.position.x >= 5) {
    //     cube.position.x = 0
    // }
    // cube.rotation.x += 0.01

    controls.update()
    
    let time = clock.getElapsedTime()
    let deltaTime = clock.getDelta()
    // console.log(deltaTime * 1000);

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


/* ------------------------------------ GUI动态改变 --------------------------------------------- */
// const gui = new dat.GUI()
// gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('4344').onChange(val => {
//     console.log(val);
// })
// .onFinishChange((val) => {})

// const params = {
//     color: '#ffff00',
//     fn: () => {
//         gsap.to(cube.position, { x: 5, duration: 5, ease: 'power2', onComplete: () => {}, onStart: () => {} })
//     }
// }
// gui.addColor(params, 'color').onChange(value => {
//     console.log(value);
//     cube.material.color.set(value)
// })
// gui.add(cube, 'visible').name('是否显示')
// gui.add(params, 'fn').name('动画')
// const folder = gui.addFolder("设置立方体")
// folder.add(cube.material, 'wireframe')

/* ------------------------------------ BufferGeometry --------------------------------------------- */
const geometry = new BufferGeometry()
const vertces = new Float32Array([
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0
])

geometry.setAttribute('position', new THREE.BufferAttribute(vertces, 3))
const material = new THREE.MeshBasicMaterial({ color: 'orange' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
 