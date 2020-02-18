<?php 
/*
 *
 * 
 * Register all scripts
 *
 *
 */
wp_register_script('gutenberg-block-elements-library-baseinput_class',plugin_dir_url(__FILE__) . '/classes/input/baseinput.js');
wp_register_script('gutenberg-block-elements-library-basetools_class',plugin_dir_url(__FILE__) . '/classes/input/tools/basetools.js');


wp_register_script('gutenberg-block-elements-library-select_class',plugin_dir_url(__FILE__) . '/classes/input/select.js');
wp_register_script('gutenberg-block-elements-library-text_class',plugin_dir_url(__FILE__) . '/classes/input/text.js');
wp_register_script('gutenberg-block-elements-library-datetime_class',plugin_dir_url(__FILE__) . '/classes/input/datetime.js');
wp_register_script('gutenberg-block-elements-library-image_class',plugin_dir_url(__FILE__) . '/classes/input/image.js');
wp_register_script('gutenberg-block-elements-library-color_class',plugin_dir_url(__FILE__) . '/classes/input/color.js');
wp_register_script('gutenberg-block-elements-library-checkbox_class',plugin_dir_url(__FILE__) . '/classes/input/checkbox.js');
wp_register_script('gutenberg-block-elements-library-radio_class',plugin_dir_url(__FILE__) . '/classes/input/radio.js');
wp_register_script('gutenberg-block-elements-library-input_class',plugin_dir_url(__FILE__) . '/classes/input/input.js');


wp_register_script('gutenberg-block-elements-library-fontsizepicker_class',plugin_dir_url(__FILE__) . '/classes/input/tools/fontsizepicker.js');
wp_register_script('gutenberg-block-elements-library-alignmenttool_class',plugin_dir_url(__FILE__) . '/classes/input/tools/aligntool.js');

wp_register_script('gutenberg-block-elements-library-gallery_class',plugin_dir_url(__FILE__) . '/classes/gallery/gallery.js');
wp_register_script('gutenberg-block-elements-library-list_class',plugin_dir_url(__FILE__) . '/classes/list/list.js');
wp_register_script('gutenberg-block-elements-library-popup_class',plugin_dir_url(__FILE__) . '/classes/popup/popup.js');

/*
    Localize Some Scripts
*/
wp_localize_script('gutenberg-block-elements-library-color_class','color_translations', array(
    "remove_color"                  => __( "Remove Color" , "gutenberg-block-elements-library"),
));

wp_localize_script('gutenberg-block-elements-library-image_class','img_translations', array(
    "add_image"                     => __( "Add Image" , "gutenberg-block-elements-library"),
    "remove_image"                  => __( "Remove Image" , "gutenberg-block-elements-library"),
    "confirm_deletion"              => __( "Are you sure that you want to delete this image?", "gutenberg-block-elements-library" ),
));

wp_localize_script('gutenberg-block-elements-library-gallery_class','gallery_translations', array(
    "add_to_list"                   => __( "Add To List" , "gutenberg-block-elements-library"),
    "remove_image"                  => __( "Remove Image" , "gutenberg-block-elements-library"),
    "confirm_deletion_from_list"    => __( "Are you sure that you want to delete this object?", "gutenberg-block-elements-library" ),
    "up"                            => __( "UP" , "gutenberg-block-elements-library"),
    "down"                          => __( "DOWN" , "gutenberg-block-elements-library"),
    "edit"                          => __( "Edit" , "gutenberg-block-elements-library")
));

wp_localize_script('gutenberg-block-elements-library-list_class','list_translations', array(
    "add_to_list"                   => __( "Add To List" , "gutenberg-block-elements-library"),
    "confirm_deletion_from_list"    => __( "Are you sure that you want to delete this object?", "gutenberg-block-elements-library" ),
    "up"                            => __( "UP" , "gutenberg-block-elements-library"),
    "down"                          => __( "DOWN" , "gutenberg-block-elements-library"),
));

wp_localize_script('gutenberg-block-elements-library-popup_class','popup_translations', array(
    "save_and_close"                   => __( "Save and Close" , "gutenberg-block-elements-library"),
    "close"    => __( "Close", "gutenberg-block-elements-library" )
));

wp_register_script(
    '_gutenberg-common-lib',
    plugin_dir_url(__FILE__) . '/common.js',
    array( 
        'wp-blocks', 
        'wp-element', 
        'wp-editor',
        'gutenberg-block-elements-library-baseinput_class',
        'gutenberg-block-elements-library-basetools_class',
        'gutenberg-block-elements-library-input_class',
        'gutenberg-block-elements-library-text_class',
        'gutenberg-block-elements-library-select_class',
        'gutenberg-block-elements-library-datetime_class',
        'gutenberg-block-elements-library-image_class',
        'gutenberg-block-elements-library-color_class',
        'gutenberg-block-elements-library-checkbox_class',
        'gutenberg-block-elements-library-radio_class',

        'gutenberg-block-elements-library-fontsizepicker_class',
        'gutenberg-block-elements-library-alignmenttool_class',

        'gutenberg-block-elements-library-gallery_class',
        'gutenberg-block-elements-library-list_class',
        'gutenberg-block-elements-library-popup_class'
    )
);
wp_register_style(
    '_gutenberg-common-style',
    plugin_dir_url(__FILE__) . '/common.css'
);

?>