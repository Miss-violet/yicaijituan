import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '出库单',
    path: 'outbound',
    icon: 'file',
  },
  {
    name: '入库单',
    path: 'entry',
    icon: 'file-add',
    hideInMenu: '',
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
    name: '库位管理',
    path: 'libraryManage',
    icon: 'inbox',
    hideInMenu: '',
  },
  {
    name: '操作日志',
    path: 'journal',
    icon: 'book',
    hideInMenu: '',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  /* 从 sessionStorage 中拿到角色 */
  const role = sessionStorage.getItem('role')

  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }

    /* 菜单的权限控制 */
    if (item.hasOwnProperty('hideInMenu')) {
      item.hideInMenu = (role !== '0')    // 成员级别隐藏菜单
    }
    /* 管理员及以上级别可访问入库单 */
    if (item.path === 'entry' && item.hasOwnProperty('hideInMenu')) {
      item.hideInMenu = (Number(role) > 1)
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
