class WindowBox{

    /**
     * 
     * @param {String} title The titlebar text on the window
     * @param {Number} width (optional) width of window
     * @param {Number} height (optional) width of height
     */
    constructor(title, width = 300, height = 400){
        this.focused = true;
        this.id = false;
        this.maximized = false;
        this.title = title;
        this.width = width; 
        this.height = height;
        this.overlay = document.createElement("div");
        this.windowBody = document.createElement("div");
        this.windowBody.setAttribute("class","window-body")
        this.pos = [0,0,0,0,0];
        this.previousState = [0,0]
        this.init()
    }


    /**
     * Import an HTMLElement into the window body
     * @param {HTMLElement} elem The element you want to insert into the window 
     */
    import(elem){
        this.windowBody.appendChild(elem);
    }

    /**
     *  Used during initialization to setup the titlebar and dragging functions
     */
    createWindow(){
        this.window = document.createElement("div");
        this.window.style.position = "absolute"
        
        this.window.style.zIndex = 10
        this.window.setAttribute("class","window");
        this.window.style.width = this.width + "px";
        this.window.style.height = this.height + "px";

        this.titlebar = document.createElement("div");
        this.titlebar.setAttribute("class","title-bar");
        
        this.titlebarText = document.createElement("div");
        this.titlebarText.setAttribute("class","title-bar-text")
        this.titlebarText.innerHTML = this.title;

        this.titlebarButtons = document.createElement("div");
        this.titlebarButtons.setAttribute("class","title-bar-controls");

        this.titlebarButtonObjs = []

        this.titlebarButtonObjs.push(
            new TitleBarButton("Minimize", ()=>{
                this.minimize()
            })
        )
        this.titlebarButtonObjs.push(
            new TitleBarButton("Maximize", ()=>{
                this.maximize()
            })
        )
        this.titlebarButtonObjs.push(
            new TitleBarButton("Close", ()=>{
                this.close();
            })
        )

        this.titlebarButtonObjs.forEach( button =>{
            this.titlebarButtons.appendChild( button.export())
        })

        this.titlebar.appendChild(this.titlebarText)
        this.titlebar.appendChild(this.titlebarButtons)
        
        this.titlebar.addEventListener("mousedown", (e)=>{
            let self = this;
            this.drawMouseDown(e, self)
        })

        this.window.appendChild(this.titlebar)
    }

    //these overlays appear but are invisible so that dragging with iframes doesnt glitch out the event handler
    showOverlay(){
        this.overlay.style.position = "relative";
        this.overlay.style.zIndex = "9999";
        this.overlay.style.height = this.height + "px";
        this.overlay.style.marginBottom = (-this.height) + "px"
        this.overlay.style.background = "rgba(0,0,0,0)";
    }

    hideOverlay(){
        this.overlay.style.position = "relative";
        this.overlay.style.zIndex = "0";
        this.overlay.style.height = "0px";
        this.overlay.style.marginBottom = "0px"
        this.overlay.style.background = "rgba(0,0,0,0)";
    }

    drawMouseDown(e, self){
        self.dragging = true;
        
        e = e ;
        e.preventDefault();
        // get the mouse cursor position at startup:
        self.pos[3] = e.clientX;
        self.pos[4] = e.clientY;
        document.addEventListener("mouseup", (e)=>{
            self.hideOverlay()
            self.dragging = false;
            
        })
        // call a function whenever the cursor moves:
        document.addEventListener("mousemove", (e)=>{
            
            self.elementDrag(e, self)
        })
    }

    elementDrag(e, self){
        if(!self.dragging || self.maximized){
            self.hideOverlay()
            return
        }
        window.taskBar.taskList.forEach( task =>{
            task.window.showOverlay()
        })
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        self.pos[1] = self.pos[3] - e.clientX;
        self.pos[2] = self.pos[4] - e.clientY;
        self.pos[3] = e.clientX;
        self.pos[4] = e.clientY;
        // set the element's new position:
        self.window.style.top = (self.window.offsetTop - self.pos[2]) + "px";
        self.window.style.left = (self.window.offsetLeft - self.pos[1]) + "px";
    }

    minimize(){
        if( this.window.style.visibility == "hidden"){
            this.window.style.visibility = "visible";
        }else{
            this.window.style.visibility = "hidden";
        }
    }

    close(){
        //console.log(window.tasB)
        window.taskBar.taskList.delete(this.window.id)
        this.window.outerHTML = ""
    }
    
    maximize(){
        this.maximized = true;
        this.previousState = [
            this.window.style.width,
            this.window.style.height,
            this.window.style.top,
            this.window.style.left 
        ]

        //change the buttons actions
        this.titlebarButtonObjs[1].changeType("Maximize",()=>{

            this.maximized = false;
            this.titlebarButtonObjs[1].changeType("Maximize", ()=>{
                this.maximize()
            })
            this.window.style.width = this.previousState[0]
            this.window.style.height = this.previousState[1]
            this.window.style.top =  this.previousState[2]
            this.window.style.left =  this.previousState[3]
        })
       

        //clear buttons drawn
        this.titlebarButtons.innerHTML = ""
        this.titlebarButtonObjs.forEach( button =>{
            this.titlebarButtons.appendChild( button.export())
        })


        this.window.style.top = 0;
        this.window.style.left = 0;
        this.window.style.width = window.innerWidth + "px"
        this.window.style.height = window.innerHeight + "px"
    }

    closeDragElement(){
        document.onmouseup = null;
        document.onmousemove = null;
    }

    removePadding(){
        this.windowBody.style.padding = 0;
        this.windowBody.style.marginTop = 0;
        this.windowBody.style.marginLeft = "3px";
    }

    init(){
        this.createWindow();
        this.window.appendChild(this.windowBody)
        this.windowBody.appendChild(this.overlay)
        this.windowBody.style.height = "calc( 100% - 28px)"
        document.body.appendChild(this.window)
    }

}

class TitleBarButton{
    constructor(type, callback ){
        this.type = type;
        if(callback){
            this.callback = callback ;
        }
        
        this.element = document.createElement("button")
        this.element.addEventListener('click', ()=>{
            this.callback()
        });

        this.init()
    }

    export(){
        return this.element;
    }

    changeType(type, callback){
        this.type = type;
        
        if(callback){
            //remove previous event
            this.element.removeEventListener('click', this.callback);
            this.callback = callback ;
        }

        //set new event
        this.element.addEventListener('click', this.callback);
        this.init()
    }

    init(){
        this.element.setAttribute("aria-label", this.type);
        
        this.element;
    }
}

class Paint{

    constructor(){
        this.window = new WindowBox("Paint", 600, 500);
        this.app = document.createElement("iframe");
        this.window.removePadding();
        this.app.setAttribute("frameborder", "0");
        this.app.setAttribute("class","innerWindow")
        this.app.setAttribute("src", "https://jspaint.app/");
        
        console.log(this.app)
        this.window.import(this.app)

    }

}

class MineSweeper{
    constructor(){
        this.window = new WindowBox("MineSweeper", 400, 300);
        this.app = document.createElement("iframe");
        this.window.removePadding();
        this.app.setAttribute("frameborder", "0");
        this.app.setAttribute("class","innerWindow")
        this.app.setAttribute("src", "https://mines.vercel.app/");
        
        console.log(this.app)
        this.window.import(this.app)

    }
}


class VideoPlayer{
    constructor(){
        this.window = new WindowBox("ANTONYMPH", 600, 500);
        this.app = document.createElement("iframe");
        this.window.removePadding();
        this.app.setAttribute("frameborder", "0");
        this.app.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        this.app.setAttribute("class","innerWindow")
        this.app.setAttribute("src", "https://www.youtube.com/embed/CNPdO5TZ1DQ");
        
        console.log(this.app)
        this.window.import(this.app)

    }
}

class TaskBar{

    constructor(){
        this.element = document.createElement("div");
        this.element.setAttribute("class","start-container")
        this.element.id = "taskbar"
        this.element.appendChild(new StartButton())

        this.visualTasks = [];
        this.taskList = new Map();

        //defocus all windows if you click the background
        document.getElementById("background").addEventListener("click", ()=>{
            this.taskList.forEach(task =>{
                task.window.focus = false;
            })
        })

        this.init()
    }


    createPid(){
        let id = Math.floor(Math.random() * 9999);
        if(this.taskList.get(id)){
            id = this.createPid();
        }
        return id;
    }

    focus(pid){

        //get the task 
        let task = this.taskList.get(pid);

        task.window.focused = true;

        //clear taskbar attributes
        this.visualTasks.forEach( task =>{

            if(task.id != pid){
                task.classList.remove("taskbar-focused")
            }else{
                task.classList.add("taskbar-focused")
            }
            
        })
        

        //reset all window positions
        this.taskList.forEach( task =>{
            task.window.window.style.zIndex = 10;
        })

        //set clicked window to forground
        this.taskList.get(pid).window.window.style.zIndex ++;
    }

    launchApp(appName){
        if(!eval(appName)){
            console.error("App not found!")
            return;
        }
        let id = this.createPid()
        this.taskList.set( 
            id, // sets the process ID
            new ( eval(appName) ) // launches the app
        )

        this.taskList.get(id).window.window.id = id;

        this.taskList.get(id).window.window.addEventListener('mousedown', ()=>{
            window.taskBar.focus(id)
        })

        this.visualTasks.push(document.createElement("div"))
        let task = this.visualTasks[this.visualTasks.length-1]
        task.setAttribute("class","taskbar-item");
        task.innerHTML = appName
        task.id = id;

        this.visualTasks.forEach( task =>{
            task.classList.remove("taskbar-focused")
        })
        task.classList.add("taskbar-focused")
        task.addEventListener('click', ()=>{

            
            this.visualTasks.forEach( task =>{
                task.classList.remove("taskbar-focused")
            })

            task.classList.add("taskbar-focused")

            this.taskList.forEach( task =>{
                task.window.window.style.zIndex = 10;
            })

            if(this.taskList.get(id).window.focused){
                this.taskList.get(id).window.minimize()
            }
            

            this.taskList.get(id).window.window.style.zIndex ++;
        })
        
        this.element.appendChild(task)
    }

    removeTask(pid){
       this.visualTasks.forEach( (task, i) =>{
           if(task.id == pid){
               
           }
       })
    }

    init(){
        document.body.appendChild(this.element)
    }

}

class WebAmpApp{
    constructor(){
        this.window = new WindowBox("webamp", -10, -10);
        this.app = document.createElement("div");
        this.app.id = "winamp"
        this.window.removePadding();
        this.window.minimize();
        
        this.window.import(this.app)
        new Webamp().renderWhenReady(winamp).then(()=>{

            //fix styling conflicts
            document.getElementById("main-window").classList.remove("window")
            document.getElementById("playlist-window").classList.remove("window")
            document.getElementById("equalizer-window").classList.remove("window")
            document.getElementById("equalizer-window").children[0].children[0].children[0].classList.remove("title-bar")

            document.getElementById("webamp").addEventListener("click", ()=>{
                document.getElementById("main-window").classList.remove("window")
                document.getElementById("equalizer-window").classList.remove("window")
                document.getElementById("playlist-window").classList.remove("window")
                document.getElementById("equalizer-window").children[0].children[0].children[0].classList.remove("title-bar")
            })
            
        })
        
    }
}

class StartButton{
    constructor(){
        this.button = document.createElement("div");
        this.button.setAttribute("class","start-button")

        return this.init()
    }

    init(){
        return this.button
    }
}

class Icon{
    constructor(image, appName, alias){
        this.appName = appName;
        this.alias = alias
        this.iconContainer = document.createElement("div")
        this.icon = document.createElement("img");
        this.icon.src = image;
        this.text = document.createElement("div");
        this.text.innerHTML = appName;
        if(alias){
            this.text.innerHTML = alias;
        }
        this.init();
        return appName;
    }

    createIcon(){
        this.iconContainer.setAttribute("class","desktop-icon-container")
        this.icon.setAttribute("class","desktop-icon")
        this.text.style.textAlign = "center"

        this.iconContainer.appendChild(this.icon);
        this.iconContainer.appendChild(this.text);
    }

    init(){
        this.createIcon();
      
        this.iconContainer.addEventListener("click", ()=>{
            window.taskBar.launchApp(this.appName)
        })
        document.body.appendChild(this.iconContainer);
    }
}

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

new Icon("paint_xp.png", "Paint")
new Icon("paint_xp.png", "VideoPlayer")
new Icon("paint_xp.png", "WebAmpApp")
