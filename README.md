# Gutenberg Block Elements Library
Simple library of classes for simpler block creation
# Dependencies

 - jQuery
 - wp.blocks
 - wp.element
 - wp.editor
 - wp.components
# Installation
Edit file ***common-setup.php*** and make sure to set correct path to the script and style files.
After that just use `require_once(PATH_TO_COMMON-SETUP.PHP);`
inside the method where you register block on the server side. And then just link it to your block script:


    wp_register_script(
            'gutenberg-block-test-script',
    	     get_template_directory_uri() . '/extensions/gutenberg/block.js',
            array('_gutenberg-common-lib')
        );
# Capabilities
 - Input: TEXT 
 - Input: SELECT
 - Input: IMAGE
 - Input: COLOR
 - Custom Image Library (gallery)
 - Custom Links Library

# Important

Use attribute 

    dummy:{
	    type:"string"
    }
on each block for correct work of library, otherwise some changes can stay unsaved!
Example:

    attributes: {
                text:{type:"string"},
                /* here it is*/
                dummy:{type:"string"},
                /* - - - - - - - - - */
                background:{type:"string"},
                imagesssss:{type:"array"},
                linkssssss:{type:"array"},
                bg_color:{type:"string"},
                side:{type:"string"}
    },

# Usage: General
1. Perform the installation ^
2. Define a new variable that will contain an object of library and pass properties object as argument under 'edit' callback: 

>     edit: function(props) 
>           {
>               var _common = new Common(props);
>           }

# Usage: TEXT INPUT
Signature:

    text(name,label_text)

Example:
   

    attributes: {
                text:{type:"string"},
                dummy:{type:"string"}
    },
    ...
    edit: function(props) 
        {
            var _common = new Common(props);
		    return _common.input.text("text","Text:")
	    }

 
@name - "text" - name of variable to store the input value
@label_text(optional, may be ' ') - "text:" - text that will be displayed above the input

Returns REACTJS object with all needed stuff for text input. So, user only needs to enter the text. 
![
](https://i.imgur.com/hMcmOpu.png)
# Usage: SELECT INPUT
Signature:
 

    select(name,label_text,values)

Example:
   

    attributes: {
                dummy:{type:"string"},
                side:{type:"string"}
    },
    ...
    edit: function(props) 
        {
            var _common = new Common(props);
		    return _common.input.select("side","Select side:",["left","right"])
	    }

 
@name - "text" - name of variable to store the input value
@label_text(optional, may be ' ') - "text:" - text that will be displayed above the input
@values - array - specify the options for select input here

Returns REACTJS object with all needed stuff for select input. So, user only needs to select a value. 
![
](https://i.imgur.com/aTworCZ.png)
# Usage: IMAGE INPUT
Signature:
 

    image(name,label_text,callback,return_react,event)

Example:
   

	attributes: {
                dummy:{type:"string"},
                background:{type:"string"}
    },
    ...
     edit: function(props) 
        {
            var _common = new Common(props);
		    return _common.input.image("background")
	    }

 
@name - "text" - name of variable to store the input value
@label_text - "text:" - text that will be displayed above the input
@callback(optional) - function - function that will be executed after image selected, used in Gallery object mostly. Argument to callback is @url - url of selected image.
@return_react(optional) - boolean - defines if we should return reactjs object(html) or just show the media select popup
@event(optional) - event - event passed if we need to show the media modal popup (events like: click, change, etc), so for example it's used if this method is called on click and we need to get the media modal popup.
Example with event & callback:

    /* add_image is called on click */
    add_image(event)
    {
	    ...
	    var com = new Common(this.props);
	    ...
	    var callback = function(url)
        {
	        ...
        }
	    com.input.image("","",callback,false,event);
    }

Returns VOID | REACTJS  object with all needed stuff for image input. So, user only needs to select any image | opens modal window
![
](https://i.imgur.com/imruomt.png)
# Usage: COLOR INPUT
Signature:
 

    color(name,label_text)

Example:
   

    attributes: {
                dummy:{type:"string"},
                bg_color:{type:"string"}
    },
    ...
    edit: function(props) 
        {
            var _common = new Common(props);
	        return _common.input.color("bg_color", "Select color:")
	    }

 
@name - "text" - name of variable to store the input value
@label_text(optional, may be ' ') - "text:" - text that will be displayed above the input

Alpha is supported :)

Returns REACTJS object with all needed stuff for color input. So, user only needs to pick a right color. 
![
](https://i.imgur.com/lM69bRW.png)
# Usage: GALLERY
Signature:
 

    this.gallery = new Gallery(_props);
    init(object_sample,_variable_name)

Example:
   

   

    attributes: {
                dummy:{type:"string"},
                imagesssss:{type:"array"}
    },
    ...
    edit: function(props) 
        {
            var _common = new Common(props);
            return _common.gallery.init(object_sample,"imagesssss")
	    }

    

@object_sample - object - a sample of object that should be used within gallery 
@_variable_name - "text" - name of variable to store the images array

Object example:

        var object_sample = {
			        id:
			        {
			            val:"",
			            caption:"ID"
			        },
			        url:
			        {
			            val:"",
			            caption:"URL"
			        },
			        heading:
			        {
			            val:"",
			            caption:"Heading"
			        }
			    }
Fields like: ***id*** and ***url*** are ***REQUIRED***, the rest are optional, developer can specify any field he needs, but the structure `property:{val:"",caption:""}` has to be saved.
For each custom property user will receive prompt window asking to fill the value when the image is selected:![
](https://i.imgur.com/0w0ImQJ.png)
Returns REACTJS object with all needed stuff for gallery input. So, user only needs to select images 1 by 1 and fill needed fields like heading, sub-line, / whatever specified in the code. 

User will have an ability to move image up/down inside of array, edit all custom properties(actually, any properties different from "url" and "id"), to delete image.
<br>
![
](https://i.imgur.com/1juTtyE.png)
<br>
![
](https://i.imgur.com/P3fBaLj.png)
# Usage: LINKS
Signature:
 

    this.link = new Link(_props);
    init(_variable_name)

Example:
   
	attributes: {
				dummy:{type:"string"}
                linkssssss:{type:"array"}
    },
    ...
    edit: function(props) 
        {
	        var _common = new Common(props);
		    return _common.link.init("linkssssss")
		}

 
@_variable_name - "text" - name of variable to store the links array


Returns REACTJS object with all needed stuff for links input. So, user only needs to enter link ***url*** and ***name***.
Links are filled using prompt popup asking for URL and NAME 1 by 1.
User has an ability to edit the url & name of link and may delete link as well.<br>
![
](https://i.imgur.com/agenRbe.png)
