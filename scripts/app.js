'use strict';

const apiLink = 'https://www.googleapis.com/books/v1/volumes'
const apiKey = 'AIzaSyBYtjMAEaW8fOuYca5b0lZZx8kZoAhT8rQ'

const elt = (type, attrs, children) => {
    let dom = document.createElement(type);

    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    if (children) {
        for (let child of children) {
            dom.appendChild(child)
        }
    }
    return dom;
};

const searchBook = async query => {
    query = encodeURIComponent(query);
    let link = `${apiLink}?q=${query}&key=${apiKey}`;
    return fetch(link).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(response);
            throw new Error(`Unexpected response status ${response.status} or content-type`)
        }
    });
};

const decodeData = response => {
    let result = [];
    for (let { volumeInfo } of response.items) {
        let book = {
            image: volumeInfo.imageLinks?.thumbnail,
            title: volumeInfo.title,
            authors: volumeInfo.authors,
            year: volumeInfo.publishedDate,
            pageCount: volumeInfo.pageCount
        };
        result.push(book);
    }
    console.log(result)
    return result;
};

const convertToHTML = books => {
    let result = []
    for (let book of books) {
        let bookDiv = elt('div', { class: 'book' },
            Object.keys(book).map(k => {
                if (k == 'image') {
                    return elt('img', { class: 'book_img', src: book.image });
                }
                return elt('span', { class: 'book_info' },
                    [ elt('span', {class: 'book_info_h'}, [document.createTextNode(`${k}:`)]),
                    document.createTextNode(` ${book[k]}`) ]);
            }));
        result.push(bookDiv);
    }
    return result;
};

const displayBooks = books => {
    let section = document.querySelector('.book-section');
    section.innerHTML = '';
    books = convertToHTML(books);
    let booksDiv = elt('div', { class: 'books' }, books);
    section.appendChild(booksDiv);
};

const displayAnimation = () => {
    let section = document.querySelector('.book-section');
    section.innerHTML = '';
    let animation = elt('div', {class: 'load_animation flex'}, [document.createTextNode('LOADING....')]);
    section.appendChild(animation);
}

document.querySelector('#search-button').addEventListener('click', async event => {
    displayAnimation();
    let query = document.querySelector('#search-box').value;
    let books = await searchBook(query).then(decodeData).catch(e => { console.log(e); return null });
    if (!books) return;
    displayBooks(books);
});


//TESTS
const testELT = (input, output) => {
    let result = elt(...input);
    console.log(result, output);
};

