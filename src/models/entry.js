import { routerRedux } from 'dva/router'
import { outboundList, create, update, status, info } from '../services/entry'
import { cars } from '../services/outbound'


import { manufacturerList } from '../services/manufacturerManage'
import { entrepotListAll } from '../services/libraryManage'



export default {
  namespace: 'entry',

  state: {
    listData: [],
    total: '',
    entrepotSelectList: [],
    selectedDetail: {},
    cars: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/entry') {
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

      /* 车牌号 */
      yield put({
        type: 'queryCars',
        payload: {},
      })

      /* 库位下拉列表 */
      const entrepotRes = yield call(entrepotListAll, payload)
      if (entrepotRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            entrepotSelectList: entrepotRes.data,
          },
        })
      }
    },
    *queryList({ payload }, { call, put }) {
      const queryRes = yield call(outboundList, payload)
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
