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
    name: '租户管理',
    path: 'tenantManage',
    icon: 'smile-o',
    hideInMenu: '',     // 根据用户的权限显示/隐藏
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  /* 从 sessionStorage 中拿到角色 */
  const role = sessionStorage.getItem('role')

  const tenantCode = sessionStorage.getItem('tenantCode')

  return data.map(item => {
    let { path } = item;
    const {name} = item
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    /* 菜单的权限控制 */
    if (item.hasOwnProperty('hideInMenu')) {
      item.hideInMenu = (role !== '0')
    }
    if(name === '租户管理') {
      item.hideInMenu = (tenantCode!=='platform')
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
