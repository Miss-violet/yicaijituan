module.exports = {
  api: {
    outbound: {
      list: `/api/delivery/list`,
      create: `/api/delivery/create`,
      update: `/api/delivery/update`,
      cars: `/api/delivery/cars`,
      statistics: `/api/delivery/statistics`,
    },
    shipping: {
      list: `/api/shipping/list`,
      create: `/api/shipping/create`,
      update: `/api/shipping/update`,
      info: `/api/shipping/info`,
      del: `/api/shipping/delete`,
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
      standardTitleCreate: `/api/standardTitle/create`,
    },
    manufacturerManage: {
      list: `/api/mft/list`,
      create: `/api/mft/create`,
      update: `/api/mft/update`,
    },
    journal: {
      list: `/api/log/list`,
    },
    tenantManage: {
      list: `/api/tenant/list`,
      create: `/api/tenant/create`,
      update: `/api/tenant/update`,
      validateTenantCode: `/api/tenant/vaildate`,
    },
  },
};
