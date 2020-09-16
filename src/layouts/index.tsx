import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Input, Tooltip } from 'site-ui';
import { Login, SliderFooter } from '@/components';
import { User } from '@/service';
import { history } from 'umi';
import './index.less';
const { Header, Sider, Content, Footer }: any = Layout;
const { SubMenu, Item }: any = Menu;
const AppLayout = ({ userEntity = {}, dispatch, children }: any) => {
  const { avatarUrl, nickname, userId } = userEntity;
  const [collapsed, setcollapsed]: any = useState();
  const [theme, settheme]: any = useState(
    new Date().getHours() > 18 || new Date().getHours() < 6 ? 'dark' : 'light',
  );
  const [openlogin, setopenlogin]: any = useState(false);
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
  useEffect(() => {
    setInterval(() => {
      settheme(new Date().getHours() > 18 ? 'dark' : 'dark'); // 更新主题定时器
    }, 60 * 1000);
  }, []);
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
              <div className="app-layout-header-left">
                <Input
                  placeholder="查找"
                  suffix={<Icon type="iconfont icon-search" />}
                />
              </div>
              <div className="app-layout-header-right">
                <div className="user">
                  {userId ? (
                    <Tooltip
                      placement="bottom"
                      title={
                        <div>
                          <p
                            style={{
                              fontSize: 12,
                              margin: 0,
                              cursor: 'pointer',
                            }}
                          >
                            {nickname}
                          </p>
                          <br />
                          <p
                            style={{
                              fontSize: 12,
                              margin: 0,
                              cursor: 'pointer',
                            }}
                            onClick={logOut}
                          >
                            退出
                          </p>
                        </div>
                      }
                    >
                      <img src={avatarUrl} />
                    </Tooltip>
                  ) : (
                    <Icon
                      type="suiconuser"
                      size={20}
                      onClick={setopenlogin.bind(null, true)}
                    />
                  )}
                </div>
              </div>
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
      {openlogin && (
        <Login onClose={setopenlogin.bind(null, false)} theme={theme} />
      )}
    </>
  );
};
export default connect(({ user, music }: any) => ({ ...user, ...music }))(
  AppLayout,
);
