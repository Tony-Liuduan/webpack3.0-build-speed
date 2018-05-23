class AddTitlePlugin {

    apply(compiler) {
        compiler.plugin('make', function (compilation, callback) {
            compilation.plugin("optimize-chunk-assets", function (chunks, cb) {
                chunks.forEach(chunk => {
                    chunk.files.forEach(function (file) {
                        if (/.+(js)$/.test(file)) {
                            compilation.assets[file]._value = '/**liuduan **/\n' + compilation.assets[file]._value;
                        }
                    });
                });
                cb();
            });
            callback();
        });
    }
}

module.exports = AddTitlePlugin