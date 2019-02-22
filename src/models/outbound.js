import { routerRedux } from 'dva/router'
import { outboundList, create, update, status, info, cars, statistics } from '../services/outbound'

import { manufacturerList } from '../services/manufacturerManage'
import { companyListAll } from '../services/companyManage'
import { productList, queryStandardTitleList } from '../services/productManage'



export default {
  namespace: 'outbound',

  state: {
    listData: [],
    total: '',
    manufacturerSelectList: [],
    companyAllSelectList: [],
    productSelectList: [],
    standardColumnTitleData: [],
    standardRowTitleData: [],
    selectedDetail: {},
    cars: [],
    sumNetweight: '',
    totalRecords: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/outbound') {
          if (sessionStorage.getItem('token') === '') {
            dispatch(routerRedux.push({
              pathname: '/user/login',
            }))
          } else {
            dispatch({
              type: 'queryList',
              payload: {
                "pageIndex": 0,
                "pageSize": 20,
                "sortField": null,
                "sortOrder": null,
                "params": {
                  startTime: null,
                  endTime: null,
                },
              },
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
    *queryCars({ payload }, { call, put }) {
      const carsRes = yield call(cars, payload)
      if (carsRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            cars: carsRes.data,
          },
        })
      }
    },
    *querySelectList({ payload }, { call, put }) {
      /* 生厂商下拉列表 */
      const manufacturerRes = yield call(manufacturerList, payload)
      if (manufacturerRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            manufacturerSelectList: manufacturerRes.data,
          },
        })
      }

      /* 公司下拉列表 */
      const companyAllRes = yield call(companyListAll, payload)
      if (companyAllRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            companyAllSelectList: companyAllRes.data,
          },
        })
      }

      /* 产品下拉列表 */
      const productRes = yield call(productList, payload)
      if (productRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            productSelectList: productRes.data,
          },
        })
      }

      /* 车牌号 */
      yield put({
        type: 'queryCars',
        payload: {},
      })
    },
    *queryList({ payload }, { call, put }) {
      const queryRes = yield call(outboundList, payload)
      const statisticsRes = yield call(statistics, payload)
      if (queryRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            listData: queryRes.data.rows,
            total: queryRes.data.total,
          },
        })
        yield put({
          type: 'queryCars',
          payload: {},
        })
      }
      if (statisticsRes.code === 0) {
        const { sumNetweight, totalRecords } = statisticsRes.data
        yield put({
          type: 'success',
          payload: {
            sumNetweight,
            totalRecords,
          },
        })
      }
    },
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
    *status({ payload, callback }, { call, put }) {
      const res = yield call(status, payload)
      if (res.code === 0) {
        yield put({
          type: 'queryList',
          payload: {},
        })
        if (callback) {
          callback(res.code)
        }
      }
    },
    *info({ payload, callback }, { call, put }) {
      const res = yield call(info, payload.id)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            selectedDetail: res.data,
          },
        })
        if (callback) callback(res.code, res.data);
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
