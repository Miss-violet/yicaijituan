import { routerRedux } from 'dva/router';
import { create, update, del, companyList, vaildateCompanyName } from '../services/companyManage'

export default {
  namespace: 'companyManage',

  state: {
    companySelectList: [],
    data: [],
    total: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/companyManage') {
          // if (!document.cookie && sessionStorage.getItem('cookie') === '') {
          if (sessionStorage.getItem('cookie') === '') {
            dispatch(routerRedux.push({
              pathname: '/user/login',
            }))
          }
          else {
            dispatch({
              type: 'queryList',
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
    *delete({ payload }, { call, put }) {
      const res = yield call(del, payload)
      if (res.code === 0) {
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    *queryList({ payload }, { call, put }) {
      const res = yield call(companyList, payload)
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
    *vaildateCompanyName({payload}, {call}) {
      yield call(vaildateCompanyName, payload)
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
