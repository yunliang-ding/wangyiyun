import React, { useState, useEffect, useRef } from 'react';
import { Table, Icon, Drawer, Message } from 'site-ui';
import { connect } from 'dva';
import { Music, User } from '@/service';
import './index.less';
const message = new Message({
  duration: 3,
});
const SongDetail = ({
  onClose,
  dispatch,
  userEntity,
  musicEntity,
  uiEntity,
}: any) => {
  const { playlist, userId } = userEntity;
  return (
    <div className="app-song-detail">
      <Drawer
        title="歌曲详情"
        style={{
          width: 'calc(100vw - 240px)',
        }}
        closable
        top={64}
        mask
        footer={false}
        visible
        onClose={onClose}
      >
        <div className="app-song-detail-body">SongDetail</div>
      </Drawer>
    </div>
  );
};
export default connect(({ music, user, ui }: any) => ({
  ...music,
  ...user,
  ...ui,
}))(SongDetail);
