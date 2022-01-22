const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentsList(comments) {
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
        <article class="comment-item">
            <h2>${comment.title}</h2>
            <p>${comment.text}</p>
        </article>
        `;
    commentListElement.appendChild(commentElement);
  }
  return commentListElement;
}

async function fetchCommentsForPost() {
  const postId = loadCommentsBtnElement.dataset.postid;
  try {
    const response = await fetch(`/posts/${postId}/comments`);

    if (!response.ok) {
      alert("It's look we have a problem on server, Fetching comments failed!");
      return;
    }

    const responseData = await response.json();
    if (responseData && responseData.length > 0) {
      const commentsListElement = createCommentsList(responseData);
      commentsSectionElement.innerHTML = "";
      commentsSectionElement.appendChild(commentsListElement);
    } else {
      commentsSectionElement.firstElementChild.textContent = `We could not find any comments. Maybe add one!`;
    }
  } catch (error) {
    alert("Bad Connection, Getting comments failed!");
  }
}

async function saveComment(event) {
  // prevent browser sending request
  event.preventDefault();
  const postId = commentsFormElement.dataset.postid;
  const entredTitle = commentTitleElement.value;
  const entredText = commentTextElement.value;
  const comment = { title: entredTitle, text: entredText };
  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.ok) {
      fetchCommentsForPost();
      commentTitleElement.value = "";
      commentTextElement.value = "";
    } else {
      alert(
        "It's look we have a problem on server. Could not send comment, please try again later!"
      );
    }
  } catch (error) {
    alert(
      "Bad connection, Could not send request - verify your connection and try again later!"
    );
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
