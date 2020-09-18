import React, { useState, useEffect } from 'react';
import { Badge, Message, Slider, Tooltip } from 'site-ui';
import { connect } from 'dva';
import { PlayRecord, Collection } from '@/components';
import './index.less';
const Window: any = window;
const message = new Message({
  duration: 3,
});
const $: any = document.querySelector.bind(document);
const SliderFooter = ({
  musicEntity: { currentMusic, musicCache },
  uiEntity: { openCollection },
  progressEntity,
  dispatch,
}: any) => {
  const { duration, src, image, artists, name, lyric } = currentMusic || {};
  const { progress, playing, voice } = progressEntity || {};
  const [openRecord, setopenRecord] = useState(false);
  Window.progressEntity = progressEntity;
  const setProgress = (progress?: any) => {
    Window.progressEntity.progress = progress;
    dispatch({
      type: 'progress/update',
      payload: Window.progress,
    });
    sessionStorage.setItem('progress', JSON.stringify(Window.progressEntity));
  };
  const setPlaying = (playing: boolean) => {
    Window.progressEntity.playing = playing;
    dispatch({
      type: 'progress/update',
      payload: Window.progressEntity,
    });
    playing ? $('#audio').play() : $('#audio').pause();
    sessionStorage.setItem('progress', JSON.stringify(Window.progressEntity));
  };
  const setVoice = (voice: number) => {
    Window.progressEntity.voice = voice;
    dispatch({
      type: 'progress/update',
      payload: Window.progressEntity,
    });
    $('#audio').volume = voice / 100;
    sessionStorage.setItem('progress', JSON.stringify(Window.progressEntity));
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
  const closeCollection = () => {
    dispatch({
      type: 'ui/update',
      payload: {
        openCollection: false,
      },
    });
  };
  useEffect(() => {
    if ($('#audio')) {
      if (currentMusic.id !== '') {
        $('#audio').currentTime = progress / 1000; // progress
        $('#audio').volume = voice / 100; // voice
        playing ? $('#audio').play() : $('#audio').pause();
      }
      $('#audio').ontimeupdate = (e: any) => {
        setProgress(e.target.currentTime * 1000);
      };
      $('#audio').onended = () => {
        playerNext();
      };
      $('#audio').onerror = () => {
        src !== undefined && message.error('播放异常!');
      };
    }
  }, []);
  /** 歌词 */
  const renderLyric = (lyricArray: any, progress: number) => {
    let lyric = '';
    lyricArray.map((item: any, index: number, arr: any) => {
      let currentTime = item
        .substr(item.indexOf('[') + 1, item.indexOf('.') - 1)
        .split(':') || [0, 0];
      let second =
        (Number.parseInt(currentTime[0]) * 60 +
          Number.parseInt(currentTime[1])) *
        1000;
      let nextTime = (arr[index + 1] &&
        arr[index + 1]
          .substr(
            arr[index + 1].indexOf('[') + 1,
            arr[index + 1].indexOf('.') - 1,
          )
          .split(':')) || [0, 0];
      let secondNext =
        (Number.parseInt(nextTime[0]) * 60 + Number.parseInt(nextTime[1])) *
        1000;
      if (second < progress && progress < secondNext) {
        lyric = item.substr(item.indexOf(']') + 1);
      }
    });
    return lyric;
  };
  const lyricArray = lyric && lyric.toString().split('#*#');
  return (
    <>
      <div className="app-footer-slider">
        {src && (
          <Slider
            value={(progress / duration) * 100}
            tooltipVisible={null}
            style={{ width: '100%' }}
            onChange={(e: any) => {
              $('#audio').currentTime = (duration * e) / 100 / 1000;
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
                </span>
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
                <span className="app-footer-song-lyrics">
                  {lyricArray && renderLyric(lyricArray, progress)}
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
            <Tooltip
              placement="left"
              title={
                <div className="app-audio-voice">
                  <Slider
                    value={voice}
                    tooltipVisible={null}
                    style={{ width: 120 }}
                    onChange={(e: any) => {
                      setVoice(e);
                    }}
                  />
                </div>
              }
            >
              <i className="iconfont icon-shengyin"></i>
            </Tooltip>
            <i className="iconfont icon-xunhuanbofang"></i>
            <i
              className="iconfont icon-icon-"
              id="app-badge-cache"
              onClick={setopenRecord.bind(null, !openRecord)}
            >
              {musicCache.length > 0 && (
                <>
                  <Badge count={musicCache.length} />
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 12,
                      width: 30,
                      display: 'inline-block',
                      textAlign: 'right',
                    }}
                  >
                    {musicCache.findIndex((item: any) => {
                      return item.id === currentMusic.id;
                    }) + 1}
                    /{musicCache.length}
                  </span>
                </>
              )}
            </i>
          </div>
        </div>
      </div>
      {src !== '' && (
        <>
          <audio style={{ display: 'none' }} src={src} autoPlay id="audio" />
          <img id="play-animation" src={image + '?param=60y60'} />
        </>
      )}
      {openRecord && <PlayRecord onClose={setopenRecord.bind(null, false)} />}
      {openCollection && <Collection onClose={closeCollection} />}
    </>
  );
};
export default connect(({ music, progress, ui }: any) => ({
  ...music,
  ...progress,
  ...ui,
}))(SliderFooter);
