/**
 * PackMaster: Geometry - Level Definitions
 * 5 Distinct Progressive Levels of Geometric Packing Challenges
 */

export const LEVELS = [
  {
    "id": 1,
    "title": "The Awakening",
    "difficulty": "Intro",
    "gridWidth": 4,
    "gridHeight": 4,
    "timeLimit": 45,
    "starThresholds": [
      12,
      25
    ],
    "description": "A large wooden square tray. Assemble the 4 primal geometric pieces into a seamless solid square.",
    "pieces": [
      {
        "id": "l1_p1",
        "name": "Ruby Great Triangle",
        "shapeType": "triangle",
        "colorKey": "ruby",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            0,
            4
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l1_p2",
        "name": "Sapphire Block",
        "shapeType": "square",
        "colorKey": "sapphire",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l1_p3",
        "name": "Emerald Wedge",
        "shapeType": "triangle",
        "colorKey": "emerald",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 2,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 270
      },
      {
        "id": "l1_p4",
        "name": "Amber Wedge",
        "shapeType": "triangle",
        "colorKey": "amber",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 0,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      }
    ]
  },
  {
    "id": 2,
    "title": "Geometric Harmony",
    "difficulty": "Steady",
    "gridWidth": 6,
    "gridHeight": 4,
    "timeLimit": 60,
    "starThresholds": [
      18,
      35
    ],
    "description": "Introduces the golden Trapezium. Fit 6 pieces into a 6x4 rectangular walnut tray.",
    "pieces": [
      {
        "id": "l2_p1",
        "name": "Golden Trapezium",
        "shapeType": "trapezium",
        "colorKey": "amber",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l2_p2",
        "name": "Cyan Slope Wedge",
        "shapeType": "triangle",
        "colorKey": "cyan",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 0,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l2_p3",
        "name": "Cobalt Square",
        "shapeType": "square",
        "colorKey": "sapphire",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l2_p4",
        "name": "Amethyst Beam",
        "shapeType": "rectangle",
        "colorKey": "amethyst",
        "points": [
          [
            0,
            0
          ],
          [
            3,
            0
          ],
          [
            3,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l2_p5",
        "name": "Coral Triangular Chock",
        "shapeType": "triangle",
        "colorKey": "coral",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 3,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l2_p6",
        "name": "Bronze Right Trapezoid",
        "shapeType": "trapezium",
        "colorKey": "gold",
        "points": [
          [
            0,
            0
          ],
          [
            3,
            0
          ],
          [
            3,
            2
          ],
          [
            2,
            2
          ]
        ],
        "solution": {
          "gridX": 3,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 270
      }
    ]
  },
  {
    "id": 3,
    "title": "Tessellation Challenge",
    "difficulty": "Intermediate",
    "gridWidth": 6,
    "gridHeight": 6,
    "timeLimit": 90,
    "starThresholds": [
      28,
      55
    ],
    "description": "A dense 6x6 frame with 10 interlocking pieces including an Isosceles Trapezoid and Parallelogram.",
    "pieces": [
      {
        "id": "l3_p1",
        "name": "Imperial Iso Trapezoid",
        "shapeType": "trapezium",
        "colorKey": "amber",
        "points": [
          [
            0,
            0
          ],
          [
            6,
            0
          ],
          [
            4,
            2
          ],
          [
            2,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l3_p2",
        "name": "Left Flank Wing",
        "shapeType": "triangle",
        "colorKey": "emerald",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 270,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l3_p3",
        "name": "Right Flank Wing",
        "shapeType": "triangle",
        "colorKey": "teal",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 0,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l3_p4",
        "name": "Cyan Parallelogram",
        "shapeType": "parallelogram",
        "colorKey": "cyan",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            4,
            2
          ],
          [
            2,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l3_p5",
        "name": "Rose Delta Triangle",
        "shapeType": "triangle",
        "colorKey": "rose",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 2,
          "rotation": 270,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l3_p6",
        "name": "Lime Delta Triangle",
        "shapeType": "triangle",
        "colorKey": "lime",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 2,
          "rotation": 90,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l3_p7",
        "name": "Cobalt Center Block",
        "shapeType": "square",
        "colorKey": "sapphire",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l3_p8",
        "name": "Royal Keystone (4x2)",
        "shapeType": "rectangle",
        "colorKey": "amethyst",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            4,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 4,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l3_p9",
        "name": "Sunset Triangle A",
        "shapeType": "triangle",
        "colorKey": "coral",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 4,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l3_p10",
        "name": "Sunset Triangle B",
        "shapeType": "triangle",
        "colorKey": "gold",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 4,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 270
      }
    ]
  },
  {
    "id": 4,
    "title": "The Spherical Nexus",
    "difficulty": "Expert",
    "gridWidth": 8,
    "gridHeight": 6,
    "timeLimit": 120,
    "starThresholds": [
      38,
      75
    ],
    "description": "Features the sacred Crimson Sphere and sculpted cradle brackets, alongside 11 geometric tiles in an 8x6 frame.",
    "pieces": [
      {
        "id": "l4_p1",
        "name": "Crimson Orb (Circle)",
        "shapeType": "circle",
        "type": "circle",
        "radius": 1,
        "colorKey": "ruby",
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l4_p2",
        "name": "North Cradle Bracket",
        "shapeType": "bracket",
        "type": "bracket",
        "colorKey": "gold",
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l4_p3",
        "name": "South Cradle Bracket",
        "shapeType": "bracket",
        "type": "bracket",
        "colorKey": "amber",
        "solution": {
          "gridX": 0,
          "gridY": 1,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l4_p4",
        "name": "Emerald Beam (4x2)",
        "shapeType": "rectangle",
        "colorKey": "emerald",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            4,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l4_p5",
        "name": "Amethyst Block (2x2)",
        "shapeType": "square",
        "colorKey": "amethyst",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 6,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l4_p6",
        "name": "Amber Keystone (Trap)",
        "shapeType": "trapezium",
        "colorKey": "amber",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l4_p7",
        "name": "Azure Wedge (Tri)",
        "shapeType": "triangle",
        "colorKey": "cyan",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 2,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l4_p8",
        "name": "Bronze Altar (Iso Trap)",
        "shapeType": "trapezium",
        "colorKey": "gold",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            3,
            2
          ],
          [
            1,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l4_p9",
        "name": "Topaz Wing Left",
        "shapeType": "triangle",
        "colorKey": "lime",
        "points": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 2,
          "rotation": 270,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l4_p10",
        "name": "Topaz Wing Right",
        "shapeType": "triangle",
        "colorKey": "teal",
        "points": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 7,
          "gridY": 2,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l4_p11",
        "name": "Sapphire Slab (4x2)",
        "shapeType": "rectangle",
        "colorKey": "sapphire",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            4,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 4,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l4_p12",
        "name": "Ruby Oblique (Parallelogram)",
        "shapeType": "parallelogram",
        "colorKey": "coral",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            4,
            2
          ],
          [
            2,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 4,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l4_p13",
        "name": "Jade Corner Triangle A",
        "shapeType": "triangle",
        "colorKey": "rose",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 4,
          "rotation": 270,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l4_p14",
        "name": "Jade Corner Triangle B",
        "shapeType": "triangle",
        "colorKey": "emerald",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 6,
          "gridY": 4,
          "rotation": 90,
          "flipped": false
        },
        "trayRotation": 0
      }
    ]
  },
  {
    "id": 5,
    "title": "Grandmaster Stomachion",
    "difficulty": "Master",
    "gridWidth": 8,
    "gridHeight": 8,
    "timeLimit": 180,
    "starThresholds": [
      55,
      110
    ],
    "description": "The ultimate challenge. 19 exquisite pieces packing an 8x8 frame. Demands laser spatial reasoning and time management.",
    "pieces": [
      {
        "id": "l5_p1",
        "name": "Dragon Blade (Tri 4x4)",
        "shapeType": "triangle",
        "colorKey": "ruby",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            0,
            4
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l5_p2",
        "name": "Obsidian Core (Square 2x2)",
        "shapeType": "square",
        "colorKey": "sapphire",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p3",
        "name": "Solar Fragment A",
        "shapeType": "triangle",
        "colorKey": "emerald",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 2,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 270
      },
      {
        "id": "l5_p4",
        "name": "Solar Fragment B",
        "shapeType": "triangle",
        "colorKey": "amber",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 2,
          "gridY": 0,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p5",
        "name": "Mystic Sphere (Circle)",
        "shapeType": "circle",
        "type": "circle",
        "radius": 1,
        "colorKey": "coral",
        "solution": {
          "gridX": 4,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p6",
        "name": "Sphere Cradle North",
        "shapeType": "bracket",
        "type": "bracket",
        "colorKey": "gold",
        "solution": {
          "gridX": 4,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l5_p7",
        "name": "Sphere Cradle South",
        "shapeType": "bracket",
        "type": "bracket",
        "colorKey": "amber",
        "solution": {
          "gridX": 4,
          "gridY": 1,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p8",
        "name": "Gilded Block (Square 2x2)",
        "shapeType": "square",
        "colorKey": "gold",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 6,
          "gridY": 0,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p9",
        "name": "Titan Ramp (Trap)",
        "shapeType": "trapezium",
        "colorKey": "amethyst",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            2,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 2,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l5_p10",
        "name": "Titan Chock (Tri)",
        "shapeType": "triangle",
        "colorKey": "cyan",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 6,
          "gridY": 2,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 270
      },
      {
        "id": "l5_p11",
        "name": "Crown Trapezoid",
        "shapeType": "trapezium",
        "colorKey": "amber",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            3,
            2
          ],
          [
            1,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 4,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l5_p12",
        "name": "Crown Flank Left (Tri)",
        "shapeType": "triangle",
        "colorKey": "lime",
        "points": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 4,
          "rotation": 270,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l5_p13",
        "name": "Crown Flank Right (Tri)",
        "shapeType": "triangle",
        "colorKey": "teal",
        "points": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 3,
          "gridY": 4,
          "rotation": 180,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p14",
        "name": "Monolith Beam (4x2)",
        "shapeType": "rectangle",
        "colorKey": "sapphire",
        "points": [
          [
            0,
            0
          ],
          [
            4,
            0
          ],
          [
            4,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 0,
          "gridY": 6,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l5_p15",
        "name": "Prism Parallelogram",
        "shapeType": "parallelogram",
        "colorKey": "coral",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            4,
            2
          ],
          [
            2,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 4,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l5_p16",
        "name": "Prism Delta A (Tri)",
        "shapeType": "triangle",
        "colorKey": "rose",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 4,
          "rotation": 270,
          "flipped": false
        },
        "trayRotation": 180
      },
      {
        "id": "l5_p17",
        "name": "Prism Delta B (Tri)",
        "shapeType": "triangle",
        "colorKey": "emerald",
        "points": [
          [
            0,
            0
          ],
          [
            2,
            0
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 6,
          "gridY": 4,
          "rotation": 90,
          "flipped": false
        },
        "trayRotation": 0
      },
      {
        "id": "l5_p18",
        "name": "Aether Pillar (3x2)",
        "shapeType": "rectangle",
        "colorKey": "amethyst",
        "points": [
          [
            0,
            0
          ],
          [
            3,
            0
          ],
          [
            3,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 4,
          "gridY": 6,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 90
      },
      {
        "id": "l5_p19",
        "name": "Nexus Rod (1x2)",
        "shapeType": "rectangle",
        "colorKey": "cyan",
        "points": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            1,
            2
          ],
          [
            0,
            2
          ]
        ],
        "solution": {
          "gridX": 7,
          "gridY": 6,
          "rotation": 0,
          "flipped": false
        },
        "trayRotation": 0
      }
    ]
  }
];
