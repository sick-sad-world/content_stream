import fontLoadingAnalyzer from './utils/fontLoadingAnalyzer';
import { StoryFlasher, Modal, Form, CSSTransformer } from './utils/landing';
import '../css/theme.css';
import '../css/index.css';

fontLoadingAnalyzer(['300 1em Lato', 'italic 300 1em Lato', '1em Lato', '700 1em Lato', 'italic 1em Lato', 'italic 700 1em Lato']);

let flasher = null;

document.getElementById('map').addEventListener('load', function () {
  flasher = new StoryFlasher({
    nodes: this.getSVGDocument().querySelectorAll('.cls-2'),
    container: document.getElementById('app-preview-content')
  }) 
  flasher.start();
});

const logInModal = new Modal({
  el: document.getElementById('form-sign-in'),
  layover: document.getElementById('layover'),
  className: 'visible',
  openers: document.querySelectorAll('[data-action="login"]'),
  onSubmit: (data, onClose, onError) => {
    fetch('http://', data)
      .then(() => {
        window.location.href = `${window.location.href}/app`
        onClose();
      })
      .catch(onError)
  },
})

const bannerSection = document.getElementById('banner');
const headerOpacityTransform = new CSSTransformer({
  el: document.getElementById('top-nav'),
  interval: 300,
  transform: {
    backgroundColor: (scrollTop) => {
      const percentage = (scrollTop >= bannerSection.clientHeight) ? 1 : (Math.round((scrollTop * 100) / bannerSection.clientHeight  * 100) / 100) / 100;
      return `rgba(0,0,0,${percentage})`;
    }
  }
})