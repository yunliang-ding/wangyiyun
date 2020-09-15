export default {
  namespace: 'user',
  state: {
    userEntity: {
      userId: 258252094,
      avatarUrl:
        'https://p3.music.126.net/7D-Dvbm6UJhR1Z931olS5w==/109951164610653344.jpg',
      nickname: '音乐不是我的全部',
    },
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
