<?php 
/*
 *
 * 
 * Register all scripts
 *
 *
 */
wp_register_script('_common_baseinput_class',plugin_dir_url(__FILE__) . '/classes/input/baseinput.js');
wp_register_script('_common_basetools_class',plugin_dir_url(__FILE__) . '/classes/input/tools/basetools.js');


wp_register_script('_common_select_class',plugin_dir_url(__FILE__) . '/classes/input/select.js');
wp_register_script('_common_text_class',plugin_dir_url(__FILE__) . '/classes/input/text.js');
wp_register_script('_common_datetime_class',plugin_dir_url(__FILE__) . '/classes/input/datetime.js');
wp_register_script('_common_image_class',plugin_dir_url(__FILE__) . '/classes/input/image.js');
wp_register_script('_common_color_class',plugin_dir_url(__FILE__) . '/classes/input/color.js');
wp_register_script('_common_checkbox_class',plugin_dir_url(__FILE__) . '/classes/input/checkbox.js');
wp_register_script('_common_radio_class',plugin_dir_url(__FILE__) . '/classes/input/radio.js');
wp_register_script('_common_input_class',plugin_dir_url(__FILE__) . '/classes/input/input.js');


wp_register_script('_common_fontsizepicker_class',plugin_dir_url(__FILE__) . '/classes/input/tools/fontsizepicker.js');
wp_register_script('_common_alignmenttool_class',plugin_dir_url(__FILE__) . '/classes/input/tools/aligntool.js');

wp_register_script('_common_gallery_class',plugin_dir_url(__FILE__) . '/classes/gallery/gallery.js');
wp_register_script('_common_link_class',plugin_dir_url(__FILE__) . '/classes/link/link.js');
wp_register_script('_common_list_class',plugin_dir_url(__FILE__) . '/classes/list/list.js');
wp_register_script('_common_popup_class',plugin_dir_url(__FILE__) . '/classes/popup/popup.js');


wp_register_script(
    '_gutenberg-common-lib',
    plugin_dir_url(__FILE__) . '/common.js',
    array( 
        'wp-blocks', 
        'wp-element', 
        'wp-editor',
        '_common_baseinput_class',
        '_common_basetools_class',
        '_common_input_class',
        '_common_text_class',
        '_common_select_class',
        '_common_datetime_class',
        '_common_image_class',
        '_common_color_class',
        '_common_checkbox_class',
        '_common_radio_class',

        '_common_fontsizepicker_class',
        '_common_alignmenttool_class',

        '_common_gallery_class',
        '_common_link_class',
        '_common_list_class',
        '_common_popup_class'
    )
);
wp_register_style(
    '_gutenberg-common-style',
    plugin_dir_url(__FILE__) . '/common.css'
);

?>