import pathToRegexp from 'path-to-regexp'
import { info } from '../services/outbound'
import { queryStandardTitleList } from '../services/productManage'


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
          type: 'queryStandardTitleList',
          payload: {
            productId: res.data.productId,
            type: 1,
          },
        })
      }
    },
    *queryStandardTitleList({ payload }, { call, put }) {
      const res = yield call(queryStandardTitleList, payload)
      const { type } = payload
      if (res.code === 0) {
        if (type === 0) {
          /* 行标题 */
          yield put({
            type: 'success',
            payload: {
              standardRowTitleData: res.data,
            },
          })
        }
        else if (type === 1) {
          /* 列标题 */
          yield put({
            type: 'success',
            payload: {
              standardColumnTitleData: res.data,
            },
          })
        }
      }
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
