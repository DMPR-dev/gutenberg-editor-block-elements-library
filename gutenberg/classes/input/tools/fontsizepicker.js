class FontSizePickerInput extends BaseTools
{
	constructor(_props)
	{
		super(_props);
	}
	// override default callback
	callback(props,object)
	{
		if(object.val == undefined)
		{
			object.val = 14;
		}
		object.val = object.val.toString();
		if(!object.val.endsWith("px"))
		{
			if(!object.val.includes("px"))
			{
				object.val += "px";
			}
			else
			{
				throw new TypeError("Invalid font size input!");
			}
		}
	}
	// default font sizes
	sizes()
	{
		const sizes = [
			{
				name: '8px' ,
				slug: '8px',
				size: 8,
			},
			{
				name: '10px' ,
				slug: '10px',
				size: 10,
			},
			{
				name: '12px' ,
				slug: '12px',
				size: 12,
			},
			{
				name: '14px' ,
				slug: '14px',
				size: 14,
			},
			{
				name: '16px' ,
				slug: '16px',
				size: 16,
			},
			{
				name: '18px' ,
				slug: '18px',
				size: 18,
			},
			{
				name: '24px' ,
				slug: '24px',
				size: 24,
			},
			{
				name: '36px' ,
				slug: '36px',
				size: 36,
			},
			{
				name: '48px' ,
				slug: '48px',
				size: 48,
			}
		];
		return sizes;
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
    init(name,label_text)
    {
        this.my_name = name;
        if(label_text == undefined) {label_text="";}
        if(name == undefined || name == null)
        {
            console.error("Unable to init text input because variable @name is undefined!");
            return null;
        }
        var me = this;
        if(me.props.attributes[name] == undefined || me.props.attributes[name] == '')
        {
        	me.props.attributes[name] = 14;
        }
        return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el(this.FontSizePicker,{ 
                				fontSizes:this.sizes(),
                                style:this.style(),
                                name:this.my_name,onChange: (value) => {me.update_attr(me,value)}
                                ,value:parseInt(me.props.attributes[name],10),
                                fallbackFontSize:14
                            })
            ]);
    }
}