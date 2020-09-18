import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Drawer, Message } from 'site-ui';
import { connect } from 'dva';
import { Music, User } from '@/service';
import './index.less';
const message = new Message({
  duration: 3,
});
const collection = async ({ pid, tracks, userId }: any, dispatch: any) => {
  const res = await Music.tracksPlayList({
    op: 'add',
    pid,
    tracks,
  });
  if (res.code === 200) {
    message.success('收藏成功.');
  } else {
    message.error(res.message);
  }
  /** refresh playList */
  const { playlist } = await User.queryUserPlayList(userId);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  userInfo.playlist = playlist;
  dispatch({
    type: 'user/update',
    payload: userInfo,
  });
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};
const addTracks = () => {};
const Collection = ({
  onClose,
  dispatch,
  userEntity,
  musicEntity,
  uiEntity,
}: any) => {
  const { playlist, userId } = userEntity;
  return (
    <div className="app-collection">
      <Drawer
        title="添加到歌单"
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
        <div className="app-collection-tools">
          <span className="app-collection-tools-new" onClick={addTracks}>
            新建歌单
          </span>
        </div>
        <div className="app-collection-body">
          {playlist &&
            playlist
              .filter((item: any) => item.userId === userId)
              .map((item: any) => {
                return (
                  <div
                    className="app-collection-item"
                    key={item.id}
                    onClick={collection.bind(
                      null,
                      { pid: item.id, tracks: uiEntity.collectionId, userId },
                      dispatch,
                    )}
                  >
                    <div>
                      <img src={item.coverImgUrl + '?param=50y50'} />
                    </div>
                    <div style={{ paddingLeft: 20 }}>
                      <span style={{ fontSize: 12 }}>{item.name}</span> <br />
                      <span style={{ fontSize: 12 }}>{item.trackCount}</span>
                    </div>
                  </div>
                );
              })}
        </div>
      </Drawer>
    </div>
  );
};
export default connect(({ music, user, ui }: any) => ({
  ...music,
  ...user,
  ...ui,
}))(Collection);
