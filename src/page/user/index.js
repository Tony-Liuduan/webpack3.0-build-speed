// ---------------------ES6----------------------
import { aliasFunc, aliasClass } from 'components/TreeSharkingTest/index.js';
import { get } from './containers/index.js';
import app from './containers/app.js';
console.log(get());





// ------------------Commonjs---------------------
// const app = require('./containers/index.js');
// console.log(app.get());




// 按需加载
// require.ensure([], function () {
//     console.log('preload')
//     //var app = require.include('./containers/index.js');
//     var app = require('./containers/index.js').app;
//     console.log(app);
// }, 'test');
