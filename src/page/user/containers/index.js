// ---------------------ES6----------------------
export const app = 1

export function get() {
    console.log('get');
}

export function post() {
    console.log('post');
}





// ------------------Commonjs---------------------
// module.exports.get = function get() {
//     console.log('get')
// }

// module.exports.post = function post() {
//     console.log('post')
// }




// ------------------按需加载-----------------------
// console.log('require module')
// module.exports.app = 1;