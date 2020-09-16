const musicCache = JSON.parse(localStorage.getItem('music') || '[]');
export default {
  namespace: 'music',
  state: {
    musicEntity: {
      musicCache, // 播放磁盘
      currentMusic: JSON.parse(
        localStorage.getItem('currentMusic') ||
          JSON.stringify({
            id: '',
            url: 'http://',
            name: '',
            artists: '',
            duration: '',
            image: '',
            lyric: '',
            tlyric: '',
            progress: 0,
            playing: false,
            comment: [],
          }),
      ),
      search: [],
      record: [],
      recommend: [],
      liked: [],
      simi: [],
      playlist: [],
    },
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
