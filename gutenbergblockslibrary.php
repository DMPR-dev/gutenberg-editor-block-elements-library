<?php
/*
Plugin Name: Gutenberg Editor Block Elements Library
Description: Provides intstruments for easier blocks creation
Version:     0.0.1
Author:      Dmytro Proskurin
 *
 */

namespace GutenbergBlocksLibrary;
require_once plugin_dir_path(__FILE__) ."functions.php";
require_once plugin_dir_path(__FILE__) ."block.php";
class Library
{
	public function __construct()
	{

	}
	/*
		Creates a block from passed arguments

		@param $args - an array of arguments passed to block

		@returns VOID
	*/
	public function add_block(array $args)
	{
		Block::generate_block($args);
	}
	/*
		Creates a filter to add a category based on provided variables

		@param $title (string) - a title of category to be created

		@param $slug (string) - a slug of category to be created

		@param (optional) (string | array) $post_type - a post_type name to add category to

		@returns VOID
	*/
	public function add_category($title,$slug,$post_type = '')
	{
		add_filter( 'block_categories', function($categories,$post) use ($title,$slug,$post_type)
		{
			if((is_string($post_type) && strlen($post_type) > 0) && $post_type != $post->post_type
			|| (is_array($post_type) && sizeof($post_type) > 0) && !in_array($post->post_type, $post_type))
			{
				return $categories;
			} 
			$result = array_merge(
				$categories,
				array(
					array(
						'slug' => $slug,
						'title' => $title,
					),
				)
			);
			return $result;
		},10,2);
	}
	/*
		Allows programmer to use the javascript version of library with manual elements creation

		@returns VOID
	*/
	public function enqueue_js_library()
	{
		require_once(plugin_dir_path(__FILE__) . '/gutenberg/common-setup.php');
	}
}
