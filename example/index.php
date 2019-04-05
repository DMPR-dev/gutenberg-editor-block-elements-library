<?php
function gutenberg_test_block() 
{
    // include the dependencies
    // make sure to set correct path to the file
    require_once(get_template_directory() . '/extensions/gutenberg/common-setup.php');
    // register javscript for our block
    // and enqueue common library:
    wp_register_script(
        'gutenberg-block-test-script',
        get_template_directory_uri() . '/extensions/gutenberg/block.js',
        array('_gutenberg-common-lib')
    );
    // enqueue media scripts
    global $post;
    if(!is_null($post) && is_object($post) && $post->ID != null)
    {
        wp_enqueue_media(array('post' => $post->ID));
    }
    // register our block - php side
    // pass array of arguments:
    // editor_script - name of script that we have registered
    // style - style for frontend part
    // editor_style - style for backend part
    register_block_type( 'gutenberg-editor-widgets/test', array(
        'editor_script' => 'gutenberg-block-test-script',
        'editor_style' => '_gutenberg-common-style'
    ) );
}
// attach to 'init' hook
add_action( 'init', 'gutenberg_test_block' );