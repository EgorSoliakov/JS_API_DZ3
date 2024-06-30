/*
Application ID
628072

Access Key
MRosT4IjAF9TFLkZCHmzfMCmdu_I4hB9Nmqv8nKGLXs

Secret key
HjR-COfXm3mDcuTZtx1iT2egKsdrVISyXR49SssrgtA
*/
document.addEventListener("DOMContentLoaded", main);

const key = "randomPhoto";

const containerEl = document.querySelector(".container");
const divPhotoEl = document.querySelector("#photos-container");

containerEl.addEventListener("click", (event) => {
  if (!event.target.classList.contains("likeBtn")) {
    return;
  }
  const divEl = event.target.parentElement;
  const imgEl = divEl.childNodes[1];
  const autorEl = divEl.childNodes[3];
  const likeEl = divEl.childNodes[5];
  const btnEl = divEl.childNodes[7];
  let counterLike = +likeEl.textContent;
  btnEl.classList.forEach((el) => {
    if (el === "addLike") {
      likeEl.textContent = String(counterLike - 1);
      btnEl.classList.remove("addLike");
      delImg(divEl.getAttribute("data-id"));
    } else {
      likeEl.textContent = String(+likeEl.textContent + 1);
      btnEl.classList.add("addLike");
      saveLikePhoto(
        divEl.getAttribute("data-id"),
        imgEl.getAttribute("src"),
        autorEl.textContent,
        String(+likeEl.textContent + 1)
      );
    }
  });
});

async function fechPhoto() {
  const response = await fetch(`https://api.unsplash.com/photos/random`, {
    headers: {
      Authorization: "Client-ID MRosT4IjAF9TFLkZCHmzfMCmdu_I4hB9Nmqv8nKGLXs",
    },
  });
  if (!response.ok) {
    throw new Error(`Ошибка, статус ${response.status}`);
  }

  return await response.json();
}

async function main() {
  const data = await fechPhoto();

  divPhotoEl.insertAdjacentHTML("afterbegin", createImg(data));
  addLikePhoto();
}

function createImg(objImg) {
  return `
    <div class="photo" data-id="${objImg.id}">
        <img class="img" src="${objImg.urls.small}" alt="" />
        <p class="name">Автор: ${objImg.user.name}</p>
        <p class="like">${objImg.likes}</p>
        <button class="likeBtn">like</button>
        </div>
      `;
}

function saveLikePhoto(idPhoto, urlPhoto, nameAvtor, likePhoto) {
  const objPhoto = {
    id: idPhoto,
    url: urlPhoto,
    name: nameAvtor,
    likes: likePhoto,
  };
  if (!localStorage.getItem(key)) {
    const data = [];
    data.push(objPhoto);
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    const dataPhotosLike = JSON.parse(localStorage.getItem(key));
    dataPhotosLike.push(objPhoto);
    localStorage.setItem(key, JSON.stringify(dataPhotosLike));
  }
}

function getLikePhoto() {
  const dataPhotos = localStorage.getItem(key);
  return dataPhotos ? JSON.parse(dataPhotos) : [];
}

async function addLikePhoto() {
  let imgsHtml = "";
  const dataPhoto = getLikePhoto();
  dataPhoto.forEach((element) => (imgsHtml += createLikePhoto(element)));
  await divPhotoEl.insertAdjacentHTML("beforeend", imgsHtml);
}
function createLikePhoto(data) {
  return `<div class="photo" data-id="${data.id}">
        <img class="img" src="${data.url}" alt="" />
        <p class="name">Автор: ${data.name}</p>
        <p class="like">${data.likes}</p>
        <button class="likeBtn addLike">like</button></div>`;
}

function delImg(id) {
  if (!localStorage.getItem(key)) {
    return [];
  }
  const dataPhotosLike = JSON.parse(localStorage.getItem(key));
  dataPhotosLike.forEach((el) => {
    if (el.id === id) {
      const delEl = dataPhotosLike.indexOf(el);
      dataPhotosLike.splice(delEl, 1);
    }
  });
  localStorage.setItem(key, JSON.stringify(dataPhotosLike));
}
