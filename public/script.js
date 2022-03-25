console.log("fsdfsfs");
async function onPrev() {
  console.log("prev");
  await fetch("/prev");
}
async function onNext() {
  console.log("next");
  await fetch("/next");
}
async function onSubmit() {
  let sfd = document.getElementById("form");
  console.log(sfd);
  let formData = Array.from(new FormData(sfd));
  let data = {};
  formData.map((arr) => (data[arr[0]] = arr[1]));
  console.log(data);
  let res = await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
