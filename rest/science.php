<?php
print(json_encode([
  "uuid" => $_POST['uuid']
]));

$projects = [
  "categories" => [[
      "name" => "Research & Development",
      "id" => "cat1",
      "description" => "Something about techs for researching more techs..."
    ],[
      "name" => "Resource Production",
      "id" => "cat2",
      "description" => "More for less..."
    ]
  ],
  "techs" => [[
      "name" => "R&D Tech",
      "id" => "tech1",
      "description" => "Each level of R&D Tech increases the races global reseach bonus by +20.  There are no limits to the number of levels that can be researched.",
      "tier" => 1,
      "category" => "cat1"
    ],[
      "name" => "Learning Tech",
      "id" => "tech2",
      "description" => "A race posessing Learning Tech has a +40 to their global research bonus.",
      "tier" => 1,
      "category" => "cat1"
    ],[
      "name" => "Theoretical Science",
      "id" => "tech3",
      "description" => "Increases any global research bonus by 25% per level.",
      "tier" => 3,
      "category" => "cat1"
    ],[
      "name" => "Industrial Tech",
      "id" => "tech4",
      "description" => "Increases the final RP output of a state by 5% per level.",
      "tier" => 1,
      "category" => "cat2"
    ],[
      "name" => "Agricultural Tech",
      "id" => "tech5",
      "description" => "Allows colonies to be colonized with a Food/Agriculture Products SRP source.  Colonies must be Class M.  Additional research can expand the allowable classes.",
      "tier" => 2,
      "category" => "cat2"
    ]
  ]
];

//print(json_encode($projects));

?>
