lists = []
items = []
opened = {}
counts = {}

// [ [0,100,item] ]
// [ [0,20,item][20,80,subitem][80,160,item]]
// [ [0,20,item][20,80,subitem][8[81,81,content]1,161,item]]

milgra_step = function( timestamp )
{
    for ( const list of lists ) zen_list_update( list )

    window.requestAnimationFrame( milgra_step )
}

milgra_insert_items = function ( newItems )
{
    if (newItems.length > 0)
    {
	let fi = newItems[0]
	
	for (let i = items.length - 1 ; i > -1 ; i--)
	{
	    let item = items[i]
	    if (fi.includes(item))
	    {
		items.splice(i + 1, 0, ... newItems)

		zen_list_insert( lists[0] , i + 1 , newItems.length )

		return
	    }
	}
    }
    console.log("items",items)
}

milgra_delete_items = function ( oldItem )
{
    if (items.length > 0)
    {
	let ind = items.length
	let cnt = 0 // deleted count
	let fix = -1
	
	while (ind--)
	{
	    let item = items[ind]
	    
	    if (item.includes(oldItem) && item != oldItem)
	    {
		items.splice(ind,1)
		cnt++
		fix = ind
	    } 
	}

	if ( fix > -1 ) zen_list_delete( lists[0] , fix , cnt)

    }
}

milgra_item_open = function ( item )
{
    if (item.endsWith(".html"))
    {
	if (opened[ item ])
	{
	    // remove items

	    milgra_delete_items( item )

	    opened[ item ] = false
	    delete opened[ item ]
	    
	}
	else
	{
	    // add html as an openable item

	    opened[ item ] = true
	    milgra_insert_items( [ item + ">"  ] )
	}
    }	
}

milgra_item_click = function( event )
{
    let elem = event.currentTarget

    milgra_item_open(elem.id)
}

milgra_destroy_item = function( item )
{
    item.id = null
    item.loadContent = null
    item.removeEventListener( "click" , milgra_item_click )
}

colors = [ "#88AACC", "#99BBDD", "#AACCEE" ]
months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

milgra_item_for_index = function( list, index )
{
    // console.log("item for index",index,items[index])
    
    if ( items.length > 0 && index < items.length && -1 < index)
    {
	let item = items[index]
	let elem = document.createElement("div")
	let parts = item.split("/")

	let paddingLeft = 0
	
	console.log(item,"PARTS",parts)
	
	elem.id = item
	elem.style.cursor = "pointer"
	
	if (item.endsWith("/"))
	{
	    let text = item
	    
	    if (parts.length == 3)
	    {
		text = parts[1]
		elem.style.backgroundColor = colors[0]
	    }
	    else if (parts.length == 4)
	    {
		text = months[parseInt(parts[2]) - 1]
		paddingLeft = 20
		elem.style.backgroundColor = colors[1]

	    }
	    elem.innerText = text 
	    elem.style.fontStyle = "italic"

	    let info = document.createElement("div")
	    
	    info.style.display = "relative"
	    info.style.float = "right"
	    info.innerText = counts[item] + " items"
	    elem.appendChild(info)

	}
	else
	{
	    
	    if (parts.length == 4 || parts.length == 3 || parts.length == 2)
	    {
		let text = parts[parts.length - 1]
		
		if (parts.length == 4) text = text.substring(3, text.indexOf('.html'))
		//else if (parts.length == 3) text = text.substring(5,text.indexOf(".html"))
		else text = text.substring(0,text.indexOf(".html"))
		
		elem.innerText = text

		if (item.endsWith(">"))
		{
		    // elem.style.fontWeight = "300"
		    paddingLeft = 30
		    elem.style.cursor = "auto"
		}
		else
		{
		    elem.style.backgroundColor = colors[2]
		    // elem.style.fontWeight = "500"
		    paddingLeft = 40

		    let info = document.createElement("div")
		    
		    info.style.display = "relative"
		    info.style.float = "right"
		    
		    info.innerText = item.substring(13,15)

		    if (parts.length == 3) info.innerText = parts[2].substring(0, 4)		    
		    info.style.fontStyle = "italic"
		    elem.appendChild(info)
		}
		
	    }
	    else elem.innerText = item
	}
	
	elem.style.boxSizing = "border-box"
	elem.style.width = "100%"

	if (item.endsWith(">"))
	{
	    elem.style.padding = "40px"
	    elem.style.paddingTop = "10px"
	    elem.style.paddingBottom = "10px"
	    elem.style.textAlign = "justify"
	    elem.style.backgroundColor = "#BBDDFF"
	    elem.load = function ( contentUrl )
	    {
		fetch(contentUrl)
		    .then((response) => response.text())
		    .then((html) => {
			this.innerHTML = html
		    })
	    }

	    elem.load( item.substring( 0, item.length - 1 ))
	
	}
	else
	{
	    elem.style.textAlign = "left"
	    elem.style.padding = "15px"
	    elem.style.fontSize = "20px"
	    elem.addEventListener( "click", milgra_item_click )
	}

	elem.style.paddingLeft = 10 + paddingLeft + "px"

	return elem
    }
    else return null;
}



milgra_init = function ( )
{
    // create list
    
    let list = document.createElement("div")

    list.id = "main_list"
    list.style.overflow = "hidden"
    // list.style.margin = "0px auto"
    list.style.width = "100%"
    list.style.height = "100%"
    list.style.backgroundColor = "#88AACC"

    document.getElementById("center").appendChild(list)

    zen_list_attach(list,
		    milgra_item_for_index,
		    milgra_destroy_item)

    lists.push(list)

    window.requestAnimationFrame(milgra_step)
}

milgra_load = function ( path , reverse , open)
{
    let url = "items/" + path
    
    fetch(url)
	.then((response) => response.json())
	.then((data) => {
	    items = data

	    if (reverse) items.reverse()

	    if (open) milgra_item_open(items[0])
	    
	    // extract folders

	    let folders = new Set()

	    for ( let i = 0; i < items.length;i++)
	    {
		let item = items[i]
		let parts = item.split("/")

		let spath = path + "/"
		for ( let p = 1; p < parts.length-1; p++ )
		{
		    spath += parts[p] + "/"
		    folders.add(spath)
		}
	    }

	    // count folders

	    for (let folder of folders)
	    {
		let count = 0
		for (let i=0;i<items.length;i++)
		{
		    let item = items[i]
		    if (item.search(folder) > -1)
		    {
			count++
		    }
		}
		
		counts[folder] = count
	    }

	    // insert folders into items

	    for (let folder of folders)
	    {
		for (let i=0;i<items.length;i++)
		{
		    let item = items[i]
		    if (item.search(folder) > -1)
		    {
			items.splice(i,0,folder)
			break;
		    }
		}
	    }

	    console.log("items",items)
	    
	    zen_list_reset(lists[0])

	})
}
