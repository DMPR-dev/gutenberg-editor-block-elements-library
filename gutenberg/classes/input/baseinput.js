class BaseInput
{
	constructor(_props)
	{
		this.props = _props;
		this.el = wp.element.createElement;
        this.text_box = wp.editor.RichText;
        this.DateTimePicker = wp.components.DateTimePicker;
        this.ColorPicker = wp.components.ColorPicker;
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
			border:"1px solid silver",
			borderRadius:"5px",
			padding:"2%"
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