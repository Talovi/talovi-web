<?php

/**
 * Drupal entry-point wrapper for Chemicloud shared hosting.
 *
 * Problem: The outer public_html/.htaccess rewrites all requests to web/$1.
 * LiteSpeed then sets SCRIPT_NAME=/web/index.php (prefixed with /web/).
 * Symfony's Request::prepareBaseUrl() extracts '/web' as the base path.
 * Drupal's externalIsLocal() checks that redirect URLs start with base_path,
 * so '/user/1/edit' fails the '/web' prefix check → 400 "external redirect".
 *
 * Fix: Set SCRIPT_NAME/PHP_SELF/SCRIPT_FILENAME to what they would be if
 * Drupal were served directly from the document root, then boot normally.
 */

$_SERVER['SCRIPT_NAME']     = '/index.php';
$_SERVER['PHP_SELF']        = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/web/index.php';

chdir(__DIR__ . '/web');
require __DIR__ . '/web/index.php';
