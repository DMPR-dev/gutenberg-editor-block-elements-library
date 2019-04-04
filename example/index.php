<?php
function gutenberg_test_block() 
{
    wp_register_script(
        'gutenberg-block-common-script',
        get_template_directory_uri() . '/js/common.js'
    );
        wp_register_style(
        'gutenberg-block-common-style',
        get_template_directory_uri() . '/js/common.css'
    );
    // register javscript for our block
    // and enqueue such scripts like:
    // wp-blocks, wp-element and wp-editor
    wp_register_script(
        'gutenberg-block-test-script',
        get_template_directory_uri() . '/js/block.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor','gutenberg-block-common-script')
    );
    // enqueue media scripts
    wp_enqueue_media();
    // register our block - php side
    // pass array of arguments:
    // editor_script - name of script that we have registered
    // style - style for frontend part
    // editor_style - style for backend part
    // render_callback - php part that renders front-end
    register_block_type( 'gutenberg-editor-widgets/test', array(
        'editor_script' => 'gutenberg-block-test-script',
        'editor_style' => 'gutenberg-block-common-style'
    ) );
}
// attach to 'init' hook
add_action( 'init', 'gutenberg_test_block' );