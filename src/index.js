import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchInput = document.querySelector('input[name="searchQuery"]');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const closeBtn = document.querySelector('.close-btn');

let perPage = 40;
let page = 0;
let name = searchInput.value;

loadBtn.style.display = 'none';
closeBtn.style.display = 'none';

async function eventHandler(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadBtn.style.display = 'none';
  page = 1;
  name = searchInput.value;
  // console.log(name);
  fetchImages(name, page, perPage)
    .then(name => {
      // console.log(`Number of arrays: ${name.hits.length}`);
      // console.log(`Total hits: ${name.totalHits}`);
      let totalPages = name.totalHits / perPage;
      // console.log(`Total pages: ${totalPages}`);

      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderGallery(name);
        // console.log(`Current page: ${page}`);
        const lightbox = new SimpleLightbox('.gallery a', {});
        closeBtn.style.display = 'block';
        closeBtn.addEventListener('click', () => {
          gallery.innerHTML = '';
          closeBtn.style.display = 'none';
          loadBtn.style.display = 'none';
        });
        //smooth scrool to up
        // // upBtn.style.display = 'block';
        // // upBtn.addEventListener('click', () => {
        // //   searchingBox.scrollIntoView({
        // //     behavior: 'smooth',
        // //   });
        // });

        if (page < totalPages) {
          loadBtn.style.display = 'block';
        } else {
          loadBtn.style.display = 'none';
          console.log('There are no more images');
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
      }
    })
    .catch(error => console.log(error));
}

searchForm.addEventListener('submit', eventHandler);

function renderGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}"> <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${hit.likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${hit.views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${hit.comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${hit.downloads}</br></p>
        </p>
      </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

// Load more button - function

loadBtn.addEventListener(
  'click',
  () => {
    name = searchInput.value;
    page += 1;
    fetchImages(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;
      renderGallery(name);
      new SimpleLightbox('.gallery a');
      if (page >= totalPages) {
        loadBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
  true
);

// Preloader

// window.addEventListener('load', fadeEffect);

// let arrayImageId = [{ placeholder: true, text: '' }];

// const imageSelect = () => {
//   fetchImages().then(data => {
//     data.forEach(element => {
//       arrayImageId.push({
//         webformatURL: element.webformatURL.value,
//         likes: element.likes.value,
//       });
//     });
//     //   new SlimSelect({
//     //     select: '#single',
//     //     data: arrayimageId
//     //   });
//   })
//   .catch(onFetchError)
//   // .finally(() => loader.classList.add('is-hidden'));
// };

// document.addEventListener('DOMContentLoaded', imageSelect);

// function onFetchError(error) {
// console.log(error)
// Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!', {
//   position: 'center-center',
//   timeout: 3000,
//   width: '400px',
//   fontSize: '24px',
// });
// }

// function fetchImages() {
//     const params = new URLSearchParams({
//         _key: '39666030-ea9dc56083af2dcfa2b4ed886',
//         _q: '',
//         _image_type: 'photo',
//         _orientation: 'horizontal',
//         _safesearch: true
//     });
//     return fetch(`https://jsonplaceholder.typicode.com/posts?${params}`).then(
//     (response) => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     }
//   );
// }

// const fetchImageBtn = document.querySelector(".btn");
// const postList = document.querySelector(".posts");

// fetchPostsBtn.addEventListener("click", () => {
//   fetchPosts()
//     .then((posts) => renderPosts(posts))
//     .catch((error) => console.log(error));
// });

// function fetchPosts() {
//   const params = new URLSearchParams({
//     _limit: 5,
//     // Change the group number here
//     _page: 3
//   });

//   return fetch(`https://jsonplaceholder.typicode.com/posts?${params}`).then(
//     (response) => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     }
//   );
// }

// function renderPosts(posts) {
//   const markup = posts
//     .map(({ id, title, body, userId }) => {
//       return `<li>
//           <h2 class="post-title">${title.slice(0, 30)}</h2>
//           <p><b>Post id</b>: ${id}</p>
//           <p><b>Author id</b>: ${userId}</p>
//           <p class="post-body">${body}</p>
//         </li>`;
//     })
//     .join("");
//   post.innerHTML = markup;
// }

// wyświetlanie obrazów za pomocą simpleLightbox
// const fotoGallery = document.querySelector(".gallery");
// const getFotoGallery = galleryItems
// 	.map(
// 		({preview, original, description}) => `<li class="gallery__item"><a class="gallery__item" href="${original}">
//   <img class="gallery__image" src="${preview}" alt="${description}" />
// </a>
// 	</li>`
// 	)
// 	.join(" ");

// fotoGallery.insertAdjacentHTML('beforeend', getFotoGallery)

// const lightbox = new SimpleLightbox('.gallery a', {
// 	captionsData: 'alt',
// 	captionPosition: 'outside',
// 	captionDelay: 250,
// 	nav: false,
// 	close: false,
// 	showCounter: false
// });
// console.log(galleryItems);

// załaduj więcej / konspekt
// const fetchPostsBtn = document.querySelector(".btn");
// const postList = document.querySelector(".posts");
// const alertPopup = document.querySelector(".alert");
// let isAlertVisible = false;

// // Controls the group number
// let page = 1;
// // Controls the number of items in the group
// let limit = 5;
// // In our case total number of pages is calculated on frontend
// const totalPages = 100 / limit;

// fetchPostsBtn.addEventListener("click", () => {
//   // Check the end of the collection to display an alert
//   if (page > totalPages) {
//     return toggleAlertPopup();
//   }

//   fetchPosts()
//     .then((posts) => {
//       renderPosts(posts);
//       // Increase the group number
//       page += 1;

//       // Replace button text after first request
//       if (page > 1) {
//         fetchPostsBtn.textContent = "Fetch more posts";
//       }
//     })
//     .catch((error) => console.log(error));
// });

// function fetchPosts() {
//   const params = new URLSearchParams({
//     _limit: limit,
//     _page: page
//   });

//   return fetch(`https://jsonplaceholder.typicode.com/posts?${params}`).then(
//     (response) => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     }
//   );
// }

// function renderPosts(posts) {
//   const markup = posts
//     .map(({ id, title, body, userId }) => {
//       return `<li>
//           <h2 class="post-title">${title.slice(0, 30)}</h2>
//           <p><b>Post id</b>: ${id}</p>
//           <p><b>Author id</b>: ${userId}</p>
//           <p class="post-body">${body}</p>
//         </li>`;
//     })
//     .join("");
//   postList.insertAdjacentHTML("beforeend", markup);
// }

// function toggleAlertPopup() {
//   if (isAlertVisible) {
//     return;
//   }
//   isAlertVisible = true;
//   alertPopup.classList.add("is-visible");
//   setTimeout(() => {
//     alertPopup.classList.remove("is-visible");
//     isAlertVisible = false;
//   }, 3000);
// }
