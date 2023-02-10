import * as dat from 'dat.gui'

const basicType = {
  color: {
    method: 'addColor',
    getValue: item => item.color.getStyle(),
    setValue: (item, value) => item.color.set(value)
  },
  groundColor: {
    method: 'addColor',
    getValue: item => item.color.getStyle(),
    setValue: (item, value) => item.color.set(value)
  },
  intensity: {
    method: 'add',
    extends: [0, 10],
    getValue: item => item.intensity,
    setValue: (item, value) => item.intensity = +value
  },
  distance: {
    method: 'add',
    extends: [0, 20000],
    getValue: item => item.distance,
    setValue: (item, value) => item.distance = value
  },
  angle: {
    method: 'add',
    extends: [0, Math.PI / 2],
    getValue: item => item.angle,
    setValue: (item, value) => item.angle = +value
  },
  decay: {
    method: 'add',
    extends: [0, 20],
    getValue: item => item.decay,
    setValue: (item, value) => item.decay = +value
  }
}

const itemType = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'decay'],
  AmbientLight: ['color'],
  PointLight: ['color', 'intensity', 'distance'],
  DirectionalLight: ['color', 'intensity'],
  HemisphereLight: ['skyColor', 'groundColor', 'intensity']
}

export function initControls(item) {
  console.log(item)
  const typeList = itemType[item.type]

  const controls = {}

  if (!typeList.length) return;

  const gui = new dat.GUI()

  for (let i = 0; i < typeList.length; i++) {
    const child = basicType[typeList[i]]
    if (child) {
      controls[typeList[i]] = child.getValue(item)
      const childExtends = child.extends || []
      gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
        child.setValue(item, value)
      })
    }
  }

}
