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
	/*-----------------------------------------------------------------------------------*/
	/*	CONTACT FORM
	/*-----------------------------------------------------------------------------------*/
	function enableContactForm() {
		$('.contact-form').validator({
			disable: false,
			focus: false
		});
		// when the form is submitted
		$('#contact-form').on('submit', function(e) {
			// if the validator does not prevent form submit
			if (!e.isDefaultPrevented()) {
				var url = "contact/contact.php";
				// POST values in the background the the script URL
				$.ajax({
					type: "POST",
					url: url,
					data: $(this).serialize(),
					success: function(data) {
						// data = JSON object that contact.php returns
						// we recieve the type of the message: success x danger and apply it to the
						var messageAlert = 'alert-' + data.type;
						var messageText = data.message;
						// let's compose Bootstrap alert box HTML
						var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissible fade show"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + messageText + '</div>';
						// If we have messageAlert and messageText
						if (messageAlert && messageText) {
							// inject the alert to .messages div in our form
							$('#contact-form').find('.messages').html(alertBox);
							// empty the form
							$('#contact-form')[0].reset();
						}
					}
				});
				return false;
			}
		})
	}
	enableContactForm();
});