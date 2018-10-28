import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '出库单',
    path: 'outbound',
    icon: 'file',
  },
  {
    name: '用户管理',
    path: 'userManage',
    icon: 'user',
    hideInMenu: '',
  },
  {
    name: '公司管理',
    path: 'companyManage',
    icon: 'team',
    hideInMenu: '',
  },
  {
    name: '产品管理',
    path: 'productManage',
    icon: 'api',
    hideInMenu: '',
  },
  {
    name: '生厂商管理',
    path: 'manufacturerManage',
    icon: 'appstore-o',
    hideInMenu: '',
  },
  {
    name: '操作日志',
    path: 'journal',
    icon: 'book',
    hideInMenu: '',
  },
  {
    name: '库位管理',
    path: 'libraryManage',
    icon: 'appstore-o',
    hideInMenu: '',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  /* 从cookie中拿到角色 */
  let cookie = ''
  let role = ''
  cookie = sessionStorage.getItem('cookie')
  cookie = cookie && cookie.split('&&')
  role = cookie && cookie[1]

  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    /* 菜单的权限控制 */
    if (item.hasOwnProperty('hideInMenu')) {
      item.hideInMenu = (role !== '0')
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
