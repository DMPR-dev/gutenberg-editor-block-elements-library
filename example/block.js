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
                imagesssss:{type:"array"},
                linkssssss:{type:"array"},
                bg_color:{type:"string"},
                side:{type:"string"}
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
                            _common.input.image("background"),
                            el('hr',{}),
                            _common.input.color("bg_color", "Select color:")
                        ]),
                        el(panelBody,{title:"Gallery"},
                        [
                            // here we just pass the name of variable that will be used to store the images array
                            _common.gallery.init(object_sample,"imagesssss")
                        ]),
                        el(panelBody,{title:"Links"},
                        [
                            // here we just pass the name of variable that will be used to store the links array
                            _common.link.init("linkssssss")
                        ])
                    ]),
                    _common.input.text("text","Text:"),
                    _common.input.select("side","Select a side:",["left","right"])
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
