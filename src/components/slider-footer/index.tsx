import React, { useState, useEffect } from 'react';
import { Modal, Input, Icon, Badge, Message, Slider } from 'site-ui';
import { Music } from '@/service';
import { connect } from 'dva';
import './index.less';
const Window: any = window;
const message = new Message({
  duration: 3,
});
const $: any = document.querySelector.bind(document);
const SliderFooter = (props: any) => {
  const { duration, playing, progress, src, image, artists, name } =
    props.musicEntity.currentMusic || {};
  Window.music = props.musicEntity.currentMusic;
  const setProgress = (progress?: any) => {
    Window.music.progress = progress;
    props.dispatch({
      type: 'music/update',
      payload: {
        currentMusic: Window.music,
      },
    });
  };
  useEffect(() => {
    if ($('#vidio')) {
      $('#vidio').ontimeupdate = (e: any) => {
        setProgress(e.target.currentTime * 1000);
      };
      $('#vidio').onended = () => {
        // Music.playerNext()
      };
      $('#vidio').onerror = () => {
        src !== undefined && message.warning('暂无版权!');
      };
    }
  }, []);
  return (
    <div className="app-footer-slider">
      <Slider
        value={(progress / duration) * 100}
        tooltipVisible={null}
        style={{ width: '100%' }}
        onChange={(e: any) => {
          $('#vidio').currentTime = (duration * e) / 100 / 1000;
          playing ? $('#vidio').play() : $('#vidio').pause();
          setProgress((duration * e) / 100);
        }}
      />
      <div className="app-footer-box">
        <div
          className="music-tools"
          style={{ width: '33.3%', display: 'flex', boxSizing: 'border-box' }}
        >
          <div
            style={{
              width: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            {image && (
              <img
                style={{ width: 45, height: 'auto' }}
                className="song-img"
                src={image + '?param=400y400'}
              />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
              width: 'calc(100% - 40px)',
            }}
          >
            <div className="music-tools-name">
              <span
                style={{ fontSize: 14, color: '#545454' }}
                onClick={() => {
                  // name && (window.location.hash = `/app/music.163.song/${id}`)
                }}
              >
                {name || '...'}
              </span>{' '}
              &nbsp;
              <span style={{ fontSize: 12 }}>{artists || '...'}</span>
            </div>
            <div>
              <span style={{ width: 100, fontSize: 12 }}>
                <span>
                  {Math.floor(progress / 1000 / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {Math.floor((progress / 1000) % 60)
                    .toString()
                    .padStart(2, '0')}
                </span>
                /
                <span>
                  {Math.floor(duration / 1000 / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {Math.floor((duration / 1000) % 60)
                    .toString()
                    .padStart(2, '0')}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div
          className="music-tools"
          style={{ width: '33.3%', justifyContent: 'center', minWidth: 200 }}
        >
          <i
            style={{ fontSize: 16 }}
            className="iconfont icon-shangyishou1"
            onClick={() => {
              // playerBefore()
            }}
          ></i>
          <i
            style={{ fontSize: 32 }}
            className={
              playing ? 'iconfont icon-zanting2' : 'iconfont icon-video-control'
            }
            onClick={() => {
              // this.props.Music.setPlaying(!playing)
            }}
          ></i>
          <i
            style={{ fontSize: 16 }}
            className="iconfont icon-xiayishou1"
            onClick={() => {
              // playerNext()
            }}
          ></i>
        </div>
        <div
          className="music-tools"
          style={{ width: '33.3%', justifyContent: 'flex-end', minWidth: 200 }}
        >
          <i className="iconfont icon-shengyin"></i>
          <i className="iconfont icon-xunhuanbofang"></i>
          <i
            className="iconfont icon-icon-"
            onClick={() => {
              // setPlyerRecord(!plyerRecord)
            }}
          >
            <Badge count={20} />
          </i>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <video src={src} autoPlay={true} id="vidio" />
      </div>
    </div>
  );
};
export default connect(({ music }: any) => ({ ...music }))(SliderFooter);
