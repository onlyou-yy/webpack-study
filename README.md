## webpack使用

### 安装

webpack的安装（安装webpack4以上的需要安装weboack-cli）

```shell
npm i webpack webpack-cli -D
```

webpack可以是进行0配置，但是0配置就意味着不能按我们的需求进行打包，所以还是需要我们自己进行配置的。webpack的工作过程就是用  ***打包工具 -> 输入后的结果（js模块）***

### 打包（支持我们 js 的模块化）

webpack的默认打包目录是 工程目录下的src目录，没有配置的话将会按生产环境`production`进行打包，打包出来的结果就会放到 dist下的main.js文件

```shell
# 工程目录下使用这个命令可以进行打包
npx webpack
# 这个命令的意思就是执行在node_modules目录下webpack.cmd文件，里面文件的内容就是使用node命令执行webpack.js文件
```

[npx 使用教程](http://www.ruanyifeng.com/blog/2019/02/npx.html)

### webpack的配置

webpack的默认配置文件是`webpack.config.js`一般可以放在项目根目录下，但是也可以使用其他的配置文件，在运行的时候使用`npx webpack --config 地址`指定好那个哪个配置文件就好了。

当然如果这个命令过长久可以在`package.json`文件配置一些命令来执行

```json
"scripts":{
    "build":"webpack --config webpack.dev.config.js"
}
```

在`package.json`文件下使用不需要使用 `npx `命令了，因为会主动去`node_modules/bin`下找到对应的命令

```js
//webpack.config.js  需要使用Commonjs规范导出一个对象
const path=require('path');
module.exports={
    mode:"production",//模式  默认两种 production development
    entry:path.join(__dirname,"./src/index.js"),//入口文件，是相对路径，可以使用node的path模块处理路径
    output:{//出口
    	path:path.resolve(__dirname,'./dist/'),//打包后的文件要放置的目录，必须是一个绝对路径
      filename:'boundle.[hash:8].js',//打包后的文件名 [hash:8]添加8位hash戳，不写:8，默认添加32位
	}
}
```

1. **path.join(path1，path2，path3.......)**

作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报错。

2. #### **path.resolve([from...],to)**

作用：把一个路径或路径片段的序列解析为一个绝对路径。相当于执行cd操作。

- **__dirname 是当前文件夹的绝对路径**
- **__filename是当前文件的绝对路径**



### **webpack-dev-server  本地开发服务**

`webpack-dev-server`默认在当前目录下开启一个服务，可以在指定的目录中开启一个本地的服务器，可以在webpack的配置文件中指定服务器目录。其好处就是不会进行真正的打包，而是会在内存中生成虚拟打包。因此不会再次从新打包内容浪费资源，支持热更新。

安装`npm i webpack-dev-server -D`，执行`npx webpack-dev-server`

在`package.json`添加命令

```json
"scripts":{
    "dev":"webpack-dev-server"
}
```

配置webpack.config.js

```js
module.exports={
    ...,
    devServer:{
        port:3000,//端口号
        progress:true,//显示开启进度条
        contentBase:'./dist/',//要开启服务的目录
        open:true,//是否自动打开浏览器
        compress:true,//开启压缩
        hot:true,//是否开启热更新
    }
}
```



### html-webpack-plugin 动态添加html模板文件

开始的时候，在项目下和打包出来的目录下是没有html文件的，我们需要自己手动添加html文件，相当麻烦，`html-webpack-plugin`插件可以将指定的模板html文件动态添加html文件到打包目录，并且会将打包出来的js文件自动添加到html文件中。

同样的在使用`webpack-dev-server`运行服务器的时候html文件也将被打包到虚拟的目录中，并不会被真正打包到输出目录，在运行`webpack`打包命令之后才会被打包到输出目录。

安装`npm i html-webpack-plugin -D`，在`webpack.config.js`添加配置

```js
const HtmlWebpackPlugin=require("html-webpack-plugin");
module.exports={
    ...,
    plugins:[//插件数组，放着所有的webpack插件实例
    	new HtmlWebpackPlugin({
            template:'./src/index.html',//将要打包的目标文件
            filename:'index.html',//打包后的文件名
    		minify:{//压缩配置
    			removeAttributeQuotes:true,//移除双引号
    			collapseWhitespace:true,//移除空格
			},
    		hash:true,//添加hash戳
        }),
    ]
}
```



### 样式处理

webpack 默认处理的是 js 文件，对于 css，ts 等文件需要使用其他的模块或者插件来处理。现在可以使用 `webpack `对 js 文件进行处理，用`html-webpack-plugin`对html文件处理并且将js文件自动导入，对于css，less，scss等样式文件就需要使用对应模块进行处理，将**样式文件**处理成**模块**，然后才可以**在入口文件 index.js 中使用 import 或者 require 进行导入。**

- **css-loader**：负责解析`@import`这种语法
- **style-loader**：负责将解析好的css文件插入到 head 的 style 标签中

**loader的用法**：只用一个loader的时候可以是一个字符串/对象`{loader:'...'}`，需要使用多个的时候是一个字符串数值。需要**注意**的是，使用多个loader的时候，要注意数组中loader的顺序，webpack将按**从右往左，从下到上**的顺序依次调用loader处理文件。处理css需要先解析再插入，所以顺序应该为`['style-loader','css-loader']`

在 webpack.config.js 配置

```js
module.exports={
    ...,
    module:{//模块
  		rules：[//规则
          {
  					test:/\.css$/,/**要处理的文件*/
  					use:[
              {
								laoder:'style-loader',
  							options:{//
										insert:'head',
                  }//如果需要用更多的 loader 配置可以使用对象的方式进行配置，比如配置这个 style 要插入的位置等。
                },
                'css-loader'
			],//处理这种文件需要使用的loader
          }
      ]
		}
}
```

如果使用的是less，或者是sass，stylus则需要先安装对应的模块先

```shell
##less
npm i less less-loader -D
##stylus
npm i stylus stylus-loader -D
##sass
npm i node-sass sass-loader -D
```

这些 .less/.scss/.stylus 文件并不是单纯的css文件他们需要先被解析成css文件才能被正常使用是，所以现在配置就会是

```js
module.exports={
    ...,
    module:{//模块
  		rules：[//规则
           {
  					test:/\.css$/,
  					use:['style-loader','css-loader']
					},
           {
  					test:/\.less$/,//先解析成css，在解析@import 再进行插入
  					use:['style-loader','css-loader','less-loader']
					},
           {
  					test:/\.scss$/,
  					use:['style-loader','css-loader','sass-loader']
					},
           {
  					test:/\.stylus/,
  					use:['style-loader','css-loader','stylus-loader']
					},
      ]
		}
}
```

配置好之后记得要在入口文件`index.js`使用 require 或者 import 进行导入，`style-loader`才会将 css 文件插入到 html 中

在这里这些 css 将会被解析成 style 样式，然后被插入到html文档中，并不是引用 css 文件，如果需要抽离css样式文件可以使用 `mini-css-extract-plugin`



### mini-css-extract-plugin 抽离css样式

这个插件可以将css抽离出来成为一个单独的文件。需要在webpack.config.js中添加配置

```js
const MCEP_CSS=require("mini-css-extract-plugin");
const MCEP_LESS=require("mini-css-extract-plugin");
const MCEP_SCSS=require("mini-css-extract-plugin");
module.exports={
    ...,
  	plugins:[//都是将css抽离成单独文件，less、scss、stylus可以使用同一个，因为最终结果都是css。
      new MCEP_CSS({filename:index.css}),//抽离出来的文件名
      new MCEP_LESS({filename:index.less.css}),
      new MCEP_SCSS({filename:index.scss.css})
    ]
    module:{//模块
  		rules：[//规则
           {
  					test:/\.css$/,
  					use:[MCEP_CSS.loader,'css-loader']
					},
           {
  					test:/\.less$/,//先解析成css，在解析@import 再进行插入
  					use:[MCEP_LESS.laoder,'css-loader','less-loader']
					},
           {
  					test:/\.scss$/,
  					use:[MCEP_SCSS.laoder,'css-loader','sass-loader']
					},
           {
  					test:/\.stylus/,
  					use:[MCEP_CSS.loader,'css-loader','stylus-loader']
					},
      ]
		}
}
```



### postcss-loader   autoprefixer   为css属性添加浏览器前缀

使用样式的处理工具 loader 或者抽离工具都不会为css的属性添加上浏览器的前缀，这样就会导致网页在浏览器的兼容性会变差。可使用`postcss-loader`和`autoprefixer`模块进行处理

安装` npm i postcss-loader autoprefixer -D`，loader的用法都是一样的 postcss-loader 的作用就是进行css代码的转化，既然是这样那么就需要有css文件吃可以，那么配置就是`['style-loader','css-loader','postcss-loader','less-loader']`

那么 postcss-loader 也需要按照指定的规则去对css文件的属性进行转化，所以在跟目录下添加 `postcss.config.js` 文件，并且在根目录下条件浏览器限制`.browserslistrc`

```js
//postcss.config.js
module.exports={
  plugins:[require('autoprefixer')]
}

//.browserslistrc
# Browsers that we support
defaults
not IE 11
not IE_Mob 11
```

（注意：autoprefixer 需要使用7版本的）



### optimize-css-assets-webpack-plugin  css文件压缩插件

对 css 文件的压缩可以使用webpack自带的插件 `optimize-css-assets-webpack-plugin`，对css文件做一些压缩优化，但同时根据npm官网的配置要求还需要使用`uglifyjs-webpack-plugin`或者`terser-webpack.plugin`插件

添加配置

```js
const optimizeCssMini=require("optimize-css-assets-webpack-plugin");
const ug=require("uglifyjs-webpack-plugin");
module.exports={
  ...,
  optimization:{//优化项配置
  	minimizer:[
  		new ug({
        cache:true,//缓存?
        parallel:true,//并发？
  			sourceMap:true
      }),
			new optimizeCssMini(),
    ],//压缩优化
	}
}
```

需要注意的是，压缩会在 production 生成环境才会生效；现在配置了的压缩是会对入口文件 index.js 也进行压缩的，但是使用的压缩工具却只配置了针对 css 的操作，还没有对 js 进行配置所以打包的时候可能会报错。



### babel   转化 ES6 以上高级语法为 ES5 的语法

有些浏览器是不支持es6语法的但是会支持es5的语法，所以需要使用babel将高级的转化成es5的语法。

- babel-loader ：解析处理js文件				——- 8
- @babel/preset-env：es6转es5语法库    ——– 7
- @babel/core：babel核心库                     ——– 7

安装`npm i  babel-loader babel-preset-env @babel/core -D`

添加配置

```js
module.exports={
  ...,
  module:{
    rules:[
      {
				test:/\.js$/,
  			use:{
  				loader:'babel-loader',
  				options:{
              presets:[//预设装换库  es6 -> es5
                '@babel/preset-env'
              ],
              plugins:[
                '@babel/plugin-proposal-decorators',//支持提案中es6 装饰器 语法
                '@babel/plugin-proposal-class-properties',//支持提案中es6 class 语法
              ]
					},
           include:path.resolve(__dirname,'./src/'),
           exclude:/node_modules/,//默认会匹配整个项目的js文件，加上这个就是排除了node_modules目录
				}
      }
    ]
	}
}
```

如果根据现有的配置不支持 class 语法的话可以使用`@babel/plugin-proposal-class-properties`插件添加对 class 语法的支持。`@babel/plugin-proposal-decorators`，提供装饰器语法。

由于babel只会对 es6或以上的语法进行转义，所以对于 generator 生成器这种语法是不会进行转义的。我们也不能直接使用还需要其他工具帮助转化后才能使用。



### @babel/plugin-transform-runtime  处理实例上的方法

处理使用`@babel/plugin-transform-runtime`外还需要使用到` @babel/polyfill @babel/runtime`插件

安装`npm i @babel/plugin-transform-runtime @babel/polyfill -D `，`npm i @babel/runtime -S`，在根目录下添加一个`.babelrc`配置文件

```json
{
  "plugins":['@babel/plugin-transform-runtime']
}
```

或者也可以直接在webpack.config.js中配置

```js
module.exports={
  ...,
  module:{
    rules:[
      {
				test:/\.js$/,
  			use:{
  				loader:'babel-loader',
  				options:{
              presets:[
                '@babel/preset-env'
              ],
              plugins:[
                '@babel/plugin-transform-runtime'
              ]
					},
				}
      }
    ]
	}
}
```

对于`@babel/polyfill`安装之后只需要在入口文件中`require('@babel/polufill')`导入就可以了。



### eslint 	JavaScript代码规范

eslint会检查代码是否符合整体的代码风格。具体的方格配置可以在[eslint官网](https://eslint.bootcss.com/)中设置好后添加到项目中

安装`npm i eslint eslint-loader -D`，在webpack.config.js中配置规则

```js
module.exports={
  ...,
  module:{
    rules:[
      {
				test:/\.js$/,
  			use:{
  				loader:'eslint-loader',
  				options:{
             enforce:"pre",//前置loader放在最前面，最后检查
           }
				},
         exclude:/node_modules/
      }
    ]
	}
}
```

- pre	前置执行loader
- normal	普通loader
- lloader	内联loader
- fs	后置loader

### expose-loader	引入全局变量

在webpack中大多插件都是以包的形式存在，需要使用的时候再引入就好了，但是有时候希望将这些包一次全局引用，比如说 jQ 。可以使用`expose-loader`进行全局变量的引用。

```js
import $ from "jquery";
console.log(window.$);//输出会使undefined
```

可以使用`window.$=$`进行挂载。也可以使用插件进行全局暴露

安装 `npm i expose-loader -S`，添加配置

```js
//便捷使用
import $ from 'expose-loader?$!jquery';//这个将会把这个 $ 挂载到window上

//配置使用
```