class Common
{
    constructor(_props)
    {
        if(wp == undefined)
        {
            console.error("Unalbe to initialize input object because wp is undefined!");
            return undefined;
        }
        if(_props == undefined)
        {
            console.error("Unalbe to initialize input object because block properties are undefined!");
            return undefined;
        } 
        if(wp.editor == undefined)
        {
            console.error("Unalbe to initialize input object because wp.editor is undefined!");
            return undefined;
        }
        if(wp.element == undefined)
        {
            console.error("Unalbe to initialize input object because wp.element is undefined!");
            return undefined;
        }
        if(wp.components == undefined)
        {
            console.error("Unalbe to initialize input object because wp.components is undefined!");
            return undefined;
        }
        if(wp.media == undefined)
        {
            console.error("Unalbe to initialize input object because wp.media is undefined!");
            return undefined;
        }

        this.input = new Input(_props);
        this.gallery = new Gallery(_props);
        this.link = new Link(_props);
        this.list = new List(_props);
    }
    // sets random dummy, needed for updating of block on editor
    static set_dummy(_props)
    {
        var random_dummy = Math.random().toString(10) + Math.random().toString(10) + Math.random().toString(10) + Math.random().toString(10);
        if(random_dummy != _props.attributes.dummy)
        {
            _props.setAttributes({dummy:random_dummy});
        }
        else
        {
            set_dummy(_props);
        }
    }
}
