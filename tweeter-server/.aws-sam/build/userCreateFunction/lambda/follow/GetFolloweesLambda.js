"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const DynamoDAOFactory_1 = require("../../model/dao/dynamodb/DynamoDAOFactory");
const AuthorizationService_1 = require("../../model/service/auth/AuthorizationService");
const handler = async (request) => {
    const daoFactory = new DynamoDAOFactory_1.DynamoDAOFactory();
    const authService = new AuthorizationService_1.AuthorizationService(daoFactory.getAuthTokenDAO());
    await authService.validateToken(request.token);
    const followService = new FollowService_1.FollowService(daoFactory);
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    };
};
exports.handler = handler;
