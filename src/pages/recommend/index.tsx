import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Tooltip, Button, Message } from 'site-ui';
import { connect } from 'dva';
import { Music } from '@/service';
import './index.less';
const message = new Message({
  duration: 3,
});
const weekMapping: any = {
  '0': '周 日',
  '1': '周 一',
  '2': '周 二',
  '3': '周 三',
  '4': '周 四',
  '5': '周 五',
  '6': '周 六',
};
const Recommend = ({ musicEntity = {}, dispatch }: any) => {
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
  const setCurrentMusic = async (
    currentMusic: any,
    pageX: number,
    pageY: number,
  ) => {
    setloading(true);
    const music = await Music.queryMusicById(
      currentMusic.id,
      currentMusic.name,
      currentMusic.duration,
      currentMusic.artists,
      pageX,
      pageY,
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
      message.error('暂无版权!');
    }
  };
  const playMv = async (id: string) => {
    const {
      code,
      data: { url },
    } = await Music.queryMusicMv({ id });
    if (code === 200 && url) {
      window.open(url);
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
          <>
            <Icon
              type={playing ? 'iconfont icon-shengyin' : 'iconfont icon-bofang'}
              style={{ cursor: 'pointer' }}
              onClick={({ pageX, pageY }: any) => {
                setCurrentMusic(record, pageX, pageY);
              }}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            {record.mvid !== 0 && (
              <Icon
                size={20}
                style={{ cursor: 'pointer' }}
                type="iconfont icon-shipin1"
                onClick={playMv.bind(null, record.mvid)}
              />
            )}
          </>
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
  const playAll = () => {
    musicEntity.recommend.forEach((music: any) => {
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
    localStorage.setItem('music', JSON.stringify(musicEntity.musicCache));
  };
  return (
    <div
      className="app-recommend app-content-chidren"
      ref={tableRef}
      style={{ height: '100%' }}
    >
      <div className="app-recommend-header app-content-chidren-header">
        <div className="dates">
          <div className="datas-weeks">{weekMapping[new Date().getDay()]}</div>
          <div className="datas-days">{new Date().getDate()}</div>
        </div>
        <span style={{ fontSize: 12, color: '#444' }}>
          《每日歌曲推荐》依据您的音乐口味生成, 6:00 准时更新
        </span>
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
        dataSource={musicEntity.recommend}
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
export default connect(({ music }: any) => ({ ...music }))(Recommend);
