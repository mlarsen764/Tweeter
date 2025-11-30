"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const PagedUserLambda_1 = require("../PagedUserLambda");
class GetFolloweesHandler extends PagedUserLambda_1.PagedUserLambda {
    async getPagedUsers(followService, request) {
        return await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
    }
}
const handlerInstance = new GetFolloweesHandler();
const handler = (request) => handlerInstance.handle(request);
exports.handler = handler;
