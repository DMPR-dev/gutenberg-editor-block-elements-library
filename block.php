<?php
namespace GutenbergBlocksLibrary;

class Block
{
	/*
		Validates arguments passed to the function that creates the block(generate_block)

		@param $args - an array of aruments

		@returns WP_ERROR | ARRAY
	*/
	public static function validate_add_block_args(array $args)
	{
		if(!isset($args["BlockName"]) || strlen($args["BlockName"]) == 0)
		{
			return new \WP_ERROR("insuffcient_args",__("BlockName argument was not passed!", "gutenberg-block-elements-library"));
		}
		if(!isset($args["BlockTitle"]) || strlen($args["BlockTitle"]) == 0)
		{
			return new \WP_ERROR("insuffcient_args",__("BlockTitle argument was not passed!", "gutenberg-block-elements-library"));
		}
		if(!isset($args["RenderCallback"]) || strlen($args["RenderCallback"]) == 0)
		{
			return new \WP_ERROR("insuffcient_args",__("RenderCallback argument was not passed!", "gutenberg-block-elements-library"));
		}
		return $args;
	}
	/*
		Creates a block from passed array of arguments

		@param $args - an array of argumnets passed to create the block

		@returns (WP_Block_Type|false) The registered block type on success, or false on failure.
	*/
	public static function generate_block(array $args)
	{
		/*
			Firslty we need to valid the argumnets passed to block
		*/
		$args = self::validate_add_block_args($args);
		if(is_wp_error($args))
		{
			throw new \Exception($args->get_error_message());
		}
		/*
			Declare the variables
		*/
		$BlockName = sanitize_title($args["BlockName"]);

		$RenderCallback = sanitize_text_field($args["RenderCallback"]);

		$CustomScript = null;
		if(isset($args["CustomScript"]) && sizeof($args["CustomScript"]))
		{
			$CustomScript = $args["CustomScript"];
		}

		$CustomStyle = null;
		if(isset($args["CustomStyle"]) && sizeof($args["CustomStyle"]))
		{
			$CustomStyle = $args["CustomStyle"];
		}
		$CustomEditorScript = null;
		if(isset($args["CustomEditorScript"]) && sizeof($args["CustomEditorScript"]))
		{
			$CustomEditorScript = $args["CustomEditorScript"];
		}

		$CustomEditorStyle = null;
		if(isset($args["CustomEditorStyle"]) && sizeof($args["CustomEditorStyle"]))
		{
			$CustomEditorStyle = $args["CustomEditorStyle"];
		}

		$Refresh = isset($args["Refresh"]) ? filter_var($args["Refresh"],FILTER_VALIDATE_BOOLEAN) : true; 
		/*
			Generate script for block
		*/
		if($Refresh)
		{
			self::create_script($args);
		}
		/*
			Add Our Common Block Lib - JS Elements
		*/
		Library::enqueue_js_library();

		wp_register_script($BlockName . '-editor-script', Functions::get_blocks_url($BlockName) . 'end-script.js',array('_gutenberg-common-lib'));

		wp_localize_script($BlockName . '-editor-script','block_translations', array(
			"configured_on_sidebar" => __( "Block is configured on settings sidebar >>" , "gutenberg-block-elements-library")
		));
		/*
			Preapre styles & scripts
		*/
		$basic_script = array($BlockName . '-editor-script');
		if(is_array($CustomEditorScript))
		{
			$basic_script = array_merge($basic_script,$CustomEditorScript);
		}
		$basic_style = array('_gutenberg-common-style');
		if(is_array($CustomEditorStyle))
		{
			$basic_style = array_merge($basic_style,$CustomEditorStyle);
		}
		/*
			Register Block - php side
		*/
		return register_block_type( (strtolower("GutenbergBlocksLibrary/".($BlockName))), array(
	        'editor_script' => $basic_script,
	        'editor_style' => $basic_style,
	        'style' => ($CustomStyle),
	        'script' => ($CustomScript),
	        'render_callback' => $RenderCallback
	    ));
	}
	/*
		Creates a folder to store block's javascript file

		@param $args - an array of block arguments

		@returns BOOLEAN | Throws exception
	*/
	public static function create_folder(array $args)
	{
		/*
			Declare the variables
		*/
		$BlockName = $args["BlockName"];
		if(!file_exists(Functions::get_blocks_path($BlockName)))
		{
			/*
				Create a folder for block
			*/
			$FolderHandle = mkdir(Functions::get_blocks_path($BlockName),0777,true);
			if($FolderHandle === FALSE)
			{
				throw new \Exception(__("Can not create a folder for block! Please set read-write priviledges to 0777!", "gutenberg-block-elements-library"));
			}
		}
		return true;
	}
	/*
		Creates a folder by create_folder function call and creates a js file of block

		@param $args - an array of block arguments

		@returns VOID
	*/
	public static function create_script(array $args)
	{
		/* 
			Create Folder for block
		*/
		self::create_folder($args);

		/*
			Generate script file
		*/
		self::generate_script($args);

	}
	/*
		Generates script file from array of argumnets passed to block

		@param $args - an array of arguments passed to block

		@returns BOOLEAN
	*/
	public static function generate_script(array $args)
	{
		/*
			Get basic script text
		*/
		$script_text = file_get_contents(plugin_dir_path(__FILE__)."script-template.js");
		/*
			Declare variables
		*/
		$icon = (isset($args["Icon"]) && strlen($args["Icon"]) > 0) ? $args["Icon"] : 'video-alt3';

		$category = (isset($args["Category"]) && strlen($args["Category"]) > 0) ? $args["Category"] : 'widgets';
	
		$attributes = self::generate_attributes($args);
		$settings = self::generate_settings($args);
		$settings_groups = self::generate_settings_groups($args);

		/*
			Replace variables with values in original text
		*/
		$search_arr = array(
			"%BLOCKNAME%",
			"%BLOCKTITLE%",
			"%ATTRIBUTES%",
			"%SETTINGS%",
			"%ICON%",
			"%CATEGORY%",
			"%SETTINGS_GROUPS%"
		);
		$replace_arr = array(
			strtolower("GutenbergBlocksLibrary/".$args["BlockName"]),
			$args["BlockTitle"],
			$attributes,
			$settings,
			$icon,
			$category,
			$settings_groups
		);

		$script_text = str_replace($search_arr,$replace_arr,$script_text);
		/*
			Write to js file
		*/
		return self::write_to_file(Functions::get_blocks_path($args["BlockName"]) . 'end-script.js',$script_text);
	}
	/*
		Generates JSON-like string of block attributes/settings (passed by offset)

		@param $args - an array of argumnets passed to block

		@param $offset - a name of field which should be processe, coul be Attributes or Settings

		@returms STRING
	*/
	public static function generate_attributes(array $args,$offset = "Attributes",$int_offset = -1)
	{
		$result = "";
		/*
			Return empty json array if there are no Attributes/Settings passed to block
		*/
		if(!isset($args[$offset]))
		{
			return "{}";
		}
		$attributes = $args[$offset];
		$settings_container = "";
		if(is_array($attributes) && sizeof($attributes) > 0)
		{
			if(strtoupper($offset) == strtoupper("Settings") && isset($attributes["Groups"]) && isset($attributes["Groups"][$int_offset]))
			{
				$settings_container = $attributes["Groups"][$int_offset]["ID"];
				$attributes = $attributes["Groups"][$int_offset]["Params"];
			}
			else if(isset($attributes["Groups"]))
			{
				throw new \Exception(__("Invalid settings group passed", "gutenberg-block-elements-library"));
			}
			foreach($attributes as $attr)
			{
				/*
					Assign values to 'label' and 'default' variables, that will be passed as properties of json object
				*/
				$label = "";
				if(isset($attr["label"]))
				{
					$label = $attr["label"];
				}
				$default = "";
				if(isset($attr["default"]))
				{
					$default = "default:'".$attr["default"]."',";
				}

				/*
					Collect the type, enement name and list object scheme 
				*/
				$determined_type_and_element = self::determine_type_and_element($attr);
				$type = $determined_type_and_element["type"];
				$element = $determined_type_and_element["element"];
				$list_attributes = $determined_type_and_element["list_attributes"];
				/*
					Generate output json object
				*/
				$result .= $attr["name"].":{type:\"".$type."\",gbl_elem:\"".$element."\",gbl_label:\"".$label."\",
				list:".$list_attributes.",gbl_name:\"".$attr["name"]."\",".$default."settings_container:\"".$settings_container."\"},"."\n";
			}
		}
		return $result;
	}
	/*
		Generates json-like object of settings

		@param $args - an array of arguments passed to block

		@returns STRING
	*/
	public static function generate_settings(array $args)
	{
		$result = "";
		if(isset($args["Settings"]) 
		&& isset($args["Settings"]["Groups"]) 
		&& is_array($args["Settings"]["Groups"])
		&& sizeof($args["Settings"]["Groups"]) > 0)
		{
			$groups = $args["Settings"]["Groups"];
			$i = 0;
			foreach($groups as $group)
			{
				$result .= self::generate_attributes($args,"Settings",$i);
				$i++;
			}
		}
		return $result;
	}
	/*
		Generates json-like object of settings groups that will become panels in Gutenberg editor

		@param $args - an array of arguments passed to block

		@returns STRING
	*/
	public static function generate_settings_groups(array $args)
	{
		$groups = null;
		$result = "{}";

		if(isset($args["Settings"]["Groups"])
		&& is_array($args["Settings"]["Groups"])
		&& sizeof($args["Settings"]["Groups"]) > 0
		&& isset($args["Settings"]["Groups"][0]["Params"]))
		{
			$groups = $args["Settings"]["Groups"];
		}
		else if(isset($args["Settings"]) && isset($args["Groups"]))
		{
			throw new \Exception(__("Invalid settings group passed", "gutenberg-block-elements-library"));
		}

		if(is_array($groups) && sizeof($groups) > 0)
		{
			$result = "";
			$index = 0;
			foreach($groups as $settings_group)
			{
				$result .= "{ID:\"".$settings_group["ID"]."\",Name:\"".$settings_group["Name"]."\"}";
				if(is_array($groups) && $index < sizeof($groups)-1)
				{
					$result.=",";
				}
			}
		}
		return $result;
	}
	/*
		Writes given text to given path

		@param @filepath - the path of final file to write to

		@param @text - the text that has to be written to file

		@returns BOOLEAN
	*/
	public static function write_to_file($filepath,$text)
	{
		$file = fopen($filepath, "w") or die(__("Unable to open file", "gutenberg-block-elements-library").": ".$filepath);
		fwrite($file, $text);
		fclose($file);
		return true;
	}
	/*
		Determines type and element that need to be passed to JavasScript using switch statement

		@param $attr - an array of attributes/settings passed to block

		@returns ARRAY
	*/
	public static function determine_type_and_element(array $attr)
	{
		/*
			Declare variables and assign default values
		*/
		$type = "";
		if(isset($attr["type"]))
		{
			$type = strtolower($attr["type"]);
		}
		$final_type = "string";
		$element = "";
		$list_attr = array();
		$items = array();
		$list_attributes = self::process_list_array(array());

		if(isset($attr["list_attributes"]) && is_array($attr["list_attributes"]))
		{
			$list_attr = $attr["list_attributes"];
		}
		if(isset($attr["items"]) && is_array($attr["items"]))
		{
			$items = $attr["items"];
		}
		/*
			Collect type & element name & other properties
		*/
		/*
			Default elements with out additional params
		*/
		$element = $type;
		/*
			Special cases with additional params
		*/
		switch ($type) {
			case 'gallery':
				$final_type = "array";
				$list_attributes = self::process_list_array($list_attr);
				break;
			case 'checkbox':
				$final_type = "boolean";
				break;
			case 'select':
				$list_attributes = json_encode($items);
				break;
			case 'innerblocks':
				$list_attributes = json_encode($items);
				break;
			case 'list':
				$final_type = "array";
				$list_attributes = self::process_list_array($list_attr);
				break;
			case 'radiogroup':
				$list_attributes = self::process_list_array($list_attr);
				break;

			default:
				# code...
				break;
		}
		return array("type" => $final_type, "element" => $element, "list_attributes" => $list_attributes);
	}
	/*
		Converts an array of list object fields to stringified json object

		@param $list_attr - an array of list object fields that will be used in block

		@returns STRING
	*/
	public static function process_list_array($list_attr)
	{
		$list_attributes = array(); 
		/*
			Convert input array to needed view to process it
		*/
		foreach($list_attr as $attribute)
		{
			$list_attributes_local = array();
			$list_attributes_local["caption"] = strtoupper($attribute["caption"]);
			$list_attributes_local["val"] = $attribute["value"];
			$list_attributes_local = (object)$list_attributes_local;
			$key = str_replace('-','',sanitize_title(strtolower($attribute["caption"])));

			$list_attributes[$key] = $list_attributes_local;
		}
		$list = $list_attributes;
		if(is_array($list))
		{
			$result = "{";
			$index = 0;
			foreach($list as $key => $value)
			{
				$result .= $key.":{";
				$sub_index = 0;
				if(is_object($value))
				{
					$value = (array)$value;
				}
				if(is_array($value))
				{
					foreach($value as $subkey => $subvalue)
					{
						$result.= $subkey.":\"".$subvalue."\"";
						if($sub_index < sizeof($value))
						{
							$result .= ',';
						}
						$sub_index++;
					}
				}
				$result .= "}";
				$index++;
				if($index < sizeof($list))
				{
					$result .= ',';
				}
			}
			$result .= "}";
			return $result;
		}
		return "{}";
	}
}
