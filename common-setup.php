<?php 
/*
 *
 * 
 * Register library itself & dependencies
 *
 *
 */
// make sure to set correct path to the file
wp_register_script(
    '_gutenberg-common-lib',
    get_template_directory_uri() . '/extensions/gutenberg/common.js',
    array( 'wp-blocks', 'wp-element', 'wp-editor')
);
// make sure to set correct path to the file
wp_register_style(
    '_gutenberg-common-style',
    get_template_directory_uri() . '/extensions/gutenberg/common.css'
);

?>