/**
 * util
 */
const $: any = document.querySelector.bind(document);
export default {
  playAnimation() {
    if ($('#app-badge-cache .sui-badge-wrapper')) {
      $('#app-badge-cache .sui-badge-wrapper').classList =
        'sui-badge-wrapper sui-badge-wrapper-new';
      setTimeout(() => {
        $('#app-badge-cache .sui-badge-wrapper').classList =
          'sui-badge-wrapper';
      }, 1000);
    }
  },
};
