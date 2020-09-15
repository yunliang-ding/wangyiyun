export default {
  namespace: 'music',
  state: {
    musicEntity: {},
  },
  effects: {},
  reducers: {
    update(state: any, { payload }: any) {
      let { musicEntity } = state;
      musicEntity = {
        ...musicEntity,
        ...payload,
      };
      return {
        ...state,
        musicEntity,
      };
    },
  },
};
