console.log('works');
const container = document.querySelector('.topics');
const pastTopic = document.querySelector('.containerPastTopic')
const nextTopic = document.querySelector('.containerNextTopic')

const endpoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

async function fetchTopic() {
  const topics = await fetch(`${endpoint}`);
  let data = await topics.json();
  return data;
};fetchTopic();

  const displayTopic = async () => {
    const topics = await fetchTopic();
    let sortedTopic = topics.sort((a, b) => a.upVotes - b.upVotes);
    sortededTopic = sortedTopic.filter(topic => {
      if (topic.discussedOn !== "") {
        const html = sortedTopic.map(topic => {
          return `
                <div class="nextTopicWrapper">
                  <div class="contentWrapper">
                    <p>${topic.discussedOn === "" ? topic.title : ''}</p>
                    <button type="button" class="archieve" value=${topic.id}>
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="voteWrapper">
                    <button class="increment" value="${topic.id}">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg></button>
                      <span class="increment-votes">${topic.upvotes}</span>
                    <button class="downvote" value="${topic.id}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                        <span class="decrement">${topic.downvotes}</span>
                      </button>
                  </div>
              </div>
                `
        });
        nextTopic.innerHTML = html.join('');
      }
      if (topic.discussedOn === "") {
        const htmlPast = sortedTopic.map(topic => {
          return `
              <div class="pastTopic">
                <div class="pastTopicWrapper">
                  <p>${topic.discussedOn !== "" ? topic.title : ''}</p>
                  <button class="delete" value="${topic.id}" aria-label="delete ${topic.title}"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </div>
              </div>
            `
        });
        pastTopic.innerHTML = htmlPast.join('');
      }
    });
  }

  // Increament and decreament the votes
  const incrementValue = async (id) => {
    const topics = await fetchTopic();
    var findTopic = topics.find(topic => topic.id == id);
    console.log(findTopic);
    let spanEl = document.querySelector('.increment-votes')
    // findTopic.upvotes = findTopic.upvotes + 1;
    spanEl.textContent = spanEl.textContent + 1;

  };

  // Decrement votes
  const decrementValue = async (id) => {
    const topics = await fetchTopic();
    var findTopic = topics.find(topic => topic.id == id);
    const spanEl = document.querySelector('.decrement-votes')
    findTopic.downvotes = findTopic.downvotes - 1;
  };

  const handleClick = (e) => {
    // increment the votes
    const button = e.target.matches('button.increment');
    if (button) {
      console.log(button);
      const id = button.value;
      incrementValue(id);
      container.dispatchEvent(new CustomEvent('listUpdated'));
    }

    // Decrement the votes
    if (e.target.matches('button.downvote')) {
      const buttonDecrement = document.querySelector('.downvote')
      const id = buttonDecrement.value;
      decrementValue(id);
      container.dispatchEvent(new CustomEvent('listUpdated'));
    }

    // Delete the list topics
    if (e.target.closest('button.delete')) {
      let button = e.target.closest('button.delete');
      const id = button.value;
      console.log(id);
      deleteSong(id);
      container.dispatchEvent(new CustomEvent('listUpdated'));
    }
  }

  const deleteSong = async (idToDelete) => {
    let data = await fetchTopic();
    data = data.filter(topic => topic.id != idToDelete);
  };

  // when we reload, we want to look inside the local storage and put them into songs
  const initLocalStorage = async () => {
    let topics = await fetchTopic();
    const stringFromLS = localStorage.getItem('topics');
    const lsItems = JSON.parse(stringFromLS);
    if (lsItems) {
      topics = lsItems;
    } else {
      topics = [];
    }
    container.dispatchEvent(new CustomEvent('pleaseUpdateTheList'));
  };

  // we want to update the local storage each time we update, delete or add an attirbute
  const updateLocalStorage = async () => {
    let topics = await fetchTopic();
    localStorage.setItem('topics', JSON.stringify(topics));
  };


// Listen to the events
  container.addEventListener('pleaseUpdateTheList', displayTopic);
  container.addEventListener('pleaseUpdateTheList', updateLocalStorage);
  window.addEventListener('click', handleClick);

  initLocalStorage();


