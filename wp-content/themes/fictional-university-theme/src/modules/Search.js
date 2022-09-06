/* import $ from 'jquery'; */
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
    // the next line that's asterisked out was mine. the one after it is Brad's. 
    // this.openButton = document.querySelectorAll(".js-search-trigger")[1];
    this.openButton = document.querySelectorAll(".js-search-trigger");
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

    /* This next forEach loop is Brad's code. */
    this.openButton.forEach(el => {
      el.addEventListener("click", e => {
        e.preventDefault()
        this.openOverlay()
      })
    })

    // this.openButton.addEventListener('click', this.openOverlay.bind(this))
    this.closeButton.addEventListener('click', this.closeOverlay.bind(this))

    addEventListener("keydown", this.keyPressDispatcher.bind(this))
    this.searchField.addEventListener("keyup", this.typingLogic.bind(this));
  }

  // 3. methods (function, action...)
  typingLogic() {
 // if (this.searchField.val() != this.previousValue) {
    if (this.searchField.value != this.previousValue) {
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

      fetch(universityData.root_url+`/wp-json/university/v1/search?term=${this.searchField.value}`)
        .then(response => response.json())
        .then((results) => {
      this.resultsDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search</p>'}
              ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a>${item.postType == 'post' ? ` by ${item.authorName} ` : ''} </li>`).join('')}
            ${results.generalInfo.length ? '</ul>' : ''}  
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
              ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.programs.length ? '</ul>' : ''}  
            <h2 class="search-overlay__section-title">Professors</h2>
            ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search. </p>`}
            ${results.professors.map(item => `
              <li class="professor-card__list-item">
                <a class="professor-card" href="${item.permalink}">
                  <img class="professor-card__image" src="${item.image}" alt="">
                  <span class="professor-card__name">${item.title}</span>
                </a>
              </li>
            `).join('')}
          ${results.professors.length ? '</ul>' : ''}  
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search.  <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
              ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.campuses.length ? '</ul>' : ''}
            <h2 class="search-overlay__section-title">Events</h2>
            ${results.events.length ? '' : `<p>No events match that search.  <a href="${universityData.root_url}/events">View all events</a></p>`}
            ${results.events.map(item => `
            <div class="event-summary">
              <a class="event-summary__date t-center" href="${item.permalink}">
                <span class="event-summary__month">${item.month}</span>
                <span class="event-summary__day">${item.day}</span>
              </a>
              <div class="event-summary__content">
                <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
      `
      this.isSpinnerVisible = false
    });

    /* delete this code later
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
                  ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a>${item.type == 'post' ? ` by ${item.authorName} ` : ''} </li>`).join('')}
                ${combinedResults.length ? '</ul>' : ''}   
              `
              this.isSpinnerVisible = false;
          }, () => {
            this.resultsDiv.innerHTML = `<p>Unexpected error. Please try again later. </p>`
          }
    );
    */
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
    // this.searchField.val('');
    this.searchField.value = '';
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
    return false;
  }

  closeOverlay() {
    // this.searchOverlay.removeClass("search-overlay--active")
    // $("body").removeClass("body-no-scroll");

    this.searchOverlay.classList.remove("search-overlay--active")
    this.body.classList.remove("body-no-scroll")
    this.isOverlayOpen = false;
  }

  addSearchHTML() {
    // this.body.appendChild(` this line didn't work. this.body was undefined.
    // $("body").append(`
    // the solution to this tough problem was to use document.body.insertAdjacentHTML("beforeend")
    
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" autocomplete="off" placeholder="What are you looking for?" id="search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        <div class="container">
          <div id="search-overlay__results"></div>
        </div>
      </div>
      `)
  }
}

export default Search