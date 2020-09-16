const musicCache = JSON.parse(localStorage.getItem('music') || '[]');
const currentMusic = JSON.parse(localStorage.getItem('currentMusic') || '');
export default {
  namespace: 'music',
  state: {
    musicEntity: {
      musicCache, // 播放磁盘
      currentMusic: currentMusic || {
        id: '',
        src: 'http://',
        name: '',
        artists: '',
        duration: '',
        image: '',
        lyric: '',
        tlyric: '',
        progress: 0,
        playing: true,
        comment: [],
      },
      search: [],
      record: [],
      recommend: [],
      liked: [],
      simi: [],
      playlist: {
        data: [],
        creator: {},
      },
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
