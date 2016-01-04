### 柚子音乐播放器

#### 扫二维码体验下吧：

![music02.png](music02.png)

#### 文件目录结构

```js
.
├── README.md
├── app
│   ├── article
│   │   └── 2015sumary.md
│   ├── bulid
│   │   ├── app.js
│   │   └── app.js.map
│   ├── fonts
│   │   ├── icomoon.eot
│   │   ├── icomoon.svg
│   │   ├── icomoon.ttf
│   │   └── icomoon.woff
│   ├── images
│   │   ├── 1.jpeg
│   │   ├── bg.png
│   │   ├── guide.png
│   │   └── music.png
│   ├── sass
│   │   ├── app.scss
│   │   └── markdown.css
│   └── scripts
│       ├── app.jsx
│       ├── data.jsx
│       ├── index.jsx
│       ├── music.jsx
│       └── summary.jsx
├── gulpfile.js
├── index.html
├── music02.png
└── package.json
```

#### 如何跑起来

1、在/newPlayer目录下执行：

```js
npm install
```


这里需说明下，我没有在webpack+gulp配server，我用的是[http-server](https://github.com/indexzero/http-server)

安装完http server后，在终端中指定到/newPlayer目录下，执行http-server就是运行起柚子播放器了。



欢迎大家给我提ISSUE，指出代码的不是，或是有待优化的地方
