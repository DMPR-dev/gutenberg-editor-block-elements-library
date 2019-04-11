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
            for (var i =0; i<values.length;i++) 
            {
                if(values[i] != undefined && values[i].val != undefined && values[i].val.toString().length < 64)
                {
                    var elem = this.el('p',{style:{marginTop:"0px",marginBottom:"0px"}},values[i].caption + " : " + values[i].val);
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
	                for(var i = 0; i<list.length;i++)
	                {
	                        // generate reactjs object and push it to the array of elements
	                        var element = this.el('p',{style:{border:"1px dashed silver",margin:"5%",padding:"5%"}},
	                                        [
	                                            this.el('span',{className:"links-icon-button dashicons dashicons-edit",onClick:function(event)
	                                                {
	                                                    var id = jQuery(event.target).attr("id");
	                                                    me.edit_list(id);
	                                                },id:list[i].id.val}),
	                                            this.el('span',{className:"dashicons dashicons-trash",onClick:function(event)
	                                                {
	                                                    var id = jQuery(event.target).attr("id");
	                                                    me.delete_from_list(id);
	                                                },id:list[i].id.val}),
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
            "Add To List"
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
        var current_list = this.props.attributes[this.variable_name];
        if(current_list == undefined)
        {
            current_list = [];
        }
        var values = Object.values(this.object_sample);
        var keys = Object.keys(this.object_sample);
        var new_object = JSON.parse(JSON.stringify(this.object_sample));
        if(values != undefined && keys != undefined && keys.length == values.length)
        {
            for (var i =0; i<values.length;i++) 
            {
                if(keys[i].toUpperCase() != 'id'.toUpperCase())
                {
                    if(values[i] != undefined && values[i].val != undefined && values[i].val.length < 64)
                    {
                        var _prompt = prompt("Enter " + values[i].caption,values[i].val);
                        new_object[keys[i]].val = _prompt;
                    }
                }
            }
            if(current_list.length > 0)
            {
                // if there are objects, then pick id of length of array
                new_object.id.val =  this.props.attributes[this.variable_name].length-1;
                // and iterate id until there are no object with such id
                while(this.find_needed_item(new_object.id.val) != undefined)
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
        this.props.attributes[this.variable_name] = current_list;
        Common.set_dummy(this.props);
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
                var conf = confirm("Are you sure that you want to delete object id:" + id+" from the list?");
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
        // store array of images in temp variable
        var images = this.props.attributes[this.variable_name];
        // find needed object by id
        var needed_object = this.find_needed_item(id);
       
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
                        if(values[i].caption.toUpperCase() != "id".toUpperCase())
                        {
                            var _prompt = prompt("Enter " + values[i].caption + ":",values[i].val);
                            if(_prompt != null)
                            {
                                images[index][keys[i]].val = _prompt;
                            }
                        }
                    }
                    
                    this.props.attributes[this.variable_name] = images;
                    Common.set_dummy(this.props);
                }
            }
        }
    }
}