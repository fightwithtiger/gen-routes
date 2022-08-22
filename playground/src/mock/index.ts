const pages = [
  {
    name: 'menu1',
    zhName: '菜单一',
    children: [
      {
        name: 'page1',
        zhName: '页面1',
        children: []
      }
    ]
  },
  {
    name: 'menu2',
    zhName: '菜单二',
    children: [
      {
        name: 'page3',
        zhName: '页面3',
        children: []
      }
    ]
  }
]

export const getPages = () => {
  return Promise.resolve([...pages])
}
