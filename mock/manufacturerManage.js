export function queryMftList(req, res) {
    const result = {
        code: 0,
        msg: 'success',
        data: [{
            "id": 23,
            "name": "厦门华夏国际电力发展有限公司",
            "info": null,
            "status": 0,
            "createBy": "lin",
            "createTime": 1544054761000,
            "modifyTime": 1545791067000,
            "modifyBy": "linmz",
            "tenantCode": "songneng"
        }],
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}