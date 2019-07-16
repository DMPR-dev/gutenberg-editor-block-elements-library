class Popup
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
            console.log("Unalbe to initialize gallery object because wp is undefined!");
            return undefined;
        }
	}
	/*
     *
     * spawns reactjs element with current popup and fields
     *
     *
     * @return reactjs object (element)
     *
     */
    init(_object_sample)
    {
    	if(_object_sample != undefined)
        {
            this.options = JSON.parse(JSON.stringify(_object_sample));
        	return this.render_popup();
        }
        else
        {
            console.log("Unalbe to initialize popup object because object sample is undefined!");
            return undefined;
        }
    }
    render_popup()
    {
        var elements = [];
        var me = this;
        if(this.options != undefined)
        {
            var values = Object.values(this.options);
            var keys = Object.keys(this.options);
            for (var i = 0; i < values.length;i++) 
            {
            	if(!this.restricted_fields(keys[i]))
            	{
	                var element = this.el('div',{style:{width:"100%"}},
	                	[
	                		this.el('label',{for:keys[i]},[values[i].caption,":"]),
		                		this.el('input',{type:"text", style:{width:"100%"}, id:keys[i], option:keys[i], defaultValue:values[i].val, onChange:function(event){
		                			me.options[jQuery(event.target).attr("option")].val = event.target.value;
		                		}
		                	})
	                	]);
	                elements.push(element);
            	}
            }
        }
        var me = this;
        return this.el('div',{
        		className:"common-lib-popup d-none"
        	},
        	[this.el('div',{className:"common-lib-popup-items-container"},
        		[
        			elements,
        			this.el('button',{className:"common-lib-popup-btn components-button editor-post-publish-button is-button is-default is-primary is-large",onClick:function(){me.save_and_close();}},"Save and Close"),
        			this.el('button',{className:"common-lib-popup-btn components-button editor-post-publish-button is-button is-default is-large",onClick:function(){me.close_popup();}},"Close")
        		]
        	)
        ]
      );
    }
    open_popup(object)
    {
    	if(this.popup_opened())
    	{
    		this.close_popup();
    	}
    	/* If passed object is defined then append values */
    	if(object != undefined)
    	{
    		this.options = JSON.parse(JSON.stringify(object));
    		var values = Object.values(object);
            var keys = Object.keys(object);
    		for(var i = 0; i < values.length; i++) 
    		{
    			jQuery('.common-lib-popup.d-none input[option="'+keys[i]+'"]').val(values[i].val);
    		}
    	}
    	jQuery(".common-lib-popup.d-none").removeClass("d-none");
    }
    popup_opened()
    {
    	return jQuery(".common-lib-popup:not(.d-none)").length > 0;
    }
    /* Don't allow more than 1 popup opened at the same time */
    close_popup()
    {
    	jQuery(".common-lib-popup:not(.d-none)").addClass("d-none");
    }
    /* 'Save' values and use them in callback */
    save_and_close()
    {
    	this.close_popup();
    	this.callback();
    }
    /* To be overriden*/
    callback()
    {
    	
    }
    /* To Be overriden*/
    restricted_fields()
    {
    	return false;
    }
}