const Mock = require('mockjs')

const getProduct = [
    {
        "id": 41,
        "name": "通用合格证",
        "type": 0,
        "printName": "粉煤灰",
        "remark": "强度活性指数检测报告待发。",
        "status": 0,
        "startTime": null,
        "endTime": null,
        "createBy": "lld",
        "createTime": 1531710053000,
        "modifyBy": "lin",
        "modifyTime": 1544057138000,
        "tenantCode": "songneng",
        "standards": [
            {
                "id": 88,
                "name": "细度(%)",
                "oneLevel": "12.0",
                "twoLevel": "30.0",
                "threeLevel": "45.0",
                "productId": 41,
                "pointNum": 1,
                "type": 0,
            },
            {
                "id": 89,
                "name": "需水比(%)",
                "oneLevel": "95",
                "twoLevel": "105",
                "threeLevel": "115",
                "productId": 41,
                "pointNum": 0,
                "type": 0,
            },
        ],
    },
]
let standardsTitleList = []
export function getProductList(req, res) {
    const product = {
        data: getProduct,
        "code": 0,
        "msg": "success",
        "success": true,
    }
    if (res && res.json) {
        res.json(product)
    } else {
        return product
    }
}

export function createStandardTitle(req, res) {
    const { name, type, productId, orderSort } = req.body
    const id = `${name}`
    standardsTitleList.push({ name, id, productId, type })
    const result = {
        "code": 0,
        "msg": "success",
        "data": {
            id,
            name,
            type,
            productId,
            orderSort,
            "tenantCode": "yicai",
            "createBy": "unique",
            "createTime": "yyyy-MM-dd HH:mm:ss",
            "modifyBy": "unique",
            "modifyTime": "yyyy-MM-dd HH:mm:ss"
        },
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}

export function delStandardTitle(req, res) {
    standardsTitleList = standardsTitleList.filter(item => item.id !== req.body)
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

export function editStandardTitle(req, res) {
    const { id, name } = req.body
    standardsTitleList = standardsTitleList.map(item => {
        if (item.id === id) {
            item.name = name
        }
        return item
    })
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

export function getStandardTitleList(req, res) {
    const { productId, type } = req.body
    const data = standardsTitleList.filter(item => item.productId === productId && item.type === type)
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

export function createStandardParams(req, res) {
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