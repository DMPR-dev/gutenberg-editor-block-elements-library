class BaseInput
{
	constructor(_props)
	{
        if (this.constructor === BaseInput) 
        {
            throw new TypeError('Abstract class "BaseInput" cannot be instantiated directly.'); 
        }
		if(wp == undefined)
        {
            throw new TypeError("Unalbe to initialize input object because wp is undefined!");
            return undefined;
        }
        if(_props == undefined)
        {
            throw new TypeError("Unalbe to initialize input object because block properties are undefined!");
            return undefined;
        } 
        if(wp.blockEditor == undefined)
        {
            throw new TypeError("Unalbe to initialize input object because wp.blockEditor is undefined!");
            return undefined;
        }
        if(wp.element == undefined)
        {
            throw new TypeError("Unalbe to initialize input object because wp.element is undefined!");
            return undefined;
        }
        if(wp.components == undefined)
        {
            throw new TypeErrorr("Unalbe to initialize input object because wp.components is undefined!");
            return undefined;
        }
        if(wp.media == undefined)
        {
            throw new TypeError("Unalbe to initialize input object because wp.media is undefined!");
            return undefined;
        }
        
		this.props = _props;
		this.el = wp.element.createElement;
        this.text_box = wp.blockEditor.RichText;
        this.DateTimePicker = wp.components.DateTimePicker;
        this.ColorPicker = wp.components.ColorPicker;
        this.FontSizePicker = wp.components.FontSizePicker;
        this.AlignmentToolBar = wp.blockEditor.AlignmentToolbar
	}
	//basic init
	init(name)
	{
		this.my_name = name;
		// to be overriden
	}
	// basic callback
	callback(props,value)
	{
		// to be overriden
	}
	// basic style
	style()
	{
		return {
			border: "1px solid silver",
			borderRadius: "5px",
			padding: "2%",
            width: "100%",
            maxWidth: "100%",
            minWidth: "100%"
		}
	}
	// basic 'onChange' event handler
	// can be overriden
	update_attr(object,_value)
    {
        var value_object = {val:_value}
        // execute callback with argument of properties object before value save
        object.callback(object.props,value_object);
        // save value
        object.props.attributes[object.my_name] = value_object.val;
        Common.set_dummy(object.props);
    }

}