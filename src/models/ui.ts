export default {
  namespace: 'ui',
  state: {
    uiEntity: {
      openCollection: false,
      openSongDetail: false,
      openLogin: false,
      collectionId: '',
    },
  },
  effects: {},
  reducers: {
    update(state: any, { payload }: any) {
      let { uiEntity } = state;
      uiEntity = {
        ...uiEntity,
        ...payload,
      };
      return {
        ...state,
        uiEntity,
      };
    },
  },
};
