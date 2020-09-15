import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon } from 'site-ui';
import { connect } from 'dva';
import { Music } from '@/service';
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
  }, []);
  const query = async () => {
    setloading(true);
    const { code, recommend } = await Music.recommend();
    setloading(false);
    code === 200 &&
      dispatch({
        type: 'music/update',
        payload: {
          recommend: {
            data:
              recommend.map((item: any, index: number) => {
                item.sort = index + 1;
                item.artists = item.artists[0].name;
                item.image = item.album.picUrl;
                return item;
              }) || [],
            count: recommend.length,
          },
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
      render: (e: any) => {
        return (
          <Icon type="iconfont icon-bofang" style={{ cursor: 'pointer' }} />
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
      title: '操作',
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
            <Icon type="iconfont icon-xihuan1" />
            <Icon type="iconfont icon-shoucang" />
            <Icon type="iconfont icon-xiazai1" />
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
        dataSource={musicEntity.recommend && musicEntity.recommend.data}
        columns={columns}
        style={{ height }}
      />
    </div>
  );
};
export default connect(({ music }: any) => ({ ...music }))(Recommend);
