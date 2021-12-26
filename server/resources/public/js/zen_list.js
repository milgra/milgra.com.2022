zen_list_attach = function (list,
			    item_func,
			    destroy_func,
			    anim_start_func,
			    anim_stop_func)
{
    list.items = [] // item html elements
    list.top_ind = 0 // current top index
    list.bot_ind = 0 // current bottom index

    list.full = 0 // list is full, no fillup needed currently
    list.top = 0.0 // current position of top list
    list.speed = 0.0 // current scroll speed
    list.preload_size = 0 // preload distance from top and bottom
    list.repos // list needs element repositioning
    
    list.item_func = item_func   // item generator
    list.destroy_func = destroy_func // item destroyer
    list.anim_start_func = anim_start_func
    list.anim_stop_func = anim_stop_func
    
    list.addEventListener("wheel",zen_list_wheel,{ passive : true })
    list.addEventListener('touchstart', zen_list_touch_start, { passive : true })
    list.addEventListener('touchmove', zen_list_touch_move, { passive : true })
}

var lastY = 0

zen_list_touch_start = function (event)
{
    let list = event.currentTarget

    lastY = event.touches[0].pageY
}

zen_list_touch_move = function (event)
{
    let list = event.currentTarget
    
    let deltaY = lastY - event.touches[0].pageY

    lastY = event.touches[0].pageY

    list.speed -= deltaY / 4
    list.full = false

    list.anim_start_func()
}

zen_list_wheel = function (event)
{
    let list = event.currentTarget
    
    list.speed -= event.deltaY / 4
    list.full = false

    list.anim_start_func()
}

zen_log_item = function (ni,lr)
{
    let nir = ni.getBoundingClientRect()
    console.log(ni.id,"from top",nir.top - lr.top,"from bot",nir.bottom-lr.top)
}

zen_list_reset = function (list)
{
    list.full = false

    let li
    for (li of list.items)
    {
	list.removeChild(li)
	list.destroy_func(li)
    }

    list.items = []
    list.bot_ind = 0
    list.top_ind = 0
    list.top = 0

    list.anim_start_func()
}

zen_list_insert = function ( list, index, size )
{
    let ind

    // for (ind = 0 ; ind < list.items.length ; ind++)
    // {
    // 	console.log("A",ind,list.items[ind].id)
    // 	console.log("B",ind,list.childNodes[ind].id)
    // }

    // insert items from index, animate other items down or up
    
    if (list.top_ind <= index  && index <= list.bot_ind)
    {
	start_ind = index - list.top_ind
	next_item = list.items[ start_ind ]
	
	let hth = 0
	for (ind = start_ind ; ind < start_ind + size ; ind++)
	{
	    let ni = list.item_func(list,ind + list.top_ind)
	    
	    if (ni)
	    {
		ni.style.position = "relative"
		
		list.insertBefore(ni,next_item)
		list.items.splice(ind ,0,ni)

		hth += ni.getBoundingClientRect().height
	    }
	}

	list.bot_ind += size
	list.repos = true

	// set animation position for remaining items

	for (ind = start_ind + size  ; ind < list.items.length ; ind++)
	{
	    let ni = list.items[ind]
	    // console.log("set delta",ni,ind,hth)
	    ni.setAttribute("delta" , hth)
	}
    }
    else if (index == list.bot_ind + 1)
    {
	list.repos = true
	for (ind = 0 ; ind < size ; ind++)
	{
	    list.bot_ind += 1
	    let ni = list.item_func(list,list.bot_ind)
	    
	    if (ni)
	    {
		ni.style.position = "relative"
		
		list.appendChild(ni)
		list.items.push(ni)
	    }
	}
    }
    else list.full = false
}

zen_list_delete = function (list , index , size)
{
    if (list.top_ind <= index && index <= list.bot_ind)
    {
	let start_ind = index - list.top_ind
	let hth = 0
	let ind
	
	for (ind = 0 ; ind < size ; ind++)
	{
	    console.log("start",start_ind,"length",list.items.length )

	    if (start_ind < list.items.length)
	    {
		// remove actual item
		
		let ni = list.items[start_ind]
		hth += ni.getBoundingClientRect().height
		
		list.removeChild(ni)
		list.bot_ind -= 1
		list.full = false
		list.destroy_func(ni)

		list.items.splice(start_ind ,1)
	    }
	}

	// set closing animation for remaining items

	for (ind = start_ind; ind < list.items.length; ind++)
	{
	    let ni = list.items[ind]
	    ni.setAttribute("delta" , -hth)
	}
    }
}

zen_list_update = function (list)
{
    let list_rect = list.getBoundingClientRect() // list rect
    let prel_top = list_rect.top - list.preload_size // preload top
    let prel_bot = list_rect.bottom + list.preload_size // preload bottom
    
    if (!list.full)
    {
	list.full = true
	
	if (list.items.length == 0) // first item
	{
	    let item = list.item_func(list,list.top_ind)

	    if (item)
	    {
		item.style.position = "relative"
		
		list.appendChild(item)
		list.items.push(item)
		list.repos = true
		list.full = false

	    	item.real_pos = list.top
	    }
	}
	else
	{		
	    let last = list.items[0]
	    let rect = last.getBoundingClientRect()
	    
	    if (rect.top >= prel_top) // fill up head
	    {
		let item = list.item_func(list,list.top_ind - 1)
		
		if (item)
		{
		    item.style.position = "relative"
		    
		    list.insertBefore(item,last)
		    list.items.unshift(item)
		    
		    list.top -= item.getBoundingClientRect().height
		    list.top_ind -= 1
		    list.repos = true
		    list.full = false

		    item.real_pos = last.real_pos + item.getBoundingClientRect().height
		}
	    }
	    else if (rect.bottom < prel_top && list.items.length > 1) // remove head
	    {
		list.removeChild(last)
		list.items.shift()
		list.top += rect.height
		list.top_ind += 1
		list.full = false

		list.destroy_func(last)
	    }
	    
	    last = list.items[list.items.length - 1]
	    rect = last.getBoundingClientRect()

	    if (rect.bottom <= prel_bot) // fill up tail
	    {
		let item = list.item_func(list,list.bot_ind + 1)

		if (item)
		{
		    item.style.position = "relative"

		    list.appendChild(item)
		    list.items.push(item)
		    
		    list.bot_ind += 1
		    list.full = false

		    item.real_pos = last.real_pos + item.getBoundingClientRect().height
		}
	    }
	    else if (rect.top > prel_bot && list.items.length > 1) // remove tail
	    {
		list.removeChild(last)
		list.items.pop()
		list.bot_ind -= 1
		list.full = false

		list.destroy_func(last)
	    }
	}
    }

    // move

    list.top += list.speed
    list.speed *= 0.8
    if (list.speed > 0.01 || list.speed < -0.01)
    {
	list.full = false
	list.repos = true
    }
    else list.anim_stop_func()

    // if (list.repos)
    // {
    // list.repos = false
    // list.full = false

    if (list.repos)
    {

	let item = list.items[0]
	rect = item.getBoundingClientRect()
	
	// li = list.items[list.items.length - 1]
	// rect = li.getBoundingClientRect()
	
	// bounce top
	if (rect.top > list_rect.top) list.top += ( list_rect.top - rect.top ) / 5;
	
	// bounce bottom
	// if (rect.bottom < list_rect.bottom) list.top += (list_rect.bottom - (rect.top + rect.height)) / 5

	    
	for (item of list.items)
	{
	    if (item.hasAttribute("delta"))
	    {
		let delta = parseInt(item.getAttribute("delta"))
		delta += -delta / 6

		item.setAttribute("delta",delta)

		item.style.top = Math.round(list.top) - delta + "px"

		if (Math.abs(delta) < 0.001) item.removeAttribute("delta")
	    }
	    else
	    {
		item.style.top = Math.round(list.top) + "px"
	    }
	}
    }
}
