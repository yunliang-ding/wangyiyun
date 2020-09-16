import React, { useState, useEffect } from 'react';
import { Badge, Message, Slider } from 'site-ui';
import { connect } from 'dva';
import './index.less';
const Window: any = window;
const message = new Message({
  duration: 3,
});
const $: any = document.querySelector.bind(document);
const SliderFooter = ({
  musicEntity: { currentMusic, musicCache },
  dispatch,
}: any) => {
  const { duration, playing, progress, src, image, artists, name } =
    currentMusic || {};
  Window.music = currentMusic;
  const setProgress = (progress?: any) => {
    Window.music.progress = progress;
    dispatch({
      type: 'music/update',
      payload: {
        currentMusic: Window.music,
      },
    });
  };
  const setPlaying = (playing: boolean) => {
    Window.music.playing = playing;
    dispatch({
      type: 'music/update',
      payload: {
        currentMusic: Window.music,
      },
    });
    playing ? $('#vedio').play() : $('#vedio').pause();
  };
  const playerBefore = () => {
    let index = musicCache.findIndex((item: any) => {
      return item.id === currentMusic.id;
    });
    const music = musicCache[index > 0 ? index - 1 : 0];
    localStorage.setItem('currentMusic', JSON.stringify(music));
    dispatch({
      type: 'music/update',
      payload: {
        currentMusic: music,
      },
    });
  };
  const playerNext = () => {
    let index = musicCache.findIndex((item: any) => {
      return item.id === currentMusic.id;
    });
    const music =
      musicCache[
        index < musicCache.length - 1 ? index + 1 : musicCache.length - 1
      ];
    localStorage.setItem('currentMusic', JSON.stringify(music));
    dispatch({
      type: 'music/update',
      payload: {
        currentMusic: music,
      },
    });
  };
  useEffect(() => {
    if ($('#vedio')) {
      $('#vedio').ontimeupdate = (e: any) => {
        setProgress(e.target.currentTime * 1000);
      };
      $('#vedio').onended = () => {
        playerNext();
      };
      $('#vedio').onerror = () => {
        src !== undefined && message.warning('暂无版权!');
      };
    }
  }, []);
  return (
    <>
      <div className="app-footer-slider">
        {src && (
          <Slider
            value={(progress / duration) * 100}
            tooltipVisible={null}
            style={{ width: '100%' }}
            onChange={(e: any) => {
              $('#vedio').currentTime = (duration * e) / 100 / 1000;
              playing ? $('#vedio').play() : $('#vedio').pause();
              setProgress((duration * e) / 100);
            }}
          />
        )}
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
              onClick={playerBefore}
            ></i>
            <i
              style={{ fontSize: 32 }}
              className={
                playing
                  ? 'iconfont icon-zanting2'
                  : 'iconfont icon-video-control'
              }
              onClick={setPlaying.bind(null, !playing)}
            ></i>
            <i
              style={{ fontSize: 16 }}
              className="iconfont icon-xiayishou1"
              onClick={playerNext}
            ></i>
          </div>
          <div
            className="music-tools"
            style={{
              width: '33.3%',
              justifyContent: 'flex-end',
              minWidth: 200,
            }}
          >
            <i className="iconfont icon-shengyin"></i>
            <i className="iconfont icon-xunhuanbofang"></i>
            <i
              className="iconfont icon-icon-"
              id="app-badge-cache"
              onClick={() => {
                // setPlyerRecord(!plyerRecord)
              }}
            >
              <Badge count={musicCache.length} />
            </i>
          </div>
        </div>
      </div>
      <video style={{ display: 'none' }} src={src} autoPlay id="vedio" />
    </>
  );
};
export default connect(({ music }: any) => ({ ...music }))(SliderFooter);
