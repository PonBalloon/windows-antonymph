class Menu{
    constructor(){
        this.element = document.createElement("div")
        this.element.setAttribute("class","menu-drop-down")
        
        return this;
    }

    export(){
        return this.element;
    }

    createRow(name, callback, props){
        let row = document.createElement("div")
        row.setAttribute("class","menu-drop-down-row")

        let image = document.createElement("div")
        image.setAttribute("class","menu-drop-down-image")

        let text = document.createElement("div")
        text.setAttribute("class","menu-drop-down-text")
        text.innerHTML = name

        let hotkey = document.createElement("div")
        hotkey.setAttribute("class","menu-drop-down-hotkey")

        let arrow = document.createElement("div")
        arrow.setAttribute("class","menu-drop-down-hotkey")

        if(callback){
            row.addEventListener("click", callback)
        }
        row.appendChild(image);
        row.appendChild(text);
        row.appendChild(hotkey);
        row.appendChild(arrow);
        

        return row
    }

    addDropdown(name, options){
        let menuItem = document.createElement("div")
        menuItem.setAttribute("class","menu-drop-down-item")

        let label = document.createElement("div")
        label.setAttribute("class","menu-drop-down-label")
        label.innerHTML = name;

        let dropdown = document.createElement("div")
        dropdown.setAttribute("class","menu-drop-down-option")

        
        
        let menu = document.createElement("div")
        menu.setAttribute("class","menu-drop-down-container")
        menu.style.visibility = "hidden"

        //create rows for each item in options.item
        options.items.forEach( item =>{
            let obj = this.createRow(item.name, item.callback, item.props)
            menu.appendChild(obj)
        })

        dropdown.appendChild(menu)

        menuItem.addEventListener("click", ()=>{
            if(menu.style.visibility == "hidden"){
                menu.style.visibility = "visible"
            }else{
                menu.style.visibility = "hidden"
            }
        })

        menuItem.appendChild(label)
        this.element.appendChild(dropdown)
        this.element.appendChild(menuItem)
        
    }
}