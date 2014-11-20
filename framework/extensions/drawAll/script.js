// Draw All
	// Add Sign
	if ($("#gaia_header .header_content #dailyReward #dailyChance_clawMachine").length > 0) {
		$("#gaia_header .header_content #dailyReward #dailyChance_clawMachine").after("<a class='bg_drawall' title='BetterGaia&rsquo;s Draw All Daily Chances'>draw <em>all</em></a>");
		$("body").append('<div id="bg_drawall"> \
			<div class="bgda_header"> \
				<strong>Draw All</strong> \
				<p class="bonus"></p> \
				<a id="bg_candyclose" title="Close"></a> \
			</div> \
			<ul> \
				<li><div><span candy="1"><a>Collect</a></span></div><h5>Home</h5></li> \
				<li><div><span candy="2"><a>Collect</a></span></div><h5>MyGaia</h5></li> \
                <li><div><span candy="1279"><a>Collect</a></span></div><h5>Gaia Cash</h5></li> \
				<li><div><span candy="8"><a>Collect</a></span></div><h5>Shops</h5></li> \
                <li><div><span candy="1271"><a>Collect</a></span></div><h5>GoFusion</h5></li> \
				<li><div><span candy="3"><a>Collect</a></span></div><h5>Forums</h5></li> \
				<li><div><span candy="5"><a>Collect</a></span></div><h5>World</h5></li> \
				<li><div><span candy="4"><a>Collect</a></span></div><h5>Games</h5></li> \
				<li><div><span candy="12"><a>Collect</a></span></div><h5>Mobile App</h5></li> \
			</ul> \
		</div><div class="bettergaia mask"></div>');
	}

	// Main screen
	$("#gaia_header .header_content #dailyReward a.bg_drawall").on("click", function(){
		$("body > #bg_drawall").addClass("bgopen");
	});
	$("#bg_drawall #bg_candyclose").on("click", function(){
		$("body > #bg_drawall").removeClass("bgopen");
	});

	$("#bg_drawall > ul > li:not([class]) > div > span").on("click", function(){
		$(this).parent().parent().addClass("bgc_loading");
		var thisDiv = $(this).parent();

		$.post("/dailycandy/pretty/", {action: "issue", list_id: $(this).attr("candy"), _view: "json"}, function(data) {
			thisDiv.parent().removeClass("bgc_loading");

			if (data['status'] == "ok") {
				thisDiv.parent().addClass("bgc_candy");
				$(thisDiv).html("<img src='http://s.cdn.gaiaonline.com/images/" + data['data']['reward']['thumb'] + "' /> \
					<h6>" + data['data']['reward']['name'] + "\
					<info><message>" + data['data']['reward']['descrip'] + "</message></info>\
					</h6>");
				$("#bg_drawall .bgda_header p.bonus").text(data['data']['tier_desc']);
			}
			else if (data['status'] == "fail") {
				thisDiv.parent().addClass("bgc_error");
				thisDiv.html("<info>" + data['error']['message'] + "</info>");
			}
			else {
				thisDiv.parent().addClass("bgc_error");
				thisDiv.html("<info>There was a problem getting your Daily Chance.</info>");
			}
		}, "json");
	});
