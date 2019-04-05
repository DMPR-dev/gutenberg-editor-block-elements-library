class Select extends BaseInput
{
    constructor(_props)
    {
        super(_props);
    }
    // override default method for saving
    update_attr(object,event)
    {
        var value_object = {val:event.target.value}
        // execute callback with argument of properties object before value save
        object.callback(object.props,value_object);
        // save value
        object.props.attributes[object.my_name] = value_object.val;
        Common.set_dummy(object.props);
    }
    /*
     *
     * Generates all needed stuff for simple select input
     *
     * @name - STRING - name of attribute that will be associated with input value
     *
     * @label_text - STRING - text that will be displayed on the label under input
     *
     * @values - ARRAY OF STRINGS - values that will be displayed under 'select' element
     *
     * @return reactjs object
     *
     */
    init(name,label_text,values)
    {
        this.my_name = name;
        if(label_text == undefined) {label_text="";}
        if(name == undefined || name == null)
        {
            console.error("Unable to init select input because variable @name is undefined!");
            return null;
        }
        var me = this;
        var display_values = function()
        {
            var options = [];
            if(values != undefined)
            {
                if(values.length > 0)
                {
                    for(var i =0; i<values.length; i++)
                    {
                        var option = me.el('option',{value:values[i]},values[i]);
                        options.push(option);
                    }
                }
            }
            return options;
        }
        return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el('select',{ 
                                className:"common-select-input",
                                placeholder:label_text.replace(":",""),
                                style:{border:"1px solid silver",borderRadius:"5px",padding:"2%"},
                                name:name,onChange: (value) => {me.update_attr(me,value)},value:this.props.attributes[this.my_name]
                            },
                            [
                               display_values()
                            ])
            ]);
    }
}