const getters = {
  sidebar: state => state.app.sidebar,

  token: state => state.login.token,
  avatar: state => state.login.avatar,
  roles: state => state.login.roles,

  adminList: state => state.admin.adminList,
  permission: state => state.admin.permission,
  adminType: state => state.admin.adminType,

  userList: state => state.user.userList,
  userBalanceList: state => state.user.userBalanceList,
  userLogList: state => state.user.userLogList,

  blockTxList: state => state.block.blockTxList,
  browserList: state => state.block.browserList,

  projectList: state => state.project.projectList,
  projectOrderList: state => state.project.projectOrderList,

  tokenList: state => state.token.tokenList,
  tokenPairList: state => state.token.tokenPairList,

  financialList: state => state.financal.financialList,
  financialOrder: state => state.financal.financialOrder,

  batchData: state => state.supplier.batchData
}
export default getters
