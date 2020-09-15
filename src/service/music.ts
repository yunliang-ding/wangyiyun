/**
 * 歌曲相关
 */
import { get } from '@/axios';
export default {
  // 推荐歌曲
  async recommend() {
    return get(`/api/recommend/songs?&timestamp=${new Date().getTime()}`, {});
  },
  // 查找指定音乐
  async queryMusicById(
    id: string,
    name: string,
    duration: string,
    artists: string,
  ): Promise<any> {
    // 1:先去磁盘查找
    let song: any = false;
    let music: any = {};
    // this.musicsCache.find(_item => {
    //   return _item.id === id
    // })
    if (song) {
      music.playing = true;
      if (song.lyric === '') {
        //没有歌词需要查一下
        const { lrc, tlyric } = await get('/api/lyric', {
          id,
        });
        song.lyric =
          lrc && lrc.lyric && lrc.lyric.replace(/↵/g, '').replace(/\n/g, '#*#');
        song.tlyric =
          tlyric &&
          tlyric.lyric &&
          tlyric.lyric.replace(/↵/g, '').replace(/\n/g, '#*#');
      }
      music = song;
    } else {
      const { data } = await get('/api/song/url', {
        id,
      });
      if (data[0].url === null) {
        return {};
      }
      // 不在缓存中就发请求
      const detail = await get('/api/song/detail', {
        ids: id,
      });
      const lyric = await get('/api/lyric', {
        id,
      });
      if (detail.code === 200 && lyric.code === 200) {
        music = {
          id,
          src: `https://music.163.com/song/media/outer/url?id=${id}`,
          name,
          duration,
          artists,
          image: (detail.songs && detail.songs[0].al.picUrl) || '',
          lyric:
            lyric.lrc &&
            lyric.lrc.lyric &&
            lyric.lrc.lyric.replace(/↵/g, '').replace(/\n/g, '#*#'),
          tlyric:
            lyric.tlyric &&
            lyric.tlyric.lyric &&
            lyric.tlyric.lyric.replace(/↵/g, '').replace(/\n/g, '#*#'),
          progress: 0,
          playing: true,
          comment: [],
          album: detail.songs[0].al,
        };
        // this.musicsCache.push(this.music)
        // localStorage.setItem('music', JSON.stringify(toJS(this.musicsCache)))
      }
    }
    return music;
  },
};
