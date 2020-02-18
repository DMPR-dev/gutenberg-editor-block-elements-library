class DateTimeInput extends BaseInput
{
    constructor(_props)
    {
        super(_props);
    }
    /*
        Style can be overriden
    */
    style()
    {
        return {};
    }
    /*
     *
     * Generates all needed stuff for simple datetime input
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
        if( typeof label_text === 'undefined' )
        {
            label_text = '';
        }
        if( typeof name === 'undefined' || name === null ) 
        {
            console.error("Unable to init date_time input because variable @name is undefined!");
            return null;
        }
        var me = this;
        return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el(this.DateTimePicker,{ 
                                style:this.style(),
                                placeholder:label_text.replace(":",""),
                                onChange:(value) => {me.update_attr(me,value)},
                                currentDate:this.props.attributes[name]
                            })
            ]);
    }
}