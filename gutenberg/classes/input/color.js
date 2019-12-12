class ColorInput extends BaseInput
{
	constructor(_props)
	{
		super(_props);
	}
    // override style
    style()
    {
        return {};
    }
    // overriden method
    update_attr(object,value)
    {
        var value_object = {val:value}

        object.callback(object.props,value_object);

        if(value_object.val.rgb.a == 1)
        {
            object.props.attributes[object.my_name] = value_object.val.hex;
        }
        else
        {
            object.props.attributes[object.my_name] = "rgba("+value_object.val.rgb.r + "," 
                                               + value_object.val.rgb.g+","
                                               +value_object.val.rgb.b+","
                                               +value_object.val.rgb.a+")";
        }
        Common.set_dummy(object.props);
    }
	/*
     *
     * Generates all needed stuff for simple color input
     *
     * @name - STRING - name of attribute that will be associated with input value
     *
     * @label_text - STRING - text that will be displayed on the label under input
     *
     * @return reactjs object
     *
     */
    init(name,label_text)
    {
        this.my_name = name;
        if(label_text == undefined){label_text="";}
        if(name == undefined || name == null)
        {
            console.error("Unable to init color input because variable @name is undefined!");
            return null;
        }
        var me = this;
        var spawn_del_btn = function() 
        {
            if(me.props.attributes[name] != undefined)
            {
                return me.el('button',{className:"custom-block-button components-button editor-post-preview is-button is-default is-large",
                    onClick:function(event)
                    {
                        me.props.attributes[name] = undefined;
                        Common.set_dummy(me.props);
                    }
                },color_translations.remove_color);
            }
        }
        return [
            this.el('label',{},label_text),
            this.el(this.ColorPicker,{style:this.style(),color:this.props.attributes[name],onChangeComplete:(value) => {me.update_attr(me,value)}}),
            spawn_del_btn()
        ]
    }
}