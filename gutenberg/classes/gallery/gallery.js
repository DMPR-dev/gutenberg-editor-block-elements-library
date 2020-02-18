class Gallery
{
    constructor(_props)
    {
        if(wp != undefined)
        {
            this.props = _props;
            this.el = wp.element.createElement;
        }
        else
        {
            console.error("Unalbe to initialize gallery object because wp is undefined!");
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
    init(object_sample,_variable_name)
    {
        if(object_sample == undefined){object_sample={};}
        if(_variable_name == undefined){console.error("No variable name has been set for gallery. Gallery will work, but it will be unable to save any changes.");}
        this.image_object_sample = object_sample;
        this.variable_name = _variable_name;
        return [this.display_images_backend(),this.add_image_btn(),this.render_popup()]
    }
    render_popup()
    {
        this.popup = new Popup(this.props);
        this.popup.restricted_fields = function(field_name)
        {
            field_name = String(field_name);

            if(field_name.includes("id"))
            {
                return true;
            }
            if(field_name.includes("url"))
            {
                //return true;
            }
            return false;
        }
        return this.popup.init(this.assign_type(this.image_object_sample));
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
                        var elem = this.el('h3',{className:"heading-title-preview long-word-wrap"},values[i].caption + " : " + values[i].val);
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
        if(this.props.attributes[this.variable_name] == undefined)
        {
            this.props.attributes[this.variable_name] = [];
        }

        var me = this;

        // get images
        var images = this.props.attributes[this.variable_name];
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
                        this.el('div',{className:"image-img-edit-heading",image_id:images[i].id.val, onClick:
                        function(event)
                        {
                            var id = jQuery(event.target).attr("image_id");
                            me.edit(id)
                        }},
                            [
                            " ", gallery_translations.edit
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
        if(this.props.attributes[this.variable_name] == undefined)
        {
            this.props.attributes[this.variable_name] = [];
        }

        var callback = function()
        {
            if(me.image_object_sample != undefined)
            {
                var values = Object.values(me.image_object_sample);
                var keys = Object.keys(me.image_object_sample);
                if(values != undefined && keys != undefined && keys.length == values.length)
                {
                    me.popup.callback = function()
                    {
                        var new_object = JSON.parse(JSON.stringify(me.image_object_sample));

                        for(var i = 0; i < keys.length; i++)
                        {
                            if(!me.popup.restricted_fields(keys[i]))
                            {
                                new_object[keys[i]].val = me.popup.options[keys[i]].val;
                            }
                        }

                        if(me.props.attributes[me.variable_name].length > 0)
                        {
                            // if there are objects, then pick id of length of array
                            new_object.id.val =  me.props.attributes[me.variable_name].length-1;
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
                        me.props.attributes[me.variable_name].push(new_object);
                        Common.set_dummy(me.props);
                    }
                    me.popup.open_popup();
                }

            }
            else
            {
                console.error("Unalbe to add image to gallery because image object sample is not set!");
            }
        }
        callback();
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
                        },className:"custom-block-button components-button editor-post-preview is-button is-default is-large"},gallery_translations.add_to_list)
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
                           me.delete_image(me.props.attributes[me.variable_name][_index].id.val)
                    },className:"custom-block-button components-button editor-post-preview is-button is-default is-large"},gallery_translations.remove_image)
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
            var images = this.props.attributes[this.variable_name];
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
                var _button = this.el('div',{className:"list-go-up-button",onClick:function()
                {
                    me.move_image(jQuery(event.target).attr("image_id"),-1);
                }, image_id:images[_index].id.val},gallery_translations.up);

                buttons.push(_button);
            }
            // verify that current index is not the last and add 'down' button
            if(_index < images.length - 1)
            {
                var button = this.el('div',{className:"list-go-down-button",onClick:function()
                {
                    me.move_image(jQuery(event.target).attr("image_id"),1);
                },image_id:images[_index].id.val},gallery_translations.down);

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
            var images = this.props.attributes[this.variable_name];
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

                        this.props.attributes[this.variable_name] = images;
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
        var images = this.props.attributes[this.variable_name];
        // find needed object by id
        var needed_object = this.find_image_by_id(image_id);
       
        var me = this;

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
                    me.popup.restricted_fields = function(field_name)
                    {
                        field_name = String(field_name);

                        if(field_name.includes("id"))
                        {
                            return true;
                        }
                        return false;
                    }
                    me.popup.callback = function()
                    {
                        for(var i = 0; i < keys.length; i++)
                        {
                            if(!me.popup.restricted_fields(keys[i]))
                            {
                                images[index][keys[i]].val = me.popup.options[keys[i]].val;
                            }
                        }
                        me.props.attributes[me.variable_name] = images;
                        Common.set_dummy(me.props);
                    }
                    /* Open popup and append current values */
                    me.popup.open_popup(me.assign_type(needed_object));
                }
            }
        }
    }
    /*
        Appends type to image object input

        @returns OBJECT
    */
    assign_type(object)
    {
        var values = Object.values(object);
        var keys = Object.keys(object);
        if(values != undefined && keys != undefined && keys.length == values.length)
        {
            for(var i = 0; i < keys.length; i++)
            {
                if(typeof(object[keys[i]].type) == 'undefined')
                {
                    if(String(keys[i]).toLowerCase() != String('url').toLowerCase())
                    {
                        object[keys[i]].type = 'text';
                    }
                    else
                    {
                        object[keys[i]].type = 'image';
                    }
                }
            }
        }
        return object;
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
        var images = this.props.attributes[this.variable_name];
        // fined needed object by id
        var needed_object = this.find_image_by_id(image_id);
        
        if(needed_object != undefined)
        {
            // verify that needed object exists in array and pick its index
            var index = images.indexOf(needed_object);
            if (index > -1) 
            {
                // confirm that user is sure about image deletion
                if(confirm(gallery_translations.confirm_deletion_from_list))
                {
                    // delete image from array
                    images.splice(index, 1);
                    // save edited array to block properties
                    this.props.attributes[this.variable_name] = images;
                    Common.set_dummy(this.props);
                }
            }
        }
    }
}