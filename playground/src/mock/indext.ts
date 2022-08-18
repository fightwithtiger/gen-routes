const pages = [
  {
    id: 1,
    name: 'menu1',
    zhName: '菜单一',
    isMenu: true,
    children: [
      {
        id: 11,
        name: 'page1',
        zhName: '页面1',
        isMenu: true,
        children: [],
      },
    ],
  },
  {
    id: 2,
    name: 'menu2',
    zhName: '菜单二',
    isMenu: true,
    children: [
      // {
      //   id: 21,
      //   name: 'page2',
      //   zhName: '页面2',
      //   isMenu: true,
      //   children: [],
      // },
      {
        id: 22,
        name: 'page3',
        zhName: 'page3',
        isMenu: false,
        children: [],
      },
    ],
  },
]

export const getPages = () => {
  return Promise.resolve([...pages])
}
