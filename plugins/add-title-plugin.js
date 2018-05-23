class AddTitlePlugin {

    apply(compiler) {
        compiler.plugin('make', function (compilation, callback) {
            compilation.plugin("optimize-chunk-assets", function (chunks, cb) {
                try {
                    chunks.forEach(chunk => {
                        chunk.files.forEach(function (file) {
                            if (/.+(js)$/.test(file)) {
                                if (typeof compilation.assets[file]._value === 'string')
                                    compilation.assets[file]._value = '/**liuduan **/\n' + compilation.assets[file]._value;
                                else
                                    compilation.assets[file]._source.children.unshift('/**liuduan **/\n')
                            }
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
                cb();
            });
            callback();
        });
    }
}

module.exports = AddTitlePlugin