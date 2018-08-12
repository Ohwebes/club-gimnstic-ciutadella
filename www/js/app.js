angular.module("club_gimnstic_ciutadella", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","club_gimnstic_ciutadella.controllers", "club_gimnstic_ciutadella.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "CLUB GIMN&Agrave;STIC CIUTADELLA" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "club_gimnstic_ciutadella",
				storeName : "club_gimnstic_ciutadella",
				description : "The offline datastore for CLUB GIMN&Agrave;STIC CIUTADELLA app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/club_gimnstic_ciutadella/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("YzBmYWFhN2UtYjM4Yy00ZjY5LWFjZDctMTY3ZDkzMTBjYzUz").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("club_gimnstic_ciutadella.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("es");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("es");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?httpwww\.gimnastic\-ciutadella\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("club_gimnstic_ciutadella",{
		url: "/club_gimnstic_ciutadella",
			abstract: true,
			templateUrl: "templates/club_gimnstic_ciutadella-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("club_gimnstic_ciutadella.about_us", {
		url: "/about_us",
		views: {
			"club_gimnstic_ciutadella-side_menus" : {
						templateUrl:"templates/club_gimnstic_ciutadella-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("club_gimnstic_ciutadella.dashboard", {
		url: "/dashboard",
		views: {
			"club_gimnstic_ciutadella-side_menus" : {
						templateUrl:"templates/club_gimnstic_ciutadella-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("club_gimnstic_ciutadella.faqs", {
		url: "/faqs",
		views: {
			"club_gimnstic_ciutadella-side_menus" : {
						templateUrl:"templates/club_gimnstic_ciutadella-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("club_gimnstic_ciutadella.menu_one", {
		url: "/menu_one",
		views: {
			"club_gimnstic_ciutadella-side_menus" : {
						templateUrl:"templates/club_gimnstic_ciutadella-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("club_gimnstic_ciutadella.menu_two", {
		url: "/menu_two",
		views: {
			"club_gimnstic_ciutadella-side_menus" : {
						templateUrl:"templates/club_gimnstic_ciutadella-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("club_gimnstic_ciutadella.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"club_gimnstic_ciutadella-side_menus" : {
						templateUrl:"templates/club_gimnstic_ciutadella-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})


// router by user


	$urlRouterProvider.otherwise("/club_gimnstic_ciutadella/dashboard");
});
