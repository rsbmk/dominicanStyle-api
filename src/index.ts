import app from "./app";
const PORT = process.env.PGPORT || 8080;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
