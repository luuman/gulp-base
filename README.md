## Gulp
### GulpPC PC
### GulpMoble 移动端
### GulpFlex flexible移动端适配
### GulpRes 响应式

## 演示项目目录结构
```
Pages             (项目名称)
|–.git            通过git进行版本控制,项目自动生成这个文件
|–node_modules    组件包目录
|–dev             **浏览缓存**（编译自动生成的）
|–dist            **发布环境**（编译自动生成的）
    |–css             样式文件(style.css style.min.css)
    |–fonts           fonts文件夹
    |–img             图片文件(压缩图片\合并后的图片)
    |–js              js文件(main.js main.min.js)
    |–*.html          静态页面文件(压缩html)
|–src             **开发环境**
    |–sass                sass文件夹
        |–public              public sass文件夹
        |–*.sass              sass
    |–swig                swig文件夹
        |–*.html              HTML模板
    |–fonts               fonts文件夹
    |–img                 图片文件夹
    |–js                  js文件夹
        |–*.js                js
    |–script              script文件夹
    |–*.html              html
|–ver             **hash缓存**
|–gulpfile-dev.js                   gulp配置文件
|–gulpfile-buildreva.js             gulp配置文件
|–gulpfile-buildrevc.js             gulp配置文件
|–package.json                      依赖模块json文件,在项目目录下npm install会安装项目所有的依赖模块，简化项目的安装程序
```
## Usage
```
	$ gulp              开发模式
    $ npm run clean     Clean
	$ npm run dev       打包代码
```

### 手动更改插件的源码：

#### 第一步：打开node_modules\gulp-rev\index.js 第144行
```
    /*manifest[originalFile] = revisionedFile;*/
    manifest[originalFile] = originalFile + '?v=' + file.revHash;
```
#### 第二步：打开node_modules\rev-path\index.js 第10行
```
    /*return filename + '-' + hash + ext;*/
    return filename + ext;
```
注意：这一步中，很多同学找不到这个rev-path，是因为以前的gulp-rev插件将这部分集成在了里面，而后续的版本将rev-path从gulp-rev里抽离出来了，所以要在项目目录的node_modules里找这个插件，当然，我们不需要手动安装，这是gulp-rev的依赖，npm会自动安装它。

#### 第三步：打开node_modules\gulp-rev-collector\index.js 
```
第31行

/*if ( !_.isString(json[key]) || path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !==  path.basename(key) ) {
    isRev = 0;
}*/

if ( !_.isString(json[key]) || path.basename(json[key]).split('?')[0] !== path.basename(key) ) {
    isRev = 0;
}

第50行

/*return pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, "\\$&");*/
var rp = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, "\\$&");
rp = pattern + "(\\?v=(\\d|[a-z]){8,10})*";
return rp;
第90行


/*patterns.push( escPathPattern( (path.dirname(key) === '.' ? '' : closeDirBySep(path.dirname(key)) ) + path.basename(key, path.extname(key)) )
    + opts.revSuffix
    + escPathPattern( path.extname(key) )
);*/

patterns.push( escPathPattern( (path.dirname(key) === '.' ? '' : closeDirBySep(path.dirname(key)) ) + path.basename(key, path.extname(key)) )
    + opts.revSuffix
    + escPathPattern( path.extname(key) ) + "(\\?v=(\\d|[a-z]){8,10})*"
);
```