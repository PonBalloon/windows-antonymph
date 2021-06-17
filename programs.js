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

        this.menu = new Menu()

        


        this.app = document.createElement("iframe");
        this.window.removePadding();
        this.app.setAttribute("frameborder", "0");
        this.app.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        this.app.setAttribute("class","innerWindow-menu")
        this.app.setAttribute("src", "https://www.youtube.com/embed/CNPdO5TZ1DQ");
        

        this.window.import(this.menu.export())
        this.window.import(this.app)

        let app = this.app;

        let options = {
            items: [
                {
                    name: "Test Item",
                    callback: function(){
                        alert("This is working!")
                    },
                    props: {
                        arrow: true,
                        hotkey: "Ctrl+Y"
                    }
                },
                {
                    name: "Hi street!",
                    callback: function(){
                        alert("beep boop")
                    },
                    props: {
                        arrow: true,
                        hotkey: "Ctrl+Y"
                    }
                },
                {
                    name: "The Madrigal",
                    callback: function(){
                        //example to load new url
                        app.setAttribute("src","https://www.youtube.com/embed/ig8F6weO2J0")
                        
                        app.contentWindow.location.reload();
                    },
                    props: {
                        arrow: true,
                        hotkey: "Ctrl+Y"
                    }
                }
            ]
        }
        this.menu.addDropdown("File", options)
        this.menu.addDropdown("Edit", options)

        

    }
}

class InternetExplorer{

    constructor(){
        
    }

}