import { routerRedux } from 'dva/router'
import { outboundList, create, update, status, info, cars } from '../services/outbound'

import { manufacturerList } from '../services/manufacturerManage'
import { companyList } from '../services/companyManage'
import { productList } from '../services/productManage'



export default {
  namespace: 'outbound',

  state: {
    listData: [],
    manufacturerSelectList: [],
    companySelectList: [],
    productSelectList: [],
    selectedDetail: {},
    cars: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/outbound') {
          // if (!document.cookie && sessionStorage.getItem('cookie') === '') {
          if (sessionStorage.getItem('cookie') === '') {
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
      const companyRes = yield call(companyList, payload)
      if (companyRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            companySelectList: companyRes.data.rows,
          },
        })
      }

      /* 产品下拉列表 */
      const productRes = yield call(productList, payload)
      if (productRes.code === 0) {
        console.info('productRes.data->', productRes.data)
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
      const res = yield call(outboundList, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            listData: res.data.rows,
          },
        })
        yield put({
          type: 'queryCars',
          payload: {},
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
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
