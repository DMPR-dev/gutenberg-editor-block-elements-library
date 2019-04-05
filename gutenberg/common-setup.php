<?php 
/*
 *
 * 
 * Register library itself & dependencies
 *
 *
 */
wp_register_script('_common_baseinput_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/baseinput.js');
wp_register_script('_common_select_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/select.js');
wp_register_script('_common_text_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/text.js');
wp_register_script('_common_datetime_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/datetime.js');
wp_register_script('_common_image_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/image.js');
wp_register_script('_common_color_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/color.js');
wp_register_script('_common_checkbox_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/checkbox.js');
wp_register_script('_common_input_class',get_template_directory_uri() . '/extensions/gutenberg/classes/input/input.js');

wp_register_script('_common_gallery_class',get_template_directory_uri() . '/extensions/gutenberg/classes/gallery/gallery.js');
wp_register_script('_common_link_class',get_template_directory_uri() . '/extensions/gutenberg/classes/link/link.js');


wp_register_script(
    '_gutenberg-common-lib',
    get_template_directory_uri() . '/extensions/gutenberg/common.js',
    array( 
        'wp-blocks', 
        'wp-element', 
        'wp-editor',
        '_common_baseinput_class',
        '_common_input_class',
        '_common_text_class',
        '_common_select_class',
        '_common_datetime_class',
        '_common_image_class',
        '_common_color_class',
        '_common_gallery_class',
        '_common_link_class',
        '_common_checkbox_class'
    )
);
wp_register_style(
    '_gutenberg-common-style',
    get_template_directory_uri() . '/extensions/gutenberg/common.css'
);

?>