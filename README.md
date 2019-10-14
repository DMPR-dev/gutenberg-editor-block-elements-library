# Gutenberg Block Library
A plugin that provides methods for easier block creation

# Main Functions
 - <a href="#add-block-add_block">Add Block (add_block) </a>
 - <a href="#add-category-add_category">Add Category (add_category) </a>
 - <a href="#enqueue-js-library-enqueue_js_library"> Enqueue JS library (enqueue_js_library) </a>

# Examples
 - Here you can have a look on the block created using this library: <a href="/example.php">Example of slider block</a>
 - Here you can have a look on the block created using JS version of this library(i.e using function enqueue_js_library): <a href="/example-custom.js">Example of custom block</a>

# Add Block (add_block)
Signature:
```
$library->add_block($args);
```
$args - an array of arguments passed to block

 - BlockName (required)(string) - the name of block to be used to identify the block, should have slug-like format, i.e with should not contain whitespaces and so on.
 - BlockTitle (required)(string) - the title of block to be used to identify the block in editor.
 - RenderCallback (required)(string|function name) - a name of function that will render the block, this function should return the content
 - Attributes (optional)(array) - an array of arrays that will contain the attributes of block that will be rendered on block editor
 Example:
```
array(
	"label" => "Title",
	"name" => "title",
	"type" => "text",
	"default" => "default value"
)
```
@label - the label displayed above the input field
@name - the name of variable to store the value of input
@default  - the default value applied to input / variable
@type - the type of input. Currently available:
* - text - default text field (wp rich text)
* - text_plain - default text field (simple input type text)
* - colorpicker - default color iris color input
* - image - default image input
* - datetime - default datetime input
* - checkbox - default checkbox input
* - fontsizepicker - default wp font size picker tool
* - aligntool - drfault wp align tool
* - gallery - an array of images that can have additional fields. Additional param @list_attributes (required)(array) is passed,an array that will be converted into image object, MUST contain fields: ID,URL. Rest fields are optional. Example: 
```
"list_attributes" => array(
	array(
		"caption" => "id", // required
		"value" => ""
	),
	array(
		"caption" => "url", // required
		"value" => ""
	)
)
```
* - list - an array of objects that can have custom fields. Additional param @list_attributes (required)(array) is passed,an array that will be converted into list item object, MUST contain field: ID. Rest fields are optional. Example: 
```
"list_attributes" => array(
	array(
		"caption" => "id", // required
		"value" => ""
	),
	array(
		"caption" => "heading",
		"value" => ""
	)
)
```
* - innerblocks - inner blocks input that allows you to put other blocks inside of your block, additional param @items (optional)(array) is passed,an array of allowed blocks that can be put into your block. Example:
```
"items" => array(
	"core/paragrph"
)
```
* - select - default select input , additional param @items (required)(array) is passed,an array of items present on select field. Example:
```
"items" => array(
 	"1 (33%)","2 (50%)","3 (66%)","4 (83%)","5 (100%)"
)
```
* - radiogroup - an array of values that can be selected. Additional param @list_attributes (required)(array) is passed,an array that will be converted into object that will contain values and labels for each radio button. Example: 
```
"list_attributes" => array(
	array(
		"value" => "test1",
		"caption" => "Test 1"
	),
	array(
		"value" => "test2",
		"caption" => "Test 2"
	)
)
```
- Settings (optional)(array) - an array of settings that is passed as array of groups, each group MUST have fields: "Name", "ID" and "Params". 
@Params are passed just like ATTRIBUTES. An example:
```
"Settings" => array(
	"Groups" => array(
			array(
				"Name" => "Image Settings",
				"ID" => "image_settings",
				"Params" => array(
					array(
						"label" => __("Image"), 
						"name" => "image",
						"type" => "image"
					)
				)
			),
			array(
				"Name" => "Color Preset Settings",
				"ID" => "preset_settings",
				"Params" => array(
					array(
						"label" => "Color Preset",
						"name" => "preset_color",
						"type" => "select",
						"default" => "Brown",
						"items" => array("Light brown", "Brown")
					)
				)
			)
		)
),
```
An example of result (not related to code above):

![enter image description here](https://i.imgur.com/rImh8oH.png)
 - CustomStyle (optional)(string | array) - the name(s) of custom block style that is registered before block creation, will be included while block gets rendered on site front-end
 - CustomScript (optional)(string | array) - the name(s) of custom block script that is registered before block creation, will be executed while block gets rendered on site front-end
 - CustomEditorStyle (optional)(string | array) - the name(s) of custom block style that is registered before block creation, will be included while block gets rendered on the editor
 - CustomEditorScript (optional)(string | array) - the name(s) of custom block script that is registered before block creation, will be executed while block gets rendered on the editor
 - Refresh (optional)(boolean) - defines if block's JS must be refreshed or no. Should be FALSE when block development is stopped. Also can be used to customize block's Javascript part. (<span style="color:red">IMPORTANT</span>: Your theme folder(alongside with wordpress installation folder must have 0777 rules, otherwise plugin will be unable to create JS file for block.))


# Add Category (add_category)
Signature:
```
$library->add_category($title,$slug,$post_type);
```
- $title - (required)(string) a title that will be used for new block category
- $slug - (required)(string) a slug that will be used to identify the new block category
- $post_type (optional)(string | array) an array of strings or string to add block category to (for example: page - block category will only be available for post type - page)

# Enqueue JS library (enqueue_js_library)
Signature:
```
GutenbergBlocksLibrary\Library::enqueue_js_library();
```
- Allows programmer to use the javascript version of library with manual elements creation
- More details: <a href="/README.OLD.md">Readme.OLD</a>

Usage example:
```
Library::enqueue_js_library();
wp_register_script('block-editor-script', 'end-script.js',array('_gutenberg-common-lib')); // here we specify the edditional JS script by itsname
register_block_type( (strtolower("GutenbergBlocksLibrary/".($BlockName))), array(
    'editor_script' => 'block-editor-script',
    'editor_style' => array('_gutenberg-common-style'), // here we provide CSS for library
));
```

