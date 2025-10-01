const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); 

const port = 3000;
function getPosts() {
  const data = fs.readFileSync("data/data.json", 'utf8');
  return JSON.parse(data).posts;
}
const savePosts = (posts) => {
  const data = JSON.parse(fs.readFileSync("data/data.json", 'utf8'));
  data.posts = posts; 
  fs.writeFileSync("data/data.json", JSON.stringify(data, null, 2), 'utf8');
}
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const data = fs.readFileSync("data/data.json", 'utf8')
  const users =JSON.parse(data).users;
  const user = users.find(u => u.id === userId);
  if (user) {
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } else {
    res.status(404).json({ error: "User doesn't exist" });
  }
});
app.get('/posts', (req, res) => {
  const posts =getPosts();
  if (posts) {
    res.status(200).json({posts});
  } else {
    res.status(404).json({ error: "User doesn't exist" });
  }
});
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);  
  const posts =getPosts();
  const post = users.find(u => u.id === postId);
  if (post) {
    res.status(200).json({posts});
  } else {
    res.status(404).json({ error: "User doesn't exist" });
  }
});

const ADMIN_TOKEN = "token";

app.post('/posts', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, content,author_id } = req.body.post;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content cannot be empty" });
  }

  const posts = getPosts();
  const newPost = {
    id: posts.length+1,
    title,
    content,
    author_id,
    created_at: new Date()
  };

  posts.push(newPost);
  savePosts(posts);

  return res.status(201).json(newPost);
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
