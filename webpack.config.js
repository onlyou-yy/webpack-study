//webpack.config.js  需要使用Commonjs规范导出一个对象
const path=require('path');
const HtmlWebpackPlugin=require("html-webpack-plugin");
const MECP=require("mini-css-extract-plugin");
const optimizeCssMini=require("optimize-css-assets-webpack-plugin");
const ug=require("uglifyjs-webpack-plugin");
module.exports={
    optimization:{//优化项配置
  	minimizer:[
  		new ug({
        cache:true,//缓存?
        parallel:true,//并发？
  		sourceMap:true
      }),
			new optimizeCssMini(),
    ],//压缩优化
	},
    mode:"production",//模式  默认两种 production development
    entry:path.join(__dirname,"./src/index.js"),//入口文件，是相对路径，可以使用node的path模块处理路径
    output:{//出口
    	path:path.resolve(__dirname,'./dist/'),//打包后的文件要放置的目录，必须是一个绝对路径
        filename:'boundle.js',//打包后的文件名
    },
    devServer:{
        port:3000,//端口号
        progress:true,//显示开启进度条
        contentBase:'./dist/',//要开启服务的目录
        // open:true,//是否自动打开浏览器
    },
    plugins:[//插件数组，放着所有的webpack插件实例
    	new HtmlWebpackPlugin({
            template:'./src/index.html',//将要打包的目标文件
            filename:'index.html',//打包后的文件名
        }),
        new MECP({
            filename:"main.css",
        })
    ],
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[MECP.loader,'css-loader','postcss-loader'],
            },
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env'
                        ]
                    }
                }
            }
        ]
    }
}