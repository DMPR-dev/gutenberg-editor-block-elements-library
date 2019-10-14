(function(editor,blocks,element,components)
{
    // simplify wordpress functions
    var el = element.createElement,
    registerBlockType = blocks.registerBlockType,
    InspectorControls = editor.InspectorControls,
    panelBody = components.PanelBody,
    fragment = element.Fragment;
    InnerBlocks = editor.InnerBlocks;

    var block_attributes = {
        %ATTRIBUTES%
        dummy:{type:"string", gbl_is_hidden:true}
    };
    var block_settings = {
        %SETTINGS%
    };
    var settings_groups = [%SETTINGS_GROUPS%];
    // register our block - js side
    registerBlockType( '%BLOCKNAME%', {
        // PROPERTIES
        title: '%BLOCKTITLE%',

        icon: '%ICON%',

        category: '%CATEGORY%',

        attributes: Object.assign(JSON.parse(JSON.stringify(block_attributes)),JSON.parse(JSON.stringify(block_settings))),
        // edit callback - displayed on the editor
        edit: function(props) 
        {
            var generate_settings = function(fields,is_panel,container_id,setting_id)
            {
                if(is_panel == undefined) is_panel = false;
                if(container_id == undefined) container_id = "";
                if(setting_id == undefined) setting_id = -1;

                var elements = [];
                var attr_local_values = Object.values(fields);
                var attr_local_keys = Object.keys(fields);
                for (var i = 0; i < attr_local_values.length; i++) {
                    if(!attr_local_values[i].gbl_is_hidden)
                    {
                        if(setting_id > -1 && i != setting_id)
                        {
                            continue;
                        }
                        if(container_id.length == 0 || (container_id.length > 0 && attr_local_values[i].settings_container == container_id))
                        {
                            var element = undefined;
                            switch(attr_local_values[i].gbl_elem){
                                case "text":
                                    element = new TextInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "text_plain":
                                    var temp = new TextInput(props);
                                    temp.plain = true;
                                    element = temp.init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "gallery":
                                    element = new Gallery(props).init(attr_local_values[i].list,attr_local_values[i].gbl_name);
                                    break;
                                case "list":
                                    element = new List(props).init(attr_local_values[i].gbl_name,attr_local_values[i].list);
                                    break;
                                case "colorpicker":
                                    element = new ColorInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "checkbox":
                                    element = new CheckBoxInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "fontsizepicker":
                                    element = new FontSizePickerTool(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "aligntool":
                                    element = new AlignmentTool(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "datetime":
                                    element = new DateTimeInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "select":
                                    element = new SelectInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label,attr_local_values[i].list);
                                    break;
                                case "radiogroup":
                                    element = new RadioGroupInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label,attr_local_values[i].list);
                                    break;
                                case "image":
                                    element = new ImageInput(props).init(attr_local_values[i].gbl_name,attr_local_values[i].gbl_label);
                                    break;
                                case "innerblocks":
                                    var args = {};
                                    if(attr_local_values[i].list.length > 0)
                                    {
                                        args = {allowedBlocks:attr_local_values[i].list};
                                    }
                                    element =
                                    [
                                        el('label',{},attr_local_values[i].gbl_label),
                                        el(InnerBlocks,args)
                                    ]
                                    break;

                                default:

                                    break;
                            }
                            if(element != undefined)
                            {
                                elements.push(element);
                            }
                        }
                    }
                }
                return elements;
            };
            var generate_settings_panels = function(fields,settings)
            {
                var push_settigs_into_container = function()
                {
                    var elems = [];
                    for(var j = 0; j <= settings_values.length; j++)
                    {
                        var elem = generate_settings(settings,true,fields[i].ID,j);
                        elems.push(elem);   
                    }
                    return elems;
                }

                if(settings == undefined) settings = [];
                var elements = [];
                for (var i = 0; i <= fields.length; i++) {
                    if(fields[i] != NaN && fields[i] != undefined && fields[i] != null)
                    {
                        var settings_values = Object.values(settings);

                        var element = el(panelBody,{title:fields[i].Name},
                        [
                            push_settigs_into_container()
                        ]);
                        elements.push(element);
                    }
                }
                return elements;
            };
            return el('div',{style:{backgroundColor:"rgba(0,0,0,0.05",padding:"15px"}},
                [
                    el(fragment,{},
                        [
                            el(InspectorControls,{},
                            [
                                generate_settings_panels(settings_groups,block_settings)
                            ]),
                        ]),
                    el("h2",{},"%BLOCKTITLE%"),
                    el("hr"),
                    generate_settings(block_attributes)
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
