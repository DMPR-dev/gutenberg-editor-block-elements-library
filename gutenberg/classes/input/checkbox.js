class CheckBox extends BaseInput
{   
    constructor(_props)
    {
        // construct via base class
        super(_props);
    }
    // override style
    style()
    {
        return {
            margin:"0px",
            marginRight:"5px"
        }
    }
    // override basic method
    update_attr(object,event)
    {
        // get 'checked' property
        var value_object = {val:event.target.checked}
        // execute callback with argument of properties object before value save
        object.callback(object.props,value_object);
        // save value
        object.props.attributes[object.my_name] = value_object.val;
        Common.set_dummy(object.props);
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
        return this.el('div',{},
            [
                this.el('input',{ 
                                type:"checkbox",
                                defaultChecked: me.props.attributes[name],
                                name:this.my_name,
                                id:this.my_name,
                                style:this.style(),
                                onChange: (event) => {me.update_attr(me,event)},
                            }),
                this.el('label', {labelFor:this.my_name},label_text),
            ]);
    }
}