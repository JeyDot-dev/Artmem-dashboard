declare module 'pixiv-api-client' {
  export default class PixivApi {
    constructor();
    refreshAccessToken(refreshToken: string): Promise<any>;
    illustRanking(options: { mode: string }): Promise<any>;
    bookmarkIllust(illustId: number): Promise<any>;
    unbookmarkIllust(illustId: number): Promise<any>;
  }
}
