const Mock = require('mockjs')
// const api = require('../utils/api')

// const { outbound } = api

// let deliveryListData = Mock.mock({
//     "currentPage": 0,
//     "pageSize": 0,
//     "rows": [
//         {
//             "auditor": "string",
//             "batchNo": "string",
//             "carNo": "string",
//             "checker": "string",
//             "createBy": "string",
//             "createTime": "2018-06-19T01:33:57.701Z",
//             "deliveryNo": "string",
//             "deliveryTime": "2018-06-19T01:33:57.701Z",
//             "distributorId": 0,
//             "distributorName": "string",
//             "grossWeight": 0,
//             "id": 0,
//             "level": "ONE",
//             "modifyBy": "string",
//             "modifyTime": "2018-06-19T01:33:57.701Z",
//             "netWeight": 0,
//             "productId": 0,
//             "productName": "string",
//             "qrcodeUrl": "string",
//             "remark": "string",
//             "status": "EFFECTIVE",
//             "supplierId": 0,
//             "supplierName": "string",
//             "tareWeight": 0,
//             "techno": "SORTING",
//         },
//     ],
//     "total": 0,
//     "totalPage": 0,
// })
const deliveryListData = [
    {
        "id": 2459,
        "deliveryNo": "19080236210690",
        "deliveryTime": 1550709228000,
        "outTime": 1550709328000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 95,
        "distributorName": "海顺鑫",
        "customer": "海顺鑫",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 11,
        "entrepotName": "一期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": null,
        "checker": "汤王钦",
        "auditor": "林自国",
        "carNo": "D/0229",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2459.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "linzg",
        "createTime": 1550709367000,
        "modifyTime": null,
        "modifyBy": null,
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2458,
        "deliveryNo": "19220227200455",
        "deliveryTime": 1550672765000,
        "outTime": 1550672797000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 88,
        "distributorName": "益材公司",
        "customer": "益材公司",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 10,
        "entrepotName": "#2分选细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 44.19,
        "checker": "汤王钦",
        "auditor": "颜晓辉",
        "carNo": "D/C3615",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 0,
        "techno": 1,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2458.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "yanxh",
        "createTime": 1550672824000,
        "modifyTime": 1550673851000,
        "modifyBy": "yanxh",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2457,
        "deliveryNo": "19190212205222",
        "deliveryTime": 1550661121000,
        "outTime": 1550661145000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 90,
        "distributorName": "诚德利",
        "customer": "诚德利",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 11,
        "entrepotName": "一期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 34.71,
        "checker": "汤王钦",
        "auditor": "颜晓辉",
        "carNo": "闽D9216",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2457.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "yanxh",
        "createTime": 1550661172000,
        "modifyTime": 1550669690000,
        "modifyBy": "yanxh",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2456,
        "deliveryNo": "19170213204507",
        "deliveryTime": 1550653966000,
        "outTime": 1550653999000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 93,
        "distributorName": "海豪鑫",
        "customer": "海豪鑫",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 11,
        "entrepotName": "一期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 38.61,
        "checker": "汤王钦",
        "auditor": "颜晓辉",
        "carNo": "D/D3967",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2456.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "yanxh",
        "createTime": 1550654026000,
        "modifyTime": 1550669698000,
        "modifyBy": "yanxh",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2455,
        "deliveryNo": "19140234204294",
        "deliveryTime": 1550644436000,
        "outTime": 1550644454000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 98,
        "distributorName": "诚立兴",
        "customer": "诚立兴",
        "productId": 54,
        "productName": "其它类",
        "entrepotId": 16,
        "entrepotName": "#1渣仓",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 23.11,
        "checker": null,
        "auditor": null,
        "carNo": "闽D93769",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 4,
        "techno": 4,
        "qrcodeUrl": null,
        "title": "其它类",
        "remark": null,
        "status": 0,
        "createBy": "xiaolx",
        "createTime": 1550644482000,
        "modifyTime": 1550644910000,
        "modifyBy": "xiaolx",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2454,
        "deliveryNo": "19120254203840",
        "deliveryTime": 1550638384000,
        "outTime": 1550638449000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 96,
        "distributorName": "海桥",
        "customer": "海桥",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 12,
        "entrepotName": "二期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 47.91,
        "checker": "龚永华",
        "auditor": "肖联喜",
        "carNo": "D/8083",
        "loadingTime": 1550638387000,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2454.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "xiaolx",
        "createTime": 1550638478000,
        "modifyTime": 1550644993000,
        "modifyBy": "xiaolx",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2453,
        "deliveryNo": "19100216203759",
        "deliveryTime": 1550628909000,
        "outTime": 1550628966000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 88,
        "distributorName": "益材公司",
        "customer": "益材公司",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 10,
        "entrepotName": "#2分选细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 46.81,
        "checker": "龚永华",
        "auditor": "肖联喜",
        "carNo": "D/3700",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 0,
        "techno": 1,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2453.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "xiaolx",
        "createTime": 1550628998000,
        "modifyTime": 1550645043000,
        "modifyBy": "xiaolx",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2452,
        "deliveryNo": "19090258203991",
        "deliveryTime": 1550627782000,
        "outTime": 1550627893000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 92,
        "distributorName": "海嵩飞",
        "customer": "海嵩飞",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 11,
        "entrepotName": "一期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 47.31,
        "checker": "龚永华",
        "auditor": "肖联喜",
        "carNo": "闽DD0709",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2452.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "xiaolx",
        "createTime": 1550627920000,
        "modifyTime": 1550645069000,
        "modifyBy": "xiaolx",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2451,
        "deliveryNo": "19090237205681",
        "deliveryTime": 1550626592000,
        "outTime": 1550626647000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 95,
        "distributorName": "海顺鑫",
        "customer": "海顺鑫",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 12,
        "entrepotName": "二期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 45.48,
        "checker": "龚永华",
        "auditor": "肖联喜",
        "carNo": "D/0229",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2451.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "xiaolx",
        "createTime": 1550626677000,
        "modifyTime": 1550645100000,
        "modifyBy": "xiaolx",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }, {
        "id": 2450,
        "deliveryNo": "19090201201060",
        "deliveryTime": 1550624347000,
        "outTime": 1550624442000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 91,
        "distributorName": "兴嵩源",
        "customer": "兴嵩源",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 11,
        "entrepotName": "一期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": 34.40,
        "checker": "龚永华",
        "auditor": "肖联喜",
        "carNo": "闽D6993",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2450.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "xiaolx",
        "createTime": 1550624471000,
        "modifyTime": 1550645122000,
        "modifyBy": "xiaolx",
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": null,
    }
]

export function queryDeliveryList(req, res) {
    const result = {
        code: 0,
        msg: 'success',
        data: {
            "total": 10,
            "totalPage": 1,
            "currentPage": 0,
            "pageSize": 20,
            "rows": deliveryListData,
        },
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}
export function queryDeliveryCarsList(req, res) {
    const result = {
        code: 0,
        msg: 'success',
        data: ["D/D6593", "D/0229", "闽D9216", "闽D6993", "D/8083", "闽DB8083", "D/D6888", "闽DD0709", "闽D8537", "闽DD6593", "D/D3967", "闽D93769", "D/9216", "闽D3906", "D/3700", "D/C3615", "闽D93775"],
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}
export function queryDeliveryStatistics(req, res) {
    const result = {
        code: 0,
        msg: 'success',
        data: {
            "sumTareWeight": 0,
            "sumGrossWeight": 0,
            "sumNetweight": 4669.64,
            "totalRecords": 131,
        },
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}
export function queryDeliveryInfo(req, res) {
    const data = {
        "id": 2459,
        "deliveryNo": "19110211215755",
        "deliveryTime": 1550718563000,
        "outTime": 1550718669000,
        "supplierId": 23,
        "supplierName": "厦门华夏国际电力发展有限公司",
        "distributorId": 96,
        "distributorName": "海桥",
        "customer": "海桥",
        "productId": 41,
        "productName": "通用合格证",
        "entrepotId": 11,
        "entrepotName": "一期细灰库",
        "tareWeight": null,
        "grossWeight": null,
        "netWeight": null,
        "checker": "汤王钦",
        "auditor": "林自国",
        "carNo": "D/8093",
        "loadingTime": null,
        "batchNo": "HX-",
        "level": 1,
        "techno": 3,
        "qrcodeUrl": "http://images.51flyash.com/songneng_2460.jpg",
        "title": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "createBy": "linzg",
        "createTime": 1550718718000,
        "modifyTime": null,
        "modifyBy": null,
        "tenantCode": "songneng",
        "allowModifyOutTime": 0,
        "standards": [{
            "id": 20757,
            "standardId": 88,
            "standardName": "细度(%)",
            "parameter": "17.8",
            "type": 0,
            "pointNum": 1,
            "status": 0,
            params: {
                id: '001',
                rowId: '1',
                columnId: 'a',
                type: '0',
                productId: '41',
                val: '1.1',
                pointNum: '1',
            },
        }, {
            "id": 20758,
            "standardId": 89,
            "standardName": "需水比(%)",
            "parameter": "95",
            "pointNum": 0,
            "type": 0,
            "status": 0,
            params: {
                id: '002',
                rowId: '2',
                columnId: 'a',
                type: '0',
                productId: '41',
                val: '2.1',
                pointNum: '2',
            },
        }, {
            "id": 20759,
            "standardId": 90,
            "standardName": "烧失量(%)",
            "parameter": "0.24",
            "pointNum": 2,
            "type": 0,
            "status": 0,
            params: {
                id: '003',
                rowId: '3',
                columnId: 'a',
                type: '0',
                productId: '41',
                val: '3.1',
                pointNum: '3',
            },
        }, {
            "id": 20760,
            "standardId": 91,
            "standardName": "细度(%)",
            "parameter": "0.1",
            "pointNum": 1,
            "type": 0,
            "status": 0,
            params: {
                id: '004',
                rowId: '1',
                columnId: 'b',
                type: '0',
                productId: '41',
                val: '1.2',
                pointNum: '1',
            },
        }, {
            "id": 20761,
            "standardId": 92,
            "standardName": "需水比(%)",
            "parameter": "0.74",
            "pointNum": 2,
            "type": 0,
            "status": 0,
            params: {
                id: '005',
                rowId: '2',
                columnId: 'b',
                type: '0',
                productId: '41',
                val: '2.2',
                pointNum: '2',
            },
        }, {
            "id": 20762,
            "standardId": 93,
            "standardName": "烧失量(%)",
            "parameter": "0.09",
            "pointNum": 2,
            "type": 0,
            "status": 0,
            params: {
                id: '006',
                rowId: '3',
                columnId: 'b',
                type: '0',
                productId: '41',
                val: '3.2',
                pointNum: '3',
            },
        }, {
            "id": 20763,
            "standardId": 94,
            "standardName": "细度(%)",
            "parameter": "2.24",
            "pointNum": 2,
            "type": 0,
            "status": 0,
            params: {
                id: '007',
                rowId: '1',
                columnId: 'c',
                type: '0',
                productId: '41',
                val: '1.3',
                pointNum: '1',
            },
        }, {
            "id": 20764,
            "standardId": 95,
            "standardName": "需水比(%)",
            "parameter": "1.5",
            "pointNum": 1,
            "type": 0,
            "status": 0,
            params: {
                id: '008',
                rowId: '2',
                columnId: 'c',
                type: '0',
                productId: '41',
                val: '2.3',
                pointNum: '2',
            },
        }, {
            "id": 20765,
            "standardId": 96,
            "standardName": "烧失量(%)",
            "parameter": "",
            "pointNum": 1,
            "type": 1,
            "status": 0,
            params: {
                id: '009',
                rowId: '3',
                columnId: 'c',
                type: '0',
                productId: '41',
                val: '3.3',
                pointNum: '3',
            },
        },],
    }
    const result = {
        code: 0,
        msg: 'success',
        data,
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}
export function deliveryUpdate(req, res) {
    const result = {
        code: 0,
        msg: 'success',
        data: {},
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}