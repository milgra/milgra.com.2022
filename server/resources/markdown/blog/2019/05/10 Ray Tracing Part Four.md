#Ray Tracing Part Four
_2019/05/10 3D,C,Coding_

Okay, we have diffuse and specular colors, refraction and reflection but the algorithm is not generic. We need a recursive function that follows the ray throughout its lifetime, splits up the ray into multiple rays in case of refraction and reflection and averages the resulting colors.


```
uint32_t get_ray_color( v3_t s_p , v3_t e_p , rect_t* source_rect , uint32_t* iterations_u)
{
	uint32_t color = bckgrnd_col_u;
	if ( (*iterations_u)++ > 30 ) return color;
	nearest_res_t nearest = get_nearest_rect( s_p , e_p , source_rect );
	if ( nearest.rect != NULL )
	{
		// check for direct connection with light for diffuse color
		nearest_res_t blocker_r = get_nearest_rect( nearest.isect_p , light_p , nearest.rect );
		if ( blocker_r.rect == NULL ) 
		{
			// diffuse color
			color = nearest.rect->col_diff_u;

			// specular color
			// mirror light point on normal vector to get perfect reflection
			v3_t light_mirr_p = point_line_mirror( nearest.isect_p , v3_add( nearest.isect_p , nearest.rect->norm_v ) , light_p );

			v3_t tofocus = v3_sub( s_p , nearest.isect_p );
			v3_t tomirrored = v3_sub( light_mirr_p , nearest.isect_p );

			float angle_f = v3_angle( tomirrored , tofocus );
			// the smaller the angle the closer the mirrored ray and the real ray are - reflection 

			float colorsp_f = ( float ) 0xFF * ( ( M_PI - angle_f ) / M_PI );
			uint32_t colorsp_u = ( uint8_t ) colorsp_f;
			colorsp_u = colorsp_u << 24 | colorsp_u << 16 | colorsp_u << 8 | 0xFF;
			color = color_average( color , colorsp_u );

		}
		else 
		{
			// shadow
			color = color_multiply( nearest.rect->col_diff_u , 1.0 - blocker_r.rect->transparency_f );
		}

		color = color_multiply( color , nearest.rect->transparency_f );
		// if rect is transparent calculate refraction and check for further intersections

		if ( nearest.rect->refraction_f > 1.0 )
		{
			v3_t tofocus = v3_sub( s_p , nearest.isect_p );
			float angle = v3_angle( tofocus , nearest.rect->norm_v );
			float length = v3_length( tofocus );

			// get refraction angle
			// n1 * sin( Theta1 ) = n2 * sin( Theta2 ), n1 is 1 ( vacuum )
			// Theta2 = acos( sin( Theta1 ) / n2 )

			float theta = M_PI_2 - acosf( sinf( angle ) / nearest.rect->refraction_f );
			// rotate tofocus vector in new position

			v3_t cam_to_normal_p = point_line_projection( nearest.isect_p , v3_add( nearest.isect_p , nearest.rect->norm_v ) , s_p );

			v3_t cam_normal_ycomp_v = v3_sub( cam_to_normal_p , s_p );
			v3_t cam_normal_xcomp_v = v3_sub( nearest.isect_p , cam_to_normal_p );
			// get needed x length and y length for theta

			float y_d = sinf( theta ) * length;
			float x_d = cosf( theta ) * length;

			cam_normal_xcomp_v = v3_resize( cam_normal_xcomp_v , x_d );
			cam_normal_ycomp_v = v3_resize( cam_normal_ycomp_v , y_d );

			v3_t newtarget_p = v3_add( cam_normal_xcomp_v , cam_normal_ycomp_v );
			newtarget_p = v3_add( nearest.isect_p , newtarget_p );

			uint32_t refr_color_u = get_ray_color( nearest.isect_p , newtarget_p , nearest.rect , iterations_u );

			if ( refr_color_u != bckgrnd_col_u ) color = color_average( color , refr_color_u );

		}

		// reflect ray on intersection point and check for further intersections
		if ( nearest.rect->reflection_f > 0.0 )
		{

			v3_t light_mirr_p = point_line_mirror( nearest.isect_p , v3_add( nearest.isect_p , nearest.rect->norm_v ) , s_p );

			uint32_t refl_color_u = get_ray_color( nearest.isect_p , light_mirr_p , nearest.rect , iterations_u );

			if ( refl_color_u != bckgrnd_col_u ) color = color_average( color , refl_color_u );

		}
	
	}

	return color;
}
```

As you see not much happened compared to the previous version, I just pulled out the ray handling part from the screen window point iteration loop and created a more generic function from it. To make things more spectacular arrow keys now move the first rectangle instead of the camera so you can see shadows, refraction and reflection better on the second rectangle.

Final result :

![raytrace](/images/blog/2019/05/20190510_raytrace.gif)

Download the code : [raytrace_part_four.c](/downloads/raytrace/raytrace_part_four.c)