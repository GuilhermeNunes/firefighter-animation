# firefighter-animation
Simple animation interface for the firefighter problem

Accepted JSON format:

<code>
{
		"nodes": [
	    {"id": 1, "label": "1"},
	    {"id": 2, "label": "2"},
	    {"id": 3, "label": "3"},
	    {"id": 4, "label": "4"},
	    {"id": 5, "label": "5"}
		],
		"edges": [
	    {"from": 1, "to": 3},
	    {"from": 1, "to": 2},
	    {"from": 2, "to": 4},
	    {"from": 2, "to": 5}
		],
		"source_nodes": [1],
		"animation": [
			{
				"burns": [3],
				"saves": [2,4]
			},
			{
				"burns": [5],
				"saves": []
			}
		]
}
</code>
