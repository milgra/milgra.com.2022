#Ray Tracing Part Two
_2019/04/24 3D,C,Coding_

Let's create a movable camera first. In the first part we fixed the camera to the z axis and the camera window was lying on the xy plane so it was simple to build up the camera window grid. But if we want to move the focus point or the target point to an arbitrary place in the 3D space we have to build up the camera window grid in the 3D space.
We get the camera window normal by substracting the focus point from the target point. To get the camera window horizontal axis we have to get the cross product of a vector lying on the xy plane ( 0 , 1 , 0 ) and the normal vector.
With that we can get the vertical axis with another cross product. If we have this two vectors we can resize them to the window grid stepping size and we can use them to build up any point on the window grid.

![raytrace](/images/20190424_camera.png)


```
#include <stdio.h>

v3_t camera_focus_p = { 40.0 , 20.0 , 100.0 };
v3_t camera_target_p = { 20.0 , 0.0 , 0.0 };

// camera window normal
v3_t window_normal_v = v3_sub( camera_focus_p , camera_target_p );
// xz plane normal
v3_t xzplane_normal_v = { 0.0 , 1.0 , 0.0 };
// create vector that is on the camera window and parallel with xz plane ( horizontal sreen axis )
v3_t window_haxis_v  = v3_cross( window_normal_v , xzplane_normal_v );
// create vector that is on sceeen plane and perpendicular to scr_nrm vector and prev vector ( vertical axis )
v3_t window_vaxis_v  = v3_cross( window_normal_v , window_haxis_v );
// resize horizontal and vertical screen vector to window step size
v3_t window_stepx_v = v3_resize( window_haxis_v , window_step_size_f );
v3_t window_stepy_v = v3_resize( window_vaxis_v , window_step_size_f );

// create rays going through the camera window quad starting from the top left corner

for ( int row_i = 0 ; row_i < grid_rows_i ; row_i++ )
{

	for ( int col_i = 0 ; col_i < grid_cols_i ; col_i++ )
	{
		
		v3_t window_grid_v = camera_target_p;
		window_grid_v = v3_add( window_grid_v , v3_scale( window_stepx_v , grid_cols_i / 2 - col_i ) );
		window_grid_v = v3_add( window_grid_v , v3_scale( window_stepy_v , - grid_rows_i / 2 + row_i ) );
</code>

Let's draw squares instead of dots to make the result better looking.

<code>
#include <stdio.h>

void framebuffer_drawsquare( int sx , int sy , int size , uint32_t color )
{
	for ( int y = sy ; y < sy + size ; y++  )
	{
		for ( int x = sx ; x < sx + size ; x++ )
		{

			long location = ( x + vinfo.xoffset ) * ( vinfo.bits_per_pixel / 8 ) + 
							( y + vinfo.yoffset ) * finfo.line_length;

			*( ( uint32_t* )( fbp + location ) ) = pixel_color( 
					( color >>24 ) & 0xFF , 
					( color >> 16 ) & 0xFF , 
					( color >> 8 ) & 0xFF, &vinfo );

		}
	}
}
```

Finally let's create a light source and let's create a specularish reflection of the light from the surface. It's quite simple, we will mirror the light ray on the surface normal and check if the resulting vector'angle is close enought to the focus point - intersection point vector's angle.


```
#include <stdio.h>

// set up light

v3_t light_p = { 0.0 , 30.0 , 0.0 };

//

//

v3_t light_proj_p = point_line_projetion( isect_p , v3_add( isect_p , rect_normal_v ) , light_p );
v3_t light_mirr_p = v3_sub( light_proj_p , light_p );

light_mirr_p = v3_scale( light_mirr_p , 2.0 );
light_mirr_p = v3_add( light_p , light_mirr_p );

v3_t tofocus = v3_sub( camera_focus_p , isect_p );
v3_t tomirrored = v3_sub( light_mirr_p , isect_p );

float angle = v3_angle( tomirrored , tofocus );

// the smaller the angle the closer the mirrored ray and the real ray are - reflection 

float colorf = ( float ) 0xFF * ( ( M_PI - angle ) / M_PI );
uint8_t coloru = ( uint8_t ) colorf;
uint32_t color = coloru << 24 | coloru << 16 | coloru << 8 | 0xFF;

framebuffer_drawsquare( screen_grid_x , screen_grid_y , screen_step_size_f , color );

```

Final result :

![raytrace](/images/20190424_raytrace.png)

Download the code : [raytrace_part_two.c](/downloads/raytrace/raytrace_part_two.c)