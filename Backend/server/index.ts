import 'dotenv/config';
import ExpressServerInstance from './src/app';

(function () {
  new ExpressServerInstance().startServer();
})();
