import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Icon, Input } from 'site-ui';
import './index.less';
const { Header, Sider, Content, Footer }: any = Layout;
const { SubMenu, Item }: any = Menu;
export default () => {
  const [collapsed, setcollapsed]: any = useState();
  const [theme, settheme]: any = useState('dark');
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
                <span>我的网易云音乐</span>
              )}
            </div>
            <Menu
              theme={theme}
              collapsed={collapsed}
              collapsedWidth={80}
              menuClick={(openkey: any, selectKey: any) => {
                console.log(openkey, selectKey);
              }}
              openKey={['1']}
              selectKey={['1-2']}
            >
              <SubMenu key="1" icon="icon-yonghu" title="我的音乐">
                <Item key="1-1" icon="suiconmessage">
                  每日推荐
                </Item>
                <Item key="1-2" icon="suiconmessage">
                  播放记录
                </Item>
                <Item key="1-3" icon="suiconmessage">
                  喜欢的歌
                </Item>
              </SubMenu>
              <SubMenu key="2" icon="suiconhezi" title="Navigation Two">
                <Item key="2-1">Option 1</Item>
                <SubMenu key="2-2" title="Option 2">
                  <Item key="2-2-1" icon="suiconempty">
                    Option 1
                  </Item>
                  <Item key="2-2-2">Option 2</Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="3" icon="suiconjiaohu" title="Navigation Three">
                <Item key="3-1">Option 1</Item>
              </SubMenu>
              <SubMenu
                key="4"
                icon="suiconicon_yingyongguanli"
                title="Navigation Four"
              >
                <Item key="4-1" icon="suiconcloud-form">
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
                <Dropdown
                  overlay={
                    <>
                      {['@site-ui', 'logout'].map(item => {
                        return (
                          <p key={item} style={{ fontSize: 12, padding: 4 }}>
                            {item}
                          </p>
                        );
                      })}
                    </>
                  }
                >
                  <div className="user">
                    <i
                      className="iconfont icon-palette"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                </Dropdown>
              </div>
            </Header>
            <Content>
              <div className="main">Content</div>
            </Content>
            <Footer>music @2020 created by yunliang-ding</Footer>
          </Layout>
        </Layout>
      </div>
    </>
  );
};
