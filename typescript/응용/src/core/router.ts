// import 할때 {} 안에 사용할 객체 이름을 적어준다. form 에는 그 파일의 위치를 적는다.
import { RouteInfo } from '../types';
// view.ts 의 ts 는 생략이 가능하다.
// 그리고 export default 는 {} 가 아니라 내가 여기서 쓰고 싶은 이름을 적어 주면 된다.
import View from './view';

export default class Router {
    private isStart: boolean;
    routeTable: RouteInfo[];
    defaultRoute: RouteInfo | null;
  
    constructor() {
      window.addEventListener("hashchange", this.route.bind(this)); // bind 함수를 사용해서 this를 고정시켜준다.
  
      this.routeTable = [];
      this.defaultRoute = null;
      this.isStart = false;
    }
    setDefaultPage(page: View, params: RegExp | null = null): void {
      this.defaultRoute = { path: '', page, params, }; // page 는 이름 같아서 생략 ( 원래는 page: page )
    }
    addRoutePath(path: string, page: View,  params: RegExp | null = null): void {
      this.routeTable.push({
       path, page, params
      });
      
      if(!this.isStart){
        this.isStart = true;
        //Execute next tick
        setTimeout(this.route.bind(this), 0);
      }
    }
  
    private route() {
      const routePath: string = location.hash;
  
      if(routePath === '' && this.defaultRoute) {
        this.defaultRoute.page.render();
        return;
      }
  
      for(const routeInfo of this.routeTable) {
        if(routePath.indexOf(routeInfo.path) >= 0) {
          if(routeInfo.params){
            const parseParams = routePath.match(routeInfo.params);
            
            if(parseParams){
              routeInfo.page.render.apply(null, [parseParams[1]]);
            }
          }else{
            routeInfo.page.render();
          }
          return;
        }
      }
    }
  }