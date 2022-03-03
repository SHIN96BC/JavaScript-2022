//async, await 방식
import { NewsFeed, NewsDetail } from '../types';

export default class Api {
    url: string;
    xhr: XMLHttpRequest;
  
    constructor(url: string){
      this.url = url;
      this.xhr = new XMLHttpRequest();
    }

    async request<AjaxResponse>(): Promise<AjaxResponse> { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
      // Json.parse 의 문제점은 동기적으로 작동되기떄문에 ui가 멈추는 문제가 있다. 
      //아래는 그걸 해결하기 위해서 거의 형식적으로 쓰는 방식이다.
      const response = await fetch(this.url);
      return await response.json() as AjaxResponse;
    }
  }
  
  export class NewsFeedApi extends Api{
    constructor(url: string) {
      super(url);
    }
    async getData(): Promise<NewsFeed[]> {
      return this.request<NewsFeed[]>();
    }
  }
  
  export class NewsDetailApi extends Api {
    constructor(url: string) {
      super(url);
    }
    async getData(): Promise<NewsDetail>{
      return this.request<NewsDetail>();
    }
  }




/*
// 비동기식 코드 ( 콜백 헬 해결 Promise ) ( 사용하는쪽에서는 바꿀게 거의 없다 )
import { NewsFeed, NewsDetail } from '../types';

export default class Api {
    url: string;
    xhr: XMLHttpRequest;
  
    constructor(url: string){
      this.url = url;
      this.xhr = new XMLHttpRequest();
    }

    getRequestWithPromise<AjaxResponse>(cb: (data: AjaxResponse) => void ): void { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
      // Json.parse 의 문제점은 동기적으로 작동되기떄문에 ui가 멈추는 문제가 있다. 
      //아래는 그걸 해결하기 위해서 거의 형식적으로 쓰는 방식이다.
      fetch(this.url)
        .then(response => response.json())
        .then(cb)
        .catch(() => {
          console.error('데이터를 불러오지 못했습니다');
        })
    }
  }
  
  export class NewsFeedApi extends Api{
    constructor(url: string) {
      super(url);
    }
    getData(cb: (data: NewsFeed[]) => void ): void {
      return this.getRequestWithPromise<NewsFeed[]>(cb);
    }
  }
  
  export class NewsDetailApi extends Api {
    constructor(url: string) {
      super(url);
    }
    getData(cb: (data: NewsDetail) => void ): void {
      return this.getRequestWithPromise<NewsDetail>(cb);
    }
  }
*/




/*
// 비동기식 코드 ( 콜백 헬 )
import { NewsFeed, NewsDetail } from '../types';

export default class Api {
    url: string;
    ajax: XMLHttpRequest;
  
    constructor(url: string){
      this.url = url;
      this.ajax = new XMLHttpRequest();
    }
  
    getRequest<AjaxResponse>(cb: (data: AjaxResponse) => void ): void { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
      this.ajax.open('GET', this.url);
      this.ajax.addEventListener('load', () => {
        cb(JSON.parse(this.ajax.response) as AjaxResponse)
      });
      this.ajax.send();
    }
  }
  
  export class NewsFeedApi extends Api{
    constructor(url: string) {
      super(url);
    }
    getData(cb: (data: NewsFeed[]) => void ): void {
      return this.getRequest<NewsFeed[]>(cb);
    }
  }
  
  export class NewsDetailApi extends Api {
    constructor(url: string) {
      super(url);
    }
    getData(cb: (data: NewsDetail) => void ): void {
      return this.getRequest<NewsDetail>(cb);
    }
  }
*/



  /*
  //동기식 코드
  import { NewsFeed, NewsDetail } from '../types';

export default class Api {
    url: string;
    ajax: XMLHttpRequest;
  
    constructor(url: string){
      this.url = url;
      this.ajax = new XMLHttpRequest();
    }
  
    getRequest<AjaxResponse>(): AjaxResponse { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
      this.ajax.open('GET', this.url, false);
      this.ajax.send();
  
      return JSON.parse(this.ajax.response) as AjaxResponse;
    }
  }
  
  export class NewsFeedApi extends Api{
    constructor(url: string) {
      super(url);
    }
    getData(): NewsFeed[]{
      return this.getRequest<NewsFeed[]>();
    }
  }
  
  export class NewsDetailApi extends Api {
    constructor(url: string) {
      super(url);
    }
    getData(): NewsDetail{
      return this.getRequest<NewsDetail>();
    }
  }
  */