const progressEntity = JSON.parse(
  sessionStorage.getItem('progress') ||
    '{"progress":0, "playing":false, "voice": 100}',
);
export default {
  namespace: 'progress',
  state: {
    progressEntity,
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
