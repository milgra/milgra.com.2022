zen_list_attach = function (list,
			    item_func,
			    destroy_func)
{
    list.items = [] // item html elements
    list.top_ind = 0 // current top index
    list.bot_ind = 0 // current bottom index

    list.full = 0 // list is full, no fillup needed currently
    list.top = 0.0 // current position of top list
    list.speed = 0.0 // current scroll speed
    list.preload_size = 20 // preload distance from top and bottom
    list.repos // list needs element repositioning
    
    list.item_func = item_func   // item generator
    list.destroy_func = destroy_func // item destroyer
    
    list.addEventListener("wheel",zen_list_wheel,{ passive : true })
}

zen_list_wheel = function (event)
{
    let list = event.currentTarget
    
    list.speed -= event.deltaY / 8
    list.full = false
    //zen_list_update(list)
}

zen_log_item = function (ni,lr)
{
    let nir = ni.getBoundingClientRect()
    console.log(ni.id,"from top",nir.top - lr.top,"from bot",nir.bottom-lr.top)
}

zen_list_continue = function (list)
{
    list.full = false
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
    list.bot_ind = list.top_ind
}

zen_list_refill = function ( list , index )
{
    list.full = false

    for (let i = 0 ; i < list.items.length ; i++)
    {
	if (list.top_ind + i > index)
	{
	    let item = list.items[i]

	    list.removeChild(item)
	    list.destroy_func(item)
	}
    }
    
    list.items.splice(index - list.top_ind)
    list.top_ind = index + 1
    list.bot_ind = index + 1
}

zen_list_update_item_positions = function ( list )
{

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
    
    if (list.items)
    {
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
		    list.full = false
		    list.repos = true

		    list.destroy_func(fi,lr)
		}
		
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
			list.full = 0
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
		    list.full = false

		    list.destroy_func(li)
		}	
	    }
	}

	// move

	list.top += list.speed
	list.speed *= 0.8
	if (list.speed > 0.01 || list.speed < -0.01) list.repos = true

	if (list.repos)
	{
	    list.repos = false

	    fi = list.items[0]
	    fir = fi.getBoundingClientRect()

	    li = list.items[list.items.length - 1]
	    lir = li.getBoundingClientRect()

	    // bounce top
	    // if (fir.top > lr.top) list.top += ( lr.top - fir.top ) / 5;

	    // bounce bottom
	    // if (lir.bottom < lr.bottom) list.top += (lr.bottom - (lir.top + lir.height)) / 5
	    	    
	    for (ci of list.items)
	    {
		ci.style.top = Math.round(list.top) + "px"
	    }
	}
    }
}

