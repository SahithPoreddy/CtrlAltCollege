# API Endpoint Requirements for Frontend

This document outlines the API endpoint requirements for the frontend application, covering blog posts, trending posts, profile management, account deletion, and Q&A functionalities.

## 1. Blog Posts

### 1.1 Retrieve Blog Posts (`GET /api/blog/sendPosts`)
- **Description**: Returns a collection of blog posts (e.g., 5 posts per request).
- **Details Returned**:
  - Username
  - Date of creation
  - Tags
  - Profile picture (if available)
  - Pronouns (if available)
  - Content
  - Pictures (if available)
  - Upvotes and downvotes
  - Comments (retrieved separately to reduce response overhead)
- **Comments Retrieval**:
  - Comments are fetched dynamically via a separate request.
  - **Parameters**:
    - `postId`: ID of the blog post.
    - `lastCommentIndex`: Index of the last comment received.
  - **Response**: Returns comments following the specified index, including:
    - Username of commentator
    - Date of comment
    - Comment content

### 1.2 Create Blog Post (`POST /api/blog/savePosts`)
- **Description**: Saves a new blog post to the database.
- **Data Sent**:
  - Username
  - Date of creation
  - Tags
  - Profile picture (if available)
  - Pronouns (if available)
  - Content
  - Pictures (if available)
  - Upvotes and downvotes (initially zero)
  - Comments (none at creation)

## 2. Trending Posts (`GET /api/blog/sendPosts`)

- **Description**: Retrieves trending blog posts based on provided filters.
- **Parameters**:
  - JSON object containing filter criteria (e.g., time range, popularity).
- **Response**: Same structure as blog posts from `/api/blog/sendPosts`.

## 3. Profile Management

### 3.1 Retrieve Profile (`GET /api/profile`)
- **Description**: Fetches user profile details.
- **Details Returned**:
  - Username
  - Profile picture (if available)
  - Pronouns (if available)
  - Summary:
    - Reputation
    - Number of posts
    - Total upvotes and downvotes
    - Posts (filtered by username)
      - **Suggestion**: Reuse `/api/blog/sendPosts` with an `isProfile` boolean parameter set to `true`.

### 3.2 Update Profile (`PUT /api/profile`)
- **Description**: Updates user profile with new data.
- **Data Sent**: Same as profile details above, with updated values.

### 3.3 Delete Post (`DELETE /api/blog/post/{postId}`)
- **Description**: Deletes a specific post by the user.
- **Parameters**:
  - `postId`: ID of the post to delete.
- **Behavior**: Removes the post and associated data (e.g., comments, votes).

## 4. Delete Profile (`DELETE /api/profile`)

- **Description**: Deletes or deactivates a user’s account.
- **Options**:
  - **Hard Deletion**: Permanently deletes user data and their blog posts.
  - **Deactivation**: Retains account data for 30 days from deactivation date, allowing reactivation.
- **Behavior**:
  - If hard deletion is chosen, all associated blog posts are deleted.
  - If deactivated, blog posts are retained.

## 5. Q&A Section

### 5.1 Ask a Question (`POST /api/Q&A/ask`)
- **Description**: Submits a new question.
- **Data Sent**:
  - Question content
  - Tags for the question
  - Details of the user asking the question
  - Email notification preference (boolean)
    - If `true`, sends email notifications for the first `n` responses.
- **Response**:
  - Includes a boolean indicating if the question is answered.
  - If answered, includes the answers.

### 5.2 Answer a Question (`GET /api/Q&A/answer`)
- **Description**: Retrieves a list of questions for the user to answer.
- **Criteria**:
  - Questions are selected based on:
    - Matching tags of the question.
    - Tags the answering user is interested in.
- **Response**: List of questions with relevant details.