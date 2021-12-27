milgra = {
    list    : null ,  // infinite scroller element
    group   : null ,  // file group ( blog, apps, tabs, work )
    animate : false , // trigger list animation
    items   : [] ,    // current items
    opened  : {} ,    // opened items
    counts  : {} ,    // folder counter
    colors  : [ "#88AACC", "#99BBDD", "#AACCEE" ] , // item colors
    months  : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ] // month names for blog 
}

milgra_init = function()
{
    milgra.list = document.createElement( "div" )
    milgra.list.id = "main_list"

    document.getElementById( "center" ).appendChild( milgra.list )

    zenlist_attach( milgra.list,
		    0,
		    milgra_item_for_index,
		    milgra_destroy_item,
		    milgra_start_anim,
		    milgra_stop_anim )
    

    const search = document.getElementById( "milgra_search_input" )
    
    search.onkeyup = function ({key}) {
	if (key === "Enter") {
	    milgra_search(search.value)
	    search.blur()
	}
    }

    const query = window.location.search;
    const params = new URLSearchParams(query);

    // load items based on query params
    
    if ( params.has("show_file") )
    {
	const path = params.get("show_file")
	
	milgra.items = [ {"path" : path , "type" : "file" } ,
			 {"path" : path , "type" : "viewer" }  ,
			 {"path" : "comments/" + path , "type" : "comment" } ]

	zenlist_reset( milgra.list )
    }
    else if ( params.has("show_group") )
    {
	const group = params.get("show_group")

	milgra_load( group )
    }
    else
    {
	milgra_load("blog",true,true)
    }
}

milgra_start_anim = function()
{
    if ( !milgra.animate ) window.requestAnimationFrame( milgra_step )
    milgra.animate = true
}

milgra_stop_anim = function()
{
    milgra.animate = false
}

milgra_step = function( timestamp )
{
    zenlist_update( milgra.list )

    if ( milgra.animate ) window.requestAnimationFrame( milgra_step )
}

milgra_load = function ( pGroup , pReverse , pOpen)
{
    milgra.group = pGroup
    const url = "items/" + pGroup

    fetch( url )
	.then( (response) => response.json() )
	.then( (data) => {

	    // create detailed item map from path list
	    
	    milgra.items = data.map( (item) => { return { "path" : item , "type" : "file" } } )

	    // reverse and open if needed
	    
	    if ( pReverse ) milgra.items.reverse()
	    if ( pOpen ) milgra_item_open( milgra.items[0] )
	    
	    // extract folders

	    let folders = new Set()

	    for ( let { path } of milgra.items)
	    {
		let parts = path.split( "/" )
		let folder = pGroup + "/"
		
		for ( let ind = 1; ind < parts.length - 1; ind++ )
		{
		    folder += parts[ ind ] + "/"
		    folders.add( folder )
		}
	    }

	    // count folders

	    for ( let folder of folders )
	    {
		let count = 0
		for ( { path } of milgra.items )
		{
		    if ( path.search( folder ) > -1 ) count++
		}
		
		milgra.counts[ folder ] = count
	    }

	    // insert folders into items

	    for ( folder of folders )
	    {
		for ( let ind = 0; ind < milgra.items.length; ind++ )
		{
		    let { path } = milgra.items[ ind ]
		    
		    if ( path.search( folder ) > -1 )
		    {
			milgra.items.splice( ind , 0 , { "path" : folder , "type" : "folder" } )
			break;
		    }
		}
	    }
	    
	    zenlist_reset( milgra.list )
	})
}

milgra_search = function( text )
{
    let url = "items/search=" + text
    
    fetch( url )
	.then( (response) => response.json() )
	.then( (data) => {

	    // create detailed item map from path list
	    
	    milgra.items = data.map( (item) => { return { "path" : item , "type" : "file" }} )
	    	    
	    zenlist_reset( milgra.list )
	})
}

milgra_comment_send = function( path, nick, comment )
{
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
    
    fetch( url, params )
	.then( (response) => response.json() )
	.then( (data) => {
	    milgra_delete_item( {"path" : path , "type" : "comment"} )
	    milgra_insert_items( [ {"path" : path , "type" : "comment"} ] )
	})
	.catch( (error) => console.log( "send comment error", error ) )
}

milgra_item_for_index = function( list, index )
{
    if ( milgra.items.length > 0 && index < milgra.items.length && -1 < index )
    {
	const item = milgra.items[index]
	if ( item.type == "file" ) return milgra_file_item( item )
	if ( item.type == "folder" ) return milgra_folder_item( item )
	if ( item.type == "viewer" ) return milgra_viewer_item( item )
	if ( item.type == "comment" ) return milgra_comment_item( item )
    }
    else return null;
}

milgra_destroy_item = function( item )
{
    item.id = null
    item.listItem = null
    item.loadContent = null
    item.onclick = null
    if ( item.childNodes.length > 0 ) item.childNodes[0].remove()
}

milgra_folder_item = function( item )
{
    let elem = document.createElement( "div" )
    let info = document.createElement( "div" )
    let parts = item.path.split( "/" )
 
    elem.onclick = milgra_item_click
    elem.className = "folder_item"
    elem.listItem = item
    elem.id = item.path

    info.className = "item_info"
    info.innerText = milgra.counts[ item.path ] + " items" // show item count in info

    // we show the first part - year in case of blog - by default
    
    let left = 10
    let text = parts[1]
    let color = milgra.colors[0]
    
    if ( parts.length == 4 )
    {
	// in case of blog, we show the month name
	text = milgra.months[ parseInt( parts[2] ) - 1 ]
	color = milgra.colors[1]
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
    let elem = document.createElement( "div" )
    let info = document.createElement( "div" )
    let parts = item.path.split( "/" )

    elem.onclick = milgra_item_click
    elem.className = "file_item"
    elem.listItem = item
    elem.id = item.path
    
    info.className = "item_info"
    info.innerText = item.path.substring( 13, 15 ) // show day in info
    if (parts.length == 3) info.innerText = parts[2].substring( 0, 4 )
    
    let text = parts[parts.length - 1]
    
    if ( parts.length == 4 ) text = text.substring( 3, text.indexOf('.html') )
    //else if (parts.length == 3) text = text.substring(5,text.indexOf(".html"))
    else text = text.substring( 0, text.indexOf(".html") )
    
    elem.style.backgroundColor = milgra.colors[2]        
    elem.style.paddingLeft = 40 + "px"    
    elem.innerText = text
    elem.appendChild( info )

    return elem
}

milgra_viewer_item = function( item )
{
    let elem = document.createElement( "div" )
    let parts = item.path.split( "/" )
    
    elem.className = "viewer_item"
    elem.listItem = item    
    elem.id = item.path
    
    elem.load = function( contentUrl )
    {
	fetch( contentUrl )
	    .then( (response) => response.text() )
	    .then( (html) => {
		this.innerHTML = html
	    })
    }
    
    elem.load( item.path )
    
    return elem
}

milgra_comment_item = function( item )
{
    let elem = document.createElement( "div" )
    let info = document.createElement( "div" )
    let parts = item.path.split( "/" )

    let paddingLeft = 0
    
    elem.appendChild( info )
    elem.className = "viewer_item"
    elem.listItem = item
    elem.id = item.path
    
    info.className = "item_info"
    
    elem.load = function( contentUrl )
    {
	fetch( contentUrl )
	    .then( (response) => response.text() )
	    .then( (html) => {
		
		// show response if it is "No Comments"
		
		if ( html != "No Comments" ) this.innerHTML = html
		else this.innerHTML = ""
		
		// add comment button in case of comment item
		
		let button = document.createElement( "div" )
		
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

milgra_item_click = function( event )
{
    let elem = event.currentTarget

    milgra_item_open( elem.listItem )
}

milgra_comment_click = function( event )
{
    let elem = event.currentTarget.parentNode

    let button = document.createElement( "div" )
    let editor = document.createElement( "input" )
    let nick = document.createElement( "input" )

    button.style.cursor = "pointer"
    button.onclick = function() { milgra_comment_send( elem.id, nick.value, editor.value ) }    
    button.innerText = "Send"
    
    editor.id = "editor"
    editor.value = "comment"
    editor.style.width = "100%"
    editor.style.height = "100px"
    editor.onfocus = function() { editor.value = "" }

    nick.id = "nick"
    nick.value = "nick"
    nick.style.width = "100%"
    nick.onfocus = function() { nick.value = "" }

    elem.insertBefore( button,elem.childNodes[0] )
    elem.insertBefore( editor,elem.childNodes[0] )
    elem.insertBefore( nick,elem.childNodes[0] )

    event.currentTarget.remove()
}

milgra_item_open = function( { path, type } )
{
    if ( type == "file" )
    {
	window.history.pushState('path', 'path', '?show_file=' + path);

	if ( milgra.opened[path] )
	{
	    milgra_delete_item( { path , type } )

	    delete milgra.opened[path]	    
	}
	else
	{
	    milgra.opened[path] = true

	    // add viewer and comment list item

	    milgra_insert_items( [ {"path" : path , "type" : "viewer" }  ,
				   {"path" : "comments/" + path , "type" : "comment" } ] )
	}
    }	
}

milgra_insert_items = function( newItems )
{
    if ( newItems.length > 0 )
    {
	for ( const newItem of newItems )
	{
	    for ( let ind = milgra.items.length - 1; ind > -1; ind-- )
	    {
		const item = milgra.items[ ind ]

		// insert after the last similar item
		
		if ( newItem.path.includes( item.path ) )
		{
		    milgra.items.splice( ind + 1, 0, ... newItems )		    
		    zenlist_insert( milgra.list , ind + 1 , newItems.length )
		    return
		}
	    }
	}
    }
}

milgra_delete_item = function( item )
{
    if ( milgra.items.length > 0 )
    {
	const { path , type } = item
	let ind = milgra.items.length
	let count = 0
	let index = -1

	// delete all items with prefix
	
	while ( ind-- )
	{
	    const { path: onePath , type: oneType } = milgra.items[ind]

	    if ( onePath.includes( path ) )
	    {
		if ( type == "file" )
		{
		    if (oneType == "viewer" || oneType == "comment")
		    {
			milgra.items.splice( ind, 1 )
			count++
			index = ind
			
		    }
		}
		if ( type == "comment" )
		{
		    milgra.items.splice( ind, 1 )
		    count++
		    index = ind
		}
	    }
	}
	
	// remove items from list

	if ( index > -1 ) zenlist_delete( milgra.list, index, count )
    }
}

