import React, { useState } from 'react';
import { Modal, Input, Icon, Button, RadioGroup } from 'site-ui';
import { User } from '@/service';
import { connect } from 'dva';
import './index.less';
const Login = ({ onClose, dispatch }: any) => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [loginWay, setloginway]: any = useState(1);
  const onOk = async () => {
    const { code, profile, account } = await User.login({
      username,
      password,
      loginWay,
    });
    if (code === 200) {
      const { playlist } = await User.queryUserPlayList(profile.userId);
      onClose();
      let userInfo = {
        ...profile,
        playlist,
        loginWay,
        username,
        password,
        createTime: account.createTime,
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      window.location.reload(); // reload
      dispatch({
        type: 'user/update',
        payload: userInfo,
      });
    }
  };
  return (
    <Modal
      title="用户登录"
      style={{
        width: 600,
        height: 400,
      }}
      closable
      mask
      footer={
        <>
          <Button type="primary" onClick={onOk}>
            确定
          </Button>
          <Button onClick={onClose}>取消</Button>
        </>
      }
      visible
      onClose={onClose}
      onOk={onOk}
    >
      <div className="app-login-box">
        <div className="app-login-way">
          <RadioGroup
            options={[
              {
                label: '邮箱登录',
                value: 1,
              },
              {
                label: '手机号登录',
                value: 0,
              },
            ]}
            value={loginWay}
            onChange={(e: any) => {
              setloginway(e);
            }}
          />
        </div>
        <Input
          placeholder={loginWay === 1 ? '邮箱' : '手机号'}
          value={username}
          onChange={(e: any) => {
            setusername(e.target.value);
          }}
          prefix={
            <Icon
              size={18}
              type={
                loginWay === 1
                  ? 'iconfont icon-youxiang'
                  : 'iconfont icon-shouji'
              }
            />
          }
        />
        <Input
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e: any) => {
            setpassword(e.target.value);
          }}
          prefix={<Icon size={16} type="iconfont icon-mima" />}
        />
      </div>
    </Modal>
  );
};
export default connect()(Login);
