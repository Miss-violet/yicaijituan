import pathToRegexp from 'path-to-regexp'
import { info } from '../services/outbound'


export default {
  namespace: 'report',

  state: {
    standardColumnTitleData: [],
    detail: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        const match = pathToRegexp('/report/:id').exec(location.pathname)
        if (match && Number(match[1])) {
          dispatch({
            type: 'info',
            payload: {
              id: match[1],
            },
          })

        }
      })
    },
  },

  effects: {
    *info({ payload }, { call, put }) {
      const res = yield call(info, payload.id)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            detail: res.data,
          },
        })
        yield put({
          type: 'productManage/queryStandardTitleList',
          payload: {
            productId: res.data.productId,
            type: 1,
          },
        })
        yield put({
          type: 'productManage/info',
          payload: {
            productId: res.data.productId,
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
