/**
 * 歌曲相关
 */
import { get } from '@/axios';
export default {
  // 推荐歌曲
  async recommend() {
    return get(`/api/recommend/songs?&timestamp=${new Date().getTime()}`, {});
  },
};
