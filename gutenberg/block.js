(function(editor,blocks,element,components)
{
    // simplify wordpress functions
    var el = element.createElement,
    registerBlockType = blocks.registerBlockType,
    insperctorControls = editor.InspectorControls,
    panelBody = components.PanelBody,
    fragment = element.Fragment;

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
                side:{type:"string"},
                date_time:{type:"string"},
                checkbox_test:{type:"boolean"}
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
                            _common.input.image.init("background"),
                            el('hr',{}),
                            _common.input.color.init("bg_color", "Select color:")
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
                    _common.input.text.callback = (props,object) =>
                    {
                        if(!object.val.includes("px"))
                        {
                            object.val +="px";
                        }
                    },
                    // get simple text input
                    _common.input.text.init("text","Text:"),
                    // get simple checkbox input
                    _common.input.checkbox.init("checkbox_test","Check me!"),
                    // get simple select input
                    _common.input.select.init("side","Select a side:",["left","right"]),
                    // get simple datetime input
                    _common.input.datetime.init("date_time","Select date & time:")
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
