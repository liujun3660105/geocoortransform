# geocoortransform 坐标转换

## 简介
本模块提供了wgs84、gcj02和bd09坐标系相互之间的转换。
关于这三类坐标系的转换，其实网络上公开的有很多，但是我在应用的过程中发现有一些问题：就是**gcj02或者bd09转wgs84**的过程中，有几米的误差。在项目中，如果对定位精度要求较高，则不能满足项目需求。所以本模块针对上述问题，利用迭代法，重新写了相应算法，精度得到很大的提高。
支持node和浏览器引入

 [npm网址] https://www.npmjs.com/package/geocoortransform

## 安装

npm install coordtransform

## 使用

### NodeJS用法
```javascript
const geocoortransform = require('geocoortransform');
console.log(geocoortransform.bd2gcj(117,39));
//geocoortransform.bd2gcj geocoortransform.gcj2bd 
//geocoortransform.gcj2wgs geocoortransform.wgs2gcj 
//geocoortransform.bd2wgs geocoortransform.wgs2bd
```
### 浏览器用法
直接应用下载好的index.js文件
```html
<script src="index.js"></script>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
<script src="index.js"></script> 
</head>
<body>
    <script>
        console.log(geocoortransform.gcj2wgs(117,39));
    </script>
    
</body>
</html>
```
