/* Imports */
// this will check if we have a user and set signout link if it exists
import '../auth/user.js';
// > Part B: import pet fetch
// > Part C: import create comment
import { getPet, createComment } from '../fetch-utils.js';
import { renderComment } from '../render-utils.js';

/* Get DOM Elements */
const errorDisplay = document.getElementById('error-display');
const petName = document.getElementById('pet-name');
const petImage = document.getElementById('pet-image');
const petBio = document.getElementById('pet-bio');
const commentList = document.getElementById('comment-list');
const addCommentForm = document.getElementById('add-comment-form');

/* State */
let error = null;
let pet = null;

/* Events */
window.addEventListener('load', async () => {
    // > Part B:
    //   - get the id from the search params
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    //   - if no id, redirect to list (home) page
    if (!id) {
        location.replace('/');
    } else {
        //  - otherwise, get the pet by id and store the error and pet data
        const response = await getPet(id);
        error = response.error;
        pet = response.data;
    }
    //  - if error, redirect to home
    if (error) {
        location.replace('/');
    } else {
        //  - otherwise, display pet
        displayPet();
        // > Part C: also call display comments in addition to display pet
        displayComments();
    }
});

addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // > Part C:
    //    - create an comment insert object from formdata and the id of the pet
    const formData = new FormData(addCommentForm);

    //    - create the comment
    const addComment = {
        text: formData.get('text'),
        pet_id: pet.id,
    };

    //    - store
    const response = await createComment(addComment);
    error = response.error;
    // check for an error and display it, otherwise
    if (error) {
        displayError();
    } else {
        // store response data to comment
        const comment = response.data;
        //    - add the new comment (data) to the front of the pet comments using unshift
        pet.comments.unshift(comment);
        displayComments();
        //    - reset the form
        addCommentForm.reset();
    }
});

/* Display Functions */

function displayError() {
    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}

function displayPet() {
    // > Part B: display the pet info
    petName.textContent = pet.name;
    petImage.src = pet.image_url;
    petBio.textContent = pet.bio;
}

function displayComments() {
    commentList.innerHTML = '';

    for (const comment of pet.comments) {
        // > Part C: render the comments
        const commentEl = renderComment(comment);
        commentList.append(commentEl);
    }
}
