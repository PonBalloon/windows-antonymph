//painfully set taskbar to a window global variable.
window.taskBar = new TaskBar();


//temp code to setup themes in javascript
let theme = "xp"
let link = document.createElement("link")
switch(theme){
    
    case "98": 
        
        link.setAttribute("rel","stylesheet");
        link.setAttribute("href","https://unpkg.com/98.css");
        document.head.appendChild(link)
        break;
    case "xp":
        link.setAttribute("rel","stylesheet");
        link.setAttribute("href","https://unpkg.com/xp.css");
        document.head.appendChild(link)
        break;
    case "7":
        link.setAttribute("rel","stylesheet");
        link.setAttribute("href","https://unpkg.com/7.css");
        document.head.appendChild(link)
        break;
    default:
        link.setAttribute("rel","stylesheet");
        link.setAttribute("href","https://unpkg.com/xp.css");
        document.head.appendChild(link)
        break;
}

new Icon("icons/paint_xp.png", "Paint")
new Icon("icons/paint_xp.png", "VideoPlayer")
new Icon("icons/winamp_xp.png", "WebAmpApp")