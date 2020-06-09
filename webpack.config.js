const path = require('path');
module.exports = {
    entry:'./index.js',
    mode:"production",
    output:{
        filename:'[name].js',
        library:'geocoortransform',
        libraryTarget:'umd',
        globalObject: 'this',// 添加这个选项
        libraryExport:'default'

    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:["@babel/preset-env"],
                        plugins:['@babel/plugin-transform-modules-umd']
                    }
                }
            }

        ]

    }
}