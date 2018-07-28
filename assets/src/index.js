import fontLoadingAnalyzer from './utils/fontLoadingAnalyzer';
import '../css/theme.css';
import '../css/index.css';

class StoryFlasher {

  constructor({nodes = [], container, delay = 3000}) {
    this.delay = delay;
    this.nodes = Array.from(nodes).sort(() => 0.5 - Math.random());
    this.container = container;
    this.nodeClass = 'light';
    this.newItemClass = 'fresh';
    this.interval = null;
    this.node = 0;
    Array.from(this.container.children).forEach(this.removeClass(this.newItemClass));
  }

  removeClass = (className) => (el) => {
    el.classList.remove(className)
  }

  addClass = (className) => (el) => {
    el.classList.add(className)
  }

  updateNode() {
    this.nodes.forEach(this.removeClass(this.nodeClass));
    this.addClass(this.nodeClass)(this.nodes[this.node]);
    this.node = (this.node < this.nodes.length) ? this.node + 1 : 0;
  }

  do = (first) => {
    this.updateNode();

    const childs = Array.from(this.container.children);

    const item = childs.pop()

    item.remove();
    
    item.classList.add(this.newItemClass);

    //setTimeout(this.removeClass(this.newItemClass), this.interval, this.container.firstElementChild);

    this.container.insertBefore(item, this.container.firstElementChild);
  }

  start = () => {
    if (this.interval) return false;
    this.do();
    this.interval = setInterval(this.do, this.delay);
  }
  
  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
  }
}

fontLoadingAnalyzer(['300 1em Lato', 'italic 300 1em Lato', '1em Lato', '700 1em Lato', 'italic 1em Lato', 'italic 700 1em Lato']);

document.getElementById('map').addEventListener('load', function () {
  const flasher = new StoryFlasher({
    nodes: this.getSVGDocument().querySelectorAll('.cls-2'),
    container: document.getElementById('app-preview-content')
  }) 
  flasher.start();
});