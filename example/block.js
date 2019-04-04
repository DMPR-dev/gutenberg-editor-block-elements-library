(function(editor,blocks,element,components)
{
    // simplify wordpress functions
    var el = element.createElement,
    registerBlockType = blocks.registerBlockType,
    textBox = editor.RichText
    insperctorControls = editor.InspectorControls,
    panelBody = components.PanelBody,
    panelRow = components.PanelRow,
    fragment = element.Fragment,
    BlockControls = editor.BlockControls;

    //used for storing parent container of "select image" button
    var current_object_container;

    var object_sample = {
        id:
        {
            val:"",
            caption:"ID"
        },
        url:
        {
            val:"",
            caption:"URL"
        },
        heading:
        {
            val:"",
            caption:"Heading"
        }
    }
    // register our block - js side
    registerBlockType( 'gutenberg-editor-widgets/block-with-image', {
        // PROPERTIES
        title: 'Test BLOCK',

        icon: 'media-document',

        category: 'widgets',

        // attributes - variables? 
        attributes: {
                text:{type:"string"},
                dummy:{type:"string"},
                background:{type:"string"},
                images:{type:"array"},
                links:{type:"array"}
            },
        // edit callback - displayed on the editor
        edit: function(props) 
        {
            var _common = new Common(props);

            return el(fragment,{},
                [
                    el(insperctorControls,{},
                    [
                        el(panelBody,{title:"Background"},
                        [
                            // get needed elements for setting - background
                            _common.input.generate_image_input("background")
                        ]),
                        el(panelBody,{title:"Gallery"},
                        [
                            // get needed elements for setting - gallery with given object sample
                            _common.gallery.init(object_sample)
                        ]),
                        el(panelBody,{title:"Links"},
                        [
                            // get needed elements for setting - links
                            _common.link.init()
                        ])
                    ]),
                    // get needed elements for setting - text
                    _common.input.generate_text_input("text","Text:"),
                ])
        },
        // save callback - displayed on the front-end part
        save: function(props) {
             return el('h1',{},"kek")
        },
    } );
})(
    window.wp.editor,
    window.wp.blocks,
    window.wp.element,
    window.wp.components
)
