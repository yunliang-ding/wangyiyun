import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Tooltip, Button, Message } from 'site-ui';
import { connect } from 'dva';
import { Music } from '@/service';
import util from '@/util';
import './index.less';
const message = new Message({
  duration: 3,
});
const Record = ({ userEntity = {}, musicEntity = {}, dispatch }: any) => {
  const [loading, setloading] = useState(false);
  const [height, setheight]: any = useState(false);
  const [hoverRow, sethoverRow] = useState('');
  const [type, settype] = useState(1);
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
    const { code, weekData, allData } = await Music.record({
      uid: userEntity.userId,
      type,
    });
    setloading(false);
    if (code === 200) {
      let data = weekData || allData;
      dispatch({
        type: 'music/update',
        payload: {
          record: data.map((item: any, index: number) => {
            item.sort = index + 1;
            item.id = item.song.id;
            item.name = item.song.name;
            item.artists = item.song.ar[0].name;
            item.image = item.song.al.picUrl;
            item.duration = item.song.dt;
            return item;
          }),
        },
      });
    }
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
    if (music) {
      dispatch({
        type: 'music/update',
        payload: {
          currentMusic: music,
          musicCache: JSON.parse(localStorage.getItem('music') || '[]'),
        },
      });
    } else {
      message.warning('歌曲不存在!');
    }
    setloading(false);
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
      width: '20%',
      ellipsis: true,
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
      title: '播放次数',
      dataIndex: 'playCount',
      key: 'playCount',
      width: '20%',
      className: 'music-score',
      render: (playCount: number, record: any) => {
        return (
          <div
            style={{
              height: 45,
              display: 'flex',
              alignItems: 'center',
              width: record.score + '%',
              background: '#9dc3ec47',
              padding: '0 10px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{playCount} 次</span>
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
          )
        );
      },
    },
  ];
  /** query type */
  useEffect(() => {
    query();
  }, [type]);
  /** play all */
  const playAll = () => {
    musicEntity.record.forEach((music: any) => {
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
    <div className="app-record" ref={tableRef} style={{ height: '100%' }}>
      <div className="app-record-header">
        <div className="app-record-header-tips">
          <b>《听歌排行》亲爱的！这是你在网易云的第</b>
          <span className="app-record-header-tips-days">
            {Math.floor(
              (new Date().getTime() - userEntity.createTime) /
                1000 /
                60 /
                60 /
                24,
            )}
          </span>
          <b>天</b>
          <Button
            style={{ width: 80, margin: '0 20px' }}
            type="dashed"
            onClick={playAll}
          >
            播放全部
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            width: 140,
            justifyContent: 'space-between',
          }}
        >
          <Button
            label="本周"
            style={{ width: 60 }}
            type={type === 1 ? 'primary' : 'dashed'}
            onClick={settype.bind(null, 1)}
          >
            本周
          </Button>
          <Button
            label="所有"
            style={{ width: 60 }}
            type={type === 0 ? 'primary' : 'dashed'}
            onClick={settype.bind(null, 0)}
          >
            所有
          </Button>
        </div>
      </div>
      <Table
        bordered={false}
        rowKey="id"
        onCheck={false}
        checkable={false}
        pagination={false}
        loading={loading}
        dataSource={musicEntity.record}
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
  Record,
);
