$(document).ready(function() {
	'use strict';
	/*-----------------------------------------------------------------------------------*/
	/*	ISOTOPE GRID
	/*-----------------------------------------------------------------------------------*/
	function enableIsotope() {
		// for each container
		$('.grid').each(function(i, gridContainer) {
			var $gridContainer = $(gridContainer);
			// init isotope for container
			var $grid = $gridContainer.find('.isotope').imagesLoaded(function() {
				$grid.isotope({
					itemSelector: '.item',
					layoutMode: 'masonry',
					percentPosition: true,
					masonry: {
						columnWidth: $grid.width() / 12
					},
					transitionDuration: '0.7s'
				})
			});
			$(window).resize(function() {
				$grid.isotope({
					masonry: {
						columnWidth: $grid.width() / 12
					}
				});
			});
			$(window).on("load", function() {
				$grid.isotope({
					masonry: {
						columnWidth: $grid.width() / 12
					}
				});
			});
			// initi filters for container
			$gridContainer.find('.isotope-filter').on('click', 'a', function() {
				var filterValue = $(this).attr('data-filter');
				$grid.isotope({
					filter: filterValue
				});
			});
		});
		$('.isotope-filter').each(function(i, buttonGroup) {
			var $buttonGroup = $(buttonGroup);
			$buttonGroup.on('click', 'a', function() {
				$buttonGroup.find('.active').removeClass('active');
				$(this).addClass('active');
			});
		});
	};
	enableIsotope();
	/*-----------------------------------------------------------------------------------*/
	/*	FANCYBOX
	/*-----------------------------------------------------------------------------------*/
	$("[data-fancybox]").fancybox({
		idleTime : false,
		smallBtn: false, 
		buttons : [
			'close'
		],
		touch : {
			vertical : false,
			momentum : false
		},
		wheel : false
	});
});
