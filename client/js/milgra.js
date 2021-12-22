root = null // path root ( blog, apps, tabs, work )
list = null // infinite scroller
items = [] // current items
opened = {} // opened items
counts = {} // folder counter
colors = [ "#88AACC", "#99BBDD", "#AACCEE" ] // item colors
months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ] // month names for blog 


milgra_init = function ( )
{
    list = document.createElement("div")

    list.id = "main_list"
    list.style.overflow = "hidden"
    list.style.width = "100%"
    list.style.height = "100%"
    list.style.backgroundColor = "#88AACC"

    document.getElementById("center").appendChild(list)

    zen_list_attach(list,
		    milgra_item_for_index,
		    milgra_destroy_item)

    window.requestAnimationFrame(milgra_step)

    let search = document.getElementById("search")

    search.addEventListener("keyup", ({key}) => {
	if (key === "Enter") {
	    milgra_search(search.value)
	    search.blur()
	}
    })
}


milgra_load = function ( pRoot , pReverse , pOpen)
{
    root = pRoot
    let url = "items/" + root
    
    fetch(url)
	.then((response) => response.json())
	.then((data) => {

	    // create detailed item map from path list
	    
	    items = data.map((item) => { return { "path" : item , "type" : "file" }})

	    // reverse and open if needed
	    
	    if (pReverse) items.reverse( )
	    if (pOpen) milgra_item_open( items[0] )
	    
	    // extract folders

	    let folders = new Set()

	    for ( { path } of items)
	    {
		let parts = path.split("/")
		let folder = root + "/"
		
		for ( ind = 1; ind < parts.length - 1; ind++ )
		{
		    folder += parts[ ind ] + "/"
		    folders.add( folder )
		}
	    }

	    // count folders

	    for ( folder of folders )
	    {
		let count = 0
		for ( { path } of items )
		{
		    if ( path.search( folder ) > -1 ) count++
		}
		
		counts[ folder ] = count
	    }

	    // insert folders into items

	    for ( folder of folders )
	    {
		for ( ind = 0; ind < items.length; ind++ )
		{
		    let { path } = items[ ind ]
		    
		    if ( path.search( folder ) > -1 )
		    {
			items.splice( ind , 0 , { "path" : folder , "type" : "folder" } )
			break;
		    }
		}
	    }
	    
	    zen_list_reset(list)
	})
}


milgra_search = function ( text )
{
    let url = "items/search=" + text
    
    fetch(url)
	.then((response) => response.json())
	.then((data) => {

	    // create detailed item map from path list
	    
	    items = data.map((item) => { return { "path" : item , "type" : "file" }})
	    	    
	    zen_list_reset(list)
	})
}


milgra_step = function( timestamp )
{
    zen_list_update( list )

    window.requestAnimationFrame( milgra_step )
}


milgra_insert_items = function ( newItems )
{
    if ( newItems.length > 0 )
    {
	for ( const newItem of newItems )
	{
	    for ( let ind = items.length - 1 ; ind > -1 ; ind-- )
	    {
		const item = items[ ind ]

		// insert after the last similar item
		
		if ( newItem.path.includes( item.path ) )
		{
		    items.splice( ind + 1, 0, ... newItems )		    
		    zen_list_insert( list , ind + 1 , newItems.length )
		    return
		}
	    }
	}
    }
}


milgra_delete_item = function ( item )
{
    if ( items.length > 0 )
    {
	const { path , type } = item
	let ind = items.length
	let count = 0
	let index = -1

	// delete all items with prefix
	
	while ( ind-- )
	{
	    const { path: onePath , type: oneType } = items[ind]
	    
	    if ( onePath.includes( path ) && type != oneType)
	    {
		items.splice( ind, 1 )
		count++
		index = ind
	    } 
	}
	
	// remove items from list

	if ( index > -1 ) zen_list_delete( list, index, count )
    }
}

milgra_comment_send = function ( item )
{
    console.log("SEND")
}

milgra_item_open = function ( { path, type } )
{
    if ( type == "file" )
    {
	if ( opened[ path ] )
	{
	    milgra_delete_item( { path , type } )

	    delete opened[ path ]	    
	}
	else
	{
	    opened[ path ] = true

	    // add viewer and comment list item
	    
	    milgra_insert_items( [ {"path" : path , "type" : "viewer" }  ,
				   {"path" : "comment/" + path , "type" : "comment" } ] )
	}
    }	
}

milgra_item_click = function( event )
{
    let elem = event.currentTarget

    milgra_item_open( elem.listItem )
}

milgra_comment_click = function( event )
{
    let elem = event.currentTarget.parentNode

    let button = document.createElement("div")

    button.style.cursor = "pointer"
    button.addEventListener("click",milgra_comment_send)
    
    button.innerText = "Send"
    
    elem.insertBefore(button,elem.childNodes[0])

    let editor = document.createElement("input")
    editor.id = "editor"
    editor.value = "comment"
    editor.style.width = "100%"
    editor.style.height = "100px"
    
    elem.insertBefore(editor,elem.childNodes[0])

    let nick = document.createElement("input")
    nick.id = "nick"
    nick.value = "nick"
    nick.style.width = "100%"

    elem.insertBefore(nick,elem.childNodes[0])

    event.currentTarget.remove()
}

milgra_destroy_item = function( item )
{
    item.id = null
    item.loadContent = null
    item.removeEventListener( "click" , milgra_item_click )
}

milgra_item_for_index = function( list, index )
{
    if ( items.length > 0 && index < items.length && -1 < index)
    {
	let item = items[ index ]
	let elem = document.createElement("div")
	let info = document.createElement("div")
	let parts = item.path.split("/")
	let paddingLeft = 0
		
	elem.appendChild(info)
	elem.style.boxSizing = "border-box"
	elem.style.width = "100%"
	elem.id = item.path
	elem.listItem = item

	info.style.display = "relative"
	info.style.float = "right"
	
	if ( item.type == "folder" )
	{
	    // we will be a folder item
 	    
	    let text
	    
	    if (parts.length == 3)
	    {
		// in case of blog, we show the year
		text = parts[1]
		elem.style.backgroundColor = colors[0]
	    }
	    else if (parts.length == 4)
	    {
		// in case of blog, we show the month name
		text = months[ parseInt( parts[2] ) - 1 ]
		elem.style.backgroundColor = colors[1]
		paddingLeft = 20
	    }
	    else
	    {
		// else we show the full path
		text = item.folder
	    }

	    // show folder/file count in info block
	    
	    info.innerText = counts[item] + " items"

	    elem.innerText = text 
	    elem.style.fontStyle = "italic"
	}
	else
	{
	    // we will be a file item
	    
	    if (parts.length == 5 || parts.length == 4 || parts.length == 3 || parts.length == 2)
	    {
		let text = parts[parts.length - 1]

		// show name without extension
		
		if (parts.length == 4) text = text.substring(3, text.indexOf('.html'))
		//else if (parts.length == 3) text = text.substring(5,text.indexOf(".html"))
		else text = text.substring(0,text.indexOf(".html"))
		
		elem.innerText = text

		if (item.type == "file" )
		{
		    elem.style.backgroundColor = colors[2]
		    // elem.style.fontWeight = "500"
		    paddingLeft = 40

		    // show day in the info view
		    
		    info.innerText = item.path.substring(13,15)

		    if (parts.length == 3) info.innerText = parts[2].substring(0, 4)		    

		    info.style.fontStyle = "italic"
		}
		
	    }
	    else elem.innerText = item.path
	}

	// additional css setup
	
	if (item.type == "viewer")
	{
	    paddingLeft = 30
	    elem.style.cursor = "auto"
	    elem.style.padding = "40px"
	    elem.style.paddingTop = "10px"
	    elem.style.paddingBottom = "10px"
	    elem.style.textAlign = "justify"
	    elem.style.backgroundColor = "#BBDDFF"	
	}
	else
	{
	    elem.style.cursor = "pointer"
	    elem.style.textAlign = "left"
	    elem.style.padding = "15px"
	    elem.style.fontSize = "20px"
	    elem.addEventListener( "click", milgra_item_click )
	}

	elem.style.paddingLeft = 10 + paddingLeft + "px"

	if (item.type == "viewer" || item.type == "comment")
	{
	    elem.load = function ( contentUrl )
	    {
		fetch(contentUrl)
		    .then((response) => response.text())
		    .then((html) => {

			// show response if it is "No Comments"
			
			if (html != "No Comments") this.innerHTML = html
			else this.innerHTML = ""

			if (item.type == "comment")
			{
			    // add comment button in case of comment item
			    
			    let button = document.createElement("div")
			    
			    button.style.display = "absolute"
			    button.style.width = "100%"
			    button.style.padding = "10px"
			    button.style.backgroundColor = "#446688"
			    button.style.cursor = "pointer"
			    button.addEventListener("click",milgra_comment_click)
			    
			    button.innerHTML = "New Comment"
			    
			    this.insertBefore( button, this.childNodes[0] )

			    elem.style.backgroundColor = "#AACCEE"
			}
		    })
	    }

	    elem.load( item.path )
	}
	
	return elem
    }
    else return null;
}
