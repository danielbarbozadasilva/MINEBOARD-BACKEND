module.exports = [
  {
    permission: 'administrator',
    rule: [
      'USER_LIST_ID',
      'USER_UPDATE',
      'CLIENT_ID',
      'CLIENT_UPDATE',
      'CLIENT_DELETE',
      'CREATE_CATEGORY',
      'UPDATE_CATEGORY',
      'DELETE_CATEGORY',
    ]
  },
  {
    permission: 'client',
    rule: [
      'USER_LIST_ID',
      'USER_UPDATE',
      'USER_DELETE',
      'LIST_CLIENT',
      'CLIENT_ID',
      'CLIENT_UPDATE',
      'CLIENT_DELETE',
      'CREATE_RATING',
      'DELETE_RATING'
    ]
  }
]
