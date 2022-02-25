import Router from "./core/router";
import { NewsDetailView, NewsFeedView } from './page';
import Store from './store';

const store = new Store();
const router: Router = new Router();
const newsFeedView = new NewsFeedView('root', store);
const newsDetailView = new NewsDetailView('root', store);

router.setDefaultPage(newsFeedView);

router.addRoutePath('/page/', newsFeedView, /page\/(\d+)/);
router.addRoutePath('/show/', newsDetailView, /show\/(\d+)/);

// ( 모듈 스펙 )
//    1) import: 다른 파일에 있는 특정한 class나 값들을 가지고 올 수 있는 문법
//    2) export: 해당하는 파일을 외부에서 import문을 통해서 가져갈 수 있게 허락해주는 문법
