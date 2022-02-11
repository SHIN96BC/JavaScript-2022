const ajax = new XMLHttpRequest(); // XMLHttpRequest는 네트워크 너머에 있는 데이터를 가져오는 것.
// let 과 const 의 차이점은 let(변수)은 이후에 값을 바꿀 수 있고, const(상수)는 처음 데이터를 바꿀 수 없다.
const container = document.getElementById("root");
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
ajax.open("GET", NEWS_URL, false); // false는 동기적으로 가져오겠다 라는 것이다.
ajax.send();

const newsFeed = JSON.parse(ajax.response); //XMLHttpRequest로 불러온 데이터는 js에서 작업하기 힘든 형태로 되어있으므로,
//JSON.parse를 이용해서 js에서 다루기 쉬운 데이터 형식으로 바꿔준다. ( json 형식으로 불러왔을때 가능 )

// 문자열을 만들때는 ` 빽틱을 사용한다.
// newsFeed는 배열형식으로 되어있다.
/*document.getElementById("root").innerHTML = `<ul>
    <li>${newsFeed[0].title}</li>
    <li>${newsFeed[1].title}</li>
    <li>${newsFeed[2].title}</li>
</ul>`;*/
// 이런 0, 1, 2 로 접근하는 방식을 하드 코딩이라고 한다.

// 반복문 처리
const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  const id = location.hash.substr(1); //location객체는 브라우저가 기본적으로 제공하는 객체다. 주소와 관련된 다양한 정보를 제공해준다.

  ajax.open("GET", CONTENT_URL.replace("@id", id), false); //replace는 값을 대체해주는 함수(왼쪽에 있는 값을 오른쪽에 있는 값으로 바꾼다)
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement("h1");

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);
