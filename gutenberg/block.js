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
                checkbox_test:{type:"boolean"},
                radio_text:{type:"string"},
                text_fs:{type:"string"}
            },
        // edit callback - displayed on the editor
        edit: function(props) 
        {
            window.props = props;

            var _common = new Common(props);
            const buttons = 
            [
                 {
                    val:"test1",
                    label:"TEST 1"
                 },
                 {
                    val:"test2",
                    label:"TEST 2"
                 },
                 {
                    val:"test3",
                    label:"TEST 3"
                 }
            ];
            var custom_textbox = new TextInput(props);
            var current_style = custom_textbox.style();
            // edit style for our custom textbox, apply custom font size
            custom_textbox.style = () =>
            {
                return Object.assign({
                        color:"red",
                        background:"black",
                        // apply custom font-size
                        fontSize:props.attributes.text_fs
                },current_style);
            }
            return el(fragment,{},
                [
                    el(insperctorControls,{},
                    [
                        el(panelBody,{title:"Text Size"},
                        [
                            new FontSizePickerInput(props).init("text_fs"),
                        ]),
                        el(panelBody,{title:"Background"},
                        [
                            new ImageInput(props).init("background"),
                            el('hr',{}),
                            new ColorInput(props).init("bg_color", "Select color:")
                        ]),
                        el(panelBody,{title:"Gallery"},
                        [
                            // here we just pass the name of variable that will be used to store the images array
                            new Gallery(props).init(object_sample,"imagesssss")
                        ]),
                        el(panelBody,{title:"Links"},
                        [
                            // here we just pass the name of variable that will be used to store the links array
                            new Link(props).init("linkssssss")
                        ])
                    ]),
                    // edit text on change
                    _common.input.text.callback = (props,object) =>
                    {
                        if(!object.val.includes("px"))
                        {
                            object.val +="px";
                        }
                    },
                    // get customized text input
                    custom_textbox.init("text","I AM customized"),
                    // get simple text input
                    _common.input.text.init("text","Text:"),
                    // get simple checkbox input
                    _common.input.checkbox.init("checkbox_test","Check me!"),
                    // get simple select input
                    _common.input.select.init("side","Select a side:",["left","right"]),
                    // get simple radio buttons group for a few buttons
                    _common.input.radiogroup.init("radio_text","Select 1 of them:",buttons),
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
