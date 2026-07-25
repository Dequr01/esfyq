const fs = require('fs');
const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
// Wait, three/examples is not easy to use in node without a DOM or JSDOM.
