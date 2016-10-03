window.onload = function() {

	/*
	 * GLOBAL VARIABLES
	 */

	var NEUTRAL_COLOR = '#ffffff';
	var BURNED_COLOR = '#ff6666';
	var SAVED_COLOR = '#99ff66';

	var INTERVAL_MILLISECS = 1000;

	// The main graph drawing network object
	var network;
	var nodes;
	var edges;

	// Animation variables
	var animationSteps;
	var intervalObject;
	var animationTimesteps;
	var animationTimesrun;
	var isAnimationRunning;

	// The data input text area
	var modelInputTextArea;

	var defaultData = 
	{
		nodes: [
	    {id: 1, label: '1'},
	    {id: 2, label: '2'},
	    {id: 3, label: '3'},
	    {id: 4, label: '4'},
	    {id: 5, label: '5'}
		],
		edges: [
	    {from: 1, to: 3},
	    {from: 1, to: 2},
	    {from: 2, to: 4},
	    {from: 2, to: 5}
		],
		source_nodes: [2],
		animation: [
			{
				burns: [3],
				saves: [2,4]
			},
			{
				burns: [5],
				saves: []
			},
		],
	};

	var mainData = defaultData;

	/*
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
			},
		],
}

	*/


	/*
	 * METHODS
	 */


	var setupHierarchicalButtons = function() {
		$('#hierarc-lr').click(function() {
			var opt = getOptions;
			opt.layout = {hierarchical: { direction: "LR"}}
			network.setOptions(opt);
		});
		$('#hierarc-rl').click(function() {
			var opt = getOptions;
			opt.layout = {hierarchical: { direction: "RL", enabled: true}}
			network.setOptions(opt);
		});
		$('#hierarc-du').click(function() {
			var opt = getOptions;
			opt.layout = {hierarchical: { direction: "DU", enabled: true}}
			network.setOptions(opt);
		});
		$('#hierarc-ud').click(function() {
			var opt = getOptions;
			opt.layout = {hierarchical: { direction: "UD", enabled: true}}
			network.setOptions(opt);
		});
		$('#hierarc-refresh').click(function() {
			var opt = getOptions;
			opt.layout = {hierarchical: false}
			network.setOptions(opt);
			network.redraw();
		});
	};

	var readSingleFile = function(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
	      var contents = e.target.result;
        setData(JSON.parse(contents)); 
      }
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
  }


	/* Setup the options for the graph visualization tool */
	var getOptions = function() {
		var options = {
	  	autoResize: true,
	  	edges: {
	  		arrows: 'to',
	  		physics: true,
	  		smooth: {
	  			enabled: false,
	  			forceDirection: false,
	  		},
	  	},
	  	nodes: {
	  		color: {
	  			background: NEUTRAL_COLOR,
	  		},
	  	},
	  };

	  return options;
	};


	var setData = function(data) {
		mainData = data;
		loadData();
	}

	/* Loads the data from the input, or the default data if none is provided */
	var loadData = function() {
		nodes = new vis.DataSet(mainData.nodes);
		edges = new vis.DataSet(mainData.edges);
		source_nodes = mainData.source_nodes;

		var graph = {
	    nodes: nodes,
	    edges: edges,
	  };

		network.setData(graph);
		animationSteps = mainData.animation;
		animationTimesteps = animationSteps.length - 1;
		clearGraphFormatting();
	};


	/* Clears the graph formating to initial state, i.e., all nodes white and source nodes red */
	var clearGraphFormatting = function() {
			// Clears all the nodes to initial state
			for(var i = 1; i <= nodes.length; i++) {
				nodes.update([
					{
						id:i,
						color: {background: NEUTRAL_COLOR}
					}
				]);
			}

			// Set source nodes to burned
			for(var i in source_nodes) {
				nodes.update([
					{
						id: source_nodes[i],
						color: {background: BURNED_COLOR}
					}
				]);	
			}
	};

	/* Runs the animation of a given index */
	var animateGraph = function(index) {
		console.log("Animatting... ", index);

		var nodesToBurn = animationSteps[index].burns;
		var nodesToSave = animationSteps[index].saves;

		console.log("BURNING", nodesToBurn);
		for(var i in nodesToBurn) {
			nodes.update([
				{
					id: nodesToBurn[i],
					color: {background: BURNED_COLOR}
				}
			]);	
		}

		console.log("SAVING", nodesToSave);
		for(var i in nodesToSave) {
			nodes.update([
				{
					id: nodesToSave[i],
					color: {background: SAVED_COLOR}
				}
			]);	
		}
	};

	/* Runs the animation provided */
	var runModelAnimation = function() {
		if(isAnimationRunning) return;
		clearGraphFormatting();
		isAnimationRunning = true;
		animationTimesrun = 0;
		intervalSecs = $('#aimation-secs').val();		
		intervalObject = setInterval(function(){
	    if(animationTimesrun >= animationTimesteps){
	      clearInterval(intervalObject);
				isAnimationRunning = false;
	    }
	    animateGraph(animationTimesrun);
	    animationTimesrun++;
		}, INTERVAL_MILLISECS); 
	};

	/* Stops the animation and resets the formatting to initial state */
	var stopModelAnimation = function() {
		clearInterval(intervalObject);
		isAnimationRunning = false;
		clearGraphFormatting();
	};
 
 	/* ======= MAIN =======*/
	(function(){
	  
	  // Initialize codemirror!
		var myTextarea = document.getElementById('datatextarea');
		modelInputTextArea = CodeMirror.fromTextArea(myTextarea, {
	    lineNumbers: false,
	    mode:  {name: "javascript", json: true}
	  });

	  // Initialize network!
	  var networkContainer = document.getElementById('mynetwork');
	  network = new vis.Network(networkContainer, new vis.DataSet(), getOptions());
	  loadData();

		// Setup modal behavior
	  $('#myModal').on('shown.bs.modal', function () {
		  modelInputTextArea.focus();
		})
		$('.submit-data').click(function() {
			$('#myModal').modal('hide');
			var data = JSON.parse(modelInputTextArea.getValue());
			setData(data);
		});

		// Setup animation buttons
		$('#play-animation-btn').click(function(){
			runModelAnimation();
		});
		$('#stop-animation-btn').click(function(){
			stopModelAnimation();
		});

		// Setup hierarchical drawing
		setupHierarchicalButtons();

		// Setup the import file button
		document.getElementById('importFile').addEventListener('change', readSingleFile, false);

	})();
};