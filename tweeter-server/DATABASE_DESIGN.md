# DynamoDB Table Design

## Tables

### 1. tweeter-users
- **Partition Key**: alias (string)
- **Attributes**: 
  - firstName (string)
  - lastName (string)
  - imageUrl (string)
  - hashedPassword (string)
  - followerCount (number)
  - followeeCount (number)

### 2. tweeter-auth-tokens
- **Partition Key**: token (string)
- **Attributes**:
  - userAlias (string)
  - timestamp (number)
- **TTL**: Set to expire tokens after 24 hours

### 3. tweeter-follows
- **Partition Key**: followerAlias (string)
- **Sort Key**: followeeAlias (string)
- **GSI**: followeeAlias-followerAlias-index
  - **Partition Key**: followeeAlias (string)
  - **Sort Key**: followerAlias (string)

### 4. tweeter-stories
- **Partition Key**: userAlias (string)
- **Sort Key**: timestamp (number, descending)
- **Attributes**:
  - post (string)
  - user (User object)

### 5. tweeter-feeds (Pre-computed feeds)
- **Partition Key**: userAlias (string)
- **Sort Key**: timestamp (number, descending)
- **Attributes**:
  - post (string)
  - user (User object)
  - authorAlias (string)

## Design Decisions

1. **Pre-computed Feeds**: Store each status in followers' feeds for fast retrieval
2. **GSI for Follows**: Allows querying both followers and followees efficiently
3. **Separate Stories/Feeds**: Stories for user's own posts, feeds for timeline
4. **Token TTL**: Automatic cleanup of expired tokens
5. **Denormalized Data**: Store user info with statuses to avoid joins