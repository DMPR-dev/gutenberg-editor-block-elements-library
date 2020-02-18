//editor.AlignmentToolbar
class AlignmentTool extends BaseTools
{
	constructor(_props)
	{
		super(_props);
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
        if(me.props.attributes[name] == undefined || me.props.attributes[name] == '')
        {
        	me.props.attributes[name] = 14;
        }
        return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el(this.AlignmentToolBar,{ 
                                style:this.style(),
                                name:this.my_name,onChange: (value) => {me.update_attr(me,value)}
                                ,value:me.props.attributes[name]
                            })
            ]);
    }
}