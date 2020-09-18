import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Tooltip } from 'site-ui';
import { connect } from 'dva';
import './index.less';
import util from '@/util';
const Search = ({ uiEntity, musicEntity = {}, dispatch }: any) => {
  const [height, setheight]: any = useState(false);
  const [hoverRow, sethoverRow] = useState('');
  const tableRef: any = useRef();
  useEffect(() => {
    if (tableRef.current) {
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
                util.setCurrentMusic(record, pageX, pageY, dispatch);
              }}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            {record.mvid !== 0 && (
              <Icon
                size={20}
                style={{ cursor: 'pointer' }}
                type="iconfont icon-shipin1"
                onClick={util.playMv.bind(null, record.mvid)}
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
                onClick={util.collection.bind(null, dispatch, {
                  openCollection: true,
                  collectionId: record.id,
                })}
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
    <div
      className="app-search app-content-chidren"
      ref={tableRef}
      style={{ height: '100%' }}
    >
      <div className="app-search-header app-content-chidren-header">
        <span style={{ fontSize: 12, color: '#444' }}>
          查询结果总计
          <span className="app-search-header-count">
            {musicEntity.search.length}
          </span>
          条
        </span>
      </div>
      <Table
        bordered={false}
        rowKey="id"
        onCheck={false}
        checkable={false}
        pagination={false}
        loading={uiEntity.loading}
        dataSource={musicEntity.search}
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
export default connect(({ music, ui }: any) => ({ ...music, ...ui }))(Search);
