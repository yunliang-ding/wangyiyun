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
  const { currentMusic } = musicEntity;
  const [comment, setcomment] = useState({
    hotComments: [],
    comments: [],
    total: 0,
  });
  useEffect(() => {
    query();
  }, []);
  const query = async () => {
    const { code, hotComments, total, comments } = await Music.queryCommentById(
      {
        id: currentMusic.id,
        offset: 0,
        limit: 30,
      },
    );
    if (code === 200) {
      setcomment({
        hotComments,
        total,
        comments,
      });
    }
  };
  return (
    <div className="app-song-detail">
      <Drawer
        title={
          <>
            <span style={{ fontSize: 14 }}>{currentMusic.name}</span>
            <span style={{ fontSize: 12, marginLeft: 8, opacity: 0.8 }}>
              {currentMusic.artists}
            </span>
          </>
        }
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
        <div className="app-song-detail-body">
          <div className="app-song-detail-body-comment">
            {comment.hotComments.map((item: any) => {
              return (
                <div
                  key={item.commentId}
                  className="app-song-detail-body-comment-item"
                >
                  <img src={item.user.avatarUrl + '?param=30y30'} />
                  <div className="app-song-detail-body-comment-item-right">
                    <span>{item.user.nickname}</span>
                    <span>{new Date(item.time).toLocaleDateString()}</span>
                    <span>{new Date(item.time).toLocaleTimeString()}</span>
                    <div className="app-song-detail-body-comment-item-right-content">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="app-song-detail-body-simi"></div>
        </div>
      </Drawer>
    </div>
  );
};
export default connect(({ music, user, ui }: any) => ({
  ...music,
  ...user,
  ...ui,
}))(SongDetail);
