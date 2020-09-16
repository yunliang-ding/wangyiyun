export default {
  namespace: 'progress',
  state: {
    progressEntity: {
      progress: 0,
      playing: false,
    },
  },
  effects: {},
  reducers: {
    update(state: any, { payload }: any) {
      let { progressEntity } = state;
      progressEntity = {
        ...progressEntity,
        ...payload,
      };
      return {
        ...state,
        progressEntity,
      };
    },
  },
};
