import $ from 'jquery';
/* jQuery is needed for the addSearchHTML method. I haven't figured out the replacement for $("body") */
class Search {
  // 1. describe and create/initiate our object 
  constructor() {
    // this.openButton = $(".js-search-trigger")[1];
    // this.closeButton = $(".search-overlay__close");
    // this.searchOverlay = $(".search-overlay");
    // this.openButton = document.querySelectorAll(".js-search-trigger")[1];
    // this.searchField = $("#search-term");
    // this.resultsDiv = $("#search-overlay__results");

    this.addSearchHTML(); /* this needs to be coded first.*/

    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.previousValue;
    this.typingTimer;
    this.openButton = document.querySelectorAll(".js-search-trigger")[1];
    this.closeButton = document.querySelector(".search-overlay__close");
    this.searchOverlay = document.querySelector(".search-overlay");
    
    this.body = document.querySelector("body");
    this.searchField = document.querySelector("#search-term");
    this.resultsDiv = document.querySelector("#search-overlay__results")

    this.events();
  }

  // 2. events 
  events() {
    // this.openButton.on("click", this.openOverlay)
    // this.closeButton.on("click", this.closeOverlay)
    // $(document).on("keydown", this.keyPressDispatcher.bind(this));
    // this.searchField.on("keyup", this.typingLogic.bind(this));

    this.openButton.addEventListener('click', this.openOverlay.bind(this))
    this.closeButton.addEventListener('click', this.closeOverlay.bind(this))

    addEventListener("keydown", this.keyPressDispatcher.bind(this))
    this.searchField.addEventListener("keyup", this.typingLogic.bind(this));
  }

  // 3. methods (function, action...)
  typingLogic() {
 // if (this.searchField.val() != this.previousValue) {
    if (this.searchField.value != this.previousValue) {
      console.log(`typingLogic is executing`)
      // we clear the timeout with each keystroke. 
      // Then when the user pauses for 2 seconds, our setTimeout function executes.  
      clearTimeout(this.typingTimer);
      
      if (this.searchField.value) {
        // if (this.searchField.val()) {
        if(!this.isSpinnerVisible) {
          this.resultsDiv.innerHTML = `<div class="spinner-loader"></div>`
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750);
      } else {
        this.resultsDiv.innerHTML = ``
        this.isSpinnerVisible = false;
      }
    } 
//this.previousValue = this.searchField.val();
  this.previousValue = this.searchField.value;
  }

  getResults() {
    // jQuery:  this.resultsDiv.html("search results")
    // this.resultsDiv.innerHTML = `search results`

    /*
     $.getJSON('http://fictional-university.local/wp-json/wp/v2/posts?search='+this.searchField.val())
        this.resultsDiv.html(``)
    */

    $.when(
      fetch(universityData.root_url+`/wp-json/wp/v2/posts?search=${this.searchField.value}`)
          .then(response => response.json()), 
      fetch(universityData.root_url+`/wp-json/wp/v2/pages?search=${this.searchField.value}`)
          .then(response => response.json()))
          .then((posts, pages) => {
            let combinedResults = posts.concat(pages);
            this.resultsDiv.innerHTML = `
                <h2 class="search-overlay__section-title">General Information</h2>
                ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search</p>'}
                  ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
                ${combinedResults.length ? '</ul>' : ''}   
              `
              this.isSpinnerVisible = false;
          }, () => {
            this.resultsDiv.innerHTML = `<p>Unexpected error. Please try again later. </p>`
          });
  }

  keyPressDispatcher(e) {
    const s_key_was_pressed = e.keyCode === 83;
    const escape_key_was_pressed = e.keyCode === 27;

    if (s_key_was_pressed && !this.isOverlayOpen && !$("input, textarea").is(':focus'))  {
      this.openOverlay();
    }
    if (escape_key_was_pressed && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }

  openOverlay() {
    // this.searchOverlay.addClass("search-overlay--active")
    // $("body").addClass("body-no-scroll");
    console.log(this.body)
    this.searchOverlay.classList.add("search-overlay--active")
    this.body.classList.add("body-no-scroll")
    // this.searchField.val('');
    this.searchField.value = '';
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    // this.searchOverlay.removeClass("search-overlay--active")
    // $("body").removeClass("body-no-scroll");

    this.searchOverlay.classList.remove("search-overlay--active")
    this.body.classList.remove("body-no-scroll")
    this.isOverlayOpen = false;
  }

  addSearchHTML() {
    console.log(this.body)
    // this.body.appendChild(` this line didn't work. this.body was undefined.
    $("body").append(`
    <div class="search-overlay">
      <div class="search-overlay__top">
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" class="search-term" autocomplete="off" placeholder="What are you looking for?" id="search-term">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
      </div>
      <div class="container">
        <div id="search-overlay__results">
          
        </div>
      </div>
    </div>
    `)
  }
}

export default Search