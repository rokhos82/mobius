<?php
require_once __DIR__.'/../php/vendor/autoload.php';

$settings_data = array(
  "general" => array(
    "main" => array(
      "welcome" => array(
        "Welcome to the Mobius. Mobius is a general purpose combat simulator that using JSON to describe the participating actors. The engine is intended to be used with Stellar Conflagration and most of the organizational terms reflect the nature of the game. Mobius and Stellar Conflagration are both works in progress so not all features work or are balanced.",
        "Unit definitions can be imported via a JSON string. The unit detail page is not finished yet, but can be accessed by clicking on the UUID at the bottom of the unit card.",
        "Fleets can be created with a name, faction, and breakoff level. Again the detail page can be accessed by clicking on the UUID at the bottom of the fleet card. On the detail page, fleet information can be changed and units can be added to the fleet. Mass addition of units is also allowed and unit names can be changed.",
        "The combat simulator now requires that a fleets be added via the Fleets page. An attacking fleet and a defending fleet can then be selected and then combat ran. Only a final summary of what units survived the combat is displayed on the combat page. Saving the combat report allows access to a more detailed version.",
        "Work has begun on the Unit Creation Wizard!",
        "Please enjoy and report any problems to the GitHub project page <a class='text-warning' href='https://github.com/rokhos82/mobius/issues' target='_blank'>here</a>."
      )
    ),
    "units" => array(
      "welcome" => array(
        "Welcome to the unit management feature of Mobius. Here you can create new unit templates, import other unit templates, and export existing unit templates."
      )
    )
  )
);

$users = array(
  array(
    "username" => "test",
    "password" => "password",
    "level" => 0,
    "email" => "justin.l.lane@gmail.com",
    "name" => "Justin Lane",
    "uuid" => "custom-mobius-123456"
  )
);

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

$app = new Silex\Application();
$app['debug'] = true;
$app->register(new Silex\Provider\SessionServiceProvider());

$app->get('/',function() {
  return new Response("This page intentionally left blank");
});

$app->get('/settings',function() use ($settings_data) {
  $response = new JsonResponse();
  $response->setEncodingOptions(JSON_NUMERIC_CHECK);
  $response->setData($settings_data);

  return $response;
});

$app->get('/settings/{section}',function(Silex\Application $app,$section) use($settings_data) {
  $response = new JsonResponse();
  $response->setEncodingOptions(JSON_NUMERIC_CHECK);
  $response->setData($settings_data[$section]);
  return $response;
});

$app->post('/auth',function(Request $request) use ($users) {
  $username = $request->get('username');
  $password = $request->get('password');

  if($username === $users[0]['username'] && $password === $users[0]['password']) {
    $app['session']->set('user',$users[0]);
    return $app->json($users[0]);
  }

  $response = new Response();
  $response->headers->set('WWW-Authenticate',sprintf('Basic realm="%s"','site_login'));
  $response->setStatusCode(401,'Please sign in.');
  return $response;
});

$app->run();
?>
