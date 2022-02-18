const ajax = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const container = document.getElementById("root");
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

// 문자열을 만들때는 ` 빽틱을 사용한다.
// newsFeed는 배열형식으로 되어있다.
/*document.getElementById("root").innerHTML = `<ul>
    <li>${newsFeed[0].title}</li>
    <li>${newsFeed[1].title}</li>
    <li>${newsFeed[2].title}</li>
</ul>`;*/
// 이런 0, 1, 2 로 접근하는 방식을 하드 코딩이라고 한다.

//ajax 코드가 중복되므로 중복을 제거하기위해 함수를 만든다.
/*function getData(url) {
  ajax.open("GET", url, false); // false는 동기적으로 가져오겠다 라는 것이다.
  ajax.send();

  return JSON.parse(ajax.response); //XMLHttpRequest로 불러온 데이터는 js에서 작업하기 힘든 형태로 되어있으므로,
  //JSON.parse를 이용해서 js에서 다루기 쉬운 데이터 형식으로 바꿔준다. ( json 형식으로 불러왔을때 가능 )
}*/

//1) 함수가 이벤트 핸들러에 묶여있는 ( 익명함수 )
/* 
window.addEventListener("hashchange", function () {
  const id = location.hash.substr(1); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.

  const newsContent = getData(CONTENT_URL.replace("@id", id)); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  const title = document.createElement("h1");
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    
    <div>
      <a href='#'>목록으로</a>
    </div>
  `;
});
*/

//1) dom 사용
/*
for (let i = 0; i < 10; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}
*/

// 2) 이 코드의 문제점은, 코드만 보고는 html 태그들의 구조를 파악하기가 어렵다.
// 이 문제점을 해결하는 방법은 아이러니하지만 DOM API 자체를 최대한 사용하지 않는 것 이다. 그 대신에 문자열만을 이용하여 UI를 만드는 방식을 사용한다.
/*
for (let i = 0; i < 10; i++) {
  const div = document.createElement("div"); // 일회용으로 쓰고버릴 div 태그를 만든다.
  // div 태그에 백틱을 사용해서 문자열로써 추가해도 결과는 똑같다. ( 장점: 가독성이 좋아짐 )

  div.innerHTML = `               
  <li>
    <a href="#${newsFeed[i].id}">
    ${newsFeed[i].title} (${newsFeed[i].comments_count})
    </a>
  </li>
  `;

  //ul.appendChild(div.children[0]); // children은 배열이다.
  ul.appendChild(div.firstElementChild); // children 배열중에 첫번째 요소
}
container.appendChild(ul);
container.appendChild(content);
*/

//3) dom 방식은 최대한 없애는것이 좋다. ( 2/14 )
//하나의 문자열로 만들 수 없는 경우에는 배열을 사용한다.
//그리고 라우터를 사용해 반복해서 코드를 사용하려면 함수로 만들어줘야한다.
// 4) 페이징 기능 추가 ( 2/15 )
/*
const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open("GET", url, false); // false는 동기적으로 가져오겠다 라는 것이다.
  ajax.send();

  return JSON.parse(ajax.response); //XMLHttpRequest로 불러온 데이터는 js에서 작업하기 힘든 형태로 되어있으므로,
  //JSON.parse를 이용해서 js에서 다루기 쉬운 데이터 형식으로 바꿔준다. ( json 형식으로 불러왔을때 가능 )
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];
  newsList.push("<ul>");
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`               
    <li>
      <a href="#/show/${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
    `);
  }

  newsList.push("</ul>");
  newsList.push(`
    <div>
      <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
      <a href="#/page/${store.currentPage < 3 ? store.currentPage + 1 : 3}">다음 페이지</a>
    </div>
  `);

  container.innerHTML = newsList.join("");
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail() {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const newsContent = getData(CONTENT_URL.replace("@id", id)); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    
    <div>
      <a href='#/page/${store.currentPage}'>목록으로</a>
    </div>
  `;
}

// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router() {
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

// 5) 템플릿 ( 배열을 최소화 해보자 )
//  장점: ui를 한눈에 볼수있다
//  단점: 여전히 for문 같은 걸로 li는 따로 만들고 있고, replace영역을 보면 마킹의 갯수만큼 replace를 써야 한다는 단점이 있다.
// 6) 디자인 입히기
const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open("GET", url, false); // false는 동기적으로 가져오겠다 라는 것이다.
  ajax.send();

  return JSON.parse(ajax.response); //XMLHttpRequest로 불러온 데이터는 js에서 작업하기 힘든 형태로 되어있으므로,
  //JSON.parse를 이용해서 js에서 다루기 쉬운 데이터 형식으로 바꿔준다. ( json 형식으로 불러왔을때 가능 )
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
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
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1);

  container.innerHTML = template;
}

// 2) 익명함수로 되어있으면 호출이 불가능하므로 이번트 핸들러에서 함수를 떼어낸다.
function newsDetail() {
  const id = location.hash.substr(7); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.
  const newsContent = getData(CONTENT_URL.replace("@id", id)); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
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

  //template = template.replace
  container.innerHTML = template;
}

// 화면전환을 위해 이벤트 핸들러에 라우터라는 함수를 만들어서 라우터함수에 이벤트를 걸어준다.
function router() {
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
