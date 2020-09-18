import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Input, Tooltip } from 'site-ui';
import { Login, SliderFooter } from '@/components';
import { User } from '@/service';
import { history } from 'umi';
import './index.less';
import util from '@/util';
const { Header, Sider, Content, Footer }: any = Layout;
const { SubMenu, Item }: any = Menu;
const AppLayout = ({ uiEntity, userEntity = {}, dispatch, children }: any) => {
  const { avatarUrl, nickname, userId } = userEntity;
  const [collapsed, setcollapsed]: any = useState();
  const [theme, settheme]: any = useState(
    new Date().getHours() > 18 || new Date().getHours() < 6 ? 'dark' : 'light',
  );
  const logOut = async () => {
    const { code } = await User.logOut({});
    if (code === 200) {
      localStorage.removeItem('userInfo');
      dispatch({
        type: 'user/update',
        payload: {},
      });
    }
  };
  // useEffect(() => {
  //   setInterval(() => {
  //     settheme(new Date().getHours() > 18 ? 'dark' : 'light'); // 更新主题定时器
  //   }, 60 * 1000);
  // }, []);
  const [keywords, setkeywords] = useState('');
  const searchMusic = async () => {
    await util.searchMusic(keywords, dispatch);
    history.push('/search');
  };
  const setopenlogin = (openLogin: boolean) => {
    dispatch({
      type: 'ui/update',
      payload: {
        openLogin,
      },
    });
  };
  return (
    <>
      <div
        className={
          theme === 'dark' ? 'app-layout app-layout-dark' : 'app-layout'
        }
      >
        <Layout>
          <Sider
            width={240}
            theme={theme}
            collapsible
            onCollapse={setcollapsed.bind(null, !collapsed)}
          >
            <div className="logo">
              {collapsed ? (
                <i className="iconfont icon-wangyiyunyinle"></i>
              ) : (
                <>
                  <span style={{ marginLeft: 10 }}>简听音乐</span>
                </>
              )}
            </div>
            <Menu
              theme={theme}
              collapsed={collapsed}
              collapsedWidth={80}
              menuClick={(openkey: any, selectKey: any) => {
                history.push(selectKey[0]);
              }}
              openKey={['3']}
              selectKey={['/recommend']}
            >
              <Item key="/discover" icon="suiconpassword-visible">
                发现音乐
              </Item>
              <Item key="/video" icon="iconfont icon-shipin1">
                视频
              </Item>
              <SubMenu key="3" icon="iconfont icon-yonghu" title="我的音乐">
                <Item key="/recommend" icon="iconfont icon-tuijian">
                  每日推荐
                </Item>
                <Item key="/record" icon="iconfont icon-history">
                  播放记录
                </Item>
                <Item key="/liked" icon="iconfont icon-xihuan">
                  喜欢的歌
                </Item>
              </SubMenu>
              <SubMenu key="4" icon="suiconhezi" title="创建的歌单">
                {userEntity.playlist &&
                  userEntity.playlist
                    .filter((item: any) => item.userId === userEntity.userId)
                    .map((item: any) => {
                      return (
                        <Item
                          icon="iconfont icon-gedan"
                          key={`/playlist/${item.id}`}
                        >
                          {item.name}
                        </Item>
                      );
                    })}
              </SubMenu>
              <SubMenu key="5" icon="iconfont icon-shoucang" title="收藏的歌单">
                {userEntity.playlist &&
                  userEntity.playlist
                    .filter((item: any) => item.userId !== userEntity.userId)
                    .map((item: any) => {
                      return (
                        <Item
                          icon="iconfont icon-gedan"
                          key={`/playlist/${item.id}`}
                        >
                          {item.name}
                        </Item>
                      );
                    })}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header>
              <div className="app-header-nav">
                <Input
                  value={keywords}
                  allowClear
                  onAllowClear={setkeywords.bind(null, '')}
                  onChange={(e: any) => {
                    setkeywords(e.target.value);
                  }}
                  onPressEnter={searchMusic}
                  placeholder="查找"
                  suffix={<Icon type="iconfont icon-search" />}
                />
              </div>
              <div className="app-header-nav">
                <Tooltip title="主题切换" placement="bottom" theme={theme}>
                  <Icon
                    type={
                      theme === 'dark'
                        ? 'iconfont icon-icon_huabanfuben'
                        : 'iconfont icon-baitianmoshimingliangmoshi'
                    }
                    size={20}
                    onClick={settheme.bind(
                      null,
                      theme === 'dark' ? 'light' : 'dark',
                    )}
                  />
                </Tooltip>
              </div>
              {userId ? (
                <>
                  <div className="app-header-nav">
                    <img src={avatarUrl} />
                    <span style={{ marginLeft: 10, fontSize: 12 }}>
                      {nickname}
                    </span>
                  </div>
                  <div className="app-header-nav">
                    <Tooltip
                      title={
                        <span
                          onClick={logOut}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          退出
                        </span>
                      }
                      placement="bottom"
                      theme={theme}
                    >
                      <Icon type="iconfont icon-shezhi1" size={20} />
                    </Tooltip>
                  </div>
                </>
              ) : (
                <div className="app-header-nav">
                  <Tooltip title="登录" placement="bottom" theme={theme}>
                    <span onClick={setopenlogin.bind(null, true)}>
                      <Icon type="iconfont icon-log-in" size={20} />
                    </span>
                  </Tooltip>
                </div>
              )}
            </Header>
            <Content>
              <div className="main">{children}</div>
            </Content>
            <Footer>
              <SliderFooter />
            </Footer>
          </Layout>
        </Layout>
      </div>
      {uiEntity.openLogin && (
        <Login onClose={setopenlogin.bind(null, false)} theme={theme} />
      )}
    </>
  );
};
export default connect(({ user, music, ui }: any) => ({
  ...user,
  ...music,
  ...ui,
}))(AppLayout);
