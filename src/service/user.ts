/**
 * 用户相关
 */
import { get } from '@/axios';
export default {
  // 退出登录
  async logOut(params: any) {
    return get('/api/logout', { params });
  },
  // 登录
  async login({ username, loginWay, password }: any) {
    const url = loginWay === 1 ? '/api/login' : '/api/login/cellphone';
    const params =
      loginWay === 1
        ? {
            email: username,
            password,
          }
        : {
            phone: username,
            password,
          };
    return get(url, params);
  },
  // 签到
  async signin() {
    return get('/api/daily_signin', {});
  },
};
