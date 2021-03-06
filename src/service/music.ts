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
  // 喜欢歌曲
  async liked(params: any) {
    return get(`/api/likelist?&timestamp=${new Date().getTime()}`, params);
  },
  // 批量查询歌曲ids
  async songs(params: any) {
    return get('/api/song/detail', params);
  },
  // 查询歌单
  async playlist(params: any) {
    return get('/api/playlist/detail', params);
  },
  // 查询关键字
  async search(params: any) {
    return get('/api/search', params);
  },
  //查询mv
  async queryMusicMv(params: any) {
    return get('/api/mv/url', params);
  },
  // 收藏歌曲
  async tracksPlayList(params: any) {
    return get('/api/playlist/tracks', params);
  },
  // 歌曲评论
  async queryCommentById(params: any) {
    return get('/api/comment/music', params);
  },
  // 查找指定音乐
  async queryMusicById(
    id: string,
    name: string,
    duration: string,
    artists: string,
    pageX?: number,
    pageY?: number,
  ): Promise<any> {
    const musicCache = JSON.parse(localStorage.getItem('music') || '[]');
    // 1:先去磁盘查找
    let song: any = musicCache.find((item: any) => {
      return item.id === id;
    });
    let music: any = {
      playing: true,
    };
    if (song) {
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
          url: data[0].url,
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
        pageY && pageX && util.playAnimation(pageX, pageY);
      }
    }
    localStorage.setItem('currentMusic', JSON.stringify(music));
    return music;
  },
};
