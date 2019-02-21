export function queryCompanyListAll(req, res) {
    const result = {
        code: 0,
        msg: 'success',
        data: [],
    }
    if (res && res.json) {
        res.json(result)
    } else {
        return result
    }
}