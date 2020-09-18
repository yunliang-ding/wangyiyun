/**
 * util
 */
import { Music } from '@/service';
import { Message } from 'site-ui';
const message = new Message({
  duration: 3,
});
const Window: any = window;
const $: any = document.querySelector.bind(document);
export default {
  /** */
  setloading(loading: boolean, dispatch: any) {
    dispatch({
      type: 'ui/update',
      payload: {
        loading,
      },
    });
  },
  /** 动画 */
  playAnimation(pageX: number, pageY: number) {
    // 获取鼠标坐标
    let el = $('#play-animation');
    if (el) {
      el.style.right = document.body.clientWidth - pageX - 120 + 'px';
      el.style.bottom = document.body.clientHeight - pageY - 20 + 'px';
      setTimeout(() => {
        el.classList = 'play-animation-start';
      }, 800);
    }
    setTimeout(() => {
      if (el) {
        el.classList = '';
      }
    }, 3000);
  },
  /** 播放歌曲 */
  async setCurrentMusic(
    currentMusic: any,
    pageX: number,
    pageY: number,
    dispatch: any,
  ) {
    this.setloading(true, dispatch);
    const music = await Music.queryMusicById(
      currentMusic.id,
      currentMusic.name,
      currentMusic.duration,
      currentMusic.artists,
      pageX,
      pageY,
    );
    if (music) {
      dispatch({
        type: 'music/update',
        payload: {
          currentMusic: music,
          musicCache: JSON.parse(localStorage.getItem('music') || '[]'),
        },
      });
      Window.progressEntity.playing = true;
      dispatch({
        type: 'progress/update',
        payload: Window.progressEntity,
      });
      sessionStorage.setItem('progress', JSON.stringify(Window.progressEntity));
    } else {
      message.error('暂无版权!');
    }
    this.setloading(false, dispatch);
  },
  /**play all */
  playAll(dataSource: any, musicEntity: any, dispatch: any) {
    dataSource.forEach((music: any) => {
      if (!musicEntity.musicCache.some((item: any) => item.id === music.id)) {
        musicEntity.musicCache.push({
          id: music.id,
          src: `https://music.163.com/song/media/outer/url?id=${music.id}`,
          name: music.name,
          duration: music.duration,
          artists: music.artists,
          image: music.image,
          lyric: '',
          tlyric: '',
          progress: 0,
          playing: true,
          comment: [],
        });
      }
    });
    dispatch({
      type: 'music/update',
      payload: {
        musicCache: musicEntity.musicCache,
      },
    });
    localStorage.setItem('music', JSON.stringify(musicEntity.musicCache));
  },
  /** play Mv */
  async playMv(id: string) {
    const {
      code,
      data: { url },
    } = await Music.queryMusicMv({ id });
    if (code === 200 && url) {
      window.open(url);
    }
  },
  /** collection */
  collection(dispatch: any, payload: any) {
    dispatch({
      type: 'ui/update',
      payload,
    });
  },
  /** search Music */
  async searchMusic(keywords: string, dispatch: any) {
    this.setloading(true, dispatch);
    const { code, result } = await Music.search({
      keywords,
      offset: 0,
      limit: 30,
    });
    if (code === 200) {
      // query image url
      const { code, songs } = await Music.songs({
        ids: result.songs
          ? result.songs.map((item: any) => item.id).join(',')
          : '',
      });
      if (code === 200) {
        dispatch({
          type: 'music/update',
          payload: {
            search:
              songs.map((item: any, index: number) => {
                item.sort = index + 1;
                item.artists = item.ar[0].name;
                item.album = item.al;
                item.image = item.al.picUrl;
                item.duration = item.dt;
                item.mvid = item.mv;
                return item;
              }) || [],
          },
        });
      }
    }
    this.setloading(false, dispatch);
  },
};
