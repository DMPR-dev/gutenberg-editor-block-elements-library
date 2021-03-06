class TextInput extends BaseInput
{   
    constructor(_props)
    {
        // construct via base class
        super(_props);
        this.plain = false;
    }
    /*
     *
     * Generates all needed stuff for simple text input
     *
     * @name - STRING - name of attribute that will be associated with input value
     *
     * @label_text - STRING - text that will be displayed on the label under input
     *
     * @plain_text - BOOLEAN - define if the input should be a plain text input or richtext wp element
     *
     * @return reactjs object
     *
     */
    init(name,label_text,placeholder)
    {
        this.my_name = name;
        if( typeof label_text === 'undefined' )
        {
            label_text = '';
        }
        if( typeof name === 'undefined' || typeof name === null )
        {
            console.error( "Unable to init text input because variable @name is undefined!" );
            return null;
        }
        if( typeof placeholder === 'undefined' )
        {
            placeholder = '';
        }
        var me = this;
        if( !this.plain )
        {
            return this.el('div',{},
                [
                    this.el('label', {},label_text),

                    this.el(this.text_box,{
                                    placeholder:label_text.replace(":",""),
                                    allowedFormats: this.formatting_controls(),
                                    withoutInteractiveFormatting: false,
                                    style:this.style(),
                                    name:this.my_name,onChange: (value) => {
                                        me.update_attr(me,value);
                                    }
                                    ,value:me.props.attributes[name],
                                    placeholder:placeholder
                                })
                ]);
        }
        else
        {
            return this.el('div',{},
            [
                this.el('label', {},label_text),

                this.el("input",{
                                type:"text",
                                placeholder:label_text.replace(":",""),
                                style:this.style(),
                                name:this.my_name,onChange: (event) => {
                                    me.update_attr(me,event.target.value);
                                },
                                defaultValue:me.props.attributes[name],
                                placeholder:placeholder
                            })
            ]);
        }
    }
    /*
        Default formatting controls of text input, can be overriden
        @link https://github.com/WordPress/gutenberg/tree/master/packages/block-editor/src/components/rich-text#formattingcontrols-array
    */
    formatting_controls()
    {
        return [ 'core/bold', 'core/italic', 'core/strikethrough' , 'core/link', 'core/image' ];
    }
    // @link https://javascript.ru/php/strip_tags
    strip_tags( str )
    { 
        // Strip HTML and PHP tags from a string
        // 
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

        return str.replace(/<\/?[^>]+>/gi, '');
    }
}