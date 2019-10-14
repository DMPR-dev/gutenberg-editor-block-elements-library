<?php

add_action("init","generate_gutenberg_block_slider");
function generate_gutenberg_block_slider()
{
	if(!class_exists("GutenbergBlocksLibrary\Library")){
		return false;
	}
	$lib = new GutenbergBlocksLibrary\Library();

	wp_register_style("vialife-slider-style",get_template_directory_uri() . '/gutenberg-blocks/vialife-slider/style.css');

	wp_register_script("vialife-slider-script",get_template_directory_uri() . '/gutenberg-blocks/vialife-slider/script.js',array("jquery"));

	wp_register_style('slick-style',"//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css");

    wp_register_script('slick-script',"//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js");

	$lib->add_block(array(
			"BlockName" => "vialife-slider",
			"BlockTitle" => "Vialife Slider",
			"Category" => "vialife",
			"Attributes" => array(
				
			),
			"Settings" => array(
				"Groups" => array(
						array(
							"Name" => __("Images Desktop"),
							"ID" => "images_settings",
							"Params" => array(
								array(
									"label" => __("Images Desktop"),
									"name" => "images",
									"type" => "gallery",
									"list_attributes" => array(
										array(
											"caption" => "id", // required
											"value" => ""
										),
										array(
											"caption" => "url", // required
											"value" => ""
										)
									)
								)
							)
						),
						array(
							"Name" => __("Images Mobile"),
							"ID" => "mobile_images_settings",
							"Params" => array(
								array(
									"label" => __("Images Mobile"),
									"name" => "mobile_images",
									"type" => "gallery",
									"list_attributes" => array(
										array(
											"caption" => "id", // required
											"value" => ""
										),
										array(
											"caption" => "url", // required
											"value" => ""
										)
									)
								)
							)
						)
					)
				),
			"CustomStyle" => array("vialife-slider-style","slick-style"),
			"CustomScript" => array("vialife-slider-script","slick-script"),
			"RenderCallback" => "slider_block_callback"
		)
	);
}
function slider_block_callback($attributes,$content)
{
	ob_start();
	$images = $attributes["images"];
	$mobile_images = $attributes["mobile_images"];
	$height = "75vh";
	$height_mobile = "50vh";
	?>
		<div class="gallery mobile-view" id="slider" style="height:<?php echo $height;?>;opacity: 0;">
			<?php
			foreach($images as $image)
			{
				$image = $image["url"]["val"];
				?>
				<div class="gallery-image async-background-image" async-background-image="<?php echo $image;?>">

				</div>
				<?php
			}
			?>
		</div>
		<div class="mobile_gallery mobile-view" style="display: none;height:<?php echo $height;?>;opacity: 0;">
			<?php
			foreach($mobile_images as $image)
			{
				$image = $image["url"]["val"];
				?>
				<div class="gallery-image async-background-image" async-background-image="<?php echo $image;?>">

				</div>
				<?php
			}
			?>
		</div>
		<style>
			@media screen and (max-width: 576px)
			{
				div.gallery.mobile-view
				{
					height: <?Php echo $height_mobile; ?> !important;
				}
			}
		</style>
	<?php
	return ob_get_clean();
}