import { Application } from 'egg';

export default (app: Application) => {
  require('./router/user')(app);
};
