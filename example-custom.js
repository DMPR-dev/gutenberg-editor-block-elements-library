(function(editor,blocks,element,components)
{
    // simplify wordpress functions
    var el = element.createElement,
    registerBlockType = blocks.registerBlockType,
    insperctorControls = editor.InspectorControls,
    panelBody = components.PanelBody,
    fragment = element.Fragment;
    InnerBlocks = editor.InnerBlocks;

    // register our block - js side
    registerBlockType( 'diy-blocks/listitem', {
        // PROPERTIES
        title: 'List Item',

        icon: 'video-alt3',

        category: 'widgets',

        // attributes - variables? 
        attributes: {
                title:{type:"string"},
                text:{type:"string"},
                embed_type:{type:"string"},
                embed_url:{type:"string"}
            },
        // edit callback - displayed on the editor
        edit: function(props) 
        {
            var embed_url_field = function()
            {
                if(props.attributes.embed_type == undefined || props.attributes.embed_type.length == 0)
                {
                    props.attributes.embed_type = "Pinterest";
                }
                if(props.attributes.embed_type != undefined && props.attributes.embed_type.length > 0)
                {
                    if(props.attributes.embed_type != "Instagram")
                    {
                        if(props.attributes.embed_type == "Custom Image")
                        {
                             return el(InnerBlocks,{allowedBlocks:['core/image']});
                        }
                        else
                        {
                            var input = new TextInput(props);
                            input.plain = true;
                            return input.init("embed_url",props.attributes.embed_type + " URL:");
                        }
                    }
                    else
                    {
                        return el(InnerBlocks,{allowedBlocks:['core-embed/instagram']});
                    }
                }
            }
            return el('div',{},
                [
                    new TextInput(props).init("title","Title:"),
                    new TextInput(props).init("text","Text:"),
                    new SelectInput(props).init("embed_type","Select embed type:",["Pinterest","Youtube","Instagram","Custom Image"]),
                    embed_url_field()
                ])
        },
        // save callback - displayed on the front-end part
        save: function(props) {
             return el(InnerBlocks.Content);
        },
    } );
})(
    window.wp.editor,
    window.wp.blocks,
    window.wp.element,
    window.wp.components
)
