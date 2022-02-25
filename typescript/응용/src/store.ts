import { NewsFeed, NewsStore } from './types';

export default class Store implements NewsStore{
    private feeds: NewsFeed[];
    private _currentPage: number; // 내부에서만 쓰는 속성의 경우 이름이 겹치면 앞에다가 _ 를 붙인다.
    constructor() {
        this.feeds = [];
        this._currentPage = 1;
    }

    get currentPage() { // 겟터 ( 외부에서 메소드를 호출하면 불편하니까 내부에서는 함수지만, 외부에서는 속성값처럼 쓸 수 있게 해주는 기능 )
        return this._currentPage;
    }

    set currentPage(page: number) { // 셋터 ( 겟터와 동일한 방식이지만 값을 셋팅 하는 기능 )
        this._currentPage = page;
    }

    get nextPage(): number {
        return this._currentPage + 1;
    }

    get prevPage(): number {
        return this._currentPage > 1 ? this._currentPage - 1 : 1;
    }

    get numberOfFeed(): number {
        return this.feeds.length;
    }

    get hasFeeds():boolean {
        return this.feeds.length > 0;
    }

    getAllFeeds(): NewsFeed[] {
        return this.feeds;
    }

    getFeed(position: number): NewsFeed {
        return this.feeds[position];
    }

    setFeeds(feeds: NewsFeed[]): void {  // 현대적인 코드이다. ( 배열의 map 함수 중요!! )
        this.feeds = feeds.map(feed => ({
            ...feed,
            read: false
        }));
    }

    makeRead(id: number): void {
        const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);

        if(feed){
            feed.read = true;
        }
    }

}