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
            console.error("Unalbe to initialize link object because wp is undefined!");
            return undefined;
        }
    }
    /* Render popup window */
    render_popup()
    {
        this.popup = new Popup(this.props);
        return this.popup.init(this.link_object);
    }
    /*
     *
     * spawns reactjs element with current links plus 'add link' button
     *
     *
     * @return reactjs object (element)
     *
     */
    init(_variable_name)
    {
        if( typeof _variable_name === 'undefined' )
        {
            console.error("No variable name has been set for links. Links system will work, but it will be unable to save any changes.");
        }
        this.variable_name = _variable_name;
        this.link_object = {
            url:
            {
                val:"",
                caption:"URL"
            },
            name:
            {
                val:"",
                caption:"Name"
            },
        };
        return [this.display_links(),this.spawn_link_button(),this.render_popup()]
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
        if(this.props.attributes[this.variable_name] != undefined)
        {
            // loop through the link array
            for(var i = 0; i<this.props.attributes[this.variable_name].length; i++)
            {
                // find needed object by 'url' property
                // and return it or its index
                if(this.props.attributes[this.variable_name][i].url.val == url)
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
        var links = this.props.attributes[this.variable_name];
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
                        if(links[i].name != undefined && links[i].url.val != undefined)
                        {
                            // generate reactjs object and push it to the array of elements
                            var element = this.el('p',{},
                                            [
                                                this.el('span',{className:"links-icon-button dashicons dashicons-edit",onClick:function(event)
                                                    {
                                                        var url = jQuery(event.target).attr("url");
                                                        me.edit_link(url);
                                                    },url:links[i].url.val}),
                                                this.el('span',{className:"dashicons dashicons-trash",onClick:function(event)
                                                    {
                                                        var url = jQuery(event.target).attr("url");
                                                        me.delete_link(url);
                                                    },url:links[i].url.val}),
                                                links[i].name.val
                                            ]);
                            elements.push(element);
                        }
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
        var me = this;
        var current_links = this.props.attributes[this.variable_name];
        if(current_links == undefined)
        {
            current_links = [];
        }

        me.popup.callback = function()
        {
            var new_object = JSON.parse(JSON.stringify(me.link_object));

            var values = Object.values(new_object);
            var keys = Object.keys(new_object);

            for(var i = 0; i < keys.length; i++)
            {
                if(!me.popup.restricted_fields(keys[i]))
                {
                    new_object[keys[i]].val = me.popup.options[keys[i]].val;
                }
            }
            current_links.push(new_object);
            me.props.attributes[me.variable_name] = current_links;
            Common.set_dummy(me.props);
        }
        me.popup.open_popup();
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
                    var links = this.props.attributes[this.variable_name];
                    var index = -1;
                    index = links.indexOf(link_object);
                    if(index > -1)
                    {
                        links.splice(index, 1);
                        this.props.attributes[this.variable_name] = links;
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
        var me = this;
        if(url != undefined)
        {
            var link_object_index = me.find_needed_link(url,true);
            if(link_object_index != undefined && link_object_index>-1)
            {
                // store as temp array          
                var links = me.props.attributes[me.variable_name];
                
                me.popup.callback = function()
                {
                    var values = Object.values(links[link_object_index]);
                    var keys = Object.keys(links[link_object_index]);

                    for(var i = 0; i < keys.length; i++)
                    {
                        if(!me.popup.restricted_fields(keys[i]))
                        {
                            links[link_object_index][keys[i]].val = me.popup.options[keys[i]].val;
                        }
                    }
                    me.props.attributes[me.variable_name] = links;
                    Common.set_dummy(me.props);
                }
                me.popup.open_popup(links[link_object_index]);
            }
        }
    }
}