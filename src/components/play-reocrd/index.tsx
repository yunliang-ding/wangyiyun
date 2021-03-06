import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Drawer } from 'site-ui';
import { connect } from 'dva';
import './index.less';
const PlayRecord = ({ onClose, dispatch, userEntity, musicEntity }: any) => {
  const [height, setheight]: any = useState(false);
  const [hoverRow, sethoverRow] = useState('');
  const tableRef: any = useRef();
  useEffect(() => {
    if (tableRef.current) {
      const { height } = tableRef.current.getBoundingClientRect();
      setheight(height);
    }
    window.addEventListener('resize', () => {
      if (tableRef.current) {
        const { height } = tableRef.current.getBoundingClientRect();
        setheight(height);
      }
    });
  }, []);
  /** 播放歌曲 */
  const setCurrentMusic = async (currentMusic: any) => {
    dispatch({
      type: 'music/update',
      payload: {
        currentMusic,
        musicCache: JSON.parse(localStorage.getItem('music') || '[]'),
      },
    });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
      render: (e: any, record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '播放',
      dataIndex: 'play',
      key: 'play',
      width: 60,
      render: (e: any, record: any) => {
        let playing =
          musicEntity.currentMusic && musicEntity.currentMusic.id === record.id;
        return (
          <Icon
            type={playing ? 'iconfont icon-shengyin' : 'iconfont icon-bofang'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentMusic(record);
            }}
          />
        );
      },
    },
    {
      title: '音乐标题',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      ellipsis: true,
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 60,
      render: (e: any, record: any) => {
        return (
          <Icon
            onClick={clear.bind(null, record.id)}
            type="iconfont icon-shanchu"
            style={{
              cursor: 'pointer',
            }}
          />
        );
      },
    },
  ];
  const clear = (id: string) => {
    const musicCache = musicEntity.musicCache.filter((item: any) => {
      return item.id !== id;
    });
    dispatch({
      type: 'music/update',
      payload: {
        musicCache,
      },
    });
    localStorage.setItem('music', JSON.stringify(musicCache));
  };
  const delAll = () => {
    dispatch({
      type: 'music/update',
      payload: {
        musicCache: [],
      },
    });
    localStorage.removeItem('music');
  };
  return (
    <div className="app-play-record">
      <Drawer
        title="播放歌单"
        style={{
          width: 460,
        }}
        closable
        top={64}
        mask
        footer={false}
        visible
        onClose={onClose}
      >
        <b className="del-all" onClick={delAll}>
          全部删除
        </b>
        <div ref={tableRef} style={{ height: '100%' }}>
          <Table
            bordered={false}
            rowKey="id"
            onCheck={false}
            checkable={false}
            pagination={false}
            dataSource={musicEntity.musicCache}
            columns={columns}
            style={{ height }}
          />
        </div>
      </Drawer>
    </div>
  );
};
export default connect(({ music, user }: any) => ({ ...music, ...user }))(
  PlayRecord,
);
