const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params === 'none') window.location = '/';
document.title =  params.get('author');
document.addEventListener("DOMContentLoaded", function(event) {
  myInit();
});
function myInit() {
  fetch(`pairs.txt`)
    .then(response => response.text())
    .then(data => {
      const AuthorBooks = data.replace(/\n+$/, "").split('\n');
      const book = {};
      AuthorBooks.forEach(AuthorBook => {
        const [Author, Book] = AuthorBook.split(" ");
        if (Author in book) {
          book[Author].push(Book);
        } else {  
            book[Author] = [ Book ];
          }
      });
      const li_a = a => `<li><a href='zhttsbook.html?title=${a}'>${a.replace(/_/g," ")}</a></li>`;
      document.querySelector('ul').innerHTML = book[document.title].map(e => li_a(e)).join('\n');
      const b = document.getElementsByTagName('a');
      for (i=0; i < b.length; i++) {
        b[i].href = `${b[i].href}&caller=${document.title}`;
      }
    });
}
