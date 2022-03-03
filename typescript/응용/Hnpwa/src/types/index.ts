  import View from '../core/view';
  
  export interface NewsStore {
    getAllFeeds: () => NewsFeed[];
    getFeed: (position: number) => NewsFeed;
    setFeeds: (feeds: NewsFeed[]) => void;
    makeRead: (id: number) => void;
    hasFeeds: boolean;
    currentPage: number;
    nextPage: number;
    prevPage: number;
  }

  export interface News {
    readonly id: number;  
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user:string;
    readonly content: string;
  }
  
  export interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean; // 있다가 없다가 하는 옵셔널한 변수에는 ? 를 붙여준다 ( 선택 속성 )
  }
  
  export interface NewsDetail extends News {
    readonly comments: NewsComment[];
  }
  
  export  interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
  }
  
  export  interface RouteInfo {
    path: string;
    page: View;
    params: RegExp | null;
  }