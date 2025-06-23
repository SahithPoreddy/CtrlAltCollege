#### API endpoint requirements for frontend:
i. Blog posts:
    a. When requested at (api/blog/sendPosts), a collection of blog posts should be returned (Ex: 5). Also the comments are requested separtely since sending all the comments along with the posts itself will increase the overhead of the response. For comments being sent dynamically, an post ID and the index of last comment is sent. The comments following are to be sent back to the client. The details sent for blog post are:
        I. Username
        II. Date of the creation
        III. Tags
        IV. Profile picture
        V. Pronouns (If exists)
        VI. Content
        VII. Pictures (If exists)
        VIII. Upvotes and downvotes
        IX. Comments (Username of commentator, data of the comment, Comment content)
    b. When a new blog post is created and sent, the data shall be saved in the DB(api/blog/savePosts). The data sent is the same as the data to be received in the section 'a'. Except there will be no comments, zero upvotes and downvotes.

ii. Trending posts:
      Nothing fancy. Same as that of (api/blog/sendPosts) with an json containing filters. Depending on the filter data, send the desired posts.

iii. Profile management:
      a. Username
      b. profile picture (If exists)
      c. Pronouns(If exists)
      d. Summary:
          I. Reputation
          II. Number of posts
          III. Total number of upvotes and downvotes
          IV. Posts (Filter by the username. Suggestable to use the same API end point (api/blog/sendPosts) with a bool representing isProfile
      If the user edits the profile, the new data is sent back to the server for updation. If the user wants to delete a post of theirs, a delete request is sent along with the id of the post which will delete the post as well as the data surrounding it.

iv. Delete profile:
      a. A simple request to delete the data of the user from the database. Only if the user opts for hard deletion, the blogs are also deleted else they are retained. If deactivated instead of deletion, the account is retained for the next 30 days starting from the date of deactivation.

v. Q&A:
      a. In the Q&A section, a (api/Q&A/ask) is sent for question with the following details:
          I. The question content
          II. Tags for the question
          III. Details of the user who asked the question
          IV. An optional feature where the user gets an email when someone answers the question. If the bool is true, send an email for the first n responses to that question.
          V. If the question is answered, then a bool saying that it is answered should be returned along with the answers as well.
      b. In the Q&A section, a (api/Q&A/answer):
          I. A list of question should be returned. These questions should be based on matching the tags the question contains as well as the tags the person who is answering the question is interested in.
      
      
          
