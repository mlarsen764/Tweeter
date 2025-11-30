"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    daoFactory;
    constructor(daoFactory) {
        this.daoFactory = daoFactory;
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        const followDAO = this.daoFactory.getFollowDAO();
        const [users, hasMore] = await followDAO.getFollowees(userAlias, pageSize, lastItem?.alias);
        return [users.map(user => user.dto), hasMore];
    }
    ;
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        const followDAO = this.daoFactory.getFollowDAO();
        const [users, hasMore] = await followDAO.getFollowers(userAlias, pageSize, lastItem?.alias);
        return [users.map(user => user.dto), hasMore];
    }
    ;
    async getFakeData(lastItem, pageSize, userAlias) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        const followDAO = this.daoFactory.getFollowDAO();
        return await followDAO.isFollower(user.alias, selectedUser.alias);
    }
    async getFolloweeCount(token, user) {
        const followDAO = this.daoFactory.getFollowDAO();
        return await followDAO.getFolloweeCount(user.alias);
    }
    async getFollowerCount(token, user) {
        const followDAO = this.daoFactory.getFollowDAO();
        return await followDAO.getFollowerCount(user.alias);
    }
    async follow(token, userToFollow, userAlias) {
        const followDAO = this.daoFactory.getFollowDAO();
        await followDAO.follow(userAlias, userToFollow.alias);
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const currentUserDto = { alias: userAlias };
        const followeeCount = await this.getFolloweeCount(token, currentUserDto);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollow, userAlias) {
        const followDAO = this.daoFactory.getFollowDAO();
        await followDAO.unfollow(userAlias, userToUnfollow.alias);
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const currentUserDto = { alias: userAlias };
        const followeeCount = await this.getFolloweeCount(token, currentUserDto);
        return [followerCount, followeeCount];
    }
}
exports.FollowService = FollowService;
