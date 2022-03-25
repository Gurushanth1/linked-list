import express from "express";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
// const dLinkedList = require("./LinkedList");
import cors from "cors";
const app = express();
const PORT = 8000;
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("home", { name: "sdf" });
});
app.delete("/post/:id", async (req, res) => {
  const id = req.params.id;
  const removeNode = await getPost(id);
  //HEAD
  if (removeNode.previousId === "NULL") {
    const nextNode = await getPost(removeNode.nextId);
    nextNode.previousId = "NULL";
    await updatePost(nextNode.id, nextNode);
    await deletePost(removeNode.id);

    return;
  }
  //TAil
  if (removeNode.nextId === "NULL") {
    const previousNode = await getPost(removeNode.previousId);
    previousNode.nextId = "NULL";
    await updatePost(previousNode.id, previousNode);
    await deletePost(removeNode.id);
  }
  //Middle
  if (removeNode.nextId !== "NULL" && removeNode.previousId !== "NULL") {
    const previousNode = await getPost(removeNode.previousId);
    const nextNode = await getPost(removeNode.nextId);
    nextNode.previousId = previousNode.id;
    previousNode.nextId = nextNode.id;
    await updatePost(previousNode.id, previousNode);
    await updatePost(nextNode.id, nextNode);
    await deletePost(removeNode.id);
  }
  res.status(200);
});
app.post("/insert/:id", async (req, res) => {
  const insertId = req.params.id;

  const previousNode = await getPost(insertId);
  // if tail
  if (previousNode.nextId === "NULL") {
    const newNode = {
      ...req.body,
      id: uuidv4(),
      previousId: previousNode.id,
      nextId: "NULL",
    };
    previousNode.nextId = newNode.id;
    await savePost(newNode);
    await updatePost(previousNode.id, previousNode);
    return;
  }
  const nextNode = await getPost(previousNode.nextId);
  const newNode = {
    ...req.body,
    id: uuidv4(),
    previousId: previousNode.id,
    nextId: nextNode.id,
  };
  previousNode.nextId = newNode.id;
  nextNode.previousId = newNode.id;
  await savePost(newNode);
  await updatePost(previousNode.id, previousNode);
  await updatePost(nextNode.id, nextNode);
});
app.post("/save", async (req, res) => {
  console.log(req.body);
  const posts = await getPosts();
  console.log(posts);
  const newNode = {
    ...req.body,
    id: uuidv4(),
  };
  if (posts.length > 0) {
    const tailNode = await getTail();
    console.log("tail", tailNode);
    newNode.previousId = tailNode.id;
    tailNode.nextId = newNode.id;
    newNode.nextId = "NULL";
    await updatePost(tailNode.id, tailNode);
  } else {
    newNode.previousId = "NULL";
    newNode.nextId = "NULL";
  }
  console.log(await savePost(newNode));
});
app.get("/post/:id", async (req, res) => {
  const id = req.params.id;
  const data = await getPost(id);
  res.send(data);
});
app.get("/posts", async (req, res) => {
  const post = await getPosts();
  console.log(post);
  res.send(post);
});
app.get("/latest", async (req, res) => {
  const post = await getTail();
  console.log(post);
  res.send(post);
});
const getPosts = async () => {
  const data = await fetch("http://localhost:3001/posts");
  return await JSON.parse(await data.text());
};
const getPost = async (id) => {
  const data = await fetch(`http://localhost:3001/posts/${id}`);
  return await JSON.parse(await data.text());
};
const deletePost = async (id) => {
  const data = await fetch(`http://localhost:3001/posts/${id}`, {
    method: "DELETE",
  });
  return await data.text();
};
const getTail = async (id) => {
  const data = await fetch(`http://localhost:3001/posts?nextId=NULL`);
  return (await JSON.parse(await data.text()))[0];
};
const savePost = async (data) => {
  const resData = await fetch(`http://localhost:3001/posts/`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return await resData.text();
};
const updatePost = async (id, data) => {
  const resData = await fetch(`http://localhost:3001/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return await JSON.parse(await resData.text());
};
app.listen(PORT, () => console.log(`Listening on port:${PORT}`));
