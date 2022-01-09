zenlist_attach = (list,
		  preload_size,
		  newitem_fun,
		  delitem_fun) =>
{
    list.items = []  // item html elements
    list.top_ind = 0 // current top index
    list.bot_ind = 0 // current bottom index

    list.full = 0      // list is full, no fillup needed currently
    list.repos = false // list needs element repositioning

    list.touch = 0.0   // last y position of finger
    list.speed = 0.0   // current scroll speed
    list.delta = 0.0   // last touch delta
    list.top_pos = 0.0 // current position of top list
    
    list.preload_size = preload_size // preload distance from top and bottom
    
    list.newitem_fun = newitem_fun        // item generator
    list.delitem_fun = delitem_fun        // item destroyer
    
    list.style.overflow = "hidden" // this is a must for the list, don't set it from css

    list.addEventListener( "wheel", zenlist_wheel)
    list.addEventListener( 'touchmove', zenlist_touch_move)
    list.addEventListener( 'touchstart', zenlist_touch_start)
    list.addEventListener( 'touchend', zenlist_touch_end)
    list.addEventListener( 'touchcancel', zenlist_touch_cancel)
}

zenlist_touch_start = ( event ) =>
{
    let list = event.currentTarget
    list.touch = event.touches[0].pageY
}

zenlist_touch_end = ( event ) =>
{
    let list = event.currentTarget
    list.speed = list.delta

    zenlist_start_anim(list)
}

zenlist_touch_cancel = ( event ) =>
{
    let list = event.currentTarget
}

zenlist_touch_move = ( event ) =>
{
    let list = event.currentTarget
    
    list.delta = event.touches[0].pageY - list.touch
    list.touch = event.touches[0].pageY
    list.full = false

    list.top_pos += list.delta
    zenlist_update( list )
}

zenlist_wheel = ( event ) =>
{
    let list = event.currentTarget

    list.speed -= event.deltaY / 4
    list.full = false

    zenlist_start_anim(list)
}

zenlist_start_anim = (list) =>
{
    if ( !list.interval ) list.interval = setInterval(zenlist_step, 15,list)
}

zenlist_stop_anim = (list) =>
{
    if ( list.interval ) clearInterval( list.interval )
    list.interval = null
}

zenlist_step = (list) =>
{
    zenlist_update( milgra.list )
}

zenlist_reset = ( list ) =>
{
    list.full = false

    let li
    for ( li of list.items )
    {
	list.removeChild(li)
	list.delitem_fun(li)
    }

    list.items = []
    list.bot_ind = 0
    list.top_ind = 0
    list.top_pos = 0

    zenlist_start_anim(list)
 }

zenlist_insert = ( list, index, size ) =>
{
    if ( list.top_ind <= index  && index <= list.bot_ind )
    {
	// insert items from index, animate other items down or up

	const start_ind = index - list.top_ind
	const next_item = list.items[ start_ind ]
	
	let height = 0
	for ( let ind = start_ind; ind < start_ind + size; ind++ )
	{
	    let item = list.newitem_fun( list, ind + list.top_ind )
	    
	    if ( item )
	    {
		item.style.position = "relative"
		item.anim_delta = 0
		
		list.insertBefore(item,next_item)
		list.items.splice(ind ,0,item)

		height += item.getBoundingClientRect().height
	    }
	}

	list.bot_ind += size
	list.repos = true

	// set animation delta for remaining items

	for (let ind = start_ind + size; ind < list.items.length ; ind++ )
	{
	    let item = list.items[ind]
	    item.anim_delta = height
	}
    }
    else if ( index == list.bot_ind + 1 )
    {
	// append items to the end
	
	list.repos = true
	for ( let ind = 0 ; ind < size ; ind++ )
	{
	    list.bot_ind += 1
	    let item = list.newitem_fun( list, list.bot_ind )
	    
	    if ( item )
	    {
		item.style.position = "relative"
		item.anim_delta = 0
		
		list.appendChild(item)
		list.items.push(item)
	    }
	}
    }
    else list.full = false

    zenlist_start_anim(list)
}

zenlist_delete = ( list , index , size ) =>
{
    if ( list.top_ind <= index && index <= list.bot_ind )
    {
	let start_ind = index - list.top_ind
	let height = 0
	
	for ( let ind = 0 ; ind < size ; ind++ )
	{
	    if ( start_ind < list.items.length )
	    {
		// remove actual item
		
		let item = list.items[start_ind]
		height += item.getBoundingClientRect().height
		
		list.removeChild(item)
		list.bot_ind -= 1
		list.full = false
		list.delitem_fun(item)

		list.items.splice(start_ind ,1)
	    }
	}

	// set closing animation for remaining items

	for ( let ind = start_ind; ind < list.items.length; ind++ )
	{
	    let item = list.items[ind]
	    item.anim_delta = -height
	}
    }

    zenlist_start_anim(list)
}

zenlist_update = ( list ) =>
{
    let list_rect = list.getBoundingClientRect() // list rect
    let prel_top = list_rect.top - list.preload_size // preload top
    let prel_bot = list_rect.bottom + list.preload_size // preload bottom

    // check if any item's height is changed in the meantime

    let changed = false
    for ( let item of list.items )
    {
	let rect = item.getBoundingClientRect()
	if ( (item == list.items[0] || list.speed > 0.01 ) && item.old_height < rect.height )
	{
	    list.top_pos -= rect.height - item.old_height
	    item.old_height = rect.height
	    changed = true
	}
    }

    if ( changed ) for ( item of list.items ) item.style.top = Math.round(list.top_pos) + "px"

    let iter = 0 // guard loop against wrong css settings
    
    while ( !list.full && iter++ < 1000 )
    {
	list.full = true
	
	if ( list.items.length == 0 ) // first item
	{
	    let head = list.newitem_fun( list,list.top_ind )

	    if (head)
	    {
		head.style.position = "relative"
		head.style.top = Math.round(list.top_pos) + "px"
		head.anim_delta = 0
		head.list_head = true
		
		list.appendChild(head)
		list.items.push(head)
		list.repos = true
		list.full = false

		head.old_height = head.getBoundingClientRect().height
	    }
	}
	else
	{		
	    let head = list.items[0]
	    let rect = head.getBoundingClientRect()

	    if ( rect.top >= prel_top ) // fill up head
	    {
		let item = list.newitem_fun( list,list.top_ind - 1 )
		
		if ( item )
		{
		    item.style.position = "relative"
		    item.style.top = Math.round(list.top_pos) + "px"
		    item.anim_delta = 0
		    item.list_head = true
		    head.list_head = false
		    
		    list.insertBefore(item,head)
		    list.items.unshift(item)

		    list.top_pos -= item.getBoundingClientRect().height
		    list.top_ind -= 1
		    list.repos = true
		    list.full = false

		    item.old_height = item.getBoundingClientRect().height

		    // apply new top to all items

		    for ( item of list.items ) item.style.top = Math.round( list.top_pos ) + "px"
		}
	    }
	    else if ( rect.bottom < prel_top && list.items.length > 1 ) // remove head
	    {
		list.removeChild( head )
		list.items.shift()
		list.top_pos += rect.height
		list.top_ind += 1
		list.full = false

		list.delitem_fun( head )
		list.items[0].list_head = true
		
		// apply new top to all items

		for ( item of list.items ) item.style.top = Math.round( list.top_pos ) + "px"
	    }

	    let tail = list.items[ list.items.length - 1 ]
	    rect = tail.getBoundingClientRect()

	    if ( rect.bottom <= prel_bot ) // fill up tail
	    {
		let item = list.newitem_fun( list,list.bot_ind + 1 )

		if ( item )
		{
		    item.style.position = "relative"
		    item.style.top = Math.round( list.top_pos ) + "px"
		    item.anim_delta = tail.anim_delta // inherit tail item's delta in case of animation
		    item.list_tail = true
		    tail.list_tail = false
		    
		    list.appendChild( item )
		    list.items.push( item )
		    
		    list.bot_ind += 1
		    list.full = false

		    item.old_height = item.getBoundingClientRect().height
		}
	    }
	    else if ( rect.top > prel_bot && list.items.length > 1 ) // remove tail
	    {
		list.removeChild( tail )
		list.items.pop()
		list.bot_ind -= 1
		list.full = false

		list.items[ list.items.length - 1 ].list_tail = true

		list.delitem_fun( tail )
	    }
	}
    }

    let stop_flag = false
    
    // move

    list.top_pos += list.speed

    if ( list.speed > 0.01 || list.speed < -0.01 )
    {
	list.full = false
	list.repos = true
    }
    else stop_flag = true

    list.speed *= 0.85
    
    if ( list.repos )
    {
	// bounce

	let head = list.items[0]
	let tail = list.items[ list.items.length - 1 ]

	if ( head.list_head )
	{
	    let hrect = head.getBoundingClientRect()
	    if ( hrect.top > list_rect.top ) list.top_pos += ( list_rect.top - hrect.top ) / 5;
	}
	if ( tail.list_tail && list.items.length > 1 )
	{
	    let trect = tail.getBoundingClientRect()
	    if ( trect.bottom < list_rect.bottom ) list.top_pos += ( list_rect.bottom - trect.bottom ) / 5
	}

	// pos all items
	
	for ( let item of list.items )
	{
	    if ( item.anim_delta != 0 )
	    {
		item.anim_delta += -item.anim_delta / 6
		item.style.top = Math.round( list.top_pos ) - item.anim_delta + "px"
		if ( Math.abs( item.anim_delta ) < 0.001 ) item.anim_delta = 0

		stop_flag = false
	    }
	    else
	    {
		item.style.top = Math.round( list.top_pos ) + "px"
		item.old_height = item.getBoundingClientRect().height
	    }
	}
    }

    if ( stop_flag ) zenlist_stop_anim(list)

    list.removeEventListener( 'touchmove', zenlist_touch_move)
    list.addEventListener( 'touchmove', zenlist_touch_move)

}

