import { routerRedux } from 'dva/router';
import { create, update, del, productList, standardTitleCreate, standardTitleDelete, standardTitleEdit, queryStandardTitleList } from '../services/productManage'

export default {
  namespace: 'productManage',

  state: {
    data: [],
    standardTitleData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/productManage') {
          if (sessionStorage.getItem('token') === '') {
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
      const res = yield call(productList, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            data: res.data,
          },
        })
      }
    },
    *standardTitleCreate({ payload }, { call, put }) {
      const res = yield call(standardTitleCreate, payload)
      if (res.code === 0) {
        const { productId, type } = res.data
        yield put({
          type: 'success',
          payload: {
            newStandardTitle: { ...res.data },
          },
        })
        yield put({
          type: 'queryStandardTitleList',
          payload: {
            productId,
            type,
          },
        })
      }
    },
    *standardTitleDelete({ payload }, { call, put }) {
      const res = yield call(standardTitleDelete, payload.id)
      if (res.code === 0) {
        const { productId, type } = payload
        yield put({
          type: 'queryStandardTitleList',
          payload: {
            productId,
            type,
          },
        })
      }
    },
    *standardTitleEdit({ payload }, { call, put }) {
      const res = yield call(standardTitleEdit, payload)
      if (res.code === 0) {
        const { productId, type } = payload
        yield put({
          type: 'queryStandardTitleList',
          payload: {
            productId,
            type,
          },
        })
      }
    },
    *queryStandardTitleList({ payload }, { call, put }) {
      const res = yield call(queryStandardTitleList, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            standardTitleData: res.data,
          },
        })
      }
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
