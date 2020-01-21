$(function() {
		
	const domain = "https://crushretailapp.sayantanpc.repl.co";
	//const domain = window.location.hostname;
	
	let prodPage = 0;    //page no.
	let perPage = 0;  //limit 
	let gCat = '';	//category
	let prodURLbase = '';
	let searchURLbase = '';
	let pBarBaseClass = '';
	
	initApp();
	
	$("form").submit(function(e){
		e.preventDefault();
	});
	
	
	function initApp(){
		prodPage = 1;	//page number`
		perPage = 12;  //default number of results per page
		gCat = 'all';	//default category
		prodURLbase = domain + "/products/";
		//searchURLbase = domain + "/search/";
		searchURLbase = domain + "/searchv2/";
		
		pBarBaseClass = "progress-bar";
		
		let url = prodURLbase + encodeURI(gCat) + `?p=${prodPage}&l=${perPage}`;
		getCatProducts(url, gCat);
	}
	
	
	//alert(JSON.stringify($("body").data().cat_prodlist));	
	
	
	//initialize progress bar in the parent element ref. (el). Also, pass the css class name of the progress bar.
	function initLoadingProgress(el, pbclass){
		
		let pBarHtml = '<div class="' + pbclass + ' progress-bar-striped progress-bar-animated" style="width:5%"></div>';
		 el.html(pBarHtml);
		 
		 let pBarIntervalId = setInterval(function(){
			 let v = parseInt(el.find("." + pbclass).attr("width").split("%")[0]);
			 el.find("." + pbclass).attr("width", (v + 0.5) + "%");
		 }, 200);
		 
		 //save the interval id
		 el.find("." + pbclass).data("intervalId", pBarIntervalId);
	}
	
	//show progress %. Pass the parent element ref. (el) to locate the progress bar and the % loaded value. Also, pass the css class name of the progress bar.
	function showLoadingProgress(el, pbclass, pct){
		
		el.find("." + pbclass).attr("width", pct + "%");
	}
	
	
	//hide progres bar. Pass the parent element ref. (el) to locate the progress bar.
	function hideLoadingProgess(el, pbclass){
		
		el.find("." + pbclass).attr("width", "100%");
		let intervalId = el.find("." + pbclass).data().intervalId;
		
		clearInterval(intervalId);
		el.find("." + pbclass).fadeOut();
	}
	
	
	//fetch the products
	function getCatProducts(searchURL, catg){
		
		//initLoadingProgress($("#container_prod_list"), pBarBaseClass);
		
		$.when($.getJSON(searchURL, function( res ) {
			
			//alert(data);
			if(res.status == 'undefined' || res.status == 'failed'){
				//trigger data complete and return
				$("#container_prod_list").trigger($.Event("dataComplete"));
				return;
			};
			
			//load fetched data
			let obj = $("#container_prod_list").data().cat_prodlist;
			
			//reset the data store if needed (catg changed or data not defined yet)
			if($("#container_prod_list").data().cat != catg || obj === undefined || obj === null){
				//alert('Un-defined');
				$("#container_prod_list").removeData("cat_prodlist");
				$("#container_prod_list").data({cat_prodlist : [res.data], cat : catg});
			}
			else{
				//alert('defined');
				$("#container_prod_list").data().cat_prodlist.push(res.data);  //array of arrays
			}
			
			
			//count total no. of records fetched from server
			let len = 0;
			$("#container_prod_list").data().cat_prodlist.forEach(function(item, ind){
				len += item.length;
			});			
			console.log(catg + ' : ' + len);
			
			//***To test this code to stop the 'Pagination' at the end of all the data
			//To Trigger dataComplete  event, check if the last calculated total count matches with the current total.
			/*if($("#container_prod_list").data().cat_rec_count == len){
				//alert('all data fetched');
				$("#container_prod_list").trigger($.Event("dataComplete"));
			}
			else{
				$("#container_prod_list").removeData("cat_rec_count");
				$("#container_prod_list").data("cat_rec_count", len);
			}*/
			
		})).then(function(){
			
			//alert('products were fetched');
			
			//showLoadingProgress($("#container_prod_list"), pBarBaseClass, 30);
			
			$("#container_prod_list").trigger($.Event("dataFetched", {method : "getCatProducts"}));
			
			//increment the results page counter
			prodPage += 1;
		});
	}
	
	
	//load a new card. Pass the DOM element ref. to add the card to and the data {object} for the card
	function loadCard(el, data){
		
		//build url for image
		let imgUrl = domain + '/image/' + data.Item_Number;
		
		let htmlInStock = '';
		
		if (data.InStock.toUpperCase() == 'YES') {
			htmlInStock = '<h6><span class="badge badge-success">In Stock</span></h6>';
		}
		
		let htmlDiscount = '';
		let htmlDisPrice = '';
		let htmlPrice = data.List_Price;
		
		if(data.Discount != 0){
			/*htmlDiscount = '<div class="card-img-overlay"><p class="text-md-left"><span class="badge badge-pill badge-danger medium"><span class="badge badge-light">$' + 
							data.Discount + '</span> off</span></p></div>';*/
			htmlDiscount = '<div class="card-img-overlay"><p class="text-md-left"><span class="badge badge-pill badge-danger medium">$' + 
							data.Discount + ' off</span></p></div>';
			
			htmlDisPrice = '&nbsp;' + (data.List_Price - data.Discount);
			htmlPrice = '<s>' + data.List_Price + '</s>';
			
		}
		
		let htmlAttr = '<h6 class="bg-info text-white font-weight-bold"><small>';
		
		if(data.SKUAtt_Value1 != null && data.SKUAtt_Value1 != ""){
			htmlAttr += data.SKUAtt_Value1 + '&nbsp;&nbsp;';	
		}
		
		if(data.SKUAtt_Value2 != null && data.SKUAtt_Value2 != ""){
			htmlAttr += data.SKUAtt_Value2 + '&nbsp;&nbsp;';
		} 
		
		if(data.SKUAtt_Value3 != null && data.SKUAtt_Value3 != ""){
			htmlAttr += data.SKUAtt_Value3 + '&nbsp;' + data.SKUAttribute3 + '&nbsp;&nbsp;';
		}
		
		if(data.SKUAtt_Value4 != null && data.SKUAtt_Value4 != ""){
			htmlAttr += data.SKUAtt_Value4 + '&nbsp;&nbsp;';
		}
		
		if(data.SKUAtt_Value5 != null && data.SKUAtt_Value5 != ""){
			htmlAttr += data.SKUAtt_Value5 + '&nbsp;&nbsp;';
		}
		
		if(data.SKUAtt_Value6 != null && data.SKUAtt_Value6 != ""){
			htmlAttr += data.SKUAtt_Value6 + '&nbsp;&nbsp;';
		}
		
		htmlAttr += '</small></h6>';
		
		//prepare the html for the card
		let cardHtml = 
				'<!--Grid column-->' +
				'<div class="col-lg-3 col-md-6 mb-4" id="p' + data.Item_Number +'">' +
				'<!--Card-->' +
				'<div class="card">' +
				'  <!--Card image-->' +
				'  <div class="view overlay">' +
				'	<img src="' + imgUrl + '" crossorigin="anonymous"  max-width="200" height="250" alt="Thumbnail" class="mx-auto d-block">' +
				'	<a>' +
				'	  <div class="mask rgba-white-slight"></div>' +
						htmlDiscount +
				'	</a>' +
				'  </div>' +
				'  <!--Card image-->' +
				'  <!--Card content-->' +
				'  <div class="card-body text-center">' +
				'	<!--Category & Title-->' +
				'	<a href="" class="grey-text">' +
				'	  <h6>' + data.Class_Name + '</h6>' +
				'	</a>' +
				'	<h6>' +
				'	  <strong>' +
				'		<a href="" class="dark-grey-text">' + data.sku_desc + 
				'		</a>' +
				'	  </strong>' +
				'	</h6>' + 
					htmlAttr + 
				'	<h6 class="font-weight-bold blue-text">' +
				'	  <strong>$' + htmlPrice + htmlDisPrice + '</strong>' + 
				'	</h6>' + 
				    htmlInStock + 
				'  </div>' +
				'  <!--Card content-->' +
				'</div>' +
				'<!--Card-->' +
				'</div>' +
				'<!--Grid column-->';
				
		$.when(el.append(cardHtml))
			.then(function(d){
				//trigger new card loaded event on the results container
				$("#container_prod_list").trigger($.Event("newCardLoaded"));
			});
		
		//$("#p" + data.Item_Number).data("catg", data.catg);
	}

	
	
	//load 'n' new rows. Pass the DOM element ref. to add the row to
	function loadRow(el, n){
		
		let rowHTML = 
			'<!--Grid row-->' + 
			'<div class="row wow fadeIn"></div>' + 
			'<!--Grid row-->';
			
		for(i=0;i<n;i++){
			$.when(el.append(rowHTML))
				.then(function(d){
					//trigger new row added event on the results container
				$("#container_prod_list").trigger($.Event("newRowAdded"));
				});
		}
	}
	
	
	
	//pagination start
	function initPaginate(context){
		
		//reset page counter
		prodPage = 1; 
		
		$("#btn_paginate").click(function(e){
				
			//add spinner to show data load progress
			let loadHTML = '<span class="spinner-border spinner-border-sm"></span>';
			$(this).append(loadHTML);
			
			$(this).prop("disabled",true);
			
			//let catg = $("#nav_catg").find("li.active").children("a.nav-link").attr("data").toLowerCase();
			
			//load more results
			if(context == 'SEARCH'){
				let url = prodURLbase + encodeURI(gCat) + `?p=${prodPage}&l=${perPage}`;
				getCatProducts(url, gCat);				
			}
			else {
				let url = searchURLbase + encodeURI(gCat) + `?p=${prodPage}&l=${perPage}`;
				getCatProducts(url, gCat);
			}
			
		});
	}
	
	
	//page load completed
	function stopPaginate(){
		
		//remove the spinner
		$("#btn_paginate").children("span").remove();
		
		$("#btn_paginate")
			.prop("disabled",false)
			.addClass("btn btn-outline-primary btn-block")
			.fadeIn("slow");
	}
	
	
	//pagination end
	function endPaginate(){
		
		//remove the spinner
		$("#btn_paginate").children("span").remove();
		
		$("#btn_paginate")
			.prop("disabled",true)
			.removeClass("btn btn-outline-primary btn-block")
			.attr("display","none");
	}
	
	
	
	//search products
	function searchProducts(){	
	
		//reset the page COunter
		prodPage = 1;
	
		let q = $("#in_text_box").val();
		
		if(q == null || q == ""){
			return false;
		}
		
		let url = searchURLbase + encodeURI(q) + `?p=${prodPage}&l=${perPage}`;
		console.log(url);
		getCatProducts(url, q);
		
	}
	
	
	
	//action on categories nav bar 
	$("#nav_catg").find("a.nav-link").click(function(e){
		//alert($(this).attr('data'));
		
		$("#nav_catg").find("li.active").removeClass("active");
		
		$(this).parent("li.nav-item")
				.append('<span class="sr-only">(current)</span>')
				.addClass("active");
		
		let searchStrArr = $(this).attr("data").toLowerCase();
		
		if(gCat != searchStrArr){
			
			//update the catgory to the recently selected
			gCat = searchStrArr;
			
			//trigger category changed event
			$("#container_prod_list").trigger($.Event("dataCatgChanged"));
			
			initPaginate("PRODUCT");
			
			//get the results
			let url = domain + "/products/" + encodeURI(gCat) + `?p=${prodPage}&l=${perPage}`;
			getCatProducts(url, gCat);
		}
		else {
			//do nothing
			null;
		}
		
		
		//alert(JSON.stringify(searchStrArr));
		
		
		//test: offline filtering
		/*if(searchStrArr === "ALL"){
			$("#container_prod_list")
				.children("div")	//select grid rows
				.children("div")
				.show();  //display all
		}
		else{
				
			//filter the results of the product page
			$("#container_prod_list")
				.children("div")	//select grid rows
				.children("div")	//select the cards (grid col)
				.filter(function(i){
					let str = $(this).data("catg").toUpperCase();
					//alert(str);
					
					if(str.indexOf(searchStrArr) > -1){
						//alert("to search for: " + searchStrArr[0] + " in str: " + str);
						$(this).show();
						$(this).addClass("col-lg-3 col-md-6 mb-4");
					}else{
						$(this).hide();
						$(this).removeClass("col-lg-3 col-md-6 mb-4");
					}
					
				});
		}*/ 
		
	});
	
	
	//action when products data is received
	$("#container_prod_list").on("dataFetched", function(e){
		//alert(e.method);
		
		//hide the contents
		$(this).nextAll().fadeOut();
		
		//Get the newly recvd. data
		let obj = $("#container_prod_list").data().cat_prodlist;
		let prodData = obj[obj.length-1];
		let el;
		
		prodData.forEach(function(item, ind){
						
			//check if the last grid row is filled
			let no_of_cols = $("#container_prod_list")
					.children("div:last-child")  //grid row
					.children("div").length;	//no. of grid column
					
			//alert(no_of_cols);
			
			//add card to the same row if the last row is not filled yet
			if(no_of_cols > 0 && no_of_cols < 4){
				el = $("#container_prod_list")
					.children("div:last-child");  //grid row
					
				loadCard(el, item);
			}
			else{  //add a new row and then add the card
				loadRow($("#container_prod_list"), 1);
				
				//get ref. to the last row
				el = $("#container_prod_list").children("div:last-child");
				loadCard(el, item);
			}
			
			//showLoadingProgress($("#container_prod_list"), pBarBaseClass, 30);
			
		});
		
		
		//trigger data displayed event
		$("#container_prod_list").trigger($.Event("dataDisplayed"));
		
	});
	
	
	
	//action when data is displayed
	$("#container_prod_list").on("dataDisplayed", function(e){
		
		//$(this).fadeIn();
		stopPaginate();
	});
	
	
	//action when no more data available to be fetched
	$("#container_prod_list").on("dataComplete", function(e){
		
		endPaginate();
	});	
	
	
	//action on Category change
	$("#container_prod_list").on("dataCatgChanged", function(e){
		
		//cleanup the previous results
		$(this).children("div").remove();
		
		endPaginate();
		
	});
	
	
	//action on new results card loaded
	$("#container_prod_list").on("newCardLoaded", function(e){
		//do nothing
		return;
	});
	
	
	//action on new results row added
	$("#container_prod_list").on("newRowAdded", function(e){
		//do nothing
		return;
	});
	
	
	//text based search
	$("#btn_txt_search").click(function(e){
		
		//cleanup results container and hide pagination
		/*$("#container_prod_list").children("div").remove();
		$("#btn_paginate")
			.removeClass("btn btn-outline-primary btn-block")
			.attr("display","none");*/
		
		//trigger search text changed event
		$("#container_prod_list").trigger($.Event("dataCatgChanged"));
		
		initPaginate("SEARCH");
		searchProducts();
		
	});
	
	
	//action on search text changed
	$("#in_text_box").on('change', function(e){					
			
		//cleanup results container and hide pagination
		/*$("#container_prod_list").children("div").remove();
		$("#btn_paginate")
			.removeClass("btn btn-outline-primary btn-block")
			.attr("display","none");*/
		
		//trigger search text changed event
			$("#container_prod_list").trigger($.Event("dataCatgChanged"));
			
		initPaginate("SEARCH");
		searchProducts();
			
	});
	
	
	//voice based search
	$("#btn_voice_search").click(function(e){
		return false;
		
	});
	
	
	$("#in_text_box").focus(function(e){
		$(this).select();
	});
	
	
		
		
});