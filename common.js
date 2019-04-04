/*

Library name: gutenberg-editor-block-library
Library URI: https://github.com/l-1337-l
Description: library for easier gutenberg editor block creation
Version: 1.0.0
Author: Dmytro Proskurin
Author URI: https://github.com/l-1337-l
License: MIT
Text Domain: gutenberg-editor-block-library
*/
/* SIMPLE USAGE 

First step:
Declare all needed attribues, for example text, background, dummy(required), images(required for gallery), links(required for links)
attributes: {
            text:{type:"string"},
            dummy:{type:"string"},
            background:{type:"string"},
            images:{type:"array"},
            links:{type:"array"}
        },

//declare object of library under 'edit' callback
var _common = new Common(props);

// generate all needed stuff for string variable with name 'text'
// also returns needed html code for input
_common.input.generate_text_input("text","Text:");

// generate all needed stuff for string variable with name 'background', that will store image url
// also returns needed html code for input
_common.input.generate_image_input("background","Select Background Image");

// generate all needed stuff for string image gallery
// @object_sample - copy of object example that will be used as image
// may contain any text properties linked to image, like caption, heading, etc.
// required fields: url,id
// example of object: 
var object_sample = {
    id:{
        val:"",
        caption:"ID"
    },
    url:{
        val:"",
        caption:"URL"
    },
    heading:{
        val:"",
        caption:"Heading"
    }
}
_common.gallery.init(object_sample)
*/
class Common
{
    constructor(_props)
    {
        this.input = new Input(_props);
        this.gallery = new Gallery(_props);
        this.link = new Link(_props);
    }
    // sets random dummy, needed for updating of block on editor
    static set_dummy(_props)
    {
        var random_dummy = Math.random().toString(10);
        if(random_dummy != _props.attributes.dummy)
        {
            _props.setAttributes({dummy:random_dummy});
        }
        else
        {
            set_dummy(_props);
        }
    }
}
class Input
{
    constructor(_props)
    {
        if(wp != undefined)
        {
            this.props = _props;
            this.text_box = wp.editor.RichText;
            this.el = wp.element.createElement;
        }
        else
        {
            alert("Unalbe to initialize input object because wp is undefined!");
            return undefined;
        }
    }
    /*
     *
     * Generates all needed stuff for simple text input
     *
     * @name - STRING - name of attribute that will be associated with input value
     *
     * @label_text - STRING - text that will be displayed on the label under input
     *
     * @return reactjs object
     *
     */
    generate_text_input(name,label_text)
    {
        var me = this;
        var update_attr = function(_value)
        {
            me.props.attributes[name] = _value;
            Common.set_dummy(me.props);
        }
        return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el(this.text_box,{ 
                                placeholder:label_text.replace(":",""),
                                style:{border:"1px solid silver",borderRadius:"5px",padding:"2%"},
                                name:name,onChange:update_attr,value:this.props.attributes[name]
                            })
            ]);
    }
    /*
     *
     * Generates wp media modal window
     *
     * @return WP.MEDIA object
     *
     */
    generate_wp_media_modal()
    {
        return wp.media.frames.customHeader = wp.media({
            //Title of media manager frame
            title: "Select image",
            library: {
               type: 'image'
            },
            button: {
               //Button text
               text: "Insert image"
            },
            //Do not allow multiple files
            multiple: false
          });
    }
    /*
     *
     * Generates all needed stuff for simple image input, including image preview, 'add image' button
     *
     * @name - STRING - name of attribute that will be associated with input value
     *
     * @label_text - STRING - text that will be displayed on the label under input
     *
     * @callback - FUNCTION - simple callback that will be executed when image is selected(can be object property setup process?)
     *
     * @return_react - BOOLEAN - if function should return reactjs object or execute handle callback(stored in function)
     *
     * @event - EVENT - event that has been triggered(click,change,etc), default undefined
     *
     * @return reactjs object | VOID
     *
     */
    generate_image_input(name,label_text,callback,return_react,event)
    {
        if(return_react == undefined) {return_react=true;}
        if(label_text == undefined) {label_text="";}

        var me = this;
        var handle_image_change = function (event) 
        {
            me.current_object_container = jQuery(event.target);
            // Create WP media frame.
            var custom_file_frame = me.generate_wp_media_modal();
            // bind select event so we can pick the object of selected attachment and get its url
            custom_file_frame.on('select', function () 
            {
              var attachment = custom_file_frame.state().get('selection').first().toJSON();
              if (me.current_object_container != undefined) 
              {
                // get parent container (from clicked button) so we can access its children
                var obj = jQuery(me.current_object_container).parent();
                // set image src
                obj.children("img").attr("src", attachment.url);
                if(callback != undefined)
                {
                    callback(attachment.url);
                }
                else
                {
                    me.props.attributes[name] = attachment.url;
                    Common.set_dummy(me.props);
                }
              }

            });
            // open wordpress media modal window
            custom_file_frame.open();
        };
        if(return_react)
        {
            return this.el('div',{},
                    [
                        this.el('label',{},label_text),
                        this.el('div',{style:{width:"100%"}},
                        [
                             this.el('img',{style:
                                {
                                    width:"100%"
                                }, 
                                src:this.props.attributes[name]
                            })
                        ]),
                        this.el('button',{
                            className:"custom-block-button components-button editor-post-preview is-button is-default is-large",
                            onClick:handle_image_change, 
                            name:name+"-selector-btn"
                        },"Select Image")
                    ])
        }
        else
        {
            if(event != undefined)
            {
                handle_image_change(event);
            }
        }
    }
}
class Gallery
{
    constructor(_props,object_sample)
    {
        if(wp != undefined)
        {
            if(object_sample == undefined){object_sample={};}

            this.props = _props;
            this.el = wp.element.createElement;
            this.image_object_sample = object_sample;
        }
        else
        {
            alert("Unalbe to initialize gallery object because wp is undefined!");
            return undefined;
        }
    }
    /*
     *
     * Initializes the gallery 
     *
     * @object_sample - OBJECT - example of object with properties that should be used with the gallery
     *
     * @return array of reactjs objects
     *
     */
    init(object_sample)
    {
        if(object_sample == undefined){object_sample={};}
        this.image_object_sample = object_sample;

        return [this.display_images_backend(),this.add_image_btn()]
    }
    /*
     *
     * Shows the given object properties
     *
     * @object_sample - OBJECT - object whose properties should be displayed
     *
     * @return array of reactjs objects
     *
     */
    display_object_properties(image_object)
    {
        var elements = [];
        if(image_object != undefined)
        {
            var values = Object.values(image_object);
            var keys = Object.keys(image_object);
            for (var i =0; i<values.length;i++) 
            {
                if(keys[i].toUpperCase() != 'id'.toUpperCase() && keys[i].toUpperCase() != 'url'.toUpperCase())
                {
                    if(values[i] != undefined && values[i].val != undefined && values[i].val.length < 64 &&
                        (!values[i].val.includes("http://" || !values[i].val.includes("https://"))))
                    {
                        var elem = this.el('h3',{className:"heading-title-preview"},values[i].caption + " : " + values[i].val);
                        elements.push(elem);
                    }
                }
            }
        }
        return elements;
    }
    /*
     *
     * Spawns reactjs object that will be shown on the block inspector, contains images & their headings,
     * and utils for editing image objects, moving them up and down inside of array of image objects
     *
     * @return REACTJS object
     *
     */
    display_images_backend()
    {
        // objects will be pushed here
        var elements = [];
        // verify that images is valid array
        if(this.props.attributes.images == undefined)
        {
            this.props.attributes.images = [];
        }

        var me = this;

        // get images
        var images = this.props.attributes.images;
        // loop through the objects and fill object array with reactjs objects (html)
        for(var i = 0; i<images.length; i++)
        {
            var object = this.el('div',{className:"image-object-container"},
                [
                    this.el('div',{className:"image-img-container"},
                    [
                        // main image
                        this.el('img',{src:images[i].url.val,style:{width:"100%"}}),
                        // 'move up' button
                        this.spawn_move_button(images,i),
                        // displays the id of image (as the property of object)
                        this.el('div',{className:"image-img-id-showcase"},"ID:" + images[i].id.val),
                        // button that lets user edit the object of image(changed headings/link)
                        this.el('div',{className:"image-img-edit-heading", onClick:
                        function()
                        {
                            me.edit(jQuery(event.target).attr("image_id"))
                        },image_id:images[i].id.val},
                            [
                            this.el('span',{className:"dashicons dashicons-admin-tools"}),
                            " Edit"
                            ])
                    ]),

                    this.display_object_properties(images[i]),
                    // spawns 'delete image' button
                    this.add_image_btn(i,true)
                ]);
            // fill array with objects
            elements.push(object);
        }
        // return reactjs object with sub-elements that has just been generated
        return this.el('div',{},[elements]);
    }
    /*
     *
     * Adds image to the gallery 
     *
     * @event - event - event that is triggered(click,change,etc...)
     *
     * @return array of reactjs objects
     *
     */
    add_image(event)
    {
        var com = new Common(this.props);
        var me = this;
        if(this.props.attributes.images == undefined)
        {
            this.props.attributes.images = [];
        }
        var callback = function(url)
        {
            if(me.image_object_sample != undefined)
            {
                var values = Object.values(me.image_object_sample);
                var keys = Object.keys(me.image_object_sample);
                var new_object = JSON.parse(JSON.stringify(me.image_object_sample));
                new_object.url.val = url;
                if(values != undefined && keys != undefined && keys.length == values.length)
                {
                    for (var i =0; i<values.length;i++) 
                    {
                        if(keys[i].toUpperCase() != 'id'.toUpperCase() && keys[i].toUpperCase() != 'url'.toUpperCase())
                        {
                            if(values[i] != undefined && values[i].val != undefined && values[i].val.length < 64 &&
                                (!values[i].val.includes("http://" || !values[i].val.includes("https://"))))
                            {
                                var _prompt = prompt("Enter " + values[i].caption,values[i].val);
                                new_object[keys[i]].val = _prompt;
                            }
                        }
                    }
                    if(me.props.attributes.images.length > 0)
                    {
                        // if there are objects, then pick id of length of array
                        new_object.id.val =  me.props.attributes.images.length-1;
                        // and iterate id until there are no object with such id
                        while(me.find_image_by_id(new_object.id.val) != undefined)
                        {
                            new_object.id.val++;
                        }
                    }
                    else
                    {
                        // if array is empty, then just pick index 0
                        new_object.id.val = 0;
                    }
                    me.props.attributes.images.push(new_object);
                    Common.set_dummy(me.props);
                }

            }
            else
            {
                alert("Unalbe to add image to gallery because image object sample is not set!");
            }
        }
        com.input.generate_image_input("","",callback,false,event);
    }
    /*
     *
     * Spawns button that can: add new image, delete image object completely, set background image
     *
     * @return REACTJS object
     *
     */
    add_image_btn(_index,_delete)
    {
        // assign default values to variables if they're not set
        if(_index == undefined) {_index = -1}
        if(_delete == undefined) {_delete = false}

        var me = this;

        // spawns 'Add image' button, that lets user add new image(and headings) to the gallery 
        if(_index == -1 && !_delete)
        {
            return this.el('div',{},
                [
                    this.el('button',{onClick:function(event)
                        {
                            me.add_image(event);
                        },className:"custom-block-button components-button editor-post-preview is-button is-default is-large"},"Add Image")
                ]);
        }
        //spawns 'delete image' button, that lets user delete selected image(image id is stored as linked to 'onClick'
        //event method)  
        else if(_index != -1 && _delete)
        {
            return this.el('div',{},
                [
                    this.el('button',{onClick:
                        function()
                        {
                           me.delete_image(me.props.attributes.images[_index].id.val)
                    },className:"custom-block-button components-button editor-post-preview is-button is-default is-large"},"Delete Image")
                ]);
        }
    }
    /*
     *
     * Searches for needed object by its id in array of images (accessible via properties of block)
     *
     * @return IMAGE OBJECT (that is stored in array of images)
     *
     */
    find_image_by_id(image_id)
    {
        // check if image_id is set
        if(image_id != undefined)
        {
            var images = this.props.attributes.images;
            if(images != undefined)
            {
                var needed_object = undefined;
                 // find needed object by its id in array
                for(var i = 0; i<images.length; i++)
                {
                    if(images[i].id.val == image_id)
                    {
                        if(typeof images[i] == 'object')
                        {
                            // if needed object is found, then just exit loop and return it
                            needed_object = images[i];
                            break;
                        }
                    }
                }
                return needed_object;
            }
        }
        return undefined;
    }
    /*
     *
     * Spawns 'up' and 'down' buttons that let user move image up and down inside of array(change the position of image)
     *
     * @return ARRAY OF REACTJS objects
     *
     */
    spawn_move_button(images,_index)
    {
        var buttons = [];
        var me = this;
        if(images[_index] != undefined)
        {
            // verify that current index is not the first and add 'up' button
            if(_index != 0)
            {
                var _button = this.el('div',{className:"image-img-go-up-button",onClick:function()
                {
                    me.move_image(jQuery(event.target).attr("image_id"),-1);
                }, image_id:images[_index].id.val},"UP");

                buttons.push(_button);
            }
            // verify that current index is not the last and add 'down' button
            if(_index < images.length - 1)
            {
                var button = this.el('div',{className:"image-img-go-down-button",onClick:function()
                {
                    me.move_image(jQuery(event.target).attr("image_id"),1);
                },image_id:images[_index].id.val},"DOWN");

                buttons.push(button);
            }
        }
        return buttons;
    }
    /*
     *
     * Allows user to move image up and down inside of array(change the position of image)
     * 1 method execution = 1 position
     *
     * @return VOID
     *
     */
    move_image (image_id, position)
    {
        // validate position ,so image will only be moved on 1 step
        if(position == 1 || position == -1)
        {
            // access images array, store it in temp variable to modify
            var images = this.props.attributes.images;
            // find needed image that will be moved by given id
            var needed_object = this.find_image_by_id(image_id);
            if(needed_object != undefined)
            {
                // if such image 100% exists in array, then move it
                var index = images.indexOf(needed_object);
                if (index > -1) 
                {
                    // check if needed index exists(so, we will not move the image if it's the first or the last in array)
                    if(images[index+position] != undefined)
                    {
                        // move objects inside of array
                        var temp_object = images[index+position];
                        images[index+position] = needed_object;
                        images[index] = temp_object;

                        this.props.setAttributes({images:images});
                        Common.set_dummy(this.props);
                    }
                }
            }
        }
    }
    /*
     *
     * Allows user to edit properties of image object(by given id), properties like: headings, url
     *
     * @return VOID
     *
     */
    edit(image_id)
    {
        // store array of images in temp variable
        var images = this.props.attributes.images;
        // find needed object by id
        var needed_object = this.find_image_by_id(image_id);
       
        if(needed_object != undefined)
        {
            // verify that needed object exists in array
            var index = images.indexOf(needed_object);
            if (index > -1) 
            {
                // edit object properties
                var values = Object.values(images[index]);
                var keys = Object.keys(images[index])
                if(values != undefined && keys != undefined && keys.length == values.length)
                {
                    for (var i = 0; i<values.length;i++) 
                    {
                        if(values[i].caption.toUpperCase() != "url".toUpperCase() &&
                            values[i].caption.toUpperCase() != "id".toUpperCase())
                        {
                            var _prompt = prompt("Enter " + values[i].caption + ":",values[i].val);
                            images[index][keys[i]].val = _prompt;
                        }
                    }
                    
                    this.props.setAttributes({images:images});
                    Common.set_dummy(this.props);
                }
            }
        }
    }
    /*
     *
     * Allows user to delete the image object from array
     *
     * @return VOID
     *
     */
    delete_image (image_id)
    {
        // store images array in temp variable
        var images = this.props.attributes.images;
        // fined needed object by id
        var needed_object = this.find_image_by_id(image_id);
        
        if(needed_object != undefined)
        {
            // verify that needed object exists in array and pick its index
            var index = images.indexOf(needed_object);
            if (index > -1) 
            {
                // confirm that user is sure about image deletion
                if(confirm("Are you sure that you want to delete image ID: " + image_id + "?"))
                {
                    // delete image from array
                    images.splice(index, 1);
                    // save edited array to block properties
                    this.props.setAttributes({images:images});
                    Common.set_dummy(this.props);
                }
            }
        }
    }
}
class Link
{
    constructor(_props)
    {
        if(wp != undefined)
        {
            this.props = _props;
            this.text_box = wp.editor.RichText;
            this.el = wp.element.createElement;
        }
        else
        {
            alert("Unalbe to initialize link object because wp is undefined!");
            return undefined;
        }
    }
    /*
     *
     * Searches for needed object by its id in array of links (accessible via properties of block)
     *
     * @url - string with link url
     *
     * @return_index - boolean - an option to return needed object index, not object reference itself
     *
     * @return LINK OBJECT (that is stored in array of links)
     *
     */
    find_needed_link(url,return_index)
    {
        if(return_index == undefined){return_index = false}
        // verify that links array is not undefined
        if(this.props.attributes.links != undefined)
        {
            // loop through the link array
            for(var i = 0; i<this.props.attributes.links.length; i++)
            {
                // find needed object by 'url' property
                // and return it or its index
                if(this.props.attributes.links[i].url == url)
                {
                    if(return_index)
                    {
                        return i;
                    }
                    return this.props.attributes.links[i];
                }
            }
        }
        return undefined;
    }
    /*
     *
     * spawns reactjs element with current links plus 'add link' button
     *
     *
     * @return reactjs object (element)
     *
     */
    init()
    {
        return [this.display_links(),this.spawn_link_button()]
    }
     /*
     *
     * Generates array of reactjs objects that contain info about current link objects(current links) :
     * name, edit & delete button
     *
     * @return reactjs object (element)
     *
     */
    display_links()
    {
        var me = this;
        var elements = [];
        var links = this.props.attributes.links;
        // verify that links array is not undefined
        if(links != undefined)
        {
            // verify that links array is not empty
            if(links.length > 0)
            {
                // loop through the link array
                for(var i = 0; i<links.length;i++)
                {
                    // verify that link object under current index is not undefined
                    if(links[i] != undefined)
                    {
                        // generate reactjs object and push it to the array of elements
                        var element = this.el('p',{},
                                        [
                                            this.el('span',{className:"links-icon-button dashicons dashicons-edit",onClick:function(event)
                                                {
                                                    var url = jQuery(event.target).attr("url");
                                                    me.edit_link(url);
                                                },url:links[i].url}),
                                            this.el('span',{className:"dashicons dashicons-trash",onClick:function(event)
                                                {
                                                    var url = jQuery(event.target).attr("url");
                                                    me.delete_link(url);
                                                },url:links[i].url}),
                                            links[i].name
                                        ]);
                        elements.push(element);
                    }
                }
            }
        }
        return elements;
    }
    /*
     *
     * Spawns a button with text 'add link' that lets user add another link
     *
     * @return reactjs object (element)
     *
     */
    spawn_link_button()
    {
        var me = this;
        return this.el("button",{className:"custom-block-button components-button editor-post-preview is-button is-default is-large",onClick:function()
            {
                me.add_link();
            }},
            "Add Link"
            )
    };
    /*
     *
     * Gives user an ability to add another link
     *
     * @return void
     *
     */
    add_link()
    {
        var current_links = this.props.attributes.links;
        if(current_links == undefined)
        {
            current_links = [];
        }
        var _prompt = "string";
        var i = current_links.length;
        if(i == 0)
        {
            i = 1;
        }
        else
        {
            i++;
        }
        while(_prompt != '' && _prompt != null && _prompt != undefined && _prompt.length > 0)
        {
            var link_object = {
                url:"",
                name:""
            }
            _prompt = prompt("Enter Link #" + i+" URL:",'');
            if(_prompt != undefined && _prompt != null && _prompt.length > 0)
            {
                link_object.url = _prompt;
                _prompt = prompt("Enter Link #" + i+" name:",'');
                if(_prompt != undefined && _prompt != null && _prompt.length > 0)
                {
                    link_object.name = _prompt;

                    current_links.push(link_object);

                    i++;
                }
            }
        }
        this.props.setAttributes({links:current_links});
        Common.set_dummy(this.props);
    }
    /*
     *
     * Deletes link from array by url
     *
     * @url - string containing url of link
     *
     * @return reactjs object (element)
     *
     */
    delete_link(url)
    {
        if(url != undefined)
        {
            var link_object = this.find_needed_link(url);
            if(link_object != undefined)
            {
                var conf = confirm("Are you sure that you want to delete url:" + url+"?");
                if(conf)
                {
                    var links = this.props.attributes.links;
                    var index = -1;
                    index = links.indexOf(link_object);
                    if(index > -1)
                    {
                        links.splice(index, 1);
                        this.props.setAttributes({links:links});
                        Common.set_dummy(this.props);
                    }
                }
            }
        }
    }
    /*
     *
     * Edites link from array by url
     *
     * @url - string containing url of link
     *
     * @return reactjs object (element)
     *
     */
    edit_link(url)
    {
        if(url != undefined)
        {
            var link_object_index = this.find_needed_link(url,true);
            if(link_object_index != undefined && link_object_index>-1)
            {
                // store as temp array          
                var links = this.props.attributes.links;
                var _prompt = prompt("Enter link URL:",links[link_object_index].url);
                links[link_object_index].url = _prompt;
                _prompt = prompt("Enter link name:",links[link_object_index].name);
                links[link_object_index].name = _prompt;

                this.props.setAttributes({links:links});
                Common.set_dummy(this.props);
            }
        }
    }
}