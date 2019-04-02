import {
  routerRedux
} from 'dva/router';
import {
  create,
  update,
  del,
  info,
  productList,
  standardTitleCreate,
  standardParamsUpdate,
  standardTitleDelete,
  standardTitleEdit,
  queryStandardTitleList,
  standardParamsCreate,
  standardParamsQuery
} from '../services/productManage'

export default {
  namespace: 'productManage',

  state: {
    data: [],
    standardColumnTitleData: [],
    standardRowTitleData: [],
    standardParams: [],
    productDetail: {},
  },

  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      return history.listen((location) => {
        if (location.pathname === '/productManage') {
          if (sessionStorage.getItem('token') === '') {
            dispatch(routerRedux.push({
              pathname: '/user/login',
            }))
          } else {
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
    * create({
      payload
    }, {
      call,
      put
    }) {
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
    * edit({
      payload
    }, {
      call,
      put
    }) {
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
    * delete({
      payload
    }, {
      call,
      put
    }) {
      const res = yield call(del, payload)
      if (res.code === 0) {
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    * info({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const res = yield call(info, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            productDetail: res.data,
          },
        })
      }
    },
    * queryList({
      payload
    }, {
      call,
      put
    }) {
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
    * standardTitleCreate({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const res = yield call(standardTitleCreate, payload)
      if (res.code === 0) {
        const {
          productId,
          type
        } = res.data
        yield put({
          type: 'success',
          payload: {
            newStandardTitle: { ...res.data
            },
          },
        })
        yield put({
          type: 'queryStandardTitleList',
          payload: {
            productId,
            type,
          },
        })
        // yield put({
        //   type: 'queryList',
        //   payload: {},
        // })
        if (callback) callback(res.data)
      }
    },
    * standardTitleDelete({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const res = yield call(standardTitleDelete, payload.id)
      if (res.code === 0) {
        const {
          productId,
          type
        } = payload
        yield put({
          type: 'queryStandardTitleList',
          payload: {
            productId,
            type,
          },
        })
      }
      if (callback) callback(res)
    },
    * standardTitleEdit({
      payload
    }, {
      call,
      put
    }) {
      const res = yield call(standardTitleEdit, payload)
      if (res.code === 0) {
        const {
          productId,
          type
        } = payload
        yield put({
          type: 'queryStandardTitleList',
          payload: {
            productId,
            type,
          },
        })
      }
    },
    * queryStandardTitleList({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const res = yield call(queryStandardTitleList, payload)
      const {
        type
      } = payload
      if (res.code === 0) {
        if (type === 0) {
          /* 行标题 */
          yield put({
            type: 'success',
            payload: {
              standardRowTitleData: res.data,
            },
          })
        } else if (type === 1) {
          /* 列标题 */
          yield put({
            type: 'success',
            payload: {
              standardColumnTitleData: res.data,
            },
          })
        }
        if (callback) callback(res)
      }
    },
    * standardParamsCreate({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const res = yield call(standardParamsCreate, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
        })
        if (callback) callback(res.code)
      }
    },
    * standardParamsUpdate({
      payload
    }, {
      call,
      put
    }) {
      const res = yield call(standardParamsUpdate, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
        })
      }
    },
    * standardParamsQuery({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const res = yield call(standardParamsQuery, payload)
      const {
        code,
        data
      } = res
      if (code === 0) {
        yield put({
          type: 'success',
          payload: {
            standardParams: data,
          },
        })
        if (callback) callback(data)
      }
    },
  },

  reducers: {
    success(state, {
      payload
    }) {
      return { ...state,
        ...payload
      }
    },
  },
};
