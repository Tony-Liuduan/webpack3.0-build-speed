class AddTitlePlugin {

    apply(compiler) {
        compiler.plugin('compilation', function (compilation) {
            compilation.plugin("optimize-chunk-assets", function (chunks, callback) {
                chunks.forEach(function (chunk) {
                    chunk.files.forEach(function (file) {
                            if (/.+(js)$/.test(file)) {
                                compilation.assets[file]._source.children.unshift('/**liuduan **/\n')
                            }
                        
                            //compilation.assets[file]._source.children[0] = '/**liuduan **/\n' + compilation.assets[file]._source.children[0];
                    });
                });
                
                callback();
            });
        });
    }
}

module.exports = AddTitlePlugin