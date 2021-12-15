lists = []
items = []
opened = {}

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
}

milgra_delete_items = function ( oldItem )
{
    if (items.length > 0)
    {
	let i = items.length
	while (i--)
	{
	    let item = items[i]
	    
	    if (item.includes(oldItem) && item != oldItem)
	    {
		items.splice(i ,1)
	    } 
	}
	zen_list_reset( lists[0] )
    }
}


milgra_item_click = function( event )
{
    let elem = event.currentTarget

    console.log(elem.innerText)

    if (opened[elem.innerText])
    {
	// remove items
	
	milgra_delete_items(elem.innerText)
	
	delete opened[elem.innerText]
    }
    else
    {
	opened[elem.innerText] = true

	if (elem.innerText.endsWith(".html"))
	{
	    // add html as an openable item
	    
	    milgra_insert_items( [ elem.innerText + ">"  ] )
	}
	else
	{
	
	    // load moar items
	    
	    let url = "http://localhost:3000/items/" + elem.innerText
	    
	    fetch(url)
		.then((response) => response.json())
		.then((data) => {
		    milgra_insert_items(data)
		})
	}
    }
}


milgra_destroy_item = function( item )
{
    item.id = null
    item.loadContent = null
    item.removeEventListener( "click" , milgra_item_click )
}

colors = [ "#CE5555", "#EE5555", "#AACEAA", "#AABEAA", "#AAAACE", "#AAAABE" ]

milgra_item_for_index = function( list, index )
{
    if ( items.length > 0 && index < items.length && -1 < index)
    {
	let item = items[index]
	let elem = document.createElement("div")

	let parts = item.split("/")
	
	console.log("ITEM",item)
	
	elem.id = item
	elem.innerText = item

	elem.style.width = "880px"
	elem.style.padding = "5px"
	elem.style.margin = "5px"

	elem.style.backgroundColor = colors[0]
	if (index % 2 == 0) elem.style.backgroundColor = colors[1]

	if (parts.length == 3)
	{
	    elem.style.backgroundColor = colors[2]
	    if (index % 2 == 0) elem.style.backgroundColor = colors[3]
	}

	if (parts.length > 3)
	{
	    elem.style.backgroundColor = colors[4]
	    if (index % 2 == 0) elem.style.backgroundColor = colors[5]
	}

	if (item.endsWith(">"))
	{
	    elem.style.display = "block"
	    elem.load = function ( contentUrl )
	    {
		fetch(contentUrl)
		    .then((response) => response.text())
		    .then((html) => {
			this.innerHTML = html
			// update list row positions
			zen_list_update_item_positions( lists[0] )
		    })
	    }

	    elem.load( "http://localhost:3000/" + item.substring(0,item.length - 1))
	}
	else
	{
	    elem.style.height = "60px"
	    elem.style.fontSize = "50px"
	    elem.addEventListener( "click", milgra_item_click )
	}
	
	return elem
    }
    else return null;
}

milgra_init = function ()
{
    // create list
    
    let list = document.createElement("div")

    list.id = "main_list"
    list.style.position = "absolute"
    list.style.overflow = "hidden"
    list.style.width = "900px"
    list.style.height = "98%"
    list.style.backgroundColor = "gray"

    document.body.appendChild(list)

    lists.push(list)

    window.requestAnimationFrame(milgra_step)

    // load initial items

    let url = "http://localhost:3000/items/blog"

    fetch(url)
	.then((response) => response.json())
	.then((data) => {
	    items = data

	    // load list base
	    
	    zen_list_attach(list,
			    milgra_item_for_index,
			    milgra_destroy_item)
	})
}
