module.exports = {
    api: {
        outbound: {
            list: `/api/delivery/list`,
            create: `/api/delivery/create`,
            update: `/api/delivery/update`,
            cars: `api/delivery/cars`,
            statistics: `/api/delivery/statistics`,
        },
        entry: {
            list: `/api/delivery/list`,
            create: `/api/delivery/create`,
            update: `/api/delivery/update`,
            cars: `api/delivery/cars`,
            statistics: `/api/delivery/statistics`,
        },
        userManage: {
            create: `/api/user/create`,
            list: `/api/user/list`,
            update: `/api/user/update`,
            vaildateLoginName: `/api/user/vaildate`,
        },
        companyManage: {
            list: `/api/company/list`,
            listAll: `/api/company/listAll`,
            create: `/api/company/create`,
            update: `/api/company/update`,
            vaildateCompanyName: `/api/company/vaildate`,
        },
        productManage: {
            list: `/api/product/list`,
            create: `/api/product/create`,
            update: `/api/product/update`,
        },
        manufacturerManage: {
            list: `/api/mft/list`,
            create: `/api/mft/create`,
            update: `/api/mft/update`,
        },
        libraryManage: {
            list: `/api/entrepot/list`,
            listAll: `/api/entrepot/listAll`,
            create: `/api/entrepot/create`,
            update: `/api/entrepot/update`,
        },
        journal: {
            list: `/api/log/list`,
        },
    },
}