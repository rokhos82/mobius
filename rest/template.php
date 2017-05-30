<?php
use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Symfony\Component\HttpFoundation\Request;

$app = new Application();
$app->register(new TwigServiceProvider());
$app['twig-path'] = [ __DIR__ ];

$app->get('/rest/template/get/{}',function($uuid) {});
?>
 
