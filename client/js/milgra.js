root = null // path root ( blog, apps, tabs, work )
list = null // infinite scroller
anim = false // animate?
items = [] // current items
opened = {} // opened items
counts = {} // folder counter
colors = [ "#88AACC", "#99BBDD", "#AACCEE" ] // item colors
months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ] // month names for blog 

// main functions

milgra_init = function ( )
{
    list = document.createElement( "div" )
    list.id = "main_list"

    zen_list_attach( list,
		     0,
		     milgra_item_for_index,
		     milgra_destroy_item,
		     milgra_start_anim,
		     milgra_stop_anim )

    document.getElementById( "center" ).appendChild( list )

    let search = document.getElementById( "milgra_search_input" )
    
    search.onkeyup = function ({key}) {
	if (key === "Enter") {
	    milgra_search(search.value)
	    search.blur()
	}
    }
}

milgra_start_anim = function ( )
{
    console.log("START ANIM")
    if (!anim) window.requestAnimationFrame( milgra_step )
    anim = true
}

milgra_stop_anim = function ( )
{
    console.log("STOP ANIM")
    anim = false
}

milgra_step = function( timestamp )
{
    zen_list_update( list )

    if (anim) window.requestAnimationFrame( milgra_step )
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


milgra_comment_send = function ( path, nick, comment )
{
    console.log("SEND", path,nick,comment)

    let body = JSON.stringify(
	{
	    "path" : path ,
	    "nick" : nick ,
	    "comment" : comment
	})
    let url = "comment"
    let params = {
	headers : { "content-type":"application/json" } ,
	method : "POST" ,
	body : body
    }
    
    fetch(url,params)
	.then((response) => response.json())
	.then((data) => {
	    milgra_delete_item({"path" : path , "type" : "comment"})
	    milgra_insert_items([{"path" : path , "type" : "comment"}])
	})
	.catch((error) => console.log("send comment error", error))

}


// list handling


milgra_item_for_index = function( list, index )
{
    if ( items.length > 0 && index < items.length && -1 < index)
    {
	const item = items[index]
	if (item.type == "file") return milgra_file_item( item )
	if (item.type == "folder") return milgra_folder_item( item )
	if (item.type == "viewer") return milgra_viewer_item( item )
	if (item.type == "comment") return milgra_comment_item( item )
    }
    else return null;
}


milgra_destroy_item = function( item )
{
    item.id = null
    item.listItem = null
    item.loadContent = null
    item.onclick = null
    if (item.childNodes.length > 0 ) item.childNodes[0].remove()
}


milgra_folder_item = function ( item )
{
    let elem = document.createElement("div")
    let info = document.createElement("div")
    let parts = item.path.split("/")
 
    elem.onclick = milgra_item_click
    elem.className = "folder_item"
    elem.listItem = item
    elem.id = item.path

    info.className = "item_info"
    info.innerText = counts[ item.path ] + " items" // show item count in info

    // we show the first part - year in case of blog - by default
    
    let left = 10
    let text = parts[1]
    let color = colors[0]
    
    if (parts.length == 4)
    {
	// in case of blog, we show the month name
	text = months[ parseInt( parts[2] ) - 1 ]
	color = colors[1]
	left = 30	
    }

    elem.style.backgroundColor = color
    elem.style.paddingLeft = left + "px"
    elem.innerText = text
    elem.appendChild( info )

    return elem
}


milgra_file_item = function ( item )
{
    let elem = document.createElement("div")
    let info = document.createElement("div")
    let parts = item.path.split("/")

    elem.onclick = milgra_item_click
    elem.className = "file_item"
    elem.listItem = item
    elem.id = item.path
    
    info.className = "item_info"
    info.innerText = item.path.substring(13,15) // show day in info
    if (parts.length == 3) info.innerText = parts[2].substring(0, 4) //
    
    let text = parts[parts.length - 1]
    
    if (parts.length == 4) text = text.substring(3, text.indexOf('.html'))
    //else if (parts.length == 3) text = text.substring(5,text.indexOf(".html"))
    else text = text.substring(0,text.indexOf(".html"))
    
    elem.style.backgroundColor = colors[2]        
    elem.style.paddingLeft = 40 + "px"    
    elem.innerText = text
    elem.appendChild(info)

    return elem
}


milgra_viewer_item = function ( item )
{
    let elem = document.createElement("div")
    let parts = item.path.split("/")
    
    elem.className = "viewer_item"
    elem.listItem = item    
    elem.id = item.path
    
    elem.load = function ( contentUrl )
    {
	fetch(contentUrl)
	    .then((response) => response.text())
	    .then((html) => {
		this.innerHTML = html
	    })
    }
    
    elem.load( item.path )
    
    return elem
}


milgra_comment_item = function ( item )
{
    let elem = document.createElement("div")
    let info = document.createElement("div")
    let parts = item.path.split("/")

    let paddingLeft = 0
    
    elem.appendChild(info)
    elem.className = "viewer_item"
    elem.listItem = item
    elem.id = item.path
    
    info.className = "item_info"
    
    elem.load = function ( contentUrl )
    {
	fetch(contentUrl)
	    .then((response) => response.text())
	    .then((html) => {
		
		// show response if it is "No Comments"
		
		if (html != "No Comments") this.innerHTML = html
		else this.innerHTML = ""
		
		// add comment button in case of comment item
		
		let button = document.createElement("div")
		
		button.style.display = "absolute"
		button.style.width = "100%"
		button.style.padding = "10px"
		button.style.backgroundColor = "#446688"
		button.style.cursor = "pointer"
		button.onclick = milgra_comment_click
		
		button.innerHTML = "New Comment"
		
		this.insertBefore( button, this.childNodes[0] )
		
		elem.style.backgroundColor = "#AACCEE"		
	    })
    }
    
    elem.load( item.path )
    
    return elem
}


// events


milgra_item_click = function( event )
{
    let elem = event.currentTarget

    milgra_item_open( elem.listItem )
}


milgra_comment_click = function( event )
{
    let elem = event.currentTarget.parentNode

    let button = document.createElement("div")
    let editor = document.createElement("input")
    let nick = document.createElement("input")

    button.style.cursor = "pointer"
    button.onclick = function () {milgra_comment_send(elem.id,nick.value,editor.value)}    
    button.innerText = "Send"
    
    editor.id = "editor"
    editor.value = "comment"
    editor.style.width = "100%"
    editor.style.height = "100px"
    editor.onfocus = function () {editor.value = ""}

    nick.id = "nick"
    nick.value = "nick"
    nick.style.width = "100%"
    nick.onfocus = function ( ) {nick.value = ""}

    elem.insertBefore(button,elem.childNodes[0])
    elem.insertBefore(editor,elem.childNodes[0])
    elem.insertBefore(nick,elem.childNodes[0])

    event.currentTarget.remove()
}

// helper functions

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
				   {"path" : "comments/" + path , "type" : "comment" } ] )
	}
    }	
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

	    if (onePath.includes( path ))
	    {

		if (type == "file")
		{
		    if (oneType == "viewer" || oneType == "comment")
		    {
			items.splice( ind, 1 )
			count++
			index = ind
			
		    }
		}
		if (type == "comment")
		{
		    items.splice( ind, 1 )
		    count++
		    index = ind
		}
		
	    }
	    
	}
	
	// remove items from list

	if ( index > -1 ) zen_list_delete( list, index, count )
    }
}

