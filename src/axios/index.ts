import axios from 'axios';
import { User } from '@/service';
import { Message } from 'site-ui';
const message = new Message({
  duration: 3,
});
const qs = require('qs');
const get = async (url: string, params: any): Promise<any> => {
  let response = null;
  let options = {
    params,
    timeout: 30000,
    validateStatus: (status: number) => {
      // 控制允许接受的状态码范围
      return status >= 200 && status < 505;
    },
  };
  try {
    response = await axios.get(url, options);
    if (response.data.code === 301) {
      // 自动刷新登录
      try {
        if (localStorage.getItem('userInfo') === null) {
          message.error('需要登录!');
        } else {
          const { username, password, loginWay } = JSON.parse(
            localStorage.getItem('userInfo') || '',
          );
          await User.login({ username, password, loginWay });
          return await get(url, params); // 继续发送
        }
      } catch (e) {
        console.log(e);
      }
    } else if (response.data.code !== 200) {
      message.error(response.data.msg);
    }
    return response.data;
  } catch (err) {
    return {
      isError: true,
      statusCode: -10001,
      message: '接口异常',
      data: null,
    };
  }
};
const post = async (url: string, data: any, headers: any) => {
  data = data || {};
  let response = null;
  try {
    response = await axios.post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    return {
      isError: true,
      statusCode: -10001,
      message: '接口异常',
      data: null,
    };
  }
};
export { get, post };
