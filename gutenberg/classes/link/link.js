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
        if(_variable_name == undefined){console.error("No variable name has been set for links. Links system will work, but it will be unable to save any changes.");}
        this.variable_name = _variable_name;
        return [this.display_links(),this.spawn_link_button()]
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
                if(this.props.attributes[this.variable_name][i].url == url)
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
        var current_links = this.props.attributes[this.variable_name];
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
        this.props.attributes[this.variable_name] = current_links;
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
        if(url != undefined)
        {
            var link_object_index = this.find_needed_link(url,true);
            if(link_object_index != undefined && link_object_index>-1)
            {
                // store as temp array          
                var links = this.props.attributes[this.variable_name];
                var _prompt = prompt("Enter link URL:",links[link_object_index].url);
                links[link_object_index].url = _prompt;
                _prompt = prompt("Enter link name:",links[link_object_index].name);
                links[link_object_index].name = _prompt;

                this.props.attributes[this.variable_name] = links;
                Common.set_dummy(this.props);
            }
        }
    }
}