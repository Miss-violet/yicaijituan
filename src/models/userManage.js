import { routerRedux } from 'dva/router';
import { create, update, userList, vaildateLoginName } from '../services/userManage'
import { companyList } from '../services/companyManage'

export default {
  namespace: 'userManage',

  state: {
    companySelectList: [],
    data: [],
    total: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/userManage') {
          if (sessionStorage.getItem('token') === '') {
            dispatch(routerRedux.push({
              pathname: '/user/login',
            }))
          } else {
            dispatch({
              type: 'queryList',
              payload: {},
            })
            /* 加载下拉框选项 */
            dispatch({
              type: 'querySelectList',
              payload: {
                pageSize: 999999999,
              },
            })
          }
        }
      })
    },
  },

  effects: {
    *create({ payload }, { call, put }) {
      const res = yield call(create, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            ...res.data,
          },
        })
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    *edit({ payload }, { call, put }) {
      const res = yield call(update, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            ...res.data,
          },
        })
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    *querySelectList({ payload }, { call, put }) {
      const res = yield call(companyList, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            companySelectList: res.data.rows,
          },
        })
      }
    },
    *queryList({ payload }, { call, put }) {
      const res = yield call(userList, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            data: res.data.rows,
            total: res.data.total,
          },
        })
      }
    },
    *vaildateLoginName({ payload, callback }, { call }) {
      const res = yield call(vaildateLoginName, payload)
      if (callback) callback(res.code)
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
