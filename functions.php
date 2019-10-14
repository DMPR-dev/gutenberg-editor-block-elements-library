<?php

namespace GutenbergBlocksLibrary;

class Functions
{
	/*
		Returns absolute path to folder where blocks' javascript files are stored, or path to folder where given block's javascript file is stored

		@param (optional) $name - the name of block whose folder we need to get

		@returns STRING
	*/
	public static function get_blocks_path($name = "")
	{
		if(strlen($name) > 0)
		{
			$name .= '/';
		}
		return get_template_directory() . '/gutenberg-blocks-js/'.$name;
	}
	/*
		Returns URL to folder where blocks' javascript files are stored, or URL to folder where given block's javascript file is stored

		@param (optional) $name - the name of block whose folder URL we need to get

		@returns STRING
	*/
	public static function get_blocks_url($name = "")
	{
		if(strlen($name) > 0)
		{
			$name .= '/';
		}
		return get_template_directory_uri() . '/gutenberg-blocks-js/'.$name;
	}
}