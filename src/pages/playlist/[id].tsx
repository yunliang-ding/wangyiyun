import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Tooltip, Button } from 'site-ui';
import { connect } from 'dva';
import { Music } from '@/service';
import './index.less';
import util from '@/util'
const Songs = (props: any) => {
  const { uiEntity = {}, musicEntity = {}, dispatch }: any = props
  const [height, setheight]: any = useState(false);
  const [hoverRow, sethoverRow] = useState('');
  const tableRef: any = useRef();
  useEffect(() => {
    if (tableRef.current) {
      query();
      const { height } = tableRef.current.getBoundingClientRect();
      setheight(height - 50);
    }
    window.addEventListener('resize', () => {
      if (tableRef.current) {
        const { height } = tableRef.current.getBoundingClientRect();
        setheight(height - 50);
      }
    });
  }, []);
  /** update */
  useEffect(() => {
    query();
  }, [props.match.params.id])
  /** 查询推荐 */
  const query = async () => {
    util.setloading(true, dispatch);
    const { code, privileges, playlist } = await Music.playlist({
      id: props.match.params.id,
    });
    if (code === 200) {
      const { code, songs } = await Music.songs({
        ids: privileges.map((item: any) => item.id).join(',')
      });
      if (code === 200) {
        playlist.data = songs.map((item: any, index: number) => {
          item.sort = index + 1;
          item.artists = item.ar[0].name;
          item.album = item.al;
          item.image = item.al.picUrl;
          item.duration = item.dt;
          item.mvid = item.mv;
          return item;
        }) || []
      }
      code === 200 &&
        dispatch({
          type: 'music/update',
          payload: {
            playlist
          },
        });
    }
    util.setloading(false, dispatch);
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
        return <>
          <Icon
            type={playing ? 'iconfont icon-shengyin' : 'iconfont icon-bofang'}
            style={{ cursor: 'pointer' }}
            onClick={({ pageX, pageY }: any) => {
              util.setCurrentMusic(record, pageX, pageY, dispatch)
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {
            record.mvid !== 0 && <Icon size={20} style={{ cursor: 'pointer' }} type='iconfont icon-shipin1' onClick={util.playMv.bind(null, record.mvid)} />
          }
        </>
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
          hoverRow === record.id && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Tooltip title="取消喜欢" placement="bottom">
                <Icon
                  type="iconfont icon-xihuan"
                  size={14}
                  style={{ cursor: 'pointer', opacity: 0.8 }}
                />
              </Tooltip>
              <Icon
                type="iconfont icon-shoucang"
                size={14}
                style={{ cursor: 'pointer', opacity: 0.8 }}
                onClick={util.collection.bind(null, dispatch, { openCollection: true, collectionId: record.id })}
              />
              <Icon
                type="iconfont icon-xiazai1"
                size={14}
                style={{ cursor: 'pointer', opacity: 0.8 }}
                onClick={util.downloadMp3.bind(null, record)}
              />
            </div>
          )
        );
      },
    },
  ];
  return (
    <div className="app-playlist app-content-chidren" ref={tableRef} style={{ height: '100%' }}>
      <div className="app-playlist-header app-content-chidren-header">
        {
          musicEntity.playlist.createTime && <>
            <img src={musicEntity.playlist.creator.avatarUrl + '?param=60y60'}></img>
            <h5>
              {musicEntity.playlist.name}
            </h5>
            <h5>
              <span style={{ fontSize: 12, marginLeft: 10 }}>{new Date(musicEntity.playlist.createTime).toLocaleDateString()} 创建</span>
              <span style={{ fontSize: 12, margin: '0 10px', color: '#111' }}>{musicEntity.playlist.creator.nickname}</span>
            </h5>
            <h5 className='app-playlist-header-number'>
              <span>歌曲数</span>
              {musicEntity.playlist.data.length}
            </h5>
            <Button
              style={{ width: 80, margin: '0 20px' }}
              type="dashed"
              onClick={util.playAll.bind(null, musicEntity.playlist.data, musicEntity, dispatch)}
            >
              播放全部
        </Button>
          </>
        }
      </div>
      <Table
        bordered={false}
        rowKey="id"
        onCheck={false}
        checkable={false}
        pagination={false}
        loading={uiEntity.loading}
        dataSource={musicEntity.playlist.data}
        columns={columns}
        style={{ height }}
        rows={{
          onMouseEnter: (record: any) => {
            sethoverRow(record.id);
          },
          onMouseLeave: () => {
            sethoverRow('');
          },
        }}
      />
    </div>
  );
};
export default connect(({ music, user, ui }: any) => ({ ...music, ...user, ...ui }))(
  Songs,
);
