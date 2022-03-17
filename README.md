# babel-plugin-manage-log

>一个通过注释的形式管理console.log的babel插件，用于方便对源码以及业务代码的调试理解。

## 场景：
当我们想调试源码，或者接手维护一个存量项目的时候，你是否为了方便理解而在代码中加入了大量的console.log，为了区分不同逻辑或者不同业务的代码，我们还会给console.log输出增加一些特定的标记并且要经常维护，否则久而久之，控制台一大堆不同逻辑不同业务的console反而会干扰我们的调试与理解。为此写了这款插件，以注释的形式插入console.log，并将一些常用的输出格式可配置化，方便我们对console.log的管理。当我们调试代码的时候，只展示我们想要的console.log输出。

## 用法：
```js
plugins: [
    [
        'babel-plugin-manage-log',
        {
            hiddenTags: [],  //要隐藏的tag调试
            groupCollapsed: false, //调试信息是否折叠
            showNoTags: true, //展示没有tag的调试
            filename: true, //显示文件信息
            tagName: true, //显示tag名称
            loc: true, //显示位置信息
            params: true, //显示参数信息
            info: true //显示自定义信息
        }
    ]
]
```
* options
* hiddenTags: 
    * Array 默认: []
    * 要隐藏的tag调试，在调试不同逻辑的时候，只想展示当前逻辑的调试信息，这个配置会非常有用
* groupCollapsed: 
    * Boolean 默认: false
    * 调试输出的信息是否折叠
* showNoTags:
    * Boolean 默认: true
    * 是否展示没有tag的调试信息
* filename: 
    * Boolean 默认: true
    * 全局配置，是否展示文件信息
* tagName
    * Boolean 默认: true
    * 全局配置，是否展示tag信息
* loc
    * Boolean 默认: true
    * 全局配置，是否展示位置信息
* params
    * Boolean 默认: true
    * 全局配置，是否展示参数信息
* info
    * Boolean 默认: true
    * 全局配置，是否展示自定义信息


* 本插件只针对函数调试，在函数的开头加上/*$lg */即可：
```js
const logicA = /*$lg tagA -n 逻辑A -i 这是逻辑A的调试输出*/(a) => {};
logicA(1)
//当logicA方法执行的时候，控制台会输出: 
//逻辑A(tagA)----这是逻辑A的调试输出
//  文件: '/src/demo/demo.js'
//  位置: line-0, column: 1
//  参数: a:1 
```
* $lg后可以有多个tag（以空格分割），用于一个方法用于不同逻辑的时候，打上不同的标签，便于后面的调试
* -n 后面跟的是函数名称。日常写代码的时候，很多都是匿名函数，这时候可以通过 -n来自定义配置函数名称，便于调试。不写的话会自动识别函数名称。
* -i 后面跟的是自定义的信息。调试的时候，如果我们想输出一些自定义的信息，可以使用-i。
* -c 后面跟的是关闭的配置参数信息。默认调试信息有文件信息(filename)、位置信息(loc)、参数信息(params)、tag信息(tagName)，可以通过-c关闭对应的调试信息。

