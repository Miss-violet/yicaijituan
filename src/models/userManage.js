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
          if (!document.cookie && sessionStorage.getItem('cookie') === '') {
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
              payload: {},
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
      const req = yield call(userList, payload)
      if (req.code === 0) {
        yield put({
          type: 'success',
          payload: {
            data: req.data.rows,
            total: req.data.total,
          },
        })
      }
    },
    *vaildateLoginName({payload}, {call}) {
      yield call(vaildateLoginName, payload)
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
