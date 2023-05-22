import { Assets, Container, Filter, Sprite, autoDetectRenderer } from 'pixi.js';
import MainLoop from 'mainloop.js';
import { Howl, Howler } from 'howler';

import darkenFrag from './darken.frag.glsl?raw';

import './styles.css';

const MIN_RENDERER_WIDTH = 600;

let underwaterSound = null;

const renderer = autoDetectRenderer({ antialias: true });
const stage = new Container();

let causticSprite = null;
let causticFilter = null;

async function init() {
  // https://www.cathalmcnally.com/news/free-caustics-generator/
  const causticsTexture = await Assets.load('caustics_002.png');

  causticSprite = new Sprite(causticsTexture);
  causticFilter = new Filter(null, darkenFrag, {
    uSampler: causticsTexture.texture,
    uScale1: 2.0,
    uScale2: 2.2,
    uTime: 0,
    uRatio: 1,
  });

  // set filter
  causticSprite.filters = [causticFilter];

  // add the sprites to the stage
  stage.addChild(causticSprite);

  // call resize to set initial dimensions
  handleWindowResize();

  // append renderer to the document
  const container = document.getElementById('canvas-container');
  container.appendChild(renderer.view);

  // add button click listener
  const button = document.getElementById('sound-btn');
  button.addEventListener('click', handleSoundClick, false);

  // add volume change listener
  const range = document.getElementById('sound-range');
  range.value = 1;
  range.addEventListener('change', handleRangeChange, false);

  // add window resize event listener
  window.addEventListener('resize', handleWindowResize, false);

  animate();
}

function handleWindowResize() {
  const width = Math.max(window.innerWidth, MIN_RENDERER_WIDTH);

  renderer.resize(width, window.innerHeight);

  causticSprite.width = width;
  causticSprite.height = window.innerHeight;

  causticFilter.uniforms.uRatio = width / window.innerHeight;
}

function handleSoundClick() {
  // Howler.volume = 0.5;
  if (!underwaterSound) {
    underwaterSound = new Howl({
      src: 'underwater.mp3',
      loop: true,
      autoplay: true,
    });
  } else if (underwaterSound.playing()) {
    underwaterSound.stop();
  } else {
    underwaterSound.play();
  }
}

function handleRangeChange(event) {
  const volume = Number(event.target.value);

  // update the global volume
  Howler.volume(volume);
}

function animate() {
  causticFilter.uniforms.uTime += 0.1;

  // render the stage
  renderer.render(stage);

  requestAnimationFrame(animate);
}

window.onload = init;
