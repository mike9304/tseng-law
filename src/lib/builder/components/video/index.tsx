import { defineComponent } from '../define';
import VideoRender from './VideoRender';

export default defineComponent({
  kind: 'video',
  displayName: 'video',
  category: 'media',
  icon: '\u25FB',
  defaultContent: {
    url: '',
    autoplay: false,
    loop: false,
    muted: false,
    thumbnail: '',
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: VideoRender,
});
