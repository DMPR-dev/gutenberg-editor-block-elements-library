class RadioGroupInput extends BaseInput
{   
    constructor(_props)
    {
        // construct via base class
        super(_props);
    }
    // override basic method
    update_attr(object,event)
    {
        // get 'checked' property
        var value_object = {val:event.target.value}
        // execute callback with argument of properties object before value save
        object.callback(object.props,value_object);
        // save value
        object.props.attributes[object.my_name] = value_object.val;
        Common.set_dummy(object.props);
    }
    // override basic style method
    style()
    {
        return {
            margin:"0px",
            marginRight:"5px"
        }
    }
    /*
     *
     * Generates all needed stuff for simple text input
     *
     * @name - STRING - name of attribute that will be associated with input value
     *
     * @label_text - STRING - text that will be displayed on the label above input
     *
     * @return reactjs object
     *
     */
    init(name,label_text,values)
    {
        this.my_name = name;
        if( typeof label_text === 'undefined' )
        {
            label_text = '';
        }
        if( typeof name === 'undefined' || name === null ) 
        {
            console.error("Unable to init text input because variable @name is undefined!");
            return null;
        }
        var me = this;
        var display_buttons = function()
        {
            var buttons = [];
            if( typeof values !== 'undefined' )
            {
                var vals = Object.values(values);
                var keys = Object.keys(values);

                for(var i = 0; i<vals.length; i++)
                {
                    // get saved value and set 'checked' property on it
                    // or just set checked property on the first element if saved value is not set
                    var checked = me.props.attributes[name];
                    if(checked == undefined || checked == '')
                    {
                        checked = vals[0].val;
                        // and save default value
                        me.props.attributes[name] = checked;
                        Common.set_dummy(me.props);
                    }
                    var button = 
                    [
                        me.el('div',{style:{whiteSpace:"nowrap"}},
                        [
                            me.el('label',{},[
                                me.el('input',
                                {
                                    type:'radio',
                                    name:me.my_name,
                                    style:me.style(),
                                    value:vals[i].val,
                                    defaultChecked: (checked == vals[i].val),
                                    onChange: (event) => {me.update_attr(me,event)}
                                }),
                                vals[i].caption
                            ])
                        ])
                    ];
                    buttons.push(button);
                }
            }
            return buttons;
        }
        return this.el('div',{style:{width:"100%",overflow:"hidden"}},
            [
               this.el('label',{},label_text),
               display_buttons()
            ]);
    }
}