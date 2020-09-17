/**
 * util
 */
const $: any = document.querySelector.bind(document);
export default {
  playAnimation(pageX: number, pageY: number) {
    // 获取鼠标坐标
    let el = $('#play-animation');
    if (el) {
      el.style.right = document.body.clientWidth - pageX + 'px';
      el.style.bottom = document.body.clientHeight - pageY + 'px';
      setTimeout(() => {
        el.classList = 'play-animation-start';
      }, 500);
    }
    setTimeout(() => {
      el.classList = '';
    }, 2000);
  },
};
