class TextInput extends BaseInput
{   
    constructor(_props)
    {
        // construct via base class
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
        if(label_text == undefined) {label_text="";}
        if(name == undefined || name == null)
        {
            console.error("Unable to init text input because variable @name is undefined!");
            return null;
        }
        var me = this;
        return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el(this.text_box,{ 
                                placeholder:label_text.replace(":",""),
                                formattingControls: this.formatting_controls(),
                                style:this.style(),
                                name:this.my_name,onChange: (value) => {me.update_attr(me,value)}
                                ,value:me.props.attributes[name]
                            })
            ]);
    }
    /*
        Default formatting controls of text input, can be overriden
        @link https://github.com/WordPress/gutenberg/tree/master/packages/block-editor/src/components/rich-text#formattingcontrols-array
    */
    formatting_controls()
    {
        return [ 'bold', 'italic', 'strikethrough' , 'link'];
    }
}