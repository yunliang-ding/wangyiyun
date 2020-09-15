import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Input, Tooltip } from 'site-ui';
import { Login } from '@/components';
import { User } from '@/service';
import './index.less';
const { Header, Sider, Content, Footer }: any = Layout;
const { SubMenu, Item }: any = Menu;
const AppLayout = ({ userEntity = {}, dispatch }: any) => {
  const { avatarUrl, nickname, userId } = userEntity;
  const [collapsed, setcollapsed]: any = useState();
  const [theme, settheme]: any = useState('dark');
  const [openlogin, setopenlogin]: any = useState(false);
  const logOut = async () => {
    const { code } = await User.logOut({});
    if (code === 200) {
      dispatch({
        type: 'user/update',
        payload: {},
      });
    }
  };
  useEffect(() => {}, []);
  return (
    <>
      <div
        className={
          theme === 'dark' ? 'app-layout app-layout-dark' : 'app-layout'
        }
      >
        <Layout>
          <Sider
            width={260}
            theme={theme}
            collapsible
            onCollapse={setcollapsed.bind(null, !collapsed)}
          >
            <div className="logo">
              {collapsed ? (
                <i className="iconfont icon-wangyiyunyinle"></i>
              ) : (
                <span>云音乐</span>
              )}
            </div>
            <Menu
              theme={theme}
              collapsed={collapsed}
              collapsedWidth={80}
              menuClick={(openkey: any, selectKey: any) => {
                console.log(openkey, selectKey);
              }}
              openKey={['3']}
              selectKey={['3-1']}
            >
              <Item key="1" icon="suiconpassword-visible">
                发现音乐
              </Item>
              <Item key="2" icon="iconfont icon-shipin1">
                视频
              </Item>
              <SubMenu key="3" icon="iconfont icon-yonghu" title="我的音乐">
                <Item key="3-1" icon="iconfont icon-tuijian">
                  每日推荐
                </Item>
                <Item key="3-2" icon="iconfont icon-history">
                  播放记录
                </Item>
                <Item key="3-3" icon="iconfont icon-xihuan">
                  喜欢的歌
                </Item>
              </SubMenu>
              <SubMenu key="4" icon="suiconhezi" title="创建的歌单">
                <Item key="4-1">Option 1</Item>
              </SubMenu>

              <SubMenu
                key="5"
                icon="suiconicon_yingyongguanli"
                title="收藏的歌单"
              >
                <Item key="5-1" icon="suiconcloud-form">
                  Option 1
                </Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header>
              <div className="app-layout-header-left">
                <Input
                  placeholder="查找"
                  suffix={<Icon type="suiconsearchicon" />}
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
              <div className="main">Content</div>
            </Content>
            <Footer>music @2020</Footer>
          </Layout>
        </Layout>
      </div>
      {openlogin && <Login onClose={setopenlogin.bind(null, false)} />}
    </>
  );
};
export default connect(({ user }: any) => ({ ...user }))(AppLayout);
//
