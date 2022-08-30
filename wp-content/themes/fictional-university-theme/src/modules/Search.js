import $ from 'jquery';

class Search {
  // 1. describe and create/initiate our object 
  constructor() {
    // this.openButton = $(".js-search-trigger")[1];
    // this.closeButton = $(".search-overlay__close");
    // this.searchOverlay = $(".search-overlay");
    // this.openButton = document.querySelectorAll(".js-search-trigger")[1];
    // this.searchField = $("#search-term");
    // this.resultsDiv = $("#search-overlay__results");

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
        this.typingTimer = setTimeout(this.getResults.bind(this), 2000);
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

    fetch(`http://fictional-university.local/wp-json/wp/v2/posts?search=${this.searchField.value}`)
      .then(response => response.json())
      .then(posts => {
          this.resultsDiv.innerHTML = `
              <h2 class="search-overlay__section-title">General Information</h2>
              <ul class="link-list min-list">
                ${posts.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
              </ul>   
            `
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

    this.searchOverlay.classList.add("search-overlay--active")
    this.body.classList.add("body-no-scroll")
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    // this.searchOverlay.removeClass("search-overlay--active")
    // $("body").removeClass("body-no-scroll");

    this.searchOverlay.classList.remove("search-overlay--active")
    this.body.classList.remove("body-no-scroll")
    this.isOverlayOpen = false;
  }
}

export default Search