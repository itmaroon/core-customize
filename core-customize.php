<?php

/**
 * Plugin Name:       Core Customize
 * Description:       コアブロックをカスタマイズしました
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            WebクリエイターITmaroon
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       core-customize
 * Domain Path:       itmar-location
 *
 * @package           itmar
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function itmar_core_customize_init_entry()
{
	$dir = dirname(__FILE__);

	//エントリーポイントJavaScript ファイルの読み込み（エンキュー）
	wp_enqueue_script(
		'core_block_entry',
		plugins_url('/build/index.js', __FILE__),
		array(),
		filemtime("$dir/build/index.js"),
		true
	);
	wp_enqueue_style(
		'core_block_entry',
		plugins_url('/build/style-index.css', __FILE__),
		array(),
		filemtime("$dir/build/style-index.css")
	);
}
add_action('enqueue_block_assets', 'itmar_core_customize_init_entry');
