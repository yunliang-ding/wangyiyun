export default {
  namespace: 'user',
  state: {
    userEntity: JSON.parse(localStorage.getItem('userInfo') || '{}'),
  },
  effects: {},
  reducers: {
    update(state: any, { payload }: any) {
      let { userEntity } = state;
      userEntity = {
        ...payload,
      };
      return {
        ...state,
        userEntity,
      };
    },
  },
};
