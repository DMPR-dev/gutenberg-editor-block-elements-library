class List
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
            console.error("Unalbe to initialize list object because wp is undefined!");
            return undefined;
        }
    }
    /* Render popup window */
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
            return false;
        }
        this.popup.init(this.object_sample);
    }
    /*
     *
     * spawns reactjs element with current list plus 'add to list' button
     *
     *
     * @return reactjs object (element)
     *
     */
    init(_variable_name,_object_sample)
    {
        if(_variable_name == undefined){console.error("No variable name has been set for list object. List system will work, but it will be unable to save any changes.");}
        this.variable_name = _variable_name;
        this.object_sample = _object_sample;
        this.render_popup();

        return [this.display_list(),this.spawn_list_button()]
    }
    /*
     *
     * Searches for needed object by its id in array of list (accessible via properties of block)
     *
     * @id - integer with id of item on the list
     *
     * @return_index - boolean - an option to return needed object index, not object reference itself
     *
     * @return LIST OBJECT (that is stored in array of list)
     *
     */
    find_needed_item(id,return_index)
    {
        if(return_index == undefined){return_index = false}
        // verify that links array is not undefined
        if(this.props.attributes[this.variable_name] != undefined)
        {
            // loop through the link array
            for(var i = 0; i<this.props.attributes[this.variable_name].length; i++)
            {
                // find needed object by 'id' property
                // and return it or its index
                if(this.props.attributes[this.variable_name][i].id.val == id)
                {
                    if(return_index)
                    {
                        return i;
                    }
                    return this.props.attributes[this.variable_name][i];
                }
            }
        }
        return undefined;
    }
    display_object_properties(object)
    {
        var elements = [];
        if(object != undefined)
        {
            var values = Object.values(object);
            var keys = Object.keys(object);

            for (var i = 0; i< values.length; i++) 
            {
                if(values[i] != undefined && values[i].val != undefined)
                {
                    var cutText = function(text){
                        if( text.length > 32 )
                        {
                            return text.slice(0 , 32) + "...";
                        }
                        return text;
                    };
                    var elem = this.el('p',{className:"long-word-wrap",style:{marginTop:"0px",marginBottom:"0px"}},values[i].caption + " : " + cutText( values[i].val.toString() ) );
                    elements.push(elem);
                }
            }
        }
        return elements;
    }
     /*
     *
     * Generates array of reactjs objects that contain info about current link objects(current links) :
     * name, edit & delete button
     *
     * @return reactjs object (element)
     *
     */
    display_list()
    {
        var me = this;
        var elements = [];
        var list = this.props.attributes[this.variable_name];
        // verify that links array is not undefined
        if(list != undefined)
        {
            // verify that links array is not empty
            if(list.length > 0)
            {
            	var values = Object.values(this.object_sample);
        		var keys = Object.keys(this.object_sample);
                // loop through the list array
                if(values != undefined && keys != undefined && keys.length == values.length)
				{
	                for( var i = 0; i < list.length; i++ )
	                {
	                    // generate reactjs object and push it to the array of elements
	                    var element = this.el('p',{style:{border:"1px dashed silver", padding:"10px", position:"relative"}},
	                        [
	                            this.el('span',{className:"list-icon dashicons dashicons-edit",onClick:function(event)
	                                {
	                                    var id = jQuery(event.target).attr("object_id");
	                                    me.edit_list(id);
	                                },object_id:list[i].id.val}),
	                            this.el('span',{className:"list-icon dashicons dashicons-trash",onClick:function(event)
	                                {
	                                    var id = jQuery(event.target).attr("object_id");
	                                    me.delete_from_list(id);
	                                },object_id:list[i].id.val}),
                                this.el('span',{ style:{ width:"100%", height: "1px", backgroundColor:"#ddd", display: "block", margin: "5px 0px" } } ),
                                
                                this.spawn_move_button(list,i),
	                            
                                this.display_object_properties(list[i]),
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
    spawn_list_button()
    {
        var me = this;
        return this.el("button",{className:"custom-block-button components-button editor-post-preview is-button is-default is-large",onClick:function()
            {
                me.add_to_list();
            }},
            list_translations.add_to_list
            )
    };
    /*
     *
     * Gives user an ability to add another link
     *
     * @return void
     *
     */
    add_to_list()
    {
        var me = this;
        var current_list = this.props.attributes[this.variable_name];
        if(current_list == undefined)
        {
            current_list = [];
        }
        me.popup.callback = function()
        {
            var new_object = JSON.parse(JSON.stringify(me.object_sample));

            var values = Object.values(new_object);
            var keys = Object.keys(new_object);

            if(values != undefined && keys != undefined && keys.length == values.length)
            {
                /* REPLACE HERE */
                for(var i = 0; i < keys.length; i++)
                {
                    if(!me.popup.restricted_fields(keys[i]))
                    {
                        new_object[keys[i]].val = me.popup.options[keys[i]].val;
                    }
                }
                if(current_list.length > 0)
                {
                    // if there are objects, then pick id of length of array
                    new_object.id.val =  me.props.attributes[me.variable_name].length-1;
                    // and iterate id until there are no object with such id
                    while(me.find_needed_item(new_object.id.val) != undefined)
                    {
                        new_object.id.val++;
                    }
                }
                else
                {
                    // if array is empty, then just pick index 0
                    new_object.id.val = 0;
                }

            }
            current_list.push(new_object);
            me.props.attributes[me.variable_name] = current_list;
            Common.set_dummy(me.props);
        }
        me.popup.open_popup();
    }
    /*
     *
     * Deletes list object from array by id
     *
     * @id - string containing id of list object
     *
     * @return reactjs object (element)
     *
     */
    delete_from_list(id)
    {
        if(id != undefined)
        {
            var list_object = this.find_needed_item(id);
            if(list_object != undefined)
            {
                var conf = confirm(list_translations.confirm_deletion_from_list);
                if(conf)
                {
                    var list = this.props.attributes[this.variable_name];
                    var index = -1;
                    index = list.indexOf(list_object);
                    if(index > -1)
                    {
                        list.splice(index, 1);
                        this.props.attributes[this.variable_name] = list;
                        Common.set_dummy(this.props);
                    }
                }
            }
        }
    }
    /*
     *
     * Edites list object from array by id
     *
     * @id - string containing id of list object
     *
     * @return reactjs object (element)
     *
     */
    edit_list(id)
    {
        var me = this;
        // store array of objects in temp variable
        var objects = this.props.attributes[this.variable_name];
        // find needed object by id
        var needed_object = this.find_needed_item(id);
       
        if(needed_object != undefined)
        {
            // verify that needed object exists in array
            var index = objects.indexOf(needed_object);
            if (index > -1) 
            {
                // edit object properties
                me.popup.callback = function()
                {
                    var values = Object.values(objects[index]);
                    var keys = Object.keys(objects[index]);

                    for(var i = 0; i < keys.length; i++)
                    {
                        if(!me.popup.restricted_fields(keys[i]))
                        {
                            objects[index][keys[i]].val = me.popup.options[keys[i]].val;
                        }
                    }
                    me.props.attributes[me.variable_name] = objects;
                    Common.set_dummy(me.props);
                }
                me.popup.open_popup(objects[index]);
            }
        }
    }
        /*
     *
     * Spawns 'up' and 'down' buttons that let user move list object up and down inside of array(change the position of object)
     *
     * @return ARRAY OF REACTJS objects
     *
     */
    spawn_move_button(list,_index)
    {
        var buttons = [];
        var me = this;
        if(list[_index] != undefined)
        {
            // verify that current index is not the first and add 'up' button
            if(_index != 0)
            {
                var _button = this.el('div',{className:"list-go-up-button",onClick:function()
                {
                    me.move_list_object(jQuery(event.target).attr("object_id"),-1);
                }, object_id:list[_index].id.val},list_translations.up);

                buttons.push(_button);
            }
            // verify that current index is not the last and add 'down' button
            if(_index < list.length - 1)
            {
                var button = this.el('div',{className:"list-go-down-button",onClick:function()
                {
                    me.move_list_object(jQuery(event.target).attr("object_id"),1);
                },object_id:list[_index].id.val},list_translations.down);

                buttons.push(button);
            }
        }
        return buttons;
    }
    /*
     *
     * Allows user to move list object up and down inside of array(change the position of list object)
     * 1 method execution = 1 position
     *
     * @return VOID
     *
     */
    move_list_object (object_id, position)
    {
        // validate position ,so image will only be moved on 1 step
        if(position == 1 || position == -1)
        {
            // access list array, store it in temp variable to modify
            var list = this.props.attributes[this.variable_name];
            // find needed image that will be moved by given id
            var needed_object = this.find_needed_item(object_id);
            if(needed_object != undefined)
            {
                // if such image 100% exists in array, then move it
                var index = list.indexOf(needed_object);
                if (index > -1) 
                {
                    // check if needed index exists(so, we will not move the image if it's the first or the last in array)
                    if(list[index+position] != undefined)
                    {
                        // move objects inside of array
                        var temp_object = list[index+position];
                        list[index+position] = needed_object;
                        list[index] = temp_object;

                        this.props.attributes[this.variable_name] = list;
                        Common.set_dummy(this.props);
                    }
                }
            }
        }
    }
}