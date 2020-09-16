const progress = JSON.parse(sessionStorage.getItem('progress') || '');
export default {
  namespace: 'progress',
  state: {
    progressEntity: progress || {
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
