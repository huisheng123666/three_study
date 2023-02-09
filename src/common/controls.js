import * as dat from 'dat.gui'

const basicType = {
  color: {
    method: 'addColor',
    getValue: item => item.color.getStyle(),
    setValue: (item, value) => item.color.set(value)
  }
}

export function initControls(item) {
  const gui = new dat.GUI()
  const controls = {
    color: 0xffffff,
    intensity: 1,
    distance: 0,
    angle: Math.PI / 3,
    exponent: 10
  }

  const key = ''

  gui.addColor(controls, 'color').onChange(value => {
    controls.color = value
    item.color.set(value)
  })
}
