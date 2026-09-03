// 2025-26 regular season offensive K=8 model, restart=2.
// distanceToCentroid is Euclidean distance in the standardized 31D feature space.
// Smaller distance = more prototypical member of the assigned archetype.

export type OffensiveArchetypeDistance = {
  playerName: string;
  cluster: number;
  distanceToCentroid: number;
  touches: number;
};

export const offensiveArchetypeDistances: OffensiveArchetypeDistance[] = [
  {
    "playerName": "Victor Wembanyama",
    "cluster": 1,
    "distanceToCentroid": 2.569991,
    "touches": 3749
  },
  {
    "playerName": "Jonathan Kuminga",
    "cluster": 1,
    "distanceToCentroid": 2.705488,
    "touches": 1499
  },
  {
    "playerName": "Evan Mobley",
    "cluster": 1,
    "distanceToCentroid": 2.928535,
    "touches": 4212
  },
  {
    "playerName": "Miles Bridges",
    "cluster": 1,
    "distanceToCentroid": 2.983016,
    "touches": 3983
  },
  {
    "playerName": "Bam Adebayo",
    "cluster": 1,
    "distanceToCentroid": 3.244502,
    "touches": 4237
  },
  {
    "playerName": "Chet Holmgren",
    "cluster": 1,
    "distanceToCentroid": 3.265405,
    "touches": 3115
  },
  {
    "playerName": "Julius Randle",
    "cluster": 1,
    "distanceToCentroid": 3.411323,
    "touches": 4814
  },
  {
    "playerName": "Saddiq Bey",
    "cluster": 1,
    "distanceToCentroid": 3.454417,
    "touches": 3096
  },
  {
    "playerName": "P.J. Washington",
    "cluster": 1,
    "distanceToCentroid": 3.558242,
    "touches": 2746
  },
  {
    "playerName": "Aaron Gordon",
    "cluster": 1,
    "distanceToCentroid": 3.6,
    "touches": 1728
  },
  {
    "playerName": "Franz Wagner",
    "cluster": 1,
    "distanceToCentroid": 3.60515,
    "touches": 1838
  },
  {
    "playerName": "Jae'Sean Tate",
    "cluster": 1,
    "distanceToCentroid": 3.690871,
    "touches": 524
  },
  {
    "playerName": "Scottie Barnes",
    "cluster": 1,
    "distanceToCentroid": 3.720793,
    "touches": 5652
  },
  {
    "playerName": "Jaren Jackson Jr.",
    "cluster": 1,
    "distanceToCentroid": 3.759807,
    "touches": 2341
  },
  {
    "playerName": "Pascal Siakam",
    "cluster": 1,
    "distanceToCentroid": 3.843535,
    "touches": 4311
  },
  {
    "playerName": "Anthony Davis",
    "cluster": 1,
    "distanceToCentroid": 3.923503,
    "touches": 1185
  },
  {
    "playerName": "RJ Barrett",
    "cluster": 1,
    "distanceToCentroid": 3.938358,
    "touches": 3102
  },
  {
    "playerName": "Joel Embiid",
    "cluster": 1,
    "distanceToCentroid": 3.981536,
    "touches": 2638
  },
  {
    "playerName": "Keldon Johnson",
    "cluster": 1,
    "distanceToCentroid": 3.987685,
    "touches": 3013
  },
  {
    "playerName": "Alperen Sengun",
    "cluster": 1,
    "distanceToCentroid": 4.066232,
    "touches": 5124
  },
  {
    "playerName": "Tobias Harris",
    "cluster": 1,
    "distanceToCentroid": 4.259598,
    "touches": 2669
  },
  {
    "playerName": "Andrew Wiggins",
    "cluster": 1,
    "distanceToCentroid": 4.417191,
    "touches": 2934
  },
  {
    "playerName": "Jimmy Butler III",
    "cluster": 1,
    "distanceToCentroid": 4.421837,
    "touches": 2440
  },
  {
    "playerName": "Paolo Banchero",
    "cluster": 1,
    "distanceToCentroid": 4.456914,
    "touches": 5501
  },
  {
    "playerName": "Precious Achiuwa",
    "cluster": 1,
    "distanceToCentroid": 4.476258,
    "touches": 2243
  },
  {
    "playerName": "Karl-Anthony Towns",
    "cluster": 1,
    "distanceToCentroid": 4.521877,
    "touches": 3925
  },
  {
    "playerName": "LeBron James",
    "cluster": 1,
    "distanceToCentroid": 4.682349,
    "touches": 4204
  },
  {
    "playerName": "Jerami Grant",
    "cluster": 1,
    "distanceToCentroid": 4.772841,
    "touches": 2640
  },
  {
    "playerName": "Derik Queen",
    "cluster": 1,
    "distanceToCentroid": 4.779044,
    "touches": 4036
  },
  {
    "playerName": "Cam Whitmore",
    "cluster": 1,
    "distanceToCentroid": 4.82975,
    "touches": 432
  },
  {
    "playerName": "Kristaps Porzingis",
    "cluster": 1,
    "distanceToCentroid": 4.962264,
    "touches": 1306
  },
  {
    "playerName": "Nikola Jokic",
    "cluster": 1,
    "distanceToCentroid": 5.554489,
    "touches": 6539
  },
  {
    "playerName": "Giannis Antetokounmpo",
    "cluster": 1,
    "distanceToCentroid": 5.642166,
    "touches": 2553
  },
  {
    "playerName": "Nate Williams",
    "cluster": 1,
    "distanceToCentroid": 5.790866,
    "touches": 261
  },
  {
    "playerName": "Zion Williamson",
    "cluster": 1,
    "distanceToCentroid": 6.13303,
    "touches": 3041
  },
  {
    "playerName": "Jamir Watkins",
    "cluster": 2,
    "distanceToCentroid": 1.757809,
    "touches": 1298
  },
  {
    "playerName": "Sandro Mamukelashvili",
    "cluster": 2,
    "distanceToCentroid": 1.975766,
    "touches": 2778
  },
  {
    "playerName": "Tidjane Salaun",
    "cluster": 2,
    "distanceToCentroid": 2.171871,
    "touches": 828
  },
  {
    "playerName": "Ryan Dunn",
    "cluster": 2,
    "distanceToCentroid": 2.339161,
    "touches": 1770
  },
  {
    "playerName": "Toumani Camara",
    "cluster": 2,
    "distanceToCentroid": 2.41485,
    "touches": 4537
  },
  {
    "playerName": "Jaylon Tyson",
    "cluster": 2,
    "distanceToCentroid": 2.467308,
    "touches": 2676
  },
  {
    "playerName": "Harrison Barnes",
    "cluster": 2,
    "distanceToCentroid": 2.473818,
    "touches": 2425
  },
  {
    "playerName": "Matisse Thybulle",
    "cluster": 2,
    "distanceToCentroid": 2.503246,
    "touches": 644
  },
  {
    "playerName": "Hugo Gonzalez",
    "cluster": 2,
    "distanceToCentroid": 2.561381,
    "touches": 1275
  },
  {
    "playerName": "Ja'Kobe Walter",
    "cluster": 2,
    "distanceToCentroid": 2.57742,
    "touches": 1789
  },
  {
    "playerName": "Daeqwon Plowden",
    "cluster": 2,
    "distanceToCentroid": 2.606965,
    "touches": 1111
  },
  {
    "playerName": "Obi Toppin",
    "cluster": 2,
    "distanceToCentroid": 2.640622,
    "touches": 920
  },
  {
    "playerName": "Ochai Agbaji",
    "cluster": 2,
    "distanceToCentroid": 2.650022,
    "touches": 1222
  },
  {
    "playerName": "Jordan Goodwin",
    "cluster": 2,
    "distanceToCentroid": 2.651341,
    "touches": 2737
  },
  {
    "playerName": "Josh Okogie",
    "cluster": 2,
    "distanceToCentroid": 2.674889,
    "touches": 1398
  },
  {
    "playerName": "Jake LaRavia",
    "cluster": 2,
    "distanceToCentroid": 2.727814,
    "touches": 3034
  },
  {
    "playerName": "Liam McNeeley",
    "cluster": 2,
    "distanceToCentroid": 2.729593,
    "touches": 474
  },
  {
    "playerName": "Tari Eason",
    "cluster": 2,
    "distanceToCentroid": 2.775158,
    "touches": 2339
  },
  {
    "playerName": "Alex Caruso",
    "cluster": 2,
    "distanceToCentroid": 2.812442,
    "touches": 1647
  },
  {
    "playerName": "Jabari Walker",
    "cluster": 2,
    "distanceToCentroid": 2.826804,
    "touches": 906
  },
  {
    "playerName": "Carter Bryant",
    "cluster": 2,
    "distanceToCentroid": 2.860524,
    "touches": 1020
  },
  {
    "playerName": "Quinten Post",
    "cluster": 2,
    "distanceToCentroid": 2.876788,
    "touches": 2144
  },
  {
    "playerName": "Tristan da Silva",
    "cluster": 2,
    "distanceToCentroid": 2.896029,
    "touches": 2413
  },
  {
    "playerName": "Herbert Jones",
    "cluster": 2,
    "distanceToCentroid": 2.897116,
    "touches": 2498
  },
  {
    "playerName": "Javonte Green",
    "cluster": 2,
    "distanceToCentroid": 2.913458,
    "touches": 1992
  },
  {
    "playerName": "Tyler Burton",
    "cluster": 2,
    "distanceToCentroid": 2.957961,
    "touches": 403
  },
  {
    "playerName": "Guerschon Yabusele",
    "cluster": 2,
    "distanceToCentroid": 2.996818,
    "touches": 1415
  },
  {
    "playerName": "Keon Ellis",
    "cluster": 2,
    "distanceToCentroid": 3.03761,
    "touches": 1741
  },
  {
    "playerName": "Derrick Jones Jr.",
    "cluster": 2,
    "distanceToCentroid": 3.190558,
    "touches": 1672
  },
  {
    "playerName": "Sidy Cissoko",
    "cluster": 2,
    "distanceToCentroid": 3.195451,
    "touches": 1775
  },
  {
    "playerName": "Josh Minott",
    "cluster": 2,
    "distanceToCentroid": 3.198516,
    "touches": 935
  },
  {
    "playerName": "Grant Williams",
    "cluster": 2,
    "distanceToCentroid": 3.202317,
    "touches": 978
  },
  {
    "playerName": "Jarred Vanderbilt",
    "cluster": 2,
    "distanceToCentroid": 3.214529,
    "touches": 1449
  },
  {
    "playerName": "Taylor Hendricks",
    "cluster": 2,
    "distanceToCentroid": 3.295228,
    "touches": 1268
  },
  {
    "playerName": "Jeremiah Robinson-Earl",
    "cluster": 2,
    "distanceToCentroid": 3.305526,
    "touches": 479
  },
  {
    "playerName": "Julian Champagnie",
    "cluster": 2,
    "distanceToCentroid": 3.327835,
    "touches": 3121
  },
  {
    "playerName": "Naz Reid",
    "cluster": 2,
    "distanceToCentroid": 3.362,
    "touches": 3857
  },
  {
    "playerName": "Kevin Love",
    "cluster": 2,
    "distanceToCentroid": 3.386403,
    "touches": 1129
  },
  {
    "playerName": "Johnny Furphy",
    "cluster": 2,
    "distanceToCentroid": 3.410092,
    "touches": 959
  },
  {
    "playerName": "Adama Bal",
    "cluster": 2,
    "distanceToCentroid": 3.412085,
    "touches": 293
  },
  {
    "playerName": "Ronald Holland II",
    "cluster": 2,
    "distanceToCentroid": 3.41514,
    "touches": 2482
  },
  {
    "playerName": "Pat Connaughton",
    "cluster": 2,
    "distanceToCentroid": 3.436098,
    "touches": 470
  },
  {
    "playerName": "Olivier-Maxence Prosper",
    "cluster": 2,
    "distanceToCentroid": 3.437779,
    "touches": 1374
  },
  {
    "playerName": "Jordan Walsh",
    "cluster": 2,
    "distanceToCentroid": 3.441788,
    "touches": 1237
  },
  {
    "playerName": "Leaky Black",
    "cluster": 2,
    "distanceToCentroid": 3.442775,
    "touches": 517
  },
  {
    "playerName": "Spencer Jones",
    "cluster": 2,
    "distanceToCentroid": 3.456258,
    "touches": 1087
  },
  {
    "playerName": "Justin Champagnie",
    "cluster": 2,
    "distanceToCentroid": 3.465511,
    "touches": 2089
  },
  {
    "playerName": "Ben Sheppard",
    "cluster": 2,
    "distanceToCentroid": 3.476358,
    "touches": 2203
  },
  {
    "playerName": "Lucas Williamson",
    "cluster": 2,
    "distanceToCentroid": 3.482881,
    "touches": 378
  },
  {
    "playerName": "Jalen Smith",
    "cluster": 2,
    "distanceToCentroid": 3.61782,
    "touches": 1826
  },
  {
    "playerName": "Gary Payton II",
    "cluster": 2,
    "distanceToCentroid": 3.622795,
    "touches": 2105
  },
  {
    "playerName": "Nae'Qwan Tomlin",
    "cluster": 2,
    "distanceToCentroid": 3.62728,
    "touches": 1127
  },
  {
    "playerName": "Pete Nance",
    "cluster": 2,
    "distanceToCentroid": 3.662915,
    "touches": 1132
  },
  {
    "playerName": "Christian Braun",
    "cluster": 2,
    "distanceToCentroid": 3.685868,
    "touches": 2096
  },
  {
    "playerName": "A.J. Lawson",
    "cluster": 2,
    "distanceToCentroid": 3.689588,
    "touches": 280
  },
  {
    "playerName": "Dorian Finney-Smith",
    "cluster": 2,
    "distanceToCentroid": 3.70071,
    "touches": 741
  },
  {
    "playerName": "Leonard Miller",
    "cluster": 2,
    "distanceToCentroid": 3.711305,
    "touches": 1183
  },
  {
    "playerName": "Onyeka Okongwu",
    "cluster": 2,
    "distanceToCentroid": 3.730006,
    "touches": 3820
  },
  {
    "playerName": "Jaylen Clark",
    "cluster": 2,
    "distanceToCentroid": 3.774572,
    "touches": 826
  },
  {
    "playerName": "John Collins",
    "cluster": 2,
    "distanceToCentroid": 3.804749,
    "touches": 2525
  },
  {
    "playerName": "Kel'el Ware",
    "cluster": 2,
    "distanceToCentroid": 3.883136,
    "touches": 2361
  },
  {
    "playerName": "Isaac Okoro",
    "cluster": 2,
    "distanceToCentroid": 3.883581,
    "touches": 1851
  },
  {
    "playerName": "Mohamed Diawara",
    "cluster": 2,
    "distanceToCentroid": 3.899404,
    "touches": 1005
  },
  {
    "playerName": "Dean Wade",
    "cluster": 2,
    "distanceToCentroid": 3.916851,
    "touches": 1679
  },
  {
    "playerName": "Karlo Matkovic",
    "cluster": 2,
    "distanceToCentroid": 3.930851,
    "touches": 1031
  },
  {
    "playerName": "Isaiah Livers",
    "cluster": 2,
    "distanceToCentroid": 3.937649,
    "touches": 379
  },
  {
    "playerName": "Bryce McGowens",
    "cluster": 2,
    "distanceToCentroid": 3.964724,
    "touches": 1147
  },
  {
    "playerName": "Larry Nance Jr.",
    "cluster": 2,
    "distanceToCentroid": 3.999301,
    "touches": 581
  },
  {
    "playerName": "Will Richard",
    "cluster": 2,
    "distanceToCentroid": 4.001087,
    "touches": 1685
  },
  {
    "playerName": "E.J. Liddell",
    "cluster": 2,
    "distanceToCentroid": 4.043959,
    "touches": 493
  },
  {
    "playerName": "Josh Green",
    "cluster": 2,
    "distanceToCentroid": 4.102686,
    "touches": 795
  },
  {
    "playerName": "Mouhamed Gueye",
    "cluster": 2,
    "distanceToCentroid": 4.195656,
    "touches": 1448
  },
  {
    "playerName": "Duop Reath",
    "cluster": 2,
    "distanceToCentroid": 4.231033,
    "touches": 305
  },
  {
    "playerName": "Max Strus",
    "cluster": 2,
    "distanceToCentroid": 4.234571,
    "touches": 511
  },
  {
    "playerName": "Gary Harris",
    "cluster": 2,
    "distanceToCentroid": 4.28557,
    "touches": 724
  },
  {
    "playerName": "Luguentz Dort",
    "cluster": 2,
    "distanceToCentroid": 4.292692,
    "touches": 1948
  },
  {
    "playerName": "Blake Hinson",
    "cluster": 2,
    "distanceToCentroid": 4.321039,
    "touches": 360
  },
  {
    "playerName": "Al Horford",
    "cluster": 2,
    "distanceToCentroid": 4.363887,
    "touches": 1945
  },
  {
    "playerName": "Thomas Bryant",
    "cluster": 2,
    "distanceToCentroid": 4.493301,
    "touches": 1193
  },
  {
    "playerName": "Julian Phillips",
    "cluster": 2,
    "distanceToCentroid": 4.582434,
    "touches": 383
  },
  {
    "playerName": "Kelly Oubre Jr.",
    "cluster": 2,
    "distanceToCentroid": 4.587869,
    "touches": 2286
  },
  {
    "playerName": "Drew Timme",
    "cluster": 2,
    "distanceToCentroid": 4.596609,
    "touches": 375
  },
  {
    "playerName": "Asa Newell",
    "cluster": 2,
    "distanceToCentroid": 4.601439,
    "touches": 658
  },
  {
    "playerName": "Micah Potter",
    "cluster": 2,
    "distanceToCentroid": 4.848383,
    "touches": 1451
  },
  {
    "playerName": "Myles Turner",
    "cluster": 2,
    "distanceToCentroid": 4.858045,
    "touches": 2275
  },
  {
    "playerName": "Bobby Portis",
    "cluster": 2,
    "distanceToCentroid": 4.861416,
    "touches": 3092
  },
  {
    "playerName": "Jaylin Williams",
    "cluster": 2,
    "distanceToCentroid": 4.89822,
    "touches": 2685
  },
  {
    "playerName": "Dariq Whitehead",
    "cluster": 2,
    "distanceToCentroid": 4.998562,
    "touches": 278
  },
  {
    "playerName": "Royce O'Neale",
    "cluster": 2,
    "distanceToCentroid": 5.008812,
    "touches": 4132
  },
  {
    "playerName": "Jeremy Sochan",
    "cluster": 2,
    "distanceToCentroid": 5.182373,
    "touches": 686
  },
  {
    "playerName": "Branden Carlson",
    "cluster": 2,
    "distanceToCentroid": 5.31623,
    "touches": 727
  },
  {
    "playerName": "DaRon Holmes II",
    "cluster": 2,
    "distanceToCentroid": 5.425191,
    "touches": 273
  },
  {
    "playerName": "Jay Huff",
    "cluster": 2,
    "distanceToCentroid": 5.452656,
    "touches": 2386
  },
  {
    "playerName": "Brook Lopez",
    "cluster": 2,
    "distanceToCentroid": 5.459097,
    "touches": 1928
  },
  {
    "playerName": "Rui Hachimura",
    "cluster": 2,
    "distanceToCentroid": 5.556229,
    "touches": 2061
  },
  {
    "playerName": "Rasheer Fleming",
    "cluster": 2,
    "distanceToCentroid": 5.626142,
    "touches": 595
  },
  {
    "playerName": "Draymond Green",
    "cluster": 2,
    "distanceToCentroid": 5.679307,
    "touches": 4693
  },
  {
    "playerName": "Tristan Vukcevic",
    "cluster": 2,
    "distanceToCentroid": 5.679439,
    "touches": 1160
  },
  {
    "playerName": "Nikola Vucevic",
    "cluster": 2,
    "distanceToCentroid": 6.122434,
    "touches": 3789
  },
  {
    "playerName": "Nicolas Batum",
    "cluster": 2,
    "distanceToCentroid": 6.431644,
    "touches": 1717
  },
  {
    "playerName": "Garrison Mathews",
    "cluster": 2,
    "distanceToCentroid": 6.776729,
    "touches": 255
  },
  {
    "playerName": "Max Christie",
    "cluster": 3,
    "distanceToCentroid": 1.71969,
    "touches": 3044
  },
  {
    "playerName": "Svi Mykhailiuk",
    "cluster": 3,
    "distanceToCentroid": 2.142415,
    "touches": 1443
  },
  {
    "playerName": "Nickeil Alexander-Walker",
    "cluster": 3,
    "distanceToCentroid": 2.276748,
    "touches": 4597
  },
  {
    "playerName": "De'Andre Hunter",
    "cluster": 3,
    "distanceToCentroid": 2.633498,
    "touches": 1839
  },
  {
    "playerName": "Jaden Ivey",
    "cluster": 3,
    "distanceToCentroid": 2.635968,
    "touches": 1119
  },
  {
    "playerName": "Corey Kispert",
    "cluster": 3,
    "distanceToCentroid": 2.713896,
    "touches": 1458
  },
  {
    "playerName": "Ethan Thompson",
    "cluster": 3,
    "distanceToCentroid": 2.71753,
    "touches": 977
  },
  {
    "playerName": "Landry Shamet",
    "cluster": 3,
    "distanceToCentroid": 2.779632,
    "touches": 1442
  },
  {
    "playerName": "Vit Krejci",
    "cluster": 3,
    "distanceToCentroid": 2.870199,
    "touches": 1964
  },
  {
    "playerName": "Cormac Ryan",
    "cluster": 3,
    "distanceToCentroid": 2.882951,
    "touches": 394
  },
  {
    "playerName": "Aaron Nesmith",
    "cluster": 3,
    "distanceToCentroid": 2.923188,
    "touches": 2249
  },
  {
    "playerName": "Zaccharie Risacher",
    "cluster": 3,
    "distanceToCentroid": 2.930925,
    "touches": 1767
  },
  {
    "playerName": "Kon Knueppel",
    "cluster": 3,
    "distanceToCentroid": 2.935715,
    "touches": 4146
  },
  {
    "playerName": "Jaylen Wells",
    "cluster": 3,
    "distanceToCentroid": 2.943753,
    "touches": 2165
  },
  {
    "playerName": "Kevin Huerter",
    "cluster": 3,
    "distanceToCentroid": 2.969874,
    "touches": 2590
  },
  {
    "playerName": "Trey Murphy III",
    "cluster": 3,
    "distanceToCentroid": 2.99918,
    "touches": 4042
  },
  {
    "playerName": "Gradey Dick",
    "cluster": 3,
    "distanceToCentroid": 3.041934,
    "touches": 1230
  },
  {
    "playerName": "Noah Clowney",
    "cluster": 3,
    "distanceToCentroid": 3.109031,
    "touches": 2506
  },
  {
    "playerName": "Buddy Hield",
    "cluster": 3,
    "distanceToCentroid": 3.163706,
    "touches": 1514
  },
  {
    "playerName": "Baylor Scheierman",
    "cluster": 3,
    "distanceToCentroid": 3.17295,
    "touches": 1655
  },
  {
    "playerName": "Justin Edwards",
    "cluster": 3,
    "distanceToCentroid": 3.186108,
    "touches": 1418
  },
  {
    "playerName": "Drake Powell",
    "cluster": 3,
    "distanceToCentroid": 3.285058,
    "touches": 1846
  },
  {
    "playerName": "Cameron Johnson",
    "cluster": 3,
    "distanceToCentroid": 3.289021,
    "touches": 2024
  },
  {
    "playerName": "Julian Strawther",
    "cluster": 3,
    "distanceToCentroid": 3.309267,
    "touches": 1242
  },
  {
    "playerName": "Jared McCain",
    "cluster": 3,
    "distanceToCentroid": 3.309918,
    "touches": 1930
  },
  {
    "playerName": "Ziaire Williams",
    "cluster": 3,
    "distanceToCentroid": 3.311343,
    "touches": 1493
  },
  {
    "playerName": "Isaiah Joe",
    "cluster": 3,
    "distanceToCentroid": 3.361925,
    "touches": 1970
  },
  {
    "playerName": "Will Riley",
    "cluster": 3,
    "distanceToCentroid": 3.396772,
    "touches": 2611
  },
  {
    "playerName": "Amir Coffey",
    "cluster": 3,
    "distanceToCentroid": 3.400877,
    "touches": 496
  },
  {
    "playerName": "Keegan Murray",
    "cluster": 3,
    "distanceToCentroid": 3.406042,
    "touches": 1055
  },
  {
    "playerName": "Jalen Wilson",
    "cluster": 3,
    "distanceToCentroid": 3.430324,
    "touches": 1222
  },
  {
    "playerName": "Devin Vassell",
    "cluster": 3,
    "distanceToCentroid": 3.445416,
    "touches": 2830
  },
  {
    "playerName": "Ron Harper Jr.",
    "cluster": 3,
    "distanceToCentroid": 3.453743,
    "touches": 450
  },
  {
    "playerName": "Luke Kennard",
    "cluster": 3,
    "distanceToCentroid": 3.531962,
    "touches": 2244
  },
  {
    "playerName": "Moses Moody",
    "cluster": 3,
    "distanceToCentroid": 3.537433,
    "touches": 1871
  },
  {
    "playerName": "Quentin Grimes",
    "cluster": 3,
    "distanceToCentroid": 3.567319,
    "touches": 3566
  },
  {
    "playerName": "Jamal Cain",
    "cluster": 3,
    "distanceToCentroid": 3.591345,
    "touches": 571
  },
  {
    "playerName": "Brice Sensabaugh",
    "cluster": 3,
    "distanceToCentroid": 3.612228,
    "touches": 2779
  },
  {
    "playerName": "Zach LaVine",
    "cluster": 3,
    "distanceToCentroid": 3.628246,
    "touches": 1999
  },
  {
    "playerName": "Brandon Miller",
    "cluster": 3,
    "distanceToCentroid": 3.69958,
    "touches": 3829
  },
  {
    "playerName": "Taurean Prince",
    "cluster": 3,
    "distanceToCentroid": 3.711954,
    "touches": 819
  },
  {
    "playerName": "Paul George",
    "cluster": 3,
    "distanceToCentroid": 3.722482,
    "touches": 2302
  },
  {
    "playerName": "Caleb Love",
    "cluster": 3,
    "distanceToCentroid": 3.738896,
    "touches": 1854
  },
  {
    "playerName": "Jamison Battle",
    "cluster": 3,
    "distanceToCentroid": 3.757481,
    "touches": 575
  },
  {
    "playerName": "Donte DiVincenzo",
    "cluster": 3,
    "distanceToCentroid": 3.760638,
    "touches": 4489
  },
  {
    "playerName": "Jordan Hawkins",
    "cluster": 3,
    "distanceToCentroid": 3.769857,
    "touches": 883
  },
  {
    "playerName": "MarJon Beauchamp",
    "cluster": 3,
    "distanceToCentroid": 3.780506,
    "touches": 272
  },
  {
    "playerName": "Sam Merrill",
    "cluster": 3,
    "distanceToCentroid": 3.784097,
    "touches": 2128
  },
  {
    "playerName": "Jaden Hardy",
    "cluster": 3,
    "distanceToCentroid": 3.784507,
    "touches": 1317
  },
  {
    "playerName": "Grayson Allen",
    "cluster": 3,
    "distanceToCentroid": 3.839099,
    "touches": 2753
  },
  {
    "playerName": "Dalton Knecht",
    "cluster": 3,
    "distanceToCentroid": 3.973738,
    "touches": 704
  },
  {
    "playerName": "Jett Howard",
    "cluster": 3,
    "distanceToCentroid": 3.999518,
    "touches": 755
  },
  {
    "playerName": "Micah Peavy",
    "cluster": 3,
    "distanceToCentroid": 4.003502,
    "touches": 959
  },
  {
    "playerName": "Jordan Clarkson",
    "cluster": 3,
    "distanceToCentroid": 4.065615,
    "touches": 1632
  },
  {
    "playerName": "Simone Fontecchio",
    "cluster": 3,
    "distanceToCentroid": 4.115887,
    "touches": 1774
  },
  {
    "playerName": "Tre Johnson",
    "cluster": 3,
    "distanceToCentroid": 4.119149,
    "touches": 2014
  },
  {
    "playerName": "Taelon Peter",
    "cluster": 3,
    "distanceToCentroid": 4.136868,
    "touches": 786
  },
  {
    "playerName": "Tyson Etienne",
    "cluster": 3,
    "distanceToCentroid": 4.166772,
    "touches": 580
  },
  {
    "playerName": "Mikal Bridges",
    "cluster": 3,
    "distanceToCentroid": 4.186711,
    "touches": 4510
  },
  {
    "playerName": "Duncan Robinson",
    "cluster": 3,
    "distanceToCentroid": 4.1986,
    "touches": 2534
  },
  {
    "playerName": "OG Anunoby",
    "cluster": 3,
    "distanceToCentroid": 4.259668,
    "touches": 2927
  },
  {
    "playerName": "Lindy Waters III",
    "cluster": 3,
    "distanceToCentroid": 4.309988,
    "touches": 403
  },
  {
    "playerName": "Tim Hardaway Jr.",
    "cluster": 3,
    "distanceToCentroid": 4.350106,
    "touches": 2502
  },
  {
    "playerName": "Jabari Smith Jr.",
    "cluster": 3,
    "distanceToCentroid": 4.456889,
    "touches": 4000
  },
  {
    "playerName": "Michael Porter Jr.",
    "cluster": 3,
    "distanceToCentroid": 4.841196,
    "touches": 3063
  },
  {
    "playerName": "John Poulakidas",
    "cluster": 3,
    "distanceToCentroid": 4.944818,
    "touches": 283
  },
  {
    "playerName": "Ace Bailey",
    "cluster": 3,
    "distanceToCentroid": 4.984497,
    "touches": 2410
  },
  {
    "playerName": "Gary Trent Jr.",
    "cluster": 3,
    "distanceToCentroid": 5.093623,
    "touches": 1334
  },
  {
    "playerName": "Sam Hauser",
    "cluster": 3,
    "distanceToCentroid": 5.236728,
    "touches": 2768
  },
  {
    "playerName": "AJ Green",
    "cluster": 3,
    "distanceToCentroid": 5.248215,
    "touches": 3470
  },
  {
    "playerName": "Lauri Markkanen",
    "cluster": 3,
    "distanceToCentroid": 5.295382,
    "touches": 2224
  },
  {
    "playerName": "Klay Thompson",
    "cluster": 3,
    "distanceToCentroid": 5.723546,
    "touches": 1718
  },
  {
    "playerName": "Doug McDermott",
    "cluster": 3,
    "distanceToCentroid": 6.062703,
    "touches": 570
  },
  {
    "playerName": "Chaz Lanier",
    "cluster": 3,
    "distanceToCentroid": 6.829836,
    "touches": 251
  },
  {
    "playerName": "DeJon Jarreau",
    "cluster": 4,
    "distanceToCentroid": 2.125983,
    "touches": 522
  },
  {
    "playerName": "Ayo Dosunmu",
    "cluster": 4,
    "distanceToCentroid": 2.180258,
    "touches": 3688
  },
  {
    "playerName": "Caleb Martin",
    "cluster": 4,
    "distanceToCentroid": 2.218595,
    "touches": 1040
  },
  {
    "playerName": "Gui Santos",
    "cluster": 4,
    "distanceToCentroid": 2.281779,
    "touches": 2618
  },
  {
    "playerName": "Bilal Coulibaly",
    "cluster": 4,
    "distanceToCentroid": 2.361379,
    "touches": 2558
  },
  {
    "playerName": "Kobe Brown",
    "cluster": 4,
    "distanceToCentroid": 2.429807,
    "touches": 1407
  },
  {
    "playerName": "Nique Clifford",
    "cluster": 4,
    "distanceToCentroid": 2.512653,
    "touches": 2953
  },
  {
    "playerName": "Cason Wallace",
    "cluster": 4,
    "distanceToCentroid": 2.518116,
    "touches": 2828
  },
  {
    "playerName": "Rayan Rupert",
    "cluster": 4,
    "distanceToCentroid": 2.612199,
    "touches": 1483
  },
  {
    "playerName": "Jahmai Mashack",
    "cluster": 4,
    "distanceToCentroid": 2.677766,
    "touches": 1113
  },
  {
    "playerName": "Kenrich Williams",
    "cluster": 4,
    "distanceToCentroid": 2.710339,
    "touches": 1225
  },
  {
    "playerName": "Noah Penda",
    "cluster": 4,
    "distanceToCentroid": 2.768444,
    "touches": 1284
  },
  {
    "playerName": "De'Anthony Melton",
    "cluster": 4,
    "distanceToCentroid": 2.774378,
    "touches": 2489
  },
  {
    "playerName": "Cody Williams",
    "cluster": 4,
    "distanceToCentroid": 2.790009,
    "touches": 2216
  },
  {
    "playerName": "Elijah Harkless",
    "cluster": 4,
    "distanceToCentroid": 2.829073,
    "touches": 914
  },
  {
    "playerName": "Josh Hart",
    "cluster": 4,
    "distanceToCentroid": 2.854299,
    "touches": 3884
  },
  {
    "playerName": "Peyton Watson",
    "cluster": 4,
    "distanceToCentroid": 2.873598,
    "touches": 2776
  },
  {
    "playerName": "Cedric Coward",
    "cluster": 4,
    "distanceToCentroid": 2.960155,
    "touches": 3400
  },
  {
    "playerName": "Andre Jackson Jr.",
    "cluster": 4,
    "distanceToCentroid": 2.982752,
    "touches": 823
  },
  {
    "playerName": "Patrick Williams",
    "cluster": 4,
    "distanceToCentroid": 2.990425,
    "touches": 2211
  },
  {
    "playerName": "Keshad Johnson",
    "cluster": 4,
    "distanceToCentroid": 3.049884,
    "touches": 482
  },
  {
    "playerName": "Kevin McCullar Jr.",
    "cluster": 4,
    "distanceToCentroid": 3.079624,
    "touches": 257
  },
  {
    "playerName": "Naji Marshall",
    "cluster": 4,
    "distanceToCentroid": 3.093991,
    "touches": 3592
  },
  {
    "playerName": "Nikola Jovic",
    "cluster": 4,
    "distanceToCentroid": 3.126011,
    "touches": 1561
  },
  {
    "playerName": "Santi Aldama",
    "cluster": 4,
    "distanceToCentroid": 3.133328,
    "touches": 2325
  },
  {
    "playerName": "Matas Buzelis",
    "cluster": 4,
    "distanceToCentroid": 3.13842,
    "touches": 4035
  },
  {
    "playerName": "Jarace Walker",
    "cluster": 4,
    "distanceToCentroid": 3.221224,
    "touches": 3215
  },
  {
    "playerName": "Bez Mbeng",
    "cluster": 4,
    "distanceToCentroid": 3.252329,
    "touches": 619
  },
  {
    "playerName": "Sion James",
    "cluster": 4,
    "distanceToCentroid": 3.270881,
    "touches": 2794
  },
  {
    "playerName": "Pelle Larsson",
    "cluster": 4,
    "distanceToCentroid": 3.301939,
    "touches": 2700
  },
  {
    "playerName": "Dru Smith",
    "cluster": 4,
    "distanceToCentroid": 3.309796,
    "touches": 2331
  },
  {
    "playerName": "GG Jackson",
    "cluster": 4,
    "distanceToCentroid": 3.317687,
    "touches": 2107
  },
  {
    "playerName": "Kyle Kuzma",
    "cluster": 4,
    "distanceToCentroid": 3.365575,
    "touches": 3034
  },
  {
    "playerName": "Cam Christie",
    "cluster": 4,
    "distanceToCentroid": 3.397698,
    "touches": 711
  },
  {
    "playerName": "Malachi Smith",
    "cluster": 4,
    "distanceToCentroid": 3.42852,
    "touches": 665
  },
  {
    "playerName": "Jordan Miller",
    "cluster": 4,
    "distanceToCentroid": 3.49846,
    "touches": 2033
  },
  {
    "playerName": "Malevy Leons",
    "cluster": 4,
    "distanceToCentroid": 3.508842,
    "touches": 392
  },
  {
    "playerName": "Jaden McDaniels",
    "cluster": 4,
    "distanceToCentroid": 3.51012,
    "touches": 3428
  },
  {
    "playerName": "Aaron Wiggins",
    "cluster": 4,
    "distanceToCentroid": 3.567554,
    "touches": 2160
  },
  {
    "playerName": "Kelly Olynyk",
    "cluster": 4,
    "distanceToCentroid": 3.580534,
    "touches": 671
  },
  {
    "playerName": "Kris Dunn",
    "cluster": 4,
    "distanceToCentroid": 3.583599,
    "touches": 4202
  },
  {
    "playerName": "Dalen Terry",
    "cluster": 4,
    "distanceToCentroid": 3.587167,
    "touches": 939
  },
  {
    "playerName": "Ausar Thompson",
    "cluster": 4,
    "distanceToCentroid": 3.593981,
    "touches": 2967
  },
  {
    "playerName": "Kasparas Jakucionis",
    "cluster": 4,
    "distanceToCentroid": 3.645929,
    "touches": 1743
  },
  {
    "playerName": "Danny Wolf",
    "cluster": 4,
    "distanceToCentroid": 3.648152,
    "touches": 2024
  },
  {
    "playerName": "Bruce Brown",
    "cluster": 4,
    "distanceToCentroid": 3.696836,
    "touches": 3035
  },
  {
    "playerName": "Brooks Barnhizer",
    "cluster": 4,
    "distanceToCentroid": 3.700225,
    "touches": 397
  },
  {
    "playerName": "Trendon Watford",
    "cluster": 4,
    "distanceToCentroid": 3.755765,
    "touches": 2053
  },
  {
    "playerName": "Amen Thompson",
    "cluster": 4,
    "distanceToCentroid": 3.944793,
    "touches": 5789
  },
  {
    "playerName": "Dyson Daniels",
    "cluster": 4,
    "distanceToCentroid": 3.948048,
    "touches": 4914
  },
  {
    "playerName": "Kyle Filipowski",
    "cluster": 4,
    "distanceToCentroid": 4.002905,
    "touches": 3205
  },
  {
    "playerName": "Malaki Branham",
    "cluster": 4,
    "distanceToCentroid": 4.27075,
    "touches": 446
  },
  {
    "playerName": "Terrence Shannon Jr.",
    "cluster": 4,
    "distanceToCentroid": 4.2828,
    "touches": 700
  },
  {
    "playerName": "Kyle Anderson",
    "cluster": 4,
    "distanceToCentroid": 4.408172,
    "touches": 1472
  },
  {
    "playerName": "Myron Gardner",
    "cluster": 4,
    "distanceToCentroid": 4.474647,
    "touches": 706
  },
  {
    "playerName": "John Konchar",
    "cluster": 4,
    "distanceToCentroid": 4.561495,
    "touches": 1655
  },
  {
    "playerName": "Jalen Slawson",
    "cluster": 4,
    "distanceToCentroid": 4.848231,
    "touches": 568
  },
  {
    "playerName": "Jaime Jaquez Jr.",
    "cluster": 4,
    "distanceToCentroid": 5.038553,
    "touches": 4944
  },
  {
    "playerName": "Davion Mitchell",
    "cluster": 4,
    "distanceToCentroid": 5.043444,
    "touches": 4591
  },
  {
    "playerName": "Kris Murray",
    "cluster": 4,
    "distanceToCentroid": 5.070177,
    "touches": 1155
  },
  {
    "playerName": "Marvin Bagley III",
    "cluster": 5,
    "distanceToCentroid": 2.070446,
    "touches": 1832
  },
  {
    "playerName": "Isaiah Jackson",
    "cluster": 5,
    "distanceToCentroid": 2.350603,
    "touches": 1178
  },
  {
    "playerName": "Anthony Gill",
    "cluster": 5,
    "distanceToCentroid": 2.500907,
    "touches": 1181
  },
  {
    "playerName": "Yves Missi",
    "cluster": 5,
    "distanceToCentroid": 2.546181,
    "touches": 1617
  },
  {
    "playerName": "Goga Bitadze",
    "cluster": 5,
    "distanceToCentroid": 2.611283,
    "touches": 1402
  },
  {
    "playerName": "Neemias Queta",
    "cluster": 5,
    "distanceToCentroid": 2.620606,
    "touches": 2661
  },
  {
    "playerName": "Moussa Diabate",
    "cluster": 5,
    "distanceToCentroid": 2.681098,
    "touches": 2655
  },
  {
    "playerName": "Adem Bona",
    "cluster": 5,
    "distanceToCentroid": 2.757366,
    "touches": 1201
  },
  {
    "playerName": "Paul Reed",
    "cluster": 5,
    "distanceToCentroid": 2.776821,
    "touches": 1479
  },
  {
    "playerName": "Clint Capela",
    "cluster": 5,
    "distanceToCentroid": 2.854323,
    "touches": 1182
  },
  {
    "playerName": "Jakob Poeltl",
    "cluster": 5,
    "distanceToCentroid": 2.868685,
    "touches": 1703
  },
  {
    "playerName": "Drew Eubanks",
    "cluster": 5,
    "distanceToCentroid": 3.027677,
    "touches": 667
  },
  {
    "playerName": "Julian Reese",
    "cluster": 5,
    "distanceToCentroid": 3.099147,
    "touches": 604
  },
  {
    "playerName": "Day'Ron Sharpe",
    "cluster": 5,
    "distanceToCentroid": 3.113243,
    "touches": 2177
  },
  {
    "playerName": "Maxime Raynaud",
    "cluster": 5,
    "distanceToCentroid": 3.131478,
    "touches": 3301
  },
  {
    "playerName": "Rudy Gobert",
    "cluster": 5,
    "distanceToCentroid": 3.166299,
    "touches": 3399
  },
  {
    "playerName": "Jaxson Hayes",
    "cluster": 5,
    "distanceToCentroid": 3.204486,
    "touches": 1345
  },
  {
    "playerName": "Robert Williams III",
    "cluster": 5,
    "distanceToCentroid": 3.269134,
    "touches": 1407
  },
  {
    "playerName": "Domantas Sabonis",
    "cluster": 5,
    "distanceToCentroid": 3.272055,
    "touches": 1212
  },
  {
    "playerName": "Yanic Konan Niederhauser",
    "cluster": 5,
    "distanceToCentroid": 3.336182,
    "touches": 474
  },
  {
    "playerName": "Jarrett Allen",
    "cluster": 5,
    "distanceToCentroid": 3.336559,
    "touches": 2137
  },
  {
    "playerName": "Andre Drummond",
    "cluster": 5,
    "distanceToCentroid": 3.342135,
    "touches": 1430
  },
  {
    "playerName": "Collin Murray-Boyles",
    "cluster": 5,
    "distanceToCentroid": 3.350693,
    "touches": 1905
  },
  {
    "playerName": "Mark Williams",
    "cluster": 5,
    "distanceToCentroid": 3.359989,
    "touches": 2072
  },
  {
    "playerName": "Dominick Barlow",
    "cluster": 5,
    "distanceToCentroid": 3.367461,
    "touches": 1960
  },
  {
    "playerName": "Alex Sarr",
    "cluster": 5,
    "distanceToCentroid": 3.379985,
    "touches": 2749
  },
  {
    "playerName": "Chaney Johnson",
    "cluster": 5,
    "distanceToCentroid": 3.380157,
    "touches": 505
  },
  {
    "playerName": "Zeke Nnaji",
    "cluster": 5,
    "distanceToCentroid": 3.483068,
    "touches": 732
  },
  {
    "playerName": "Daniel Gafford",
    "cluster": 5,
    "distanceToCentroid": 3.487093,
    "touches": 1567
  },
  {
    "playerName": "Nick Richards",
    "cluster": 5,
    "distanceToCentroid": 3.517622,
    "touches": 973
  },
  {
    "playerName": "Oso Ighodaro",
    "cluster": 5,
    "distanceToCentroid": 3.557425,
    "touches": 2741
  },
  {
    "playerName": "Wendell Carter Jr.",
    "cluster": 5,
    "distanceToCentroid": 3.67641,
    "touches": 3034
  },
  {
    "playerName": "Dwight Powell",
    "cluster": 5,
    "distanceToCentroid": 3.692209,
    "touches": 1108
  },
  {
    "playerName": "Nic Claxton",
    "cluster": 5,
    "distanceToCentroid": 3.703045,
    "touches": 3347
  },
  {
    "playerName": "Luka Garza",
    "cluster": 5,
    "distanceToCentroid": 3.721604,
    "touches": 1632
  },
  {
    "playerName": "Ariel Hukporti",
    "cluster": 5,
    "distanceToCentroid": 3.757665,
    "touches": 519
  },
  {
    "playerName": "Isaiah Stewart",
    "cluster": 5,
    "distanceToCentroid": 3.912583,
    "touches": 1484
  },
  {
    "playerName": "PJ Hall",
    "cluster": 5,
    "distanceToCentroid": 4.001256,
    "touches": 298
  },
  {
    "playerName": "Moussa Cisse",
    "cluster": 5,
    "distanceToCentroid": 4.029447,
    "touches": 582
  },
  {
    "playerName": "Luke Kornet",
    "cluster": 5,
    "distanceToCentroid": 4.038849,
    "touches": 1819
  },
  {
    "playerName": "Jonathan Mogbo",
    "cluster": 5,
    "distanceToCentroid": 4.079661,
    "touches": 349
  },
  {
    "playerName": "Steven Adams",
    "cluster": 5,
    "distanceToCentroid": 4.083182,
    "touches": 903
  },
  {
    "playerName": "Tony Bradley",
    "cluster": 5,
    "distanceToCentroid": 4.10116,
    "touches": 498
  },
  {
    "playerName": "Isaiah Hartenstein",
    "cluster": 5,
    "distanceToCentroid": 4.132165,
    "touches": 2150
  },
  {
    "playerName": "Zach Collins",
    "cluster": 5,
    "distanceToCentroid": 4.178525,
    "touches": 300
  },
  {
    "playerName": "Joan Beringer",
    "cluster": 5,
    "distanceToCentroid": 4.211976,
    "touches": 386
  },
  {
    "playerName": "Khaman Maluach",
    "cluster": 5,
    "distanceToCentroid": 4.303188,
    "touches": 530
  },
  {
    "playerName": "Deandre Ayton",
    "cluster": 5,
    "distanceToCentroid": 4.304548,
    "touches": 2672
  },
  {
    "playerName": "Ryan Kalkbrenner",
    "cluster": 5,
    "distanceToCentroid": 4.326043,
    "touches": 1601
  },
  {
    "playerName": "Jericho Sims",
    "cluster": 5,
    "distanceToCentroid": 4.333576,
    "touches": 1977
  },
  {
    "playerName": "Jalen Duren",
    "cluster": 5,
    "distanceToCentroid": 4.394985,
    "touches": 3497
  },
  {
    "playerName": "Oscar Tshiebwe",
    "cluster": 5,
    "distanceToCentroid": 4.396401,
    "touches": 601
  },
  {
    "playerName": "Jusuf Nurkic",
    "cluster": 5,
    "distanceToCentroid": 4.439026,
    "touches": 2372
  },
  {
    "playerName": "Dylan Cardwell",
    "cluster": 5,
    "distanceToCentroid": 4.46667,
    "touches": 1057
  },
  {
    "playerName": "Jonathan Isaac",
    "cluster": 5,
    "distanceToCentroid": 4.510901,
    "touches": 613
  },
  {
    "playerName": "Maxi Kleber",
    "cluster": 5,
    "distanceToCentroid": 4.54558,
    "touches": 508
  },
  {
    "playerName": "Donovan Clingan",
    "cluster": 5,
    "distanceToCentroid": 4.63344,
    "touches": 3229
  },
  {
    "playerName": "Jonas Valanciunas",
    "cluster": 5,
    "distanceToCentroid": 4.764241,
    "touches": 1764
  },
  {
    "playerName": "Kevon Looney",
    "cluster": 5,
    "distanceToCentroid": 4.830042,
    "touches": 491
  },
  {
    "playerName": "Trayce Jackson-Davis",
    "cluster": 5,
    "distanceToCentroid": 4.870496,
    "touches": 839
  },
  {
    "playerName": "Moritz Wagner",
    "cluster": 5,
    "distanceToCentroid": 5.08519,
    "touches": 735
  },
  {
    "playerName": "Ivica Zubac",
    "cluster": 5,
    "distanceToCentroid": 5.112762,
    "touches": 2304
  },
  {
    "playerName": "Christian Koloko",
    "cluster": 5,
    "distanceToCentroid": 5.116498,
    "touches": 412
  },
  {
    "playerName": "Jock Landale",
    "cluster": 5,
    "distanceToCentroid": 5.199696,
    "touches": 2181
  },
  {
    "playerName": "Lachlan Olbrich",
    "cluster": 5,
    "distanceToCentroid": 5.528386,
    "touches": 547
  },
  {
    "playerName": "Mitchell Robinson",
    "cluster": 5,
    "distanceToCentroid": 5.551631,
    "touches": 1186
  },
  {
    "playerName": "Walker Kessler",
    "cluster": 5,
    "distanceToCentroid": 5.912537,
    "touches": 264
  },
  {
    "playerName": "Xavier Tillman",
    "cluster": 5,
    "distanceToCentroid": 6.114317,
    "touches": 252
  },
  {
    "playerName": "Zach Edey",
    "cluster": 5,
    "distanceToCentroid": 6.768224,
    "touches": 401
  },
  {
    "playerName": "Hansen Yang",
    "cluster": 5,
    "distanceToCentroid": 6.966883,
    "touches": 394
  },
  {
    "playerName": "CJ McCollum",
    "cluster": 6,
    "distanceToCentroid": 2.444313,
    "touches": 4375
  },
  {
    "playerName": "De'Aaron Fox",
    "cluster": 6,
    "distanceToCentroid": 2.745899,
    "touches": 4726
  },
  {
    "playerName": "Cooper Flagg",
    "cluster": 6,
    "distanceToCentroid": 2.746366,
    "touches": 4788
  },
  {
    "playerName": "Donovan Mitchell",
    "cluster": 6,
    "distanceToCentroid": 2.759056,
    "touches": 4919
  },
  {
    "playerName": "Darius Garland",
    "cluster": 6,
    "distanceToCentroid": 2.952266,
    "touches": 2974
  },
  {
    "playerName": "Shaedon Sharpe",
    "cluster": 6,
    "distanceToCentroid": 2.978719,
    "touches": 2737
  },
  {
    "playerName": "Malik Monk",
    "cluster": 6,
    "distanceToCentroid": 3.064573,
    "touches": 2366
  },
  {
    "playerName": "Jalen Williams",
    "cluster": 6,
    "distanceToCentroid": 3.126119,
    "touches": 1807
  },
  {
    "playerName": "Ajay Mitchell",
    "cluster": 6,
    "distanceToCentroid": 3.19975,
    "touches": 2587
  },
  {
    "playerName": "Cam Thomas",
    "cluster": 6,
    "distanceToCentroid": 3.32494,
    "touches": 1721
  },
  {
    "playerName": "Coby White",
    "cluster": 6,
    "distanceToCentroid": 3.367449,
    "touches": 2621
  },
  {
    "playerName": "Bennedict Mathurin",
    "cluster": 6,
    "distanceToCentroid": 3.438798,
    "touches": 2769
  },
  {
    "playerName": "Jalen Green",
    "cluster": 6,
    "distanceToCentroid": 3.439278,
    "touches": 1532
  },
  {
    "playerName": "Anthony Edwards",
    "cluster": 6,
    "distanceToCentroid": 3.538359,
    "touches": 4444
  },
  {
    "playerName": "Cade Cunningham",
    "cluster": 6,
    "distanceToCentroid": 3.575505,
    "touches": 5687
  },
  {
    "playerName": "Desmond Bane",
    "cluster": 6,
    "distanceToCentroid": 3.629783,
    "touches": 4870
  },
  {
    "playerName": "Jamal Murray",
    "cluster": 6,
    "distanceToCentroid": 3.704617,
    "touches": 5736
  },
  {
    "playerName": "Jayson Tatum",
    "cluster": 6,
    "distanceToCentroid": 3.793417,
    "touches": 1220
  },
  {
    "playerName": "Ty Jerome",
    "cluster": 6,
    "distanceToCentroid": 3.808412,
    "touches": 784
  },
  {
    "playerName": "Jalen Brunson",
    "cluster": 6,
    "distanceToCentroid": 3.835766,
    "touches": 6756
  },
  {
    "playerName": "Dejounte Murray",
    "cluster": 6,
    "distanceToCentroid": 3.874696,
    "touches": 932
  },
  {
    "playerName": "Ja Morant",
    "cluster": 6,
    "distanceToCentroid": 3.961456,
    "touches": 1429
  },
  {
    "playerName": "Jaylen Brown",
    "cluster": 6,
    "distanceToCentroid": 4.062859,
    "touches": 4861
  },
  {
    "playerName": "James Harden",
    "cluster": 6,
    "distanceToCentroid": 4.155078,
    "touches": 5366
  },
  {
    "playerName": "Tyler Herro",
    "cluster": 6,
    "distanceToCentroid": 4.190602,
    "touches": 1981
  },
  {
    "playerName": "Trae Young",
    "cluster": 6,
    "distanceToCentroid": 4.271014,
    "touches": 935
  },
  {
    "playerName": "Deni Avdija",
    "cluster": 6,
    "distanceToCentroid": 4.304029,
    "touches": 5544
  },
  {
    "playerName": "Luka Doncic",
    "cluster": 6,
    "distanceToCentroid": 4.326118,
    "touches": 5626
  },
  {
    "playerName": "Kawhi Leonard",
    "cluster": 6,
    "distanceToCentroid": 4.337986,
    "touches": 3716
  },
  {
    "playerName": "AJ Johnson",
    "cluster": 6,
    "distanceToCentroid": 4.345979,
    "touches": 725
  },
  {
    "playerName": "Brandon Ingram",
    "cluster": 6,
    "distanceToCentroid": 4.544626,
    "touches": 4240
  },
  {
    "playerName": "Shai Gilgeous-Alexander",
    "cluster": 6,
    "distanceToCentroid": 4.61205,
    "touches": 4532
  },
  {
    "playerName": "Khris Middleton",
    "cluster": 6,
    "distanceToCentroid": 4.710404,
    "touches": 1982
  },
  {
    "playerName": "Stephen Curry",
    "cluster": 6,
    "distanceToCentroid": 4.8292,
    "touches": 2813
  },
  {
    "playerName": "Devin Booker",
    "cluster": 6,
    "distanceToCentroid": 5.116645,
    "touches": 4111
  },
  {
    "playerName": "Kevin Durant",
    "cluster": 6,
    "distanceToCentroid": 5.328405,
    "touches": 5016
  },
  {
    "playerName": "Norman Powell",
    "cluster": 6,
    "distanceToCentroid": 5.414744,
    "touches": 2615
  },
  {
    "playerName": "Dillon Brooks",
    "cluster": 6,
    "distanceToCentroid": 5.992797,
    "touches": 2371
  },
  {
    "playerName": "DeMar DeRozan",
    "cluster": 6,
    "distanceToCentroid": 6.399938,
    "touches": 3328
  },
  {
    "playerName": "Bones Hyland",
    "cluster": 7,
    "distanceToCentroid": 1.954434,
    "touches": 2778
  },
  {
    "playerName": "Jalen Suggs",
    "cluster": 7,
    "distanceToCentroid": 2.145326,
    "touches": 3702
  },
  {
    "playerName": "Immanuel Quickley",
    "cluster": 7,
    "distanceToCentroid": 2.287183,
    "touches": 5047
  },
  {
    "playerName": "Marcus Sasser",
    "cluster": 7,
    "distanceToCentroid": 2.299794,
    "touches": 865
  },
  {
    "playerName": "Jose Alvarado",
    "cluster": 7,
    "distanceToCentroid": 2.316477,
    "touches": 2905
  },
  {
    "playerName": "Bronny James",
    "cluster": 7,
    "distanceToCentroid": 2.329897,
    "touches": 748
  },
  {
    "playerName": "Derrick White",
    "cluster": 7,
    "distanceToCentroid": 2.345708,
    "touches": 5993
  },
  {
    "playerName": "Collin Gillespie",
    "cluster": 7,
    "distanceToCentroid": 2.552645,
    "touches": 4812
  },
  {
    "playerName": "Jalen Pickett",
    "cluster": 7,
    "distanceToCentroid": 2.612928,
    "touches": 1457
  },
  {
    "playerName": "Brandin Podziemski",
    "cluster": 7,
    "distanceToCentroid": 2.641286,
    "touches": 4948
  },
  {
    "playerName": "RayJ Dennis",
    "cluster": 7,
    "distanceToCentroid": 2.814257,
    "touches": 541
  },
  {
    "playerName": "JD Davison",
    "cluster": 7,
    "distanceToCentroid": 2.820383,
    "touches": 428
  },
  {
    "playerName": "Bub Carrington",
    "cluster": 7,
    "distanceToCentroid": 2.835509,
    "touches": 4890
  },
  {
    "playerName": "Gabe Vincent",
    "cluster": 7,
    "distanceToCentroid": 2.859245,
    "touches": 1204
  },
  {
    "playerName": "Reed Sheppard",
    "cluster": 7,
    "distanceToCentroid": 2.900396,
    "touches": 4464
  },
  {
    "playerName": "Vince Williams Jr.",
    "cluster": 7,
    "distanceToCentroid": 2.920566,
    "touches": 1976
  },
  {
    "playerName": "Bogdan Bogdanovic",
    "cluster": 7,
    "distanceToCentroid": 2.9383,
    "touches": 786
  },
  {
    "playerName": "Keaton Wallace",
    "cluster": 7,
    "distanceToCentroid": 3.024904,
    "touches": 1252
  },
  {
    "playerName": "VJ Edgecombe",
    "cluster": 7,
    "distanceToCentroid": 3.029262,
    "touches": 5287
  },
  {
    "playerName": "Jordan McLaughlin",
    "cluster": 7,
    "distanceToCentroid": 3.050309,
    "touches": 607
  },
  {
    "playerName": "Andrew Nembhard",
    "cluster": 7,
    "distanceToCentroid": 3.070762,
    "touches": 4987
  },
  {
    "playerName": "Jevon Carter",
    "cluster": 7,
    "distanceToCentroid": 3.107082,
    "touches": 1661
  },
  {
    "playerName": "Aaron Holiday",
    "cluster": 7,
    "distanceToCentroid": 3.199901,
    "touches": 1157
  },
  {
    "playerName": "Kentavious Caldwell-Pope",
    "cluster": 7,
    "distanceToCentroid": 3.211423,
    "touches": 2062
  },
  {
    "playerName": "Tyrese Martin",
    "cluster": 7,
    "distanceToCentroid": 3.311282,
    "touches": 1510
  },
  {
    "playerName": "Kobe Sanders",
    "cluster": 7,
    "distanceToCentroid": 3.334562,
    "touches": 1844
  },
  {
    "playerName": "Egor Demin",
    "cluster": 7,
    "distanceToCentroid": 3.419819,
    "touches": 2810
  },
  {
    "playerName": "Payton Pritchard",
    "cluster": 7,
    "distanceToCentroid": 3.420947,
    "touches": 5444
  },
  {
    "playerName": "Cameron Payne",
    "cluster": 7,
    "distanceToCentroid": 3.515799,
    "touches": 887
  },
  {
    "playerName": "KJ Simpson",
    "cluster": 7,
    "distanceToCentroid": 3.61961,
    "touches": 564
  },
  {
    "playerName": "Anfernee Simons",
    "cluster": 7,
    "distanceToCentroid": 3.671879,
    "touches": 2458
  },
  {
    "playerName": "LJ Cryer",
    "cluster": 7,
    "distanceToCentroid": 3.729526,
    "touches": 543
  },
  {
    "playerName": "Mike Conley",
    "cluster": 7,
    "distanceToCentroid": 3.788847,
    "touches": 2037
  },
  {
    "playerName": "Miles McBride",
    "cluster": 7,
    "distanceToCentroid": 3.79124,
    "touches": 1904
  },
  {
    "playerName": "Marcus Smart",
    "cluster": 7,
    "distanceToCentroid": 3.953133,
    "touches": 2751
  },
  {
    "playerName": "Cam Spencer",
    "cluster": 7,
    "distanceToCentroid": 4.043246,
    "touches": 3809
  },
  {
    "playerName": "Killian Hayes",
    "cluster": 7,
    "distanceToCentroid": 4.187719,
    "touches": 866
  },
  {
    "playerName": "Nick Smith Jr.",
    "cluster": 7,
    "distanceToCentroid": 4.202311,
    "touches": 700
  },
  {
    "playerName": "Tyus Jones",
    "cluster": 7,
    "distanceToCentroid": 4.229913,
    "touches": 2130
  },
  {
    "playerName": "Chris Paul",
    "cluster": 7,
    "distanceToCentroid": 4.423912,
    "touches": 510
  },
  {
    "playerName": "Lonzo Ball",
    "cluster": 7,
    "distanceToCentroid": 4.536636,
    "touches": 1626
  },
  {
    "playerName": "Joe Ingles",
    "cluster": 7,
    "distanceToCentroid": 4.685113,
    "touches": 286
  },
  {
    "playerName": "Ryan Rollins",
    "cluster": 8,
    "distanceToCentroid": 1.783747,
    "touches": 5266
  },
  {
    "playerName": "Daniss Jenkins",
    "cluster": 8,
    "distanceToCentroid": 1.873882,
    "touches": 3228
  },
  {
    "playerName": "Dylan Harper",
    "cluster": 8,
    "distanceToCentroid": 2.217806,
    "touches": 3274
  },
  {
    "playerName": "Collin Sexton",
    "cluster": 8,
    "distanceToCentroid": 2.292051,
    "touches": 3261
  },
  {
    "playerName": "Sharife Cooper",
    "cluster": 8,
    "distanceToCentroid": 2.307954,
    "touches": 1533
  },
  {
    "playerName": "Walter Clayton Jr.",
    "cluster": 8,
    "distanceToCentroid": 2.322508,
    "touches": 3152
  },
  {
    "playerName": "Jeremiah Fears",
    "cluster": 8,
    "distanceToCentroid": 2.339623,
    "touches": 4615
  },
  {
    "playerName": "Caris LeVert",
    "cluster": 8,
    "distanceToCentroid": 2.421379,
    "touches": 2081
  },
  {
    "playerName": "Dennis Schroder",
    "cluster": 8,
    "distanceToCentroid": 2.453269,
    "touches": 3963
  },
  {
    "playerName": "Tre Mann",
    "cluster": 8,
    "distanceToCentroid": 2.54317,
    "touches": 1402
  },
  {
    "playerName": "Tyler Kolek",
    "cluster": 8,
    "distanceToCentroid": 2.594161,
    "touches": 1809
  },
  {
    "playerName": "Jamaree Bouyea",
    "cluster": 8,
    "distanceToCentroid": 2.60274,
    "touches": 1282
  },
  {
    "playerName": "Rob Dillingham",
    "cluster": 8,
    "distanceToCentroid": 2.624427,
    "touches": 1957
  },
  {
    "playerName": "Javon Small",
    "cluster": 8,
    "distanceToCentroid": 2.671627,
    "touches": 1616
  },
  {
    "playerName": "Jrue Holiday",
    "cluster": 8,
    "distanceToCentroid": 2.70053,
    "touches": 3599
  },
  {
    "playerName": "Scoot Henderson",
    "cluster": 8,
    "distanceToCentroid": 2.739454,
    "touches": 1641
  },
  {
    "playerName": "Ousmane Dieng",
    "cluster": 8,
    "distanceToCentroid": 2.742951,
    "touches": 1923
  },
  {
    "playerName": "Tyrese Proctor",
    "cluster": 8,
    "distanceToCentroid": 2.763942,
    "touches": 1016
  },
  {
    "playerName": "Scotty Pippen Jr.",
    "cluster": 8,
    "distanceToCentroid": 2.86464,
    "touches": 498
  },
  {
    "playerName": "Quenton Jackson",
    "cluster": 8,
    "distanceToCentroid": 2.888604,
    "touches": 1991
  },
  {
    "playerName": "Brandon Williams",
    "cluster": 8,
    "distanceToCentroid": 2.93971,
    "touches": 3189
  },
  {
    "playerName": "Isaiah Collier",
    "cluster": 8,
    "distanceToCentroid": 2.967425,
    "touches": 4026
  },
  {
    "playerName": "Pat Spencer",
    "cluster": 8,
    "distanceToCentroid": 2.971483,
    "touches": 2994
  },
  {
    "playerName": "Devin Carter",
    "cluster": 8,
    "distanceToCentroid": 2.980245,
    "touches": 1470
  },
  {
    "playerName": "Josh Giddey",
    "cluster": 8,
    "distanceToCentroid": 2.981252,
    "touches": 5080
  },
  {
    "playerName": "Nolan Traore",
    "cluster": 8,
    "distanceToCentroid": 3.015619,
    "touches": 3034
  },
  {
    "playerName": "Kyshawn George",
    "cluster": 8,
    "distanceToCentroid": 3.025361,
    "touches": 2799
  },
  {
    "playerName": "Kevin Porter Jr.",
    "cluster": 8,
    "distanceToCentroid": 3.052974,
    "touches": 3025
  },
  {
    "playerName": "Terance Mann",
    "cluster": 8,
    "distanceToCentroid": 3.08351,
    "touches": 2590
  },
  {
    "playerName": "Craig Porter Jr.",
    "cluster": 8,
    "distanceToCentroid": 3.113344,
    "touches": 2240
  },
  {
    "playerName": "Ben Saraf",
    "cluster": 8,
    "distanceToCentroid": 3.156906,
    "touches": 2122
  },
  {
    "playerName": "Jamal Shead",
    "cluster": 8,
    "distanceToCentroid": 3.187183,
    "touches": 4031
  },
  {
    "playerName": "Anthony Black",
    "cluster": 8,
    "distanceToCentroid": 3.232696,
    "touches": 3657
  },
  {
    "playerName": "LaMelo Ball",
    "cluster": 8,
    "distanceToCentroid": 3.282513,
    "touches": 5265
  },
  {
    "playerName": "Kameron Jones",
    "cluster": 8,
    "distanceToCentroid": 3.330947,
    "touches": 1243
  },
  {
    "playerName": "Jase Richardson",
    "cluster": 8,
    "distanceToCentroid": 3.438614,
    "touches": 920
  },
  {
    "playerName": "D'Angelo Russell",
    "cluster": 8,
    "distanceToCentroid": 3.490336,
    "touches": 1209
  },
  {
    "playerName": "Tyrese Maxey",
    "cluster": 8,
    "distanceToCentroid": 3.520268,
    "touches": 6669
  },
  {
    "playerName": "Kennedy Chandler",
    "cluster": 8,
    "distanceToCentroid": 3.533592,
    "touches": 793
  },
  {
    "playerName": "Russell Westbrook",
    "cluster": 8,
    "distanceToCentroid": 3.543288,
    "touches": 4415
  },
  {
    "playerName": "Austin Reaves",
    "cluster": 8,
    "distanceToCentroid": 3.5489,
    "touches": 3705
  },
  {
    "playerName": "Jordan Poole",
    "cluster": 8,
    "distanceToCentroid": 3.560778,
    "touches": 1745
  },
  {
    "playerName": "Blake Wesley",
    "cluster": 8,
    "distanceToCentroid": 3.614217,
    "touches": 772
  },
  {
    "playerName": "Stephon Castle",
    "cluster": 8,
    "distanceToCentroid": 3.621294,
    "touches": 4679
  },
  {
    "playerName": "Ryan Nembhard",
    "cluster": 8,
    "distanceToCentroid": 3.661524,
    "touches": 2605
  },
  {
    "playerName": "Keyonte George",
    "cluster": 8,
    "distanceToCentroid": 3.785204,
    "touches": 4255
  },
  {
    "playerName": "Cole Anthony",
    "cluster": 8,
    "distanceToCentroid": 3.841371,
    "touches": 1285
  },
  {
    "playerName": "Jalen Johnson",
    "cluster": 8,
    "distanceToCentroid": 3.992167,
    "touches": 6422
  },
  {
    "playerName": "Tre Jones",
    "cluster": 8,
    "distanceToCentroid": 4.181308,
    "touches": 3949
  },
  {
    "playerName": "T.J. McConnell",
    "cluster": 8,
    "distanceToCentroid": 4.244401,
    "touches": 2800
  },
  {
    "playerName": "Nikola Topic",
    "cluster": 8,
    "distanceToCentroid": 4.785619,
    "touches": 367
  },
  {
    "playerName": "Yuki Kawamura",
    "cluster": 8,
    "distanceToCentroid": 4.868221,
    "touches": 443
  }
];
