/*
// 객체 타입 지정 1) 타입 알리아스 방식 ( 타입 선언을 할때는 관례상 첫글자를 대문자로 한다. )
type Store = {
  currentPage: number;
  feeds: NewsFeed[]; // [] 앞에 만든 타입 유형을 붙여주면 그 유형의 데이터가 들어간다고 지정해줄 수 있다.
}

// 중복코드를 제거하는 방법 ( 알리아스 ) 
// 1) 중복되는 속성들을 하나의 타입에 넣고
type News = {
  id: number;
  time_ago: string;
  title: string;
  url: string;
  user:string;
  content: string;
}
// 2) "=" 옆에 중복되는 속성들을 넣었던 타입을 적어주고 "&" 로 마킹을 해주면 된다. 
type NewsFeed = News & {
  comments_count: number;
  points: number;
  read?: boolean; // 있다가 없다가 하는 옵셔널한 변수에는 ? 를 붙여준다 ( 선택 속성 )
}

type NewsDetail = News & {
  comments: NewsComment[];
}

type NewsComment = News & {
  comments: NewsComment[];
  level: number;
}



const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";


const store: Store = {   //스토어의 타입은 객체이다. 그 안에는 숫자타입과 배열타입이 있다. 이때 타입을 지정하는 방법은 2가지가 있다.
  currentPage: 1,
  feeds: [],
};

// getData를 사용하는 두군데의 타입이 서로 다르다. 그런 경우에는 조금 고민이 필요하다.
// 1) 그럴때는 리턴 타입을 | 를 이용해서 두개를 적어주면 된다. ( 반환타입에 맞는 타입선인이 필요하다 )
//   그러나 1) 번의 문제점은 반환타입이 여러개일때 호출하는 곳에서 반환값을 받을때 if문으로 가드코드를 수없이 많이 써야되는 상황이 올 수 있다. 
// 이걸 해결하기 위해 '제네릭'을 사용한다 
// 2) 제네릭: 함수와 () 사이에 <> 를 적어줘서 받을 타입을 지정한다. 물론 호출하는 쪽에서도 제네릭을 사용해서 응답으로 받을 원하는 타입을 적어준다.
//    즉 호출하는 쪽에서 유형을 명시해주면 그 유형으로 받아서 반환도 그 유형으로 할 수 있게 된다.
function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false); 
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[]{
  for(let i = 0; i < feeds.length; i++){  // 여기서 let i 같은 경우 우리가 봐도, 타입스크립트가 봐도 숫자인게 명확하기 때문에 이런
    feeds[i].read = false;                // 경우는 타입스크립트가 내부적으로 타입을 적어준다.( 생략가능 )
  }

  return feeds;
}

function updateView(html: string): void {
  if(container != null){
    container.innerHTML = html;
  }else{
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
  }
}

function newsFeed(): void {
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}
      </div>
    </div>
  `;

  if(newsFeed.length === 0){
    newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));   // 대입연산자를 연속해서 쓰면 맨 오른쪽의 데이터를 왼쪽에 넣고 그 왼쪽 데이터를 다시 자신의 왼쪽에 넣는다는 의미이다.
  }
  
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
         </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>
        </div>
      </div>
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  updateView(template);
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail(): void {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const newsContent = getData<NewsDetail>(CONTENT_URL.replace("@id", id)); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        
        {{__comments__}}

      </div>
    </div>
  `;

  for(let i = 0; i < store.feeds.length; i++){
    if(store.feeds[i].id === Number(id)){
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];
  
  for(let i = 0; i < comments.length; i++){
    const comment: NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>
    `);
    
    if(comment.comments.length > 0){
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join('');
}


// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router(): void {
  const routePath = location.hash;

  if (routePath === "") {
    // location.hash 에는 분명 #이 들어있을텐데 왜 true가 되었냐면, 실제로 문자열에 #만 들어있을 경우에는 빈값을 반환하기 때문이다.
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}
window.addEventListener("hashchange", router);

router();
*/


/*
// 객체 타입 지정 2) 인터페이스  ( 유니온 타입을 사용해야할때 이외에는 인터페이스를 주로 많이 쓰는 경향이 있다. )
// 타입 알리아스와 인터페이스는 거의 유사하지만 아주 조금 차이가 있다.
// 차이점 1) 이퀄( = )이 있는냐 없느냐
// 차이점 2) 타입을 결합시키거나 조합시키는 방식에서 차이가 가장 크다.
//        인터페이스 에서는 타입 두개를 합치거나,  인터섹션( & ) 타입을 만들거나 하는것은 & 대신
//        대신에 extends 를 사용한다. ( 유니온 타입( | ) 은 지원하지 않음 )
interface Store {
  currentPage: number;
  feeds: NewsFeed[]; // [] 앞에 만든 타입 유형을 붙여주면 그 유형의 데이터가 들어간다고 지정해줄 수 있다.
}

// 타입알리아스와 인터페이스 안에 속성이 수정되지 못하게 막는 방법. ( 지시어 ): readonly
interface News {
  readonly id: number;  
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user:string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // 있다가 없다가 하는 옵셔널한 변수에는 ? 를 붙여준다 ( 선택 속성 )
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}



const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";


const store: Store = {   //스토어의 타입은 객체이다. 그 안에는 숫자타입과 배열타입이 있다. 이때 타입을 지정하는 방법은 2가지가 있다.
  currentPage: 1,
  feeds: [],
};

// getData를 사용하는 두군데의 타입이 서로 다르다. 그런 경우에는 조금 고민이 필요하다.
// 1) 그럴때는 리턴 타입을 | 를 이용해서 두개를 적어주면 된다. ( 반환타입에 맞는 타입선인이 필요하다 )
//   그러나 1) 번의 문제점은 반환타입이 여러개일때 호출하는 곳에서 반환값을 받을때 if문으로 가드코드를 수없이 많이 써야되는 상황이 올 수 있다. 
// 이걸 해결하기 위해 '제네릭'을 사용한다 
// 2) 제네릭: 함수와 () 사이에 <> 를 적어줘서 받을 타입을 지정한다. 물론 호출하는 쪽에서도 제네릭을 사용해서 응답으로 받을 원하는 타입을 적어준다.
//    즉 호출하는 쪽에서 유형을 명시해주면 그 유형으로 받아서 반환도 그 유형으로 할 수 있게 된다.
function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false); 
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[]{
  for(let i = 0; i < feeds.length; i++){  // 여기서 let i 같은 경우 우리가 봐도, 타입스크립트가 봐도 숫자인게 명확하기 때문에 이런
    feeds[i].read = false;                // 경우는 타입스크립트가 내부적으로 타입을 적어준다.( 생략가능 )
  }

  return feeds;
}

function updateView(html: string): void {
  if(container != null){
    container.innerHTML = html;
  }else{
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
  }
}

function newsFeed(): void {
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}
      </div>
    </div>
  `;

  if(newsFeed.length === 0){
    newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));   // 대입연산자를 연속해서 쓰면 맨 오른쪽의 데이터를 왼쪽에 넣고 그 왼쪽 데이터를 다시 자신의 왼쪽에 넣는다는 의미이다.
  }
  
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
         </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>
        </div>
      </div>
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  updateView(template);
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail(): void {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const newsContent = getData<NewsDetail>(CONTENT_URL.replace("@id", id)); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        
        {{__comments__}}

      </div>
    </div>
  `;

  for(let i = 0; i < store.feeds.length; i++){
    if(store.feeds[i].id === Number(id)){
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];
  
  for(let i = 0; i < comments.length; i++){
    const comment: NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>
    `);
    
    if(comment.comments.length > 0){
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join('');
}


// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router(): void {
  const routePath = location.hash;

  if (routePath === "") {
    // location.hash 에는 분명 #이 들어있을텐데 왜 true가 되었냐면, 실제로 문자열에 #만 들어있을 경우에는 빈값을 반환하기 때문이다.
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}
window.addEventListener("hashchange", router);

router();
*/



/*
// ( 상속 ) 상속을 다루는 매커니즘은 크게 '클래스'와 '믹스인' 두가지 이다. 
// 1) 클래스 를 이용한 상속
interface Store {
  currentPage: number;
  feeds: NewsFeed[]; // [] 앞에 만든 타입 유형을 붙여주면 그 유형의 데이터가 들어간다고 지정해줄 수 있다.
}

interface News {
  readonly id: number;  
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user:string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // 있다가 없다가 하는 옵셔널한 변수에는 ? 를 붙여준다 ( 선택 속성 )
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}



const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";


const store: Store = {   //스토어의 타입은 객체이다. 그 안에는 숫자타입과 배열타입이 있다. 이때 타입을 지정하는 방법은 2가지가 있다.
  currentPage: 1,
  feeds: [],
};


class Api {
  url: string;
  ajax: XMLHttpRequest;

  constructor(url: string){
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(): AjaxResponse { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
    this.ajax.open('GET', this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[]{
    return this.getRequest<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(): NewsDetail{
    return this.getRequest<NewsDetail>();
  }
}

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false); 
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[]{
  for(let i = 0; i < feeds.length; i++){  // 여기서 let i 같은 경우 우리가 봐도, 타입스크립트가 봐도 숫자인게 명확하기 때문에 이런
    feeds[i].read = false;                // 경우는 타입스크립트가 내부적으로 타입을 적어준다.( 생략가능 )
  }

  return feeds;
}

function updateView(html: string): void {
  if(container != null){
    container.innerHTML = html;
  }else{
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
  }
}

function newsFeed(): void {
  const api = new NewsFeedApi(NEWS_URL);
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}
      </div>
    </div>
  `;

  if(newsFeed.length === 0){
    newsFeed = store.feeds = makeFeeds(api.getData());   // 대입연산자를 연속해서 쓰면 맨 오른쪽의 데이터를 왼쪽에 넣고 그 왼쪽 데이터를 다시 자신의 왼쪽에 넣는다는 의미이다.
  }
  
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
         </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>
        </div>
      </div>
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  updateView(template);
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail(): void {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
  const newsContent = api.getData(); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        
        {{__comments__}}

      </div>
    </div>
  `;

  for(let i = 0; i < store.feeds.length; i++){
    if(store.feeds[i].id === Number(id)){
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];
  
  for(let i = 0; i < comments.length; i++){
    const comment: NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>
    `);
    
    if(comment.comments.length > 0){
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join('');
}


// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router(): void {
  const routePath = location.hash;

  if (routePath === "") {
    // location.hash 에는 분명 #이 들어있을텐데 왜 true가 되었냐면, 실제로 문자열에 #만 들어있을 경우에는 빈값을 반환하기 때문이다.
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}
window.addEventListener("hashchange", router);

router();
*/



/*
// 2) 믹스인 을 이용한 상속
// 클래스를 이용해서 구현하지만, extends 를 사용하지않고 클래스를 마치 함수처럼 혹은 단독의 객체처럼 바라보면서 
// 필요한 경우마다 클래스를 합성해서 새로운 기능으로 확장해 나가는 기법이다.
// ? 왜 굳이 extends 가 있는데 믹스인 기법을 사용해서 어렵게 짜야하는가 의문이 들 수 있다. 그 이유는 2가지 정도가 있다.
//   1> 기존의 extends 라고 하는 상속 방법은 코드에 적시되어야 하는 상속 방법이다. 즉, 코드의 관계를 바꾸려면 코드 자체를 바꿔야한다. ( 관계를 유연하게 가져갈 수 없다. )
//      그레서 두개의 인자로써 클래스 두개를 이어주는 함수를 사용하는 믹스인 기법이 좀더 관계를 유연하게 만들어준다.
//   2> extends 는 다중상속을 지원하지 않기 때문이다. 그래서 다중상속이 가능한 믹스인 기법을 사용하는 것 이다.
interface Store {
  currentPage: number;
  feeds: NewsFeed[]; // [] 앞에 만든 타입 유형을 붙여주면 그 유형의 데이터가 들어간다고 지정해줄 수 있다.
}

interface News {
  readonly id: number;  
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user:string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // 있다가 없다가 하는 옵셔널한 변수에는 ? 를 붙여준다 ( 선택 속성 )
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}



const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";


const store: Store = {   //스토어의 타입은 객체이다. 그 안에는 숫자타입과 배열타입이 있다. 이때 타입을 지정하는 방법은 2가지가 있다.
  currentPage: 1,
  feeds: [],
};

// ( 믹스인 ) 1. 믹스인 이라는 기법을 직접적으로 지원하는건 아니고 코드 테크닉으로 전개되는 기법이다.
function applyApiMixins(targetClass: any, baseClasses: any[]): void {
  baseClasses.forEach(baseClass =>{
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

      if(descriptor){
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

class Api {
  getRequest<AjaxResponse>(url: string): AjaxResponse { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
    const ajax = new XMLHttpRequest();
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {
  getData(): NewsFeed[]{
    return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi {
  getData(id: string): NewsDetail{
    return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id));
  }
}

// ( 믹스인 ) 2. 믹스인을 호출할때 첫번째 인자로 받은 클래스한테 두번째 인자로 받은 클래스의 내용을 상속시켜주는 코드를 넣어주면 된다.
interface NewsFeedApi extends Api{};
interface NewsDetailApi extends Api{};

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false); 
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[]{
  for(let i = 0; i < feeds.length; i++){  // 여기서 let i 같은 경우 우리가 봐도, 타입스크립트가 봐도 숫자인게 명확하기 때문에 이런
    feeds[i].read = false;                // 경우는 타입스크립트가 내부적으로 타입을 적어준다.( 생략가능 )
  }

  return feeds;
}

function updateView(html: string): void {
  if(container != null){
    container.innerHTML = html;
  }else{
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
  }
}

function newsFeed(): void {
  const api = new NewsFeedApi();
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}
      </div>
    </div>
  `;

  if(newsFeed.length === 0){
    newsFeed = store.feeds = makeFeeds(api.getData());   // 대입연산자를 연속해서 쓰면 맨 오른쪽의 데이터를 왼쪽에 넣고 그 왼쪽 데이터를 다시 자신의 왼쪽에 넣는다는 의미이다.
  }
  
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
         </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>
        </div>
      </div>
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  updateView(template);
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail(): void {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const api = new NewsDetailApi();
  const newsContent = api.getData(id); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        
        {{__comments__}}

      </div>
    </div>
  `;

  for(let i = 0; i < store.feeds.length; i++){
    if(store.feeds[i].id === Number(id)){
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];
  
  for(let i = 0; i < comments.length; i++){
    const comment: NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>
    `);
    
    if(comment.comments.length > 0){
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join('');
}


// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router(): void {
  const routePath = location.hash;

  if (routePath === "") {
    // location.hash 에는 분명 #이 들어있을텐데 왜 true가 되었냐면, 실제로 문자열에 #만 들어있을 경우에는 빈값을 반환하기 때문이다.
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}
window.addEventListener("hashchange", router);

router();
*/



// ( 뷰 클래스로 코드 구조 개선 )

interface Store {
  currentPage: number;
  feeds: NewsFeed[]; // [] 앞에 만든 타입 유형을 붙여주면 그 유형의 데이터가 들어간다고 지정해줄 수 있다.
}

interface News {
  readonly id: number;  
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user:string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // 있다가 없다가 하는 옵셔널한 변수에는 ? 를 붙여준다 ( 선택 속성 )
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}



const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";


const store: Store = {   //스토어의 타입은 객체이다. 그 안에는 숫자타입과 배열타입이 있다. 이때 타입을 지정하는 방법은 2가지가 있다.
  currentPage: 1,
  feeds: [],
};


class Api {
  url: string;
  ajax: XMLHttpRequest;

  constructor(url: string){
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(): AjaxResponse { // 클래스 외부에서 호출하면 안되는 메소드에는 protected 지시어를 사용해준다.
    this.ajax.open('GET', this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

class NewsFeedApi extends Api{
  getData(): NewsFeed[]{
    return this.getRequest<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(id: string): NewsDetail{
    return this.getRequest<NewsDetail>();
  }
}


function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false); 
  ajax.send();

  return JSON.parse(ajax.response);
}

class NewsFeedView {
  constructor() {
    let api = new NewsFeedApi(NEWS_URL);
    let newsFeed: NewsFeed[] = store.feeds;
    
    let template: string = `
      <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                  Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                  Next
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
          {{__news_feed__}}
        </div>
      </div>
    `;

    if(newsFeed.length === 0){
      newsFeed = store.feeds = makeFeeds(api.getData());   // 대입연산자를 연속해서 쓰면 맨 오른쪽의 데이터를 왼쪽에 넣고 그 왼쪽 데이터를 다시 자신의 왼쪽에 넣는다는 의미이다.
    }
    
  }

  render(): void {
    const newsList: string[] = [];

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      newsList.push(`
        <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
              <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
              <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
            </div>
          </div>
        </div>
      `);
    }

    template = template.replace('{{__news_feed__}}', newsList.join(''));
    template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

    updateView(template);
  }

  makeFeeds(feeds: NewsFeed[]): NewsFeed[]{
    for(let i = 0; i < feeds.length; i++){  // 여기서 let i 같은 경우 우리가 봐도, 타입스크립트가 봐도 숫자인게 명확하기 때문에 이런
      feeds[i].read = false;                // 경우는 타입스크립트가 내부적으로 타입을 적어준다.( 생략가능 )
    }
  
    return feeds;
  }
}



function updateView(html: string): void {
  if(container != null){
    container.innerHTML = html;
  }else{
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
  }
}

function newsFeed(): void {
  
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail(): void {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
  const newsContent = api.getData(id); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        
        {{__comments__}}

      </div>
    </div>
  `;

  for(let i = 0; i < store.feeds.length; i++){
    if(store.feeds[i].id === Number(id)){
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];
  
  for(let i = 0; i < comments.length; i++){
    const comment: NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>
    `);
    
    if(comment.comments.length > 0){
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join('');
}


// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router(): void {
  const routePath = location.hash;

  if (routePath === "") {
    // location.hash 에는 분명 #이 들어있을텐데 왜 true가 되었냐면, 실제로 문자열에 #만 들어있을 경우에는 빈값을 반환하기 때문이다.
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}
window.addEventListener("hashchange", router);

router();