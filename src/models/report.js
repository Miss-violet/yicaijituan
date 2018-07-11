import pathToRegexp from 'path-to-regexp'
import { info } from '../services/outbound'
import { toDecimal } from '../utils/utils'

export default {
  namespace: 'report',

  state: {
    detail: {},
  },

  subscriptions: {
    setup({dispatch, history}) {
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
        res.data.standards.map(standardsItem => {
          const { pointNum } = standardsItem
          standardsItem.oneLevel = toDecimal(standardsItem.oneLevel, pointNum)
          standardsItem.twoLevel = toDecimal(standardsItem.twoLevel, pointNum)
          standardsItem.threeLevel = toDecimal(standardsItem.threeLevel, pointNum)
          standardsItem.parameter = toDecimal(standardsItem.parameter, pointNum)
          return standardsItem
        })
        yield put({
          type: 'success',
          payload: {
            detail: res.data,
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
