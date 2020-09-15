import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Tooltip } from 'site-ui';
import { connect } from 'dva';
import { Music } from '@/service';
import './index.less';
const Recommend = ({ musicEntity = {}, dispatch }: any) => {
  const [loading, setloading] = useState(false);
  const [height, setheight] = useState(false);
  const tableRef: any = useRef();
  useEffect(() => {
    if (tableRef.current) {
      query();
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
  /** 查询推荐 */
  const query = async () => {
    setloading(true);
    const { code, recommend } = await Music.recommend();
    setloading(false);
    code === 200 &&
      dispatch({
        type: 'music/update',
        payload: {
          recommend:
            recommend.map((item: any, index: number) => {
              item.sort = index + 1;
              item.artists = item.artists[0].name;
              item.image = item.album.picUrl;
              return item;
            }) || [],
        },
      });
  };
  /** 播放歌曲 */
  const setCurrentMusic = async (currentMusic: any) => {
    const music = await Music.queryMusicById(
      currentMusic.id,
      currentMusic.name,
      currentMusic.duration,
      currentMusic.artists,
    );
    dispatch({
      type: 'music/update',
      payload: {
        currentMusic: music,
        musicCache: JSON.parse(localStorage.getItem('music') || '[]'),
      },
    });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
      sort: true,
    },
    {
      title: '播放',
      dataIndex: 'play',
      key: 'play',
      width: 100,
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
      title: '',
      dataIndex: 'image',
      key: 'image',
      width: 50,
      render: (e: any, record: any) => {
        return (
          <img
            src={record.image + '?param=30y30'}
            style={{
              borderRadius: 4,
              width: 30,
              height: 30,
            }}
          ></img>
        );
      },
    },
    {
      title: '音乐标题',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      width: '12%',
      ellipsis: true,
    },
    {
      title: '专辑',
      dataIndex: 'album',
      key: 'album',
      width: '20%',
      ellipsis: true,
      render: (album: any) => {
        return album.name;
      },
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 140,
      render: (duration: any) => {
        return (
          <div>
            {Math.floor(duration / 1000 / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor((duration / 1000) % 60)
              .toString()
              .padStart(2, '0')}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'opeartion',
      key: 'opeartion',
      fixed: 'right',
      width: 140,
      render: (value: any, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Tooltip title="添加到喜欢" placement="bottom">
              <Icon
                type="iconfont icon-xihuan1"
                size={14}
                style={{ cursor: 'pointer', opacity: 0.8 }}
              />
            </Tooltip>
            <Icon
              type="iconfont icon-shoucang"
              size={14}
              style={{ cursor: 'pointer', opacity: 0.8 }}
            />
            <Icon
              type="iconfont icon-xiazai1"
              size={14}
              style={{ cursor: 'pointer', opacity: 0.8 }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div
      className="app-main-recommend"
      ref={tableRef}
      style={{ height: '100%' }}
    >
      <Table
        bordered={false}
        rowKey="id"
        onCheck={false}
        checkable={false}
        pagination={false}
        loading={loading}
        dataSource={musicEntity.recommend}
        columns={columns}
        style={{ height }}
      />
    </div>
  );
};
export default connect(({ music }: any) => ({ ...music }))(Recommend);
