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

    //zen_list_update(list)
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
    let lr = list.getBoundingClientRect() // list rect
    let prel_top = lr.top - list.preload_size // preload top
    let prel_bot = lr.bottom + list.preload_size // preload bottom
    let ci  // current item
    let cir // current item rect
    let ni  // new item
    let nir // new item rect
    
    if (!list.full)
    {
	if (list.items.length == 0)
	{
	    // first item
	    
	    ni = list.item_func(list,list.top_ind)

	    if (ni)
	    {
		ni.style.position = "relative"
		
		list.appendChild(ni)
		list.items.push(ni)
		list.repos = true
	    }
	    else list.full = true
	}
	else
	{		
	    fi = list.items[0]
	    fir = fi.getBoundingClientRect()
	    
	    if (fir.top >= prel_top)
	    {
		// fill up head if needed

		ni = list.item_func(list,list.top_ind - 1)
		
		if (ni)
		{
		    ni.style.position = "relative"
		    
		    list.insertBefore(ni,fi)
		    list.items.unshift(ni)
		    
		    list.top -= ni.getBoundingClientRect().height
		    list.top_ind -= 1
		    list.repos = true
		    list.full = false
		}
		else list.full = true
	    }
	    else if (fir.bottom < prel_top && list.items.length > 1)
	    {
		// remove head if needed

		list.removeChild(fi)
		list.items.shift()
		list.top += fir.height
		list.top_ind += 1
		list.full = true

		list.destroy_func(fi,lr)
	    }
	    else list.full = true
	    
	    li = list.items[list.items.length - 1]
	    lir = li.getBoundingClientRect()

	    if (lir.bottom <= prel_bot)
	    {
		// fill up tail if needed
		
		ni = list.item_func(list,list.bot_ind + 1)

		if (ni)
		{
		    ni.style.position = "relative"

		    list.appendChild(ni)
		    list.items.push(ni)
		    
		    list.bot_ind += 1
		    list.full = false
		    list.repos = true
		}
		else list.full = true
	    }
	    else if (lir.top > prel_bot && list.items.length > 1)
	    {
		// remove tail if needed

		list.removeChild(li)
		list.items.pop()
		list.bot_ind -= 1
		list.full = true

		list.destroy_func(li)
	    }
	    else list.full = true
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

	fi = list.items[0]
	fir = fi.getBoundingClientRect()
	
	// li = list.items[list.items.length - 1]
	// lir = li.getBoundingClientRect()
	
	// bounce top
	if (fir.top > lr.top) list.top += ( lr.top - fir.top ) / 5;
	
	// bounce bottom
	// if (lir.bottom < lr.bottom) list.top += (lr.bottom - (lir.top + lir.height)) / 5

	    
	for (ci of list.items)
	{
	    if (ci.hasAttribute("delta"))
	    {
		let delta = parseInt(ci.getAttribute("delta"))
		delta += -delta / 6

		ci.setAttribute("delta",delta)

		ci.style.top = Math.round(list.top) - delta + "px"

		if (Math.abs(delta) < 0.001) ci.removeAttribute("delta")
	    }
	    else
	    {
		ci.style.top = Math.round(list.top) + "px"
	    }
	}
    }
}

