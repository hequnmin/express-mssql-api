import express from 'express';
import bodyParser from 'body-parser';
import pug from 'pug';

const app = express();

import user from './routers/user/user';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 路由
app.get('/', function (req, res) {
  res.send('hello world')
});

app.use('/user', user);

app.listen(3000, () => console.log('浏览器输入http://localhost:3000'));
