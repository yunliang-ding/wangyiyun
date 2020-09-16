import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Tooltip, Button, Message } from 'site-ui';
import { connect } from 'dva';
import { Music } from '@/service';
import util from '@/util';
import './index.less';
const message = new Message({
  duration: 3,
});
const Liked = ({ userEntity = {}, musicEntity = {}, dispatch }: any) => {
  const [loading, setloading] = useState(false);
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
  /** 查询推荐 */
  const query = async () => {
    setloading(true);
    const { code, ids } = await Music.liked({
      uid: userEntity.userId,
    });
    if (code === 200) {
      const { code, songs } = await Music.songs({
        ids: ids.join(','),
      });
      code === 200 &&
        dispatch({
          type: 'music/update',
          payload: {
            liked:
              songs.map((item: any, index: number) => {
                item.sort = index + 1;
                item.artists = item.ar[0].name;
                item.album = item.al;
                item.image = item.al.picUrl;
                item.duration = item.dt;
                item.mvid = item.mv;
                return item;
              }) || [],
          },
        });
    }
    setloading(false);
  };
  /** 播放歌曲 */
  const setCurrentMusic = async (currentMusic: any) => {
    setloading(true);
    const music = await Music.queryMusicById(
      currentMusic.id,
      currentMusic.name,
      currentMusic.duration,
      currentMusic.artists,
    );
    setloading(false);
    if (music) {
      dispatch({
        type: 'music/update',
        payload: {
          currentMusic: music,
          musicCache: JSON.parse(localStorage.getItem('music') || '[]'),
        },
      });
    } else {
      message.error('歌曲不存在!');
    }
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
              />
              <Icon
                type="iconfont icon-xiazai1"
                size={14}
                style={{ cursor: 'pointer', opacity: 0.8 }}
              />
            </div>
          )
        );
      },
    },
  ];
  const playAll = () => {
    musicEntity.liked.forEach((music: any) => {
      if (!musicEntity.musicCache.some((item: any) => item.id === music.id)) {
        musicEntity.musicCache.push({
          id: music.id,
          src: `https://music.163.com/song/media/outer/url?id=${music.id}`,
          name: music.name,
          duration: music.duration,
          artists: music.artists,
          image: music.image,
          lyric: '',
          tlyric: '',
          progress: 0,
          playing: true,
          comment: [],
        });
      }
    });
    dispatch({
      type: 'music/update',
      payload: {
        musicCache: musicEntity.musicCache,
      },
    });
    util.playAnimation();
    localStorage.setItem('music', JSON.stringify(musicEntity.musicCache));
  };
  return (
    <div
      className="app-liked app-content-chidren"
      ref={tableRef}
      style={{ height: '100%' }}
    >
      <div className="app-liked-header app-content-chidren-header">
        <Icon type="iconfont icon-xihuan" />
        <b>累计喜欢 {musicEntity.liked.length} 首歌曲</b>
        <Button
          style={{ width: 80, margin: '0 20px' }}
          type="dashed"
          onClick={playAll}
        >
          播放全部
        </Button>
      </div>
      <Table
        bordered={false}
        rowKey="id"
        onCheck={false}
        checkable={false}
        pagination={false}
        loading={loading}
        dataSource={musicEntity.liked}
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
export default connect(({ music, user }: any) => ({ ...music, ...user }))(
  Liked,
);
