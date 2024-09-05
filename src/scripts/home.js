const images = [
    'assets/photos/1.jpg',
    'assets/photos/2.jpg',
    'assets/photos/3.jpg',
    'assets/photos/4.jpg',
    'assets/photos/5.jpg',
    'assets/photos/6.jpg',
    'assets/photos/7.jpg',
    'assets/photos/8.jpg',
    'assets/photos/9.jpg',
    'assets/photos/10.jpg',
    'assets/photos/11.jpg',
    'assets/photos/12.jpg',
    'assets/photos/13.jpg',
    'assets/photos/14.jpg',
    'assets/photos/15.jpg',
    'assets/photos/16.jpg',
    'assets/photos/17.jpg',
    'assets/photos/18.jpg',
    'assets/photos/19.jpg',
    'assets/photos/20.jpg',
    'assets/photos/21.jpg',
    'assets/photos/22.jpg',
    'assets/photos/23.jpg',
    'assets/photos/24.jpg',
    'assets/photos/25.jpg',
    'assets/photos/26.jpg',
    'assets/photos/27.jpg',
    'assets/photos/28.jpg',
    'assets/photos/29.jpg',
    'assets/photos/30.jpg'
]

const actions = [
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg> Create Google Document`, "url": "https://docs.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg> Create Word Document`, "url": "https://word.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg> Create Notion Page`, "url": "https://notion.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Create Google Sheet`, "url": "https://sheets.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg> Compose Gmail Message`, "url": "https://mail.google.com/mail/u/0/#inbox?compose=new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-120v-80h200v-120H160q-33 0-56.5-23.5T80-400v-360q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v360q0 33-23.5 56.5T800-320H520v120h200v80H240Zm-80-280h640v-360H160v360Zm0 0v-360 360Z"/></svg> Create Google Slide`, "url": "https://slides.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg> Create Google Calendar Event`, "url": "https://cal.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Create Excel Workbook`, "url": "https://excel.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-120v-80h200v-120H160q-33 0-56.5-23.5T80-400v-360q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v360q0 33-23.5 56.5T800-320H520v120h200v80H240Zm-80-280h640v-360H160v360Zm0 0v-360 360Z"/></svg> Create PowerPoint Presentation`, "url": "https://powerpoint.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg> Create Paper Document`, "url": "https://paper.dropbox.com/new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg> Create Todoist Task`, "url": "https://todoist.new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg> Create GitHub Repository`, "url": "https://github.com/new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg> Create GitHub Gist`, "url": "https://gist.github.com/new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg> Create Figma File`, "url": "https://www.figma.com/file/new" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-320h80v-120h120v-80H440v-120h-80v120H240v80h120v120ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/></svg> Create Zoom Meeting`, "url": "https://zoom.us/start/videomeeting" },
    { "name": `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg> Create Bitly Link`, "url": "https://bitly.new" }
]

document.body.style.backgroundImage = `url(${images[Math.floor(Math.random() * images.length)]})`

const setClock = () => {
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    if (hours > 12) {
        hours = hours - 12
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    document.getElementById('clock').innerText = `${hours}:${minutes}`
}

const filterActions = (query) => {
    return actions.filter(action =>
        action.name.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replaceAll(' ', ''))
    );
}

let selectedElement = null;
let selectedIndex = 0;
let elementsList = [];
let taskCompleted = localStorage.getItem('taskCompleted');

if (!taskCompleted) {
    document.getElementById('task').innerText = 'To do: Press / to open Actions';
}

let actionSearch = (query, bypassBlankCheck) => {
    selectedElement = null;
    selectedIndex = 0;
    elementsList = [];
    if (query.replaceAll(' ', '').length == 0 && !bypassBlankCheck) {
        document.getElementById('actions').innerHTML = '';
        return;
    } else {
        let filteredActions = filterActions(query);
        document.getElementById('actions').innerHTML = '';
        filteredActions = filteredActions.slice(0, 5);
        filteredActions.forEach((action, index) => {
            const link = document.createElement('a');
            link.href = action.url;
            link.className = 'action';
            link.innerHTML = action.name;
            if (index === 0) {
                link.classList.add('active');
                selectedElement = link;
                selectedIndex = 0;
            }
            link.addEventListener('click', function () {
                window.location.href = action.url;
            });
            elementsList.push(link);
            document.getElementById('actions').appendChild(link);
        });
    }
}

document.getElementById('actionSearch').addEventListener('input', (event) => {
    actionSearch(event.target.value, false);
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown') {
        if (selectedElement) {
            event.preventDefault();
            selectedElement.classList.remove('active');
            selectedIndex++;
            if (selectedIndex >= elementsList.length) {
                selectedIndex = 0;
            }
            selectedElement = elementsList[selectedIndex];
            selectedElement.classList.add('active');
        }
    }
    else if (event.key === 'ArrowUp') {
        if (selectedElement) {
            event.preventDefault();
            selectedElement.classList.remove('active');
            selectedIndex--;
            if (selectedIndex < 0) {
                selectedIndex = elementsList.length - 1;
            }
            selectedElement = elementsList[selectedIndex];
            selectedElement.classList.add('active');
        }
    }
    else if (event.key === 'Enter') {
        if (selectedElement) {
            event.preventDefault();
            window.location.href = selectedElement.href;
        }
    }
    else if (event.key === 'Escape') {
        if (document.getElementById('actionsbarcontainer').style.display != 'none') {
            event.preventDefault();
            if (selectedElement) {
                selectedElement = null;
                selectedIndex = 0;
                elementsList = [];
            }
            document.getElementById('actionsbarcontainer').style.display = 'none';
        }
    }
    else if (event.key == '/') {
        event.preventDefault();
        document.getElementById('actionSearch').value = '';
        document.getElementById('actionsbarcontainer').style.display = '';
        document.getElementById('actionSearch').focus();
        if (!taskCompleted) {
            localStorage.setItem('taskCompleted', 1);
            document.getElementById('task').innerText = '';
        }
        actionSearch('', true);
    }
});

document.getElementById('actionsbarcontainer').addEventListener('click', function (event) {
    if (event.target.id == 'actionsbarcontainer') {
        if (selectedElement) {
            selectedElement = null;
            selectedIndex = 0;
            elementsList = [];
        }
        document.getElementById('actionsbarcontainer').style.display = 'none';
    }
});

const setDate = () => {
    let date = new Date();
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
    let day = date.getDate();
    document.getElementById('date').innerText = `${month} ${day}`;
};


setClock()
setInterval(setClock, 1000)

setDate()
setInterval(setDate, 1000)

function getBookmarkJSON(bookmark) {
    return {
        title: bookmark.title,
        url: bookmark.url,
        children: bookmark.children ? getBookmarkJSON(bookmark.children) : null
    }
}

function displayBookmarks(bookmarks, parentElement) {
    bookmarks.forEach(bookmark => {
        if (bookmark.children) {
            displayBookmarks(bookmark.children, parentElement);
        } else {
            const data = getBookmarkJSON(bookmark);
            let element = document.createElement('a');
            element.href = data.url;
            element.innerText = data.title;
            element.className = 'bookmark';
            parentElement.querySelector('.content').appendChild(element);
            actions.push({
                name: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/></svg> ${data.title}`,
                url: data.url
            })
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const bookmarksList = document.getElementById('bookmarks');
    chrome.bookmarks.getTree(function(bookmarks) {
        displayBookmarks(bookmarks, bookmarksList);
    });
});

function initWeather() {
    document.getElementById('weatherLocation').value = "Loading weather";
    document.getElementById('weatherLocation').disabled = true;
    document.getElementById('data').style.display = 'none';
    if (localStorage.getItem('weatherLocation')) {
        fetch(`https://wttr.in/${localStorage.getItem('weatherLocation')}?format=j1`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('weatherLocation', `${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].region[0].value}, ${data.nearest_area[0].country[0].value}`);
                document.getElementById('data').style.display = 'block';
                document.getElementById('weatherLocation').value = localStorage.getItem('weatherLocation');
                document.getElementById('weatherLocation').disabled = false;
                document.getElementById('condition').innerText = data.current_condition[0].weatherDesc[0].value;
                document.getElementById('weatherData').innerText = `${data.current_condition[0].temp_F}°F`
                document.getElementById('temperature').innerText = `${data.current_condition[0].temp_F}°F`;
                document.getElementById('areaName').innerText = `${data.nearest_area[0].areaName[0].value}`;
                document.getElementById('feelsLike').innerHTML = `<span class="title">Feels like</span> ${data.current_condition[0].FeelsLikeF}°F`;
                document.getElementById('rain').innerHTML = `<span class="title">Rain</span> ${data.current_condition[0].precipMM}mm`;
                document.getElementById('wind').innerHTML = `<span class="title">Wind</span> ${data.current_condition[0].windspeedMiles}mph`;
            })
            .catch(error => {
                document.getElementById('data').style.display = 'none';
                document.getElementById('weatherData').innerText = 'Error loading weather';
                document.getElementById('weatherLocation').value = "";
                document.getElementById('weatherLocation').disabled = false;
            });
    } else {
        document.getElementById('data').style.display = 'none';
        document.getElementById('weatherData').innerText = 'Set up weather';
        document.getElementById('weatherLocation').value = "";
        document.getElementById('weatherLocation').disabled = false;
    }
}

document.getElementById('bookmarkToggle').addEventListener('click', function() {
    document.getElementById('bookmarks').querySelector('.content').classList.toggle('open');
});

document.getElementById('weatherToggle').addEventListener('click', function() {
    document.getElementById('weather').querySelector('.content').classList.toggle('open');
});

document.getElementById('weatherLocation').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('weatherLocation').blur();
        localStorage.setItem('weatherLocation', document.getElementById('weatherLocation').value);
        initWeather();
    }
});

initWeather();