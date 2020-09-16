/**
 * 歌曲相关
 */
import { get } from '@/axios';
import util from '@/util';
export default {
  // 推荐歌曲
  async recommend() {
    return get(`/api/recommend/songs?&timestamp=${new Date().getTime()}`, {});
  },
  // 播放记录
  async record(params: any) {
    return get(`/api/user/record`, params);
  },
  // 查找指定音乐
  async queryMusicById(
    id: string,
    name: string,
    duration: string,
    artists: string,
  ): Promise<any> {
    const musicCache = JSON.parse(localStorage.getItem('music') || '[]');
    // 1:先去磁盘查找
    let song: any = musicCache.find((item: any) => {
      return item.id === id;
    });
    let music: any = {};
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
        return false;
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
        musicCache.push(music);
        localStorage.setItem('music', JSON.stringify(musicCache));
        util.playAnimation();
      }
    }
    localStorage.setItem('currentMusic', JSON.stringify(music));
    return music;
  },
};
