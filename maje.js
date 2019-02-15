var Maje = Maje || {};

var Claudie = Claudie || {};

Claudie.home = Claudie.home || {};

Claudie.footer = Claudie.footer || {};

Claudie.cart = Claudie.cart || {};

Claudie.product = Claudie.product || {};

Claudie.plpProduct = Claudie.plpProduct || {};

Claudie.plpProduct.filters = Claudie.plpProduct.filters || {};

Claudie.utils = Claudie.utils || {};

Claudie.newsletter = Claudie.newsletter || {};

Maje.header = Maje.header || {};

Maje.home = Maje.home || {};

Maje.footer = Maje.footer || {};

Maje.product = Maje.product || {};

Maje.minicart = Maje.minicart || {};

Maje.cart = Maje.cart || {};

Maje.account = Maje.account || {};

Maje.checkoutminicart = Maje.checkoutminicart || {};

Maje.checkout = Maje.checkout || {};

Maje.confirmation = Maje.confirmation || {};

Maje.zoomProduct = Maje.zoomProduct || {};

Maje.lookbook = Maje.lookbook || {};

Maje.giftpage = Maje.giftpage || {};

Maje.newsletter = Maje.newsletter || {};

Maje.login = Maje.login || {};

/*
*	Bind events for the lookbook
*/
Maje.lookbook.bindEvents = function() {
	Maje.lookbook.initSliderLooks();
	Maje.lookbook.toggleProductSize.events();
	Maje.lookbook.video();

	// init event for add to cart
	app.product.initAddToCart();
}

/*
*	Init slider swiper
*/
Maje.lookbook.initSliderLooks = function() {
	function extractUrlParams(param){
		var vars = {};
		window.location.href.replace( 
			/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
			function( m, key, value ) { // callback
				vars[key] = value !== undefined ? value : '';
			}
		);

		if ( param ) {
			return vars[param] ? vars[param] : null;	
		}
		return vars;
	}
	
	var redImg = 0; 
	var nbLook = $(".lookbook_E16").length - 1;
	var slideIndex = extractUrlParams("index");
	
	if(slideIndex == null || slideIndex > nbLook){
		slideIndex = 0;
	}

	// Check the swiper exist
	if($('.swiper-container').length) {

		// Init slider
		var mySwiperLookbook = new Swiper('.swiper-container', { 
			mode:'horizontal',
			loop: true,
			grabCursor: false,
			simulateTouch: false,
			initialSlide: slideIndex,
			onSlideChangeEnd: function(swiper){
				
				var allVid = $('.content-right iframe').length;
				if (allVid > 0){
					for(var i=0; i<allVid; i++ ){
			    		var iframe = $('.content-right iframe')[i];
					    var player = $f(iframe);
				        player.api('pause');
			    	}
	
					(function(){
				    	var iframe = $('.swiper-slide-visible.swiper-slide-active .content-right iframe')[0];
					    var player = $f(iframe);
				        player.api('play');
					})()
				}
				
				if (redImg >= 5 && $(".redlookbook").length > 0){
					redImg = 0;
					$(".swiper-slide-visible.swiper-slide-active .redlookbook").animate({"opacity" : 0}, 3250);
				}
			},
			onSlideChangeStart: function(swiper){
				redImg++
				$(".redlookbook").css({"opacity" : 0});
				if (redImg >= 5 && $(".redlookbook").length > 0){
					$(".swiper-slide-visible.swiper-slide-active .redlookbook").css({"opacity" : 1});
				}
			}
		});
		
		// Click on left : show the previous slide
		// Click on right : show the next slide
		$('.swiper-wrapper .swiper-button-prev').on("click", function(e) {
			e.preventDefault();
			mySwiperLookbook.swipePrev();
		});
		
		$('.swiper-wrapper .swiper-button-next').on("click", function(e) {
			e.preventDefault();
			mySwiperLookbook.swipeNext();
		});

	}

}

/*
 *	Init jwplayer and load
 */
Maje.lookbook.video = function(){

	// Get the url of the video
	var url_video = $("div#urlVideo").data("src-video");
	
	// Check url exist
	if(url_video) {

		// Init player
		jwplayer("video").setup({
	        file: url_video,
	        width: "100%",
	        height: "100%",
	        autostart: false,
	        mute: false,
	        controls: true,
	        repeat:false
	    });

	}
}

/*
*	Events for toggle the product sizes to look
*/

Maje.product.eventLookComplet = function() {

	 // Init form
	 $(document).on('click', 'a.btnSelectedSizes', function() {
	  $(this).closest('div.complete-look-variations').toggleClass('active');
	 });

	 // Event to select size
	 $('.complete-look-variations form .size-list ul li a.size').on('click', function() {
	  var form = $(this).closest('form');
	  var liParent = $(this).parent();
	  // we get text of element selected
	  var valSelected = $(this).text();
	  
	  // we define a variable for find the html and apply the value selected on it
	  var valSelectedDefine = $(this).closest('.complete-look-variations').find('.valueSizeSelected');
	  valSelectedDefine.text(valSelected);
	  // when you click on div complete look variation you can show or hide with class active, 
	  // this class active is define on css for show hide some element
	  $(this).closest('div.complete-look-variations').addClass('selectedSize').toggleClass('active');
	  
	  form.find('li.selected').removeClass('selected');
	  form.find('input#pid').val("");

	  if(!liParent.hasClass('size-unvailable')) {
	   liParent.addClass('selected');
	   form.find('input#pid').val(liParent.data('productid'));
	   form.find('span.error-select-size').remove();
	   form.find('button').removeClass('disabled')
	  }
	  else {
	   form.find('button').addClass('disabled');
	  }

	 });

	 $('.complete-look-variations form').on('submit', function(e) {
	  e.preventDefault();

	  if(!$(this).find('button').hasClass('disabled') && $(this).find('input#pid').val() !== "") {
	   var form = $(this).closest("form");
	   var data = form.serialize();

	   app.cart.update(data, function (response) {

	    app.minicart.show(response);
	    Maje.minicart.bindEvents();

	    $('#mobileBasket span').html($('#mini-cart .mini-cart-nb').html());
	    $('.footerMobile .mini-cart-total span.mini-cart-nb').html($('#mini-cart .mini-cart-nb').html());
	   });

	  }
	  else {
	   $(this).find('.error-select-size').remove();
	   $(this).find('button').after('<span class="error-select-size" style="display:block;color:red">'+ $(this).find('button').data('error') +'</span>');
	  }
	 });
	}

Maje.lookbook.toggleProductSize = (function() {

	var _init = function(look) {
		look.find("ul.size li").removeClass("selected");
		look.find("input#pid").val("");
	};

	var _selectedVariant = function(li) {
		var look = li.closest(".look");
		var form = look.find("form");
		var button = form.find("a");

		if (li.hasClass("notavailable")) {
			button.switchClass("add-to-cart", "coming-soon");
			button.text(app.resources.COMMING_SOON);
		} else {
			li.addClass("selected");
			button.switchClass("coming-soon", "add-to-cart");
			button.text(app.resources.ADD_TO_CART);
			form.find("input[id='pid']").val(li.data("variant"));
		}
	};

	var events = function() {
		$("div.look h3").on("click", function() {
			var look = $(this).closest(".look");
			var listLook = $(this).closest(".list-look")
			var li = look.find("li:first");

			if (!look.hasClass("expand")) {
				listLook.find(".look").removeClass("expand");
			}

			look.toggleClass("expand");

			_init(look);

			if (look.hasClass("expand")) {
				_selectedVariant(li);
			}
		});

		$("div.look div.product ul.size li a").on("click", function() {
			var look = $(this).closest(".look");
			var li = $(this).closest("li");

			_init(look);
			_selectedVariant(li);
		});

		$(".list-look").each(function() {
			var look = $(this).find(".look");

			if (look.length == 1) {
				look.addClass("noPicto");
				look.find("h3").trigger("click");
				look.find("h3").off("click");
			}
		});
	};

	return {
		events : events
	};

})();

/*
*	Show the popup with message of validation after add to cart a product
*/
Maje.lookbook.showPopupValideAddToCart = function(){

	//	Init the popup
	$("#popup-message-valideAddToCart").dialog({

	    closeText: "",
	    draggable: false,
	    dialogClass : 'message-valideaddtocart-dialog', 
	    height: "auto",
        width: "450",
	    modal: true,
	    position: "center",
	    close: function() {
	    	$(this).addClass("hidden");
	    }
	});
}

Maje.minicart.bindEvents = function(){
	Maje.minicart.initRemoveButtons();
	$('.alertunavalability').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		// Get the clicked row
		var cartRow = $(this).closest('.cart-row');
		
		// Hide Alert & Remove buttons		
		$(this).css('display', 'none');
		cartRow.find('.unavail-remove').css('display', 'none');
		
		cartRow.parent().find('.alert-product-unavailable').css('display', 'block');
		cartRow.parent().find('.alert-product-unavailable .unavail-email').focus();
	});
	
		
	$('.alertunavalability-valid').on('click', function(e) {
		e.preventDefault();
		var email = $(this).parent().find('.unavail-email').val();
		var url = $(this).parent().find('.alertunavalability-valid').attr('href');
		if(url.length > 0) {
			url += '&email=' + email;
		}
		
		// Find the div in which the success message will be display.
		var divMessage = $(this).closest('.item-list').find('.attribute');
		var message = $('<span class="productalert-result"></span>');
		var parentCont = $(this).closest('.item-list.unavailable-pdt');
		
		if(!$(this).parent().find('.unavail-email').valid() || $(this).parent().find('.unavail-email').val().length == 0) return;
		$.ajax({
			url : url,
			success : function (response) {
				if (response.success == true) {
					if (divMessage.length) {
						message.text(response.message);
						message.addClass('success');
						divMessage.append(message);
						parentCont.addClass('msgAdd');
					}
				} else {
					message.text('Une erreur est survenue');
					message.addClass('error');
					divMessage.append(message);
				}
			},
			
			error : function () {				
				// ToDo : Handle an error
				alert('error');
			}
		});
		
		$(this).parent().css('display', 'none');
		var cartRow = $(this).closest('.item-list').find('.cart-row');
		cartRow.find('.alertunavalability').css('display', 'block');
		cartRow.find('.unavail-remove').css('display', 'block');
		
	});
	
	$('.alertunavalability-cancel').on('click', function(e) {
		e.preventDefault();
		$(this).parent().css('display', 'none');
		var cartRow = $(this).closest('.item-list').find('.cart-row');
		cartRow.find('.alertunavalability').css('display', 'block');
		cartRow.find('.unavail-remove').css('display', 'block');
	});
}	

Maje.checkoutminicart.bindEvents = function(){
	Maje.checkoutminicart.initSlide();
}

Maje.checkout.bindEvents = function(){

	//Maje.checkout.inputsFocus();
	Maje.checkout.customValidation();
	Maje.checkout.shippingAddressSelect();
	Maje.checkout.surchageCreditCardErrorMessage();
	Maje.checkout.shieldClicksFinalOrderButton();
	Maje.checkout.paypalViaOgone();
	Maje.checkout.collapsibleBillingAddress();
	Maje.checkout.validatePickupStore();
	Maje.checkout.selectPickupStore();
	Maje.checkout.showLastPickupStoreOnMap();
	Maje.checkout.collapscartTotal();
	Maje.checkout.updateMapSize();
	Maje.checkout.updateEventsCreditCard();
}

/*
 * Update the events of credit card in billing
 */
Maje.checkout.updateEventsCreditCard = function(){
	
	Maje.checkout.hideShowBlockCreditCardSave(false);
	
	//Hide block add a new payment option and update the cvn displayed
	$("div.billing-credit-card-save input.radio-creditcard").on("click", function(){
		$("div.billing-payment-option").fadeOut();
		Maje.checkout.hideShowBlockCreditCardSave(false);
	});
	
	//Display block add a new payment option and update the events of credit card save
	$("div.payment a.billing-add-payment-options").on("click", function(){
		
		//init all input value and checked
		$("form :input[type='text']").val("");
		$("form :input[type='tel']").val("");
		$("form :input[type='radio']").removeAttr("checked");
		
		$("div.billing-payment-option").fadeIn();
		Maje.checkout.hideShowBlockCreditCardSave(false);
	});
}

/*
 * First functionality : Update the show or hide for the cvn of credit card save
 * Second functionality : Update the cvn in function of input radio selected
 */
Maje.checkout.hideShowBlockCreditCardSave = function(submitCheckout){
	$("div.billing-credit-card-save input.radio-creditcard").each(function(){
		var divcvn = $(this).closest("div.billing-credit-card-save").children("label.block-cvn");
		
		if($(this).is(":checked")){
			
			if($("div.form-row.cvn.required").hasClass("error")){
				divcvn.append($("div.form-row.cvn.required").children("span.error-message"));
			}
			
			$("form.checkout-billing div.payment-final-step").css("visibility", "visible");
			
			divcvn.show();
			$("div.billing-payment-option").hide();
			
			if(submitCheckout){
				$("#dwfrm_billing_paymentMethods_creditCard_cvn").val(divcvn.children("input").val());
			}
		}
		else{
			divcvn.hide();
		}
	})
}

Maje.checkout.customValidation = function() {
	
	var checkoutFormSettings = $.extend(true, 
		{
			success : function(label, element) {				
				label.addClass("valid").text(" 鉁� ");
				
				if(element.classList.contains("zip") && element.classList.contains("avataxValidation")) {
					Maje.cart.refreshCartAmounts(element.value);
				}
			}
			
		}, app.validator.settings, 
		{
			invalidHandler : function(event, validator) {
			
				var errors = validator.numberOfInvalids();
				if (errors) {
					var message;
					if(errors > 1) {
						message = $(this).data('errorsmessage') || "Please check the following fields";
					} else {
						message = $(this).data('errormessage') || "Please check the following field";
					}

					var errorMessage = $('.form-global-error').first();
					if(!errorMessage.length) {
						// Create the span error
						errorMessage = $('<span class="form-global-error">');
						//errorMessage.insertBefore($(this));
						errorMessage.insertAfter($('.shippingmethod-container'));
					}
				
					// Set the text message					
					errorMessage.text(message);
					
					// Move element and scroll to top page
					$(this).toggleClass('global-error');
					$('window').scrollTop();
				}
			}
		}
			    
		);
	
	$('form.checkout-shipping').validate(checkoutFormSettings);
}

Maje.checkout.shippingAddressSelect = function() {
	
	function populateAddressFields(aid) {
		// For convenience, we use what's already there in app.js, simulating a change on the hidden select box
		//$('select[name*=addressList]').val(aid).change();

		$("select[name$=addressList] option[value="+aid+"]").attr("selected", true);
		var flag = $("select[name$=addressList] option:selected").attr("value");
		if(flag != ''){
			Maje.checkout.shippingAddressUpdate();
		}
		$('input[name$=selectedAddressID]').val(aid);
	}
	
	$('div#primary').on('click', 'a.shipping-address-add, a.address-edit', function(e) {
		e.preventDefault();
		e.stopPropagation(); // prevent clicks on (a.address-edit) from reaching (label.address-details)
		
		$('body').stop().animate(
				{scrollTop: $('a.shipping-address-add').offset().top - $('#header').height()}
		).promise().done(function() {
			$('div.shipping-fields').slideDown();
		});
		
		$('div.shipping-form input[name=addressbook]:checked').removeAttr('checked');
		
		if($(this).hasClass('shipping-address-add')) {
			// Adding new address, reset validator and fields
			$('form.checkout-shipping').validate().resetForm();
			$('div.shipping-fields').find('input:text, input[type=tel]').val("");
			$('div.shipping-fields').find('textarea').val('');
			$('div.shipping-fields').find('select').val('');
			$('div.shipping-fields input:radio[name$=salutation]').removeAttr('checked');
			$('input[name$=selectedAddressID]').val('');
			$('div[id$=addressid]').css('display','block');
			$('div.addtobook').show();
		} else {
			$('div.radioAdressCont').removeClass('active');
			$(this).closest('div.radioAdressCont').addClass('active');
			$('div[id$=addressid]').css('display','none');
			populateAddressFields($(this).closest('label').data('aid'));
			$('div.addtobook').hide();
		}
	});
	
	$('div#primary').on('click', 'div.select-address label.address-details', function() {
		var aid = $(this).data('aid');
		$('div.shipping-fields').slideUp().promise().done(function() {
			// promise().done() makes sure the following fires only when the animation is done.
			populateAddressFields(aid); 
			$('input[name$=selectedAddressID]').val(aid);
		});
	});
	
	if ($('div.shipping-fields span.error-message').length > 0) {
		$('div.shipping-fields').show();
	}
	//Pay page Select the default address trigger event
	$('.address-details').eq(0).click();
}

Maje.checkout.shippingAddressUpdate = function(){

	$('div.shipping-fields').find('input:text, input[type=tel]').val("");
	$('div.shipping-fields').find('textarea').val('');
	$('div.shipping-fields').find('select').val('');
	var addressJson = $("select[name$=addressList] option:selected").attr("data-address");
	var addressJsonObj = JSON.parse(addressJson);
	$('input[type=text][name$=addressid]').val(addressJsonObj.ID);
	
	$('input[type=radio][name$=_salutation][value='+addressJsonObj.salutation+']').attr("checked",'checked');
	
	$('input[type=radio][name$="salutation"]:checked ').click();
	
	$('input[name$=_firstName]').val(addressJsonObj.firstName);

	$('input[name$=_lastName]').val(addressJsonObj.lastName);					

	$('input[type=text][name$=_address1]').val(addressJsonObj.address1);

	$('input[type=text][name$=_address2]').val(addressJsonObj.address2);
	
	$('input[type=text][name$=_zip]').val(addressJsonObj.postalCode);
	
	$('input[type=tel][name$=_phone]').val(addressJsonObj.phone);
	
	$("select[name$=country]").val(addressJsonObj.countryCode);
	
	$("select[name$=state]").val(addressJsonObj.stateCode);
	
	$('select[name$=state]').change();
	
	$('select[name$=city]').val(addressJsonObj.city);
	
	$('select[name$=city]').change();
	
	$("select[name$=district]").val(addressJsonObj.district);
	
};


Maje.checkout.updateMapSize = function() {
	
	$(window).on("resize", function () {
		if (Modernizr.mq('(min-width: 768px)')){
			var windWidth = $(window).width(),
			marginMap = -(windWidth/2);
			$('.mapListLocator').css({
				'width': windWidth,
				'margin-left': marginMap
			});
		}
		
	}).resize();
	
	var btnListMap = $('#listCmd'),
	storeList = $('#storeList');
	
	btnListMap.on('click', function(event){
		event.preventDefault();
		storeList.fadeToggle();
		$(this).parent().toggleClass('show');
		storeList.jScrollPane({
			autoReinitialise: true,
			mouseWheelSpeed : 20
		});
		var api = $('#storeList').data('jsp');
		if ($('.store.highlighted').length){
			api.scrollToElement($('.store.highlighted'));
		}
	});
	
	$('#moreStore').on('click', function(event){
		event.preventDefault();
		storeList.toggleClass('open');
		$(this).siblings('.listLocator').toggleClass('open');
		$(this).toggleClass('open');
	});
	
}


/**
 * Load all events related to PayPal payment
 */
Maje.checkout.paypalViaOgone = function() {
	$(".radio-creditcard").click(function() {
		var val = $(this).attr('id');
		if(val && val.indexOf("paypal") >= 0) {
			$(".selected-payment-method").val($("#paypal").data("js-paypal-value"));
			Maje.checkout.changePaymentMethodForm($("#paypal").data("js-paypal-value"))
		} else if (val && val.indexOf("alipay") >= 0) {
			$(".selected-payment-method").val($("#alipay").data("js-alipay-value"));
			Maje.checkout.changePaymentMethodForm($("#alipay").data("js-alipay-value"))
		} else if (val && val.indexOf("wechatpay") >= 0) {
			$(".selected-payment-method").val($("#wechatpay").data("js-wechatpay-value"));
			Maje.checkout.changePaymentMethodForm($("#wechatpay").data("js-wechatpay-value"))
		} else if (val && val.indexOf("CASHONDELIVERY") >= 0) {
			$(".selected-payment-method").val($("#CASHONDELIVERY").data("js-cashondelivery-value"));
			Maje.checkout.changePaymentMethodForm($("#CASHONDELIVERY").data("js-cashondelivery-value"))
		} else if (val && val.indexOf("ccard") >= 0) {
			$(".selected-payment-method").val($(".selected-payment-method").data("js-ccard-value"));
			Maje.checkout.changePaymentMethodForm($(".js-ccard-payment-method").data("js-ccard-value"));
			if (val.indexOf("amex") >= 0) {
				$('input[id$=creditCard_number]').attr('maxlength', 15);
			} else {
				$('input[id$=creditCard_number]').attr('maxlength', 16);				
			}
		}
		$('div.payment-final-step').css('visibility', 'visible');	
	});
}

Maje.checkout.collapsibleBillingAddress = function() {
	// Initialization of the billing fieldset
	if ($('input[name*=useAsBillingAddress]:checked').val() == "true") {
		$('fieldset.billing_fields').hide();
	} else {
		$('fieldset.billing_fields').show();
	}
	
	$('.checkbox-shipping').on('change', 'input[name*=useAsBillingAddress]', function () {
		if ($('input[name*=useAsBillingAddress]:checked').val() == "true") {
			$('fieldset.billing_fields').slideUp();
		} else {
			$('fieldset.billing_fields').slideDown();
		}
	});
}

Maje.checkout.collapscartTotal = function () {
	//only on mobile collapse
	
		$(document).on('click', '.miniSummaryCont .section-header', function(e){
			if($(window).width() <= 767) {
				$(this).parent().toggleClass('showIt');
			}
		});	

	
}

Maje.checkout.validatePickupStore = function() {
	$('form.checkout-shipping button#continue').click(function() {
		var storeIDInput = $('input[type=hidden][name$=_pickupStoreID]');
		if (storeIDInput.length && !storeIDInput.val()) {
			if (!$('#panel .errorGeo').length){
				$('#panel').prepend('<span class="errorGeo">'+app.resources.PLEASE_CHOOSE_A_STORE+'</span>');
				$('html, body').animate({
			        scrollTop: $("#shipping-form").offset().top
			    }, 800);
			}
			return false;
		}
		
		
		/* If an avatax error occured */
		if($("#estimation-tax-value.error").length > 0) {
			$('html, body').animate({
		        scrollTop: $("#estimation-tax-value").position().top
		    }, 800);
			return false;
		}
	});
}

Maje.checkout.selectPickupStore = function() {
	$('.pickup-store-selection').on('click', 'a.btnSelectStore, a.selectLastPickupStore', function(e) {
		e.preventDefault();
		Maje.checkout.updateStoreButtons($(this).data("storeid"));
		$(this).addClass('shopchecked');
		if ($(window).width() > 767) {
			if ($('#storeList').data('jsp')){
				var api = $('#storeList').data('jsp');
				if ($('.store.highlighted').length){
					api.scrollToElement($('.store.highlighted'));
				}
			}
			
		}
	});
}

Maje.checkout.updateStoreButtons = function(storeID) {
	$('.pickup-store-selection').find('a.btnSelectStore, a.selectLastPickupStore')
									.text(app.resources.SELECT_THIS_STORE)
									.filter('[data-storeid=' + storeID + ']')
										.text(app.resources.STORE_SELECTED_MAJE)
									.end()
								.end()
								.find('input[type=hidden][name$=_pickupStoreID]')
									.val(storeID);
	if ($('#panel .errorGeo').length){
		$('#panel .errorGeo').remove();
	}
}

Maje.checkout.showLastPickupStoreOnMap = function() {
	$('.pickup-store-selection').on('click', 'a.showStoreOnMap', function(e) {
		e.preventDefault();
		var storeID = $(this).data("storeid");
		Maje.storelocator.highlightStore(storeID);
		
		if($(window).width() <= 767) {
			$('html,body').animate({
		          scrollTop: $('a.modeMap').offset().top
		    }, 'slow');
			
			$('a.modeMap').click();
		}
	});
}

/**
 * Change the current payment method block
 */
Maje.checkout.changePaymentMethodForm = function(paymentMethodToActivate) {
	$(".payment-method").each(function() {
		$(this).attr('class', $(this).attr('class').replace('payment-method-expanded', ''));
	});
	
	$("#PaymentMethod_" + paymentMethodToActivate).attr('class', $("#PaymentMethod_" + paymentMethodToActivate).attr('class') + ' ' + 'payment-method-expanded')
	
	if(paymentMethodToActivate == 'PAYPAL' || paymentMethodToActivate == 'ALIPAY' || paymentMethodToActivate == 'WECHATPAY' || paymentMethodToActivate == 'CASHONDELIVERY') {
		$('#accept-sales-conditions').css('display', 'none');
	} else {
		$('#accept-sales-conditions').css('display', 'block');
	}
}


Maje.confirmation.bindEvents = function() {
	
	function showGuestPopinCreateAccount() {
		$('div.login-create-account').dialog({ 
			width: "535px", 
			dialogClass: "guestpop",
			modal: true,
		    closeText: "",
			create: function( event, ui ) {
				$('.guestpop input.confirm-email').closest('.form-row').addClass('confirm');
				$('.guestpop input.input-text-pw.confirm-password').closest('.form-row').addClass('confirm');
				$('.guestpop .submitBtn').on('click', function(e){
					var mailCopy = ( $('.guestpop input.email').val());
					$('.guestpop input.email.confirm-email').val(mailCopy);
					var passCopy = ( $('.guestpop input.input-text-pw').val());
					$('.guestpop input.input-text-pw.confirm-password').val(passCopy);
				});
			}
		});
	}
	
	function showKnownGuestLogin() {
		$('div.confirmation-login-box').dialog({ 
			width: "535px", 
			dialogClass: "guestpop",
			modal: true
		});
	}
	
	var delayPopin = $(window).width() < 767 ? app.constants.GUEST_REGISTER_POPIN_DELAY_MOBILE : app.constants.GUEST_REGISTER_POPIN_DELAY_DESKTOP;
	
	try {
		delayPopin = parseInt(delayPopin);
		
		// First, check if a known guest was detected
		if ($('div.confirmation-login-box').length > 0) {
			setTimeout(showKnownGuestLogin, delayPopin);
		} else {
			// Logged in or entirely new guest
			$('div.login-create-account').hide().each(function() {
				setTimeout(showGuestPopinCreateAccount, delayPopin);
			});
		}
	} catch(e) {}
	
	$('div.confirmation-guest-create-account button').click(function(e) {
		e.preventDefault();
		showGuestPopinCreateAccount();
	});
	
	$('div.login-create-account .no-thanks').click(function() {
		$('div.login-create-account').dialog('close')
	})
	
	$('.details-title').click(function() {
		$('.detailed-summary').slideToggle('slow',function(){
			if($('.detailed-summary').is(':hidden'))
			{
				$('.details-title').addClass('close');
			}else{
				$('.details-title').removeClass('close');
			}
		});
		
	});
	
	$('div.confirmation-known-guest-login a.button').click(function(e) {
		e.preventDefault();
		showKnownGuestLogin();
	});
}

Maje.home.bindEvents = function() {
	Maje.home.initModalPopup();
	Maje.home.tplProductBadge();
	Maje.home.vimeoplayerjs();
};

Maje.home.tplProductBadge = function() {
	var tplProduct = $(".homepage-3products");
	var badgeTplProduct = $(".homepage-3products").find(".badge").length;

	if (badgeTplProduct > 0){
		tplProduct.addClass("wrapper-badge");
	}

	//Add specific class to prices when there's a promotion
	var productPrice = $(".homepage-3products .product-price");

	if(productPrice.length){
		productPrice.each(function(){			
			if($(this).find(".percentage").length){
				$(this).addClass("product-pricing-promo");
			}
		});
	}
}

Maje.home.initModalPopup = function() {
	var delayDisplayPopup = $('#delayDisplayPopup').val() * 1000;
	var delayBeforeDisplayPopup =  $('#delayBeforeDisplayPopup').val() * 1000;
	var delayCookie = $('#delayCookie').val();
	var popupWrapper = $('.home-popup');
	var popupBox = $('.home-popup-box');
	var _this = this;

	if (popupWrapper.length > 0 ) {
		popupWrapper.delay(delayBeforeDisplayPopup).fadeIn("slow", function(){
			
			if(!popupBox.hasClass("home-popup-newsletter") && !popupBox.hasClass("home-popup-private-sale")){
				popupBox.css({
					top: $(document).scrollTop() + $(window).height() / 2 - popupBox.height() / 2
				});
			}
			$(".popup-close-span").on("click", function() {
				popupWrapper.stop().fadeOut();
			});
			$(document).mouseup(function (e){
				var myTarget = $(e.target).parents(".home-popup");

				if (!myTarget.length){
					popupWrapper.stop().fadeOut();
				}
			});
			
			//setTimeout fadeOut popup (time : delayDisplayPopup)
			var hidePopup = setTimeout(function(){
				popupWrapper.fadeOut();
				}, delayDisplayPopup);
			
			//if click on popup, clear the setTimeout fadeOut (hidePopup)
			popupWrapper.on("click", function() {
				clearTimeout(hidePopup);
			});
			
		});
		
		
		if($.cookie('popupLogin')){
			$.removeCookie('popupLogin', { path: '/' });
		}else{
			$.cookie('cookie-home-popup', 'OK', {expires : Number(delayCookie),path: '/'});
		}

	}
}

Maje.header.bindEvents = function(){
	// gestion du menu depliant dans le menu en mode responsive
	Maje.header.expandMenu('.subMain', '.titleMain', '.mainSubList', 'click');
	// gestion de l'evenement qui permet d'afficher le menu mobile ou non.
	Maje.header.menu();
	
	Maje.header.moveToFixe();
	
	Maje.header.loginAndRedirect();
	
	Maje.header.btnScroll();

	Maje.header.heightMiniCart();

	Maje.header.desktopSearch();
	//Search bar menu on tablet and mobile devices
	Maje.header.mobileSearch();
}

Maje.header.desktopSearch = function() {
	var wrapSearch = $('.header-search');
	var iconSearch = $('.search-icon');
	var inputSearch = wrapSearch.find('#qA');

	inputSearch.on('focus', function() {
		wrapSearch.addClass('expand-search');
	});
	
	iconSearch.on('click', function() {
		wrapSearch.addClass('expand-search');
	});
	
	$(document).mouseup(function (e){
		var myTarget = $(e.target).parents('.header-search');

		if (!myTarget.length){
			wrapSearch.removeClass('expand-search');
		}
	});
}

Maje.header.mobileSearch = function () {
	//items located in simplesearch.isml 
	var searchForm = $('.header-search > form');
	var searchIcon = $('.searchbar-icon');
	var searchBox = $('.mobile-searchBox');
	var isOpen = false;
	
	//Display expanded search bar on tablets and mobile devices
	searchIcon.on("click", function() {
		if(window.innerWidth < 1024){
			if(isOpen == false) {
				searchBox.addClass('active');
				isOpen = true;
			}
			else {
				searchBox.removeClass('active');
				isOpen= false ;
			}
		}
	});

	//Verify that search input is not empty before submiting form
	searchForm.submit(function(event) {
		event.preventDefault();
		var searchInput = $('#q').val();

		if (searchInput !== '') {
			$(this).unbind('submit').submit();
		}
	});
}

Maje.header.btnScroll = function(){
	$(document).on('click tap', '.scroll-top', function(e) {
		e.preventDefault();
		
		if($(window).scrollTop() > 0){
			$('body, html').animate({scrollTop : 0});
			return false;
		}
	});
}

Maje.footer.bindEvents = function(){
	Maje.footer.slideAssurance();
	//Maje.footer.menuHover();
	Maje.footer.showWechat();
	
	Maje.footer.salutationRadio();
	Maje.footer.shippingMethodRadio();
	Maje.footer.creditCardRadio();
	Maje.footer.inputFilesContactus();
	Maje.cart.couponCode();
	Maje.cart.taxesCalculation();
	
	$(window).resize(function(){
		Maje.footer.slideAssurance();
		Maje.product.moveElementPopinProduct();
		$('.overlayMob').css('height', $(document).height());
	});
	
	//Maje.footer.loginSuccess();
	Maje.footer.initNewsletterPopin();
	Maje.footer.tagErrorMessages();
	Maje.footer.removeErrorMessage();
	Maje.footer.menumobile();
	Maje.footer.showmobile();
	Maje.footer.bottomPosition();
	
	Claudie.footer.animateElementOnScroll();
}


Claudie.footer.bindEvents = function(){
	Claudie.footer.popupSizeGuide();
};

Maje.cart.bindEvents = function() {
	Maje.cart.couponCode();
	Maje.cart.taxesCalculation();
	Maje.cart.impulseSell();
	Maje.cart.initSwitchSize();
	Claudie.cart.Recommended();
	Claudie.cart.modifyProduct();
}

Maje.cart.couponCode = function(){
	var input = '#dwfrm_cart_couponCode';	
	$(document).on('click', input, function(){
		if($(input).attr("placeholder") == $(input).attr("value")){
			$(input).val("");
		}
	});
	$(document).on('focusout', input, function(){
		if($(input).attr("value") == ""){
		//	$(input).val($(input).attr("placeholder"));
		}
	});
}

Maje.cart.taxesCalculation = function(){
	var input = '.estimation-tax-zipcode';	
	
	if($(".shipping-form").length > 0){
		if($("#zipCodeEstimated").length > 0 && $.isNumeric($("#zipCodeEstimated").val())){
			$("input.zip").val($("#zipCodeEstimated").val());
		}
	}
	
	$(document).on('click', input, function(){
		if($(input).attr("placeholder") == $(input).attr("value")){
			$(input).val("");
		}
	});
	
	$(document).on('focusout', input, function(){
		if($(input).attr("value") == ""){
			$(input).val($(input).attr("placeholder"));
		}
	});
	
	document.onkeypress = function(){
		if($(".estimation-tax-zipcode").is(":focus")){
			if (window.event.type == "keypress" && window.event.keyCode == 13){
		    	$(".estimation-tax-submit").trigger("click");
		    	return false;
		    }
		}
	};
	
	$(".estimation-tax-submit").unbind().on('click', function(e){
		e.preventDefault();
		var zipCodeValue = $(".estimation-tax-zipcode").val();
		Maje.cart.refreshCartAmounts(zipCodeValue);
	});
	
	$("input[name='addressbook']").unbind().change(function(e){
		e.preventDefault();
		var zipcode = $("input[name='addressbook']:checked").data("zipcode");
		Maje.cart.refreshCartAmounts(zipcode);
	});
}

Maje.cart.refreshCartAmountsData = function(zipCodeValue) {
	var estimationShippingCostValue = $("#estimation-shipping-cost").val();
	var estimationOrderSubTotalValue = $("#estimation-order-subtotal").val();
	var estimationShippingCost = isNaN(estimationShippingCostValue) ? 0 : estimationShippingCostValue;
	var estimationOrderSubTotal = isNaN(estimationOrderSubTotalValue) ? 0 : estimationOrderSubTotalValue;

	return 'zipCode=' + zipCodeValue + '&estimationShippingCost=' + estimationShippingCost + '&estimationSubtotal=' + estimationOrderSubTotal + '&format=ajax';
}

Maje.cart.refreshCartAmounts = function(zipCodeValue) {
	
	if ($("#estimation-tax-value").length == 0) return false;
	
	var correctZipCode = zipCodeValue.toString().match(/^\d{5}([\-]?\d{4})?$/);
	var isCartShowStep = $(".estimation-tax-zipcode").length > 0;
	var data = Maje.cart.refreshCartAmountsData(zipCodeValue);
	
	$.ajax({
	    url: 	app.urls.refreshBasketAmounts, 
	    data: 	data,
	    dataType: 'json',
	    success:
	        function(retour){
	    	if(retour.error || !correctZipCode) {
	    		var errorReason = app.resources.CHECKOUT_ESTIMATEDTAX_NOTESTIMATED;
	    		$("#estimation-tax-value").removeClass("error");
	    		
	    		/* If we are on other step than the cart-show step, we display a detailed error message */
	    		if(!isCartShowStep && retour.errorReason.length > 0) {
	    			errorReason = retour.errorReason;
    				$("#estimation-tax-value").addClass("error");
	    		}
	    		$("#estimation-tax-value").html(errorReason);
	    	} else {
	    		$("#estimation-tax-value").removeClass("error");
	    		$("#estimation-tax-value").html(retour.taxes);
	    	}
	       $("#order-total-value").html(retour.total);
	       
	    },
	    error:
	    	function(retour){
	    		$("#estimation-tax-value").html(app.resources.CHECKOUT_ESTIMATEDTAX_NOTESTIMATED);
	    	}
	});
	return false;
}

Maje.cart.impulseSell = function() {
	$('.impulse-push button').click(function() {
		var postdata = {
			cartAction : "add",
			pid : $(this).prev('.product-tile').data('itemid') 
		}
		
		app.cart.update($.param(postdata), function(data) { 
			location.reload();
		});
	});
	$("#cart-items-form").validate({
		errorPlacement: function(error, element) {
			error.appendTo('#errorMsg');
		}
	});
}

Maje.cart.initSwitchSize = function(){
	$("body").on("click", ".switchSize", function(){
		Maje.product.switchSize();
	});
}

Maje.footer.salutationRadio = function(){	
	var btn = '.radio-salutation';	
	var input = 'div.salutation .input-radio';
	
	$(document).on('click',input, function(){
		fillHiddenSalutationInput(this);
	});
	
	function fillHiddenSalutationInput(that){
		$(that).closest('div.salutation').find('input.radiohidden').attr('value', $(that).val());
		$(that).closest('div.salutation').find('input.radiohidden').trigger('click');
	}
	
	// If an input was checked before the handlers were bound, make sure the input is filled in
	$(input + ':checked').each(function() {
		fillHiddenSalutationInput(this);
	});
}
Maje.footer.showWechat = function() {
	var flag = "0";
	  $(".follow_wechat").click(function(){
		  if(flag == "0"){
			 dataLayer.push({'event': 'social_media_maje','social_media': 'wechat'});
		  	$(this).find(".wechat_QR").css('display','block');
		  	flag = "1";
		  }else{
			 $(this).find(".wechat_QR").css('display','none');
			  flag = "0";
		  }
	  });
}

Maje.footer.shippingMethodRadio = function(){
	var btn = '.radio-shippingmethod';
	$(document).on('click', btn, function(){	
		// we substring(10) the id who begin with container- in way to abtain if of childrens
		var currentid = $(this).attr('id');
		var ischeck = $("#"+currentid.substring(10)).prop("checked");
		$(this).parent().children().removeClass("selected");
		if(ischeck){
			$(this).addClass("selected");
		}else{
			$(this).removeClass("selected");
		}
	});
}
Maje.footer.creditCardRadio = function(){
	var btn = '.radio-creditcard';
	$(document).on('click', btn, function(){	
		$('#ccard-type-container').children().addClass("inactive");
		var currentid=$(this).attr('id');
		$('#container-'+currentid).removeClass("inactive");
		$("#dwfrm_billing_paymentMethods_creditCard_type").attr('value',$("#"+currentid).attr('value'));		
	});
}
Maje.footer.inputFilesContactus = function() {
	var names = [];
	var filesMax = 4;
	
	//Les types de fichier autoris茅 dans l'input file
	var allowedFiles = ["pdf", "jpg", "jpeg", "gif", "png", "txt", "doc", "odt", "docx", "ppt", "pptx", "xls", "xlsx"];
	
	$(".input-file").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
		e.preventDefault();
	    e.stopPropagation();
	}).on('drop change', function(e) {

	    if (e.type == "drop"){
	    	droppedFiles = e.originalEvent.dataTransfer.files;
	    	//Check la compatibilit茅 du drag and drop et dataTransfer
	    	if (droppedFiles === undefined){
	    		return;
	    	}
	    } else if (e.type == "change") {
	    	droppedFiles = $(this).get(0).files;
	    }
	    
	    //Comportement OLD IE (8/9) 
	    if (droppedFiles === undefined && $(this).val() != 0){
	    	droppedFiles = $(this).val();
			droppedFiles = droppedFiles.split("\\");
			
			$(".list-input-file").empty();
			$(".list-input-file").append("<li class='center'><span class='name-file'>" + droppedFiles[2] + "</span></li>");
	    	
			names.push(droppedFiles[2]);
			return;
	    } 
	    //On arrete la fonction si c'est un OLD IE (pas d'upload ajax);
	    
	    var limit = names.length + droppedFiles.length;
	    
	    //On limite 脿 4 fichiers max
	    //Si il y en a plus on affiche l'erreur et arrete la fonction
	    if (limit > filesMax){
			$(".error-files").show();
			return;
		} else {
			$(".error-files").hide();
			$(".error-type-files").hide();
		}
	    
	    //On passe sur tout les fichiers 脿 upload
	    $.each( droppedFiles, function(i, file) {
	    	
	    	//Verification du type de fichier ref var allowedFiles
	  		var File_Ext = file.name.split('.');
              	File_Ext = File_Ext[File_Ext.length - 1].toLowerCase();
              	
              	if (allowedFiles.indexOf(File_Ext) != -1) {
              		//Push les noms des files dans un tableau var names
    		    	names.push(file.name);
              	} 
              	//On arrete la fonction si ce n'est pas un type de fichier accept茅
              	else {
              		$(".error-type-files").show();
              		return;
              	}
	    	
              	var form = $("#RegistrationForm");
	            var input = form.find('input[type="file"]');
	            var ajaxData = new FormData();
	            ajaxData.append( input.attr('name'), file );
	            
		    	// Ajax Upload file
		    	//**https://css-tricks.com/drag-and-drop-file-uploading/**
	            
	            $.ajax({
	                url: form.data('uploadfile'),
	                type: form.attr('method'),
	                data: ajaxData,
	                dataType: 'json',
	                cache: false,
	                contentType: false,
	                processData: false,
	                success: function(data) {
	                	
	                }
	            });
	    	
	    	//On affiche les fichiers dans la zone de drag un drop
	    	var nbFiles = names.length;
		    $(".list-input-file").empty();
		    for (var j = 0; j < nbFiles; j++) {
		    	var fileNameTotal = names[j];
		    	var fileName = fileNameTotal;
		    	var arrayName = names[j].split(".");
		    	if(arrayName[0].length > 28){
		    		var this_name = arrayName[0].substring(0, 28);
		    		var this_ext = arrayName[1];
		    		fileName = this_name + "..." + this_ext;
		    	}
		    	
		    	$(".list-input-file").append("<li><span class='name-file' data-filename='" + fileNameTotal + "'>" + fileName + "</span><span class='delete-file'></span></li>");
		    }
	    	
		    //Supression d'un fichier, on le retire de l'array names et supprime son affichage
		    //Le fichier est d茅j脿 upload
		    $(".delete-file").on("click", function() {
		    	var indexFiles = $(this).parent("li").index();

		    	delete names[indexFiles];
		    	
		    	// Delete file upload
		    	$.ajax({
	                url: form.data('delfile'),
	                data: 'FileName=' + $(this).parent("li").find(".name-file").data("filename"),
	                success: function(data) {
	                	
	                }
	            });
		    	
		    	names = jQuery.grep(names, function(val){
	                if( val == '' || val == NaN || val == undefined || val == null ){
	                    return false;
	                }
	                return true;
	            });
		    	$(this).parent("li").remove();
		    	$(".error-files").hide();
		    	$(".error-type-files").hide();
		    	//var names renvois les noms des images li茅es au formulaire
		    });
	    });
	    
	    // To send form. If enctype value is "multipart/form-data", the form is no send
		$("#RegistrationForm").on("submit", function() {
			var form = $(this);

			if (form.valid()) {
				var fileList = form.find("ul.list-input-file li");
				var action = form.attr("action");

				fileList.each (function() {
					var fileName = $(this).find(".name-file").data("filename");

					if (action.indexOf(fileName) === -1) {
						if (action.indexOf("?") >= 0) {
							action += "&files=" + fileName;
						}
						else {
							action += "?files=" + fileName;
						}
					}
				});

				form.attr("action", action);
			}

			form.attr("enctype", "application/x-www-form-urlencoded");
		});
		
	});
}

Maje.footer.initNewsletterPopin = function(){
	
	var delayBeforeDisplayPopup =  $('#delayAfterResponsePopupNewsletter').val() * 1000;
	
	var callAjaxNewsletter = function(targetUrl, email, currElt) {
		
		// currElt is the current DOM form element triggering the Ajax call (for NL subscription) 
		
		targetUrl += "?email=" + email+"&formatajax=true";
		$.ajax({
		 	url: targetUrl
		}).done(function(data) {
			var res = data.Result;
			var customerAlreadyMember = data.CustomerAlreadyMember;
			
			if(res != null && res != 'none' && res != '')
			{
				var msgDone = (customerAlreadyMember === null || customerAlreadyMember === false) ? "msgdone" : "msgalreadydone";
				var className = (customerAlreadyMember === null || customerAlreadyMember === false) ? "validNews" : "validAlreadyRegister";
				
				// test made to distinguish whether the submission of the NL form comes from central part form or footer one
				if(currElt.attr('id') == 'newsletterFormGift'){

					$("div#formNewsletterGift div.footerNewsletter > p").empty();				
					$("div#formNewsletterGift div.footerNewsletter > p[data-attribute = exclusive]").css('display', 'block').append($("#submitnewsletterGft").data(msgDone));
					$("div#formNewsletterGift form#newsletterFormGift").hide();
				}
				else if(currElt.attr('id') == 'popupNewsletterForm'){
					$(".popup-newsletter-top, .popup-newsletter-bottom").hide();
					$("div.home-popup-newsletter").addClass(className);
					$(".popupNewsletterConfirm").show();
					
			/*		setTimeout(function(){
						$('.home-popup').stop().fadeOut();
					}, delayBeforeDisplayPopup); */
				}
				else{

					$(".footerNewsletter > p.msg").empty();
					$("div.footerNewsletter > p.msg").append($("#submitnewsletter").data(msgDone));
					$("div.footerNewsletter > p.msg").show();
					$("div.footerNewsletter").addClass(className);
					$("div.footerNewsletter").show();
					$("div.footerNewsletter").css( "display", "table");
					$("form#newsletterForm").hide();
					
					
					$(".newsletterErrorMsg").empty();
					$("div.newsletterEndMsg > span").empty();
					$("div.newsletterEndMsg > span").append($("#submitnewsletter").data(msgDone));
					$("div.newsletterEndMsg").show();
					$("div.newsletterEndMsg").css( "display", "table");
					$("form.newsletterEndForm").hide();

				}	
				
				$("p.mandatory").hide();

				dataLayer.push({
	                'event': 'footer_subscription'
				});
				
			}
			else
			{
				$(".footerNewsletter > p.msg").empty();
				$(".footerNewsletter > p.msg").append($("#submitnewsletter").data("msgerror"));
				$("div.footerNewsletter > p.msg").show();
				$(".newsletterErrorMsg").empty();
				$(".newsletterErrorMsg").append($("#submitnewsletter").data("msgerror"));
				
				if(currElt.attr('id') == 'popupNewsletterForm'){
					$("div.home-popup-newsletter p").empty().append($("#submitnewsletter").data("msgerror"));
				}
			}
		}).fail(function() { 
			$(".newsletterErrorMsg").empty();	
			$(".newsletterErrorMsg").append($("#submitnewsletter").data("msgcomerror"));
			
			if(currElt.attr('id') == 'popupNewsletterForm'){
				$(".popup-newsletter-top, .popup-newsletter-bottom").hide();
				$("div.popupNewsletterConfirm p").empty().append($("#submitnewsletter").data("msgcomerror"));
				$(".popupNewsletterConfirm").show();
			}
		});
	}
	
	
	
	var showPopin = function() {		
		/* Need to extend settings here as app.validator.init() sets up every form with the same settings
		 * and the validate() function doesn't create a new validator object if one already exists.
		 */
		var newsLetterEndForm = $("#newsletterEndForm");
		if (newsLetterEndForm.length) {	
			$.removeData(newsLetterEndForm[0], 'validator');
			
			var newsletterFormSettings2 = $.extend(true,
				{
					debug : true,
					errorPlacement : function(error, element) {
						error.insertAfter(element).css('display', 'block');
					},
					submitHandler : function(form) {
						var email = encodeURIComponent($(form).find('input.nlemail').val());
						var targetUrl = $(form).attr("action");
						callAjaxNewsletter(targetUrl,email,$(form));
					}
				}, app.validator.settings);
			
			// Unbind these so that jQuery validate can rebind them cleanly
			newsLetterEndForm.unbind('submit').unbind("invalid-form.validate").validate(newsletterFormSettings2);
		}
	}
	
	$(document).on('click', '.showNewsletterSubscription', function(){
		showPopin();
	});
	// footer subscription event
	$('.newsletterForm').on('submit', function(e) {
		e.preventDefault();
		if ($(this).valid()) {
			var email = encodeURIComponent($(this).find('input[name="nlemail"]').val());
			var targetUrl = $(this).attr("action");
			callAjaxNewsletter(targetUrl,email,$(this));
		}
	});
	
	$('.popupNewsletterForm').on('submit', function(e) {
		e.preventDefault();
		if ($(this).valid()) {
			var email = encodeURIComponent($(this).find('input#nlemail').val());
			var targetUrl = $(this).attr("action");
			callAjaxNewsletter(targetUrl,email,$(this));
		}
	});
	
	function getQueryVariable(variable) {
	    var query = window.location.search.substring(1);
	    var vars = query.split("&");
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split("=");
	        if (pair[0] == variable) {
	            return pair[1];
	        }
	    }
	    return null;
	}
	
	var cookie = $.cookie("majenewsletterpopin");
	var returningUserOrderConfirmed = getQueryVariable('newsletter');
	if(cookie == null || returningUserOrderConfirmed == '1')
	{
		$.cookie('majenewsletterpopin', 'true', { expires: 365, path: '/' });
		showPopin();
	}
};

Maje.footer.tagErrorMessages = function() {
	$('span.error-message').each(function() {
		converteoLayer.push({'event':'error','errorName':$(this).text()});
	});
}
Maje.footer.removeErrorMessage = function(){
	$(document).on('click', '.input-text', function(){
		$(this).parent().find('.error-mesage').remove();
	});
}
Maje.footer.menumobile = function() {
	var collapsBtn = $('.collapsIt'),
		clickedElmt;
	collapsBtn.on('click', function(e){
		if (this !== clickedElmt ) {
			$(this).closest('.footerContent').find('.active').removeClass('active');	
		}
		$(this).parent().toggleClass('active');
		clickedElmt = this;
	});
}
Maje.footer.showmobile = function() {
	var collapsBtn = $('.menuFooter > ul > li.list .item-toggle'),
		clickedElmt;
	collapsBtn.on('click', function(e){
		if (this !== clickedElmt ) {
			$(this).closest('.menuFooter').find('.list.active').removeClass('active');	
		}
		$(this).parents('.list').toggleClass('active');
		clickedElmt = this;
	});
}
Maje.minicart.initRemoveButtons = function(){
	$("body").on("click", ".minicart-remove-button", function(e){
		e.preventDefault();

		//BL: Header (supprimer un produit du panier) ??!!
		converteoLayer.push({
		"event": "deleteProduct",
		"from" : "Roll-Over Cart",
		  "ecommerce": {
		    "remove": {                              
		      "products": [$(this).closest('.mini-cart-product').data('product')]
		    }
		  }
		});



		var url = $(this).attr("href");	 										            	
    	jQuery.ajax({
    		url:url,
    		cache:false	 										            		
    	}).done(function(data) {
    		var res = data.split("§§§");
    		jQuery('#mini-cart').html(res[0]);
    		if(jQuery('#cartNumberItems') && jQuery('#cartNumberItems').html() != ''){	    			
    			jQuery('#cartNumberItems').html(res[1]);
    		}
    		if(jQuery('#cart-items-form') && jQuery('#cart-items-form').html() != ''){	    			
    			jQuery('#cart-items-form').html(res[2]);	
    		}
    		Maje.minicart.initRemoveButtons();
    		if ($('.mini-cart-products .mini-cart-product').length == 0) {
    			if ($('#maskLayer').length){
    				$('#maskLayer').remove();
    			}
    		}
    	});
	});
}

Maje.minicart.initSlide = function(){
	/*
	$cache.minicart = $("#mini-cart");
	$cache.mcContent = $cache.minicart.find(".mini-cart-content");
	$cache.mcProductList = $cache.minicart.find(".mini-cart-products");
	$cache.mcProducts = $cache.mcProductList.children(".mini-cart-product");
	if ($cache.mcProducts.length > 2){
		if ($cache.mcContent.attr('data-enable-slide') != "true"){	
			if ($(window).height() > 1100){
				$('.slide2').slideApp('.contentSlide2','.mini-cart-product', '.btnPrev', '.btnNext', '.slideChild2', 3);
			}else{
				$('.slide2').slideApp('.contentSlide2','.mini-cart-product', '.btnPrev', '.btnNext', '.slideChild2', 2);
			}
			
			$cache.mcContent.attr('data-enable-slide', "true");
		}
	} else {
		$('.btnPrev, .btnNext').css('display', 'none');
	}
	*/
	
}
Maje.checkoutminicart.initSlide = function(){
	/*$cache.checkoutmcContent = $("#checkout-mini-cart-content");
	$cache.checkoutmcProductList = $cache.checkoutmcContent.find(".checkout-mini-cart-products");
	$cache.checkoutmcProducts = $cache.checkoutmcProductList.children(".checkout-mini-cart-product");
	if ($cache.checkoutmcProducts.length > 2){
		if ($cache.checkoutmcContent.attr('data-enable-slide') != "true"){
			$('.slide4').slideApp('.contentSlide','.checkout-mini-cart-product', '.btnPrev4', '.btnNext4', '.slideChild');
			$cache.checkoutmcContent.attr('data-enable-slide', "true");
		}
	}*/
};

Maje.header.heightMiniCart = function(){
	var heightWindow = window.innerHeight;
	var MiniCart = $(".mini-cart-content");
	var smallCartClass = "small-cart";

	if(heightWindow < 750){
		MiniCart.addClass(smallCartClass);
	}
};

var listenerAdded = false;
Maje.header.moveToFixe = function(){
	var classHeader = '#header';
	var classHeaderHeight = $(classHeader).outerHeight(true);
	var listItem = '.listItem';
	var subMain = '.subMain';
	var headLogo = '.headLogo';
	var menuLi = '.menuMainMaje .listMenu li';
    var isMenuOpen;
    var isTab;
	var sticky = false;
	var psSticky = '.ps-sticky';

    function removeMaskLayer() {
        if ($('#maskLayer').length != 0) {
            $('#maskLayer').remove();
        } 
    }

	if($(window).width() > 1023 && !$('.specialEvent').length){
		$(window).scroll(function(){
            isMenuOpen = $('.slideMenu').css('left') == '0px';

				if($(window).scrollTop() < 156 && sticky === false){
  					$(classHeader).removeClass('sticky');
					$('body').removeClass('sticky-active');
					sticky = true;
				}else if($(window).scrollTop() > 180 && $(window).width() > 1023 && sticky === true){
					sticky = false;
                    $(menuLi).each(function(){
						if($(menuLi).hasClass('hideSticky')){
							$(classHeader).removeClass('sticky');
							$('body').removeClass('sticky-active');

						}else{
							$(classHeader).addClass('sticky');
							$('body').addClass('sticky-active');

						}
 					})
				}
			});
	}else{
		$(classHeader)
             .removeClass('sticky');
		$('body').removeClass('sticky-active');

	}

	var $slideMenu = $('.slideMenu');
	$slideMenu.find('.listItem > a').on('click', function() {
			var $this = $(this).closest('.listItem');
			if ($this.find('.subMain').length) {
				if (!$slideMenu.hasClass('activeSub')) {
					$slideMenu.addClass('activeSub');
					$this.addClass('active').siblings('.listItem').removeClass('active');
				} else {
					if ($this.hasClass('active')) {
						$this.removeClass('active');
						$slideMenu.removeClass('activeSub');
					}
				}
				return false;
			}
	});
	$slideMenu.find('.close-sub-menu').on('click', function() {
		$(this).closest('.listItem').removeClass('active');
		$slideMenu.removeClass('activeSub');
	});
	

	$('.mini-wishlist-link').on('click', function(e) {
		if ($(window).width() < 1024) {
			e.preventDefault();
			app.minicart.close();
			if ($('.mini-wishlist-content').css('display') != 'block') {
				app.wishlist.slide();
				$('#maskLayer').one('click', function() {
					app.wishlist.close()
				})
			} else {
				app.wishlist.close();
			}
		}
	});

    $('.basketItem').on('click', function(e) {
        isTab = $(window).width() > 767 && $(window).width() < 1024;

        if (isTab) {
            e.preventDefault();
            if ($('.mini-cart-content').css('display') != 'block') {
                app.minicart.slide(false);

                $('#maskLayer').one('click', function(e) {
                    app.minicart.close();
                });
            } else {
                app.minicart.close();
            }
        }
	});
	$(window).load(function(){
		$(".ps-sticky").sticky({ topSpacing: 90 });
	});
};
Maje.header.loginAndRedirect = function() {
	var connectUrl = $('#header .userInfoHeader a.user-login').attr('href');
	if (connectUrl) {		
		var redirectUrl = window.location.href;
		
		// Hack : redirect to the full /homepage url if we're on the home, so that additional login params can be added.
		if (window.location.pathname == '/') {
			redirectUrl = app.urls.abshomepage;
		}
		
//		redirectUrl = redirectUrl.indexOf('http') < 0 ? 'http://' + redirectUrl : redirectUrl;
//		connectUrl = connectUrl.indexOf('?') > 0 ? connectUrl + '&' : connectUrl + '?';
//		connectUrl = connectUrl + 'redirectto=' + redirectUrl;
		$('#header .userInfoHeader a.user-login').attr('href', connectUrl);		
	}
};


// gestion du menu en mode mobile 
Maje.header.menu = function(){
    var header = $('#header');
	$('.btnMenuSlide').attr("data-menu-slide","");
	// au click on affiche ou non le menu 
	//$('.slideMenu').show();
	$(document).on('click','.btnMenuSlide', function(e){
		e.preventDefault();
		var attrSlide = $(this).attr("data-menu-slide");
		var detectActive = $(this).hasClass('active');
		
		// gestion de l'animation du menu 脿 droite
		if(attrSlide === "true" ){
            window.scrollTo(0, 0);
			$('.slideMenu').stop().animate({
				'left' : "-120%"
			}, {
				duration : 500, 
				easing : 'swing',
				complete : function(){
					$('.btnMenuSlide').attr("data-menu-slide","");
                    $('body').removeClass('open-sub');
                    $('#header header').css({'position':'static'});
                    $('#main').css({'opacity':'1'});
				},
				queue:false
			});

		}else{
            $('body').addClass('open-sub');
            $('#header header').css({'position':'fixed'});
			$('.slideMenu').stop().animate({
				'left' : 0
			}, {
				duration : 500, 
				easing : 'swing',
				complete : function(){
					$('.btnMenuSlide').attr("data-menu-slide","true");
				},
				queue:false
			});
			$('.slideMenu').show();
		}

		$(this).toggleClass('active');
	});
	Maje.header.icon();
	Maje.header.cloneLogo();
	Maje.header.numbItemBasket();
	$('.slideMenu').css("left", function(){
		 return "-120%";
	});
	$(window).resize(function(){
		
		if ($(window).width() > 1024 && !$('.specialEvent').length){
			$('body').removeAttr('style').removeClass('open-sub');
			$('#header header').css({'position':'static'});
			$('#wrapper, .mainSubList').attr('style', '');
			$mainMenu = $('.menuMainMaje');
			$searchInput = $('.header-search');
			
			$('.slideMenu').css("left", function(){
				var widthLeft = $(this).outerWidth() + 7; 
				 return "-120%";
			});
			$('.slideMenu').hide();
			$('.btnMenuSlide').attr("data-menu-slide", "");
		}
		// function qui permet de deplacer certains element du menu et du search au resize
		Maje.header.cloneLogo();
		Maje.header.numbItemBasket();
	});

	// function qui permet de deplacer certains element du menu et du search au resize
	Maje.header.moveMenu();
};

Maje.header.moveMenu = function(){
	var $header = $('#header header');
	$header.append( '<div class="slideMenu"></div>');
	var divWrapper =  $('#wrapper');
	var divMenu = $header.find('.slideMenu');
	var $mainMenu = $('.menuMainMaje');
	var $searchInput = $('.header-search');
	var widthWrapp =  divWrapper.width();


	// on stock dans un structure html qui va englober le layout general
	// on fait une copie de l'input recherche et on l'injecte dans le slideMenu
	// on fait une copie du menu principae recherche et on l'injecte dans le slideMenu
	if (divMenu.find('.header-search').length == 0) {
		$mainMenu.clone().appendTo(divMenu);
	}			

	// changement de position des elements du menu responsive en fonction du data-position contribu茅 dans le BM
	$(".slideMenu").find('.subMain').each(function() {
		
		var wrapSubMain = $(this);
		var tableLi = [];
		var saveTableLi = [];
		var nameClass = [];
		
		var expandMenu = $(this);
		
		var totalLi = expandMenu.find('.listItem').length;
		
		expandMenu.find('ul .listItem').each(function(index) {
			
			var position = $(this).data('position');

			if(typeof position != 'undefined'){
				saveTableLi.push($(this));
			} else {
				tableLi.push($(this));
				nameClass.push(this);
			}
			
			if (index === totalLi - 1 && saveTableLi.length) {
		        var saveTableLiLength = saveTableLi.length-1;
		        
		        for(var i=0; i <= saveTableLiLength ;i++){
		        	var thisPosition = saveTableLi[i].data('position');
		        	tableLi.splice(thisPosition-1, 0, saveTableLi[i]);
				}
		        
		        wrapSubMain.find('.titleMain').empty();
		        var tableLiLength = tableLi.length-1;
		        
		        for(var i=0; i <= tableLiLength ;i++){
					tableLi[i].clone().appendTo(wrapSubMain.find('.titleMain'));
				}
		    }
			
		});
	});
	
};

Maje.header.expandMenu = function(element, trigger, contentSlide, typeBlock, mode){

		var blockTab = $(element);
		// si l'element existe 
		var widthWindow = 767;
			
		//blockTab.first().find(trigger).next(contentSlide + ':hidden').show();
				
		$(document).on(mode, trigger, function(e){
				e.preventDefault();
				if($(window).width() < 767){
					$(this).toggleClass('active');
					$(this).siblings(typeBlock).removeClass('active');
					$(this).next(contentSlide).slideToggle();
					$(this).siblings(typeBlock).next(contentSlide).slideUp();
				}else{
					return '';
				}
			});
};
Maje.header.cloneLogo = function(){
	var existLogo = $('.mobileLogo').length;
	if (Modernizr.mq('(max-width: 767px)') && !$('#header').hasClass('light')){
		
		if(existLogo === 0){
			var cloneLogo = $('.maje:hidden');
			cloneLogo.clone().addClass('mobileLogo').insertAfter('.headLogo');
			
			var logoMobile = $('.mobileLogo');
		}
	} else {
		if(existLogo > 0){
			$('.mobileLogo').remove();
		}
	}
};
Maje.header.icon = function(){
	var menuHeaderMob = $('.userInfoHeader > li');
	var firstMenu = $('.headLogo');
	
	firstMenu.each(function(){
		var icon = $(document.createElement('span')).addClass('iconArrowTop');
		var classIcon = $('.iconArrowTop');
		var existIcon = classIcon.length;
		if($(window).width() < 960){
			if(existIcon === 0){
				$(this).append(icon);
			}
		}
	});
		
	menuHeaderMob.each(function(){
		var icon = $('<span class="iconArrowTop"></span>');
		var classIcon = $('.iconArrowTop');
		var existIcon = classIcon.length;
		if($(window).width() < 960){
			if(existIcon === 0 || existIcon <= 4){
				$(this).append(icon);
			}
		}
	});
};

Maje.header.numbItemBasket = function(){
	var nb_basket = $('#mini-cart .numberItemBasket');
	var nb_basket2 = $('.basketItem .numberItemBasket');
	var nb_basket_length = $('.numberItemBasket').length;
	var cloneNb = nb_basket.clone();
	var nb_basketText = nb_basket.text();
	//alert(nb_basketText);
	
	if (nb_basket_length != 2){
		cloneNb.appendTo('.basketItem');
	}
	
	var dataNb = nb_basket.text();
	var dataNb2 = nb_basket2.text();
	//alert(dataNb);
	
	/*
	nb_basket2.text(function(index){
		
		var updateBasket;
		dataNb != dataNb2 ? updateBasket = dataNb : updateBasket = dataNb2;
		return updateBasket;
	});
	*/
	var updateBasket = dataNb;
	
	if(dataNb != dataNb2){
		updateBasket = dataNb;
	}else{
		updateBasket = dataNb2;
	}
nb_basket2.text(function(){
		return updateBasket;
	});
	
};

Maje.header.emptyBasket = function(){
	var classBasket = '.mini-cart-total';
	
	$(document).on('hover', classBasket, function(e){
		e.preventDefault();
	});
};

Maje.product.bindEvents = function(){
	//gestion de l'affichage des filtres touchstart
	Maje.product.toggleFilter('.blckFilter','.btnTri','.subFilterTri','click');
	
	Maje.product.closeToggleFilter();
	
	// gestion de la classe active sur les listes de filtres
	Maje.product.activeFilterClass ('.contentFilter','li', '.linkFilter', 'click');

	//gestion de la modification de l'image produit sur le listing produit au passage de la souris
	//Maje.product.toggleImage();
	
	//afficher les tooltips lorsque les produits sont indisponibles
	Maje.product.tooltip();
	
	//gestion de l'affichage de la popin d'envoi de mail a un ami
	Maje.product.sendtofriendpopin();
			
	// show or hide button 
	//Maje.product.showHidebtnZoom();
	
	//Sandro.product.sliderInit();
	Maje.product.initSlide();
	
	// remove element 
	Maje.product.disable();
	
	// jqZoom Ipad
	//Maje.product.jqZoom();
	//Maje.product.zoom();
	
	// Affichage de la video
	Maje.product.displayVideo();
	
	// Chargement ajax des listes produits
	Maje.product.filters();
	Maje.product.pricePromoAlign();
	
	Maje.product.descriptToggle();
	Maje.product.scrollTop();
	Maje.product.addSelectedClass();
	Maje.product.sizeButtonMobile();
	
	// Slider page product
	Maje.product.slider(".wrapper-product-img-1 .swiper-container");
	Maje.product.slider(".wrapper-product-img-2 .swiper-container");
	
	Maje.product.crossSellToggle();
	Maje.product.mobilePagination();
	Maje.product.popinDescMobile();
	
	Maje.product.productNameBold();
	Maje.product.eventLookComplet();
	Maje.product.productSet();
	
	Claudie.product.advertising();
	
	Claudie.product.crossSell();
	
	Claudie.footer.animateElementOnScroll();
	
};

Maje.product.productNameBold = function(){
	var productName = $('.productSubname');
	
	if (productName.length && !productName.find(".first-word").length && !$('.quickview').length){
		productName.each(function() {
		    var word = $(this).html();
		    var index = word.indexOf(' ');
		    if(index == -1) {
		        index = word.length;
		    }
		    $(this).html('<span class="first-word">' + word.substring(0, index) + '</span>' + word.substring(index, word.length));
		});
	}	
}

Maje.product.initSwitchSize = function(){
	$("body").on("click", ".switchSize", function(){
		Maje.product.switchSize();
	});
}

Maje.product.scrollTop = function(){
	var windowScrollTop = Math.round($(window).scrollTop());
	var btnVisible = 0;
	
	function btnScrollUp() {
			var sTop = $(window).height();
			sTop = sTop*0.7;
			if ((windowScrollTop >= sTop) && (btnVisible == 0)){
				btnVisible = 1;
				$('.scroll-top').animate({
				'opacity' : '1'
				}, {duration:500});
			} else if ((windowScrollTop < sTop) && (btnVisible == 1)){
				btnVisible = 0;
				$('.scroll-top').animate({
					'opacity' : '0'
				});
			}
	}

		$(window).scroll(function() {
			windowScrollTop = Math.round($(window).scrollTop());
			btnScrollUp()
		});
}

Maje.product.switchSize = function(){
	$('.swatches.size, .switchSizeCont').toggleClass('frSizeShow');
}

Maje.product.descriptToggle = function(){
	$(".wrapper-tabs").each(function() {
		var wrap = $(this);
		
		wrap.find(".tabs-menu li a").on("click", function(e) {
			e.preventDefault();
			$(this).closest('.tabs-menu').find('li').removeClass('active');
			$(this).parent('li').addClass('active');
			var el = $(this).closest('.tabs-menu').find('.active');
			
			if(wrap.find(".tabs-content div.active").length > 0){
				wrap.find(".tabs-content > div").removeClass("active");
				//wrap.find(".tabs-menu li").removeClass("active");
			}
			
			var menuIndex = el.index();
			wrap.find(".tabs-content > div").eq(menuIndex).addClass("active");
			//el.addClass("active");
		});
		
		$(this).find(".tabs-menu li.ancre").on("click", function(e) {
			var desc = $(".block-description-product");
			e.preventDefault();
			
			if(desc.length){
				var windowHeight = window.innerHeight;
				var top = parseInt(desc.offset().top);
				$("html, body").animate({ scrollTop: top - windowHeight / 4}, 250);
			}
		});
	});
};

Maje.product.crossSellToggle = function(){

	var $wrap = $(".wrapper-crossSell"),
		$tabs = $wrap.find("li.tab"),
		$contents = $wrap.find(".lastProductsSeenPush");

	/**
	 * Displays the right tab and its corresponding data
	 * @param {DOMElement} $el optional.the target element
	 */
	function displayTargetContent($el){
	var $first = $el || $wrap.find("ul>li:visible").eq(0),
	    targetClass = $first.data("target"),
	    $target = $contents.filter("."+targetClass);

		// "activate" the target tab element
		$tabs.removeClass("active");
		$first.addClass("active");

		// display the corresponding content
		$contents.removeClass("active");
		$target.addClass("active");
	}

	//Enable the feature on Maje.product.crossSellToggle call
	displayTargetContent();

	// wrap this behavior in a event handler
	$wrap.on("click", "li.tab", function(e){
		displayTargetContent($(this));
	});

}

Maje.product.slider = function(ProductSlider){

	var mySwiper;
	var windowWidth;
	var initSwiper = false;
	var thisSlider = $(ProductSlider);
	var condition = thisSlider.length;
	
	$(window).on("resize", function() {
		windowWidth = window.innerWidth;
		
		if(condition){
			if(windowWidth >= 768 && windowWidth < 1024 && typeof mySwiper === 'undefined' && initSwiper === false){
				mySwiper = new Swiper(ProductSlider,{
				    mode:'horizontal',
				    loop: false,
				    slidesPerView: "auto",
				    freeMode: true,
				    calculateHeight: true
				}); 
				initSwiper = true;
			} else if (typeof mySwiper != 'undefined' && initSwiper === true && (windowWidth >= 1024 || windowWidth < 768)){
				mySwiper.destroy();
				mySwiper = undefined;
				$('.product-list-images .swiper-wrapper').removeAttr('style');
				$('.product-list-images .swiper-slide').removeAttr('style');
				initSwiper = false;
			}
		}
	}).resize();
	
	
	$(".product-list-images img").on("click", function() {
		if(window.innerWidth <= 768){
			$(".zoomMain").trigger("click");
		}
	});
  
}

Maje.product.quickviewslider = function(){
	var slider = $(".quickview-swiper");
	if(slider.length){
		var mySwiper = new Swiper(".quickview-swiper", {
			mode:'horizontal',
			loop: false,
			calculateHeight: true,
			noSwiping:false,
			onSlideChangeEnd: function(swiper) {
				if (swiper.activeIndex === 0) {
					$('.quickview-swiper .arrowLeftMj').css({display: 'none'});
				} else {
					$('.quickview-swiper .arrowLeftMj').css({display: 'block'});
				}
				if (swiper.activeIndex === swiper.slides.length - 1) {
					$('.quickview-swiper .arrowRightMj').css({display: 'none'});
				} else {
					$('.quickview-swiper .arrowRightMj').css({display: 'block'});
				}
			}
		});
		$(".arrowLeftMj").unbind();
		
		$(".arrowLeftMj").on("click", function(e) {
			e.preventDefault();
			var productName = $('span.productSubname').eq(0).text();
			dataLayer.push({
			    'event': 'quick_shop',
			    'quick_shop_action':'onclick the arrow',
			    'product':productName
			});		
			mySwiper.swipePrev();
		});
		$(".arrowRightMj").unbind();
		
		$(".arrowRightMj").on("click", function(e) {
			e.preventDefault();
			var productName = $('span.productSubname').eq(0).text();
			dataLayer.push({
			    'event': 'quick_shop',
			    'quick_shop_action':'onclick the arrow',
			    'product':productName
			});
			mySwiper.swipeNext();
		});
	}
}

Maje.product.mobilePagination = function() {
	var pagination = $(".product-img-pagination");
	var imgProduct = $(".img-product");
	var nbProduct = $(".img-product").length;
	
	if(pagination.length && nbProduct > 1){
		var tableProduct = [];
		var windowWidth = window.innerWidth;

		for(var i= 0; i < nbProduct; i++){
			pagination.append("<li class='page-product-" + i + "'></li>");
		}
		
		$(".page-product-0").addClass("on");
		
		$(window).on("scroll", function() {
			if(windowWidth < 768){
				var windowHeight = window.innerHeight/2;
				var scrollTop = parseInt($(window).scrollTop());
				var activeScroll = scrollTop + windowHeight;
				
				for(var i = nbProduct; i >= 0; i--){
					if(activeScroll > tableProduct[i]){
						pagination.find("li").removeClass("on");
						pagination.find("li").eq(i).addClass("on");
						break;
					}
				}
	
				if((scrollTop + window.innerHeight/2) > ($(".product-list-images").height() + $(".product-list-images").offset().top)){
					pagination.addClass("hide");
				} else if (pagination.hasClass("hide")){
					pagination.removeClass("hide")
				}
			}
		}).scroll();
		
		$(window).on("resize", function() {
			tableProduct = [];
			windowWidth = window.innerWidth;
			if(windowWidth < 768){
				for(var i= 0; i < nbProduct; i++){
					tableProduct.push(parseInt($(".img-product").eq(i).offset().top));
				}
			}
		}).resize();
	}
}

Maje.product.popinDescMobile = function(){
	
	var popinDesc = $(".popin-description-mobile");
	var accordeon = $(".accordeon");
	
	$(".btn-popin-product-details").on("click", function() {
		 popinDesc.dialog({
			 width: "100%", 
			 dialogClass: 'bg-popin-opacity',
			 open: function () {
				 descAccordeon();
				 popinVerticalAlign(".bg-popin-opacity");
				 if($(this).closest('body').find('.lookProducts').hasClass('lookProducts')){
					$(this).addClass('popup-ps');
				 }
			 }
		 });
	});
	
	function descAccordeon() {
		var accordeon = $(".accordeon");
		
		accordeon.each(function() {
			var _this = $(this);
			
			_this.find("h3").on('click', function() {
				accordeon.removeClass("active");
				_this.addClass("active");
			});
		}); 
	}
	
	function popinVerticalAlign(el) {
		var popin = $(el);
		var popinHeight = popin.innerHeight();
		var windowHeight = window.innerHeight;
		var scrollTop = $(window).scrollTop();
		var top = popinHeight < windowHeight ? (scrollTop + windowHeight / 2 - popinHeight / 2) : (scrollTop);

		popin.css({"top": top + "px"});
	}
}

Maje.product.zoom = function(){
	var el = {
		imageZoom : '.main-image',
		closeCurrent : '.closeCurrent',
		imgProduct : '.imgProduct',
		zoomPopin : '.zoomPopin', 
		urlVideo : '.urlVideo a'
	};
	
	var createElementPopin = function(selectorBody){
		var parentDiv = $(document.createElement('div')).addClass('zoomPopin');
		var closeCurrent = $(document.createElement('div')).addClass('closeCurrent iconClose');	
		
		
		// create element of Popin 
		parentDiv
		.appendTo($('body'))
		.append(closeCurrent);
		
	}
	
	var closePopin = function(){
		$(el.closeCurrent).on('click tap touchstart', removeElementPopin);
	};
	
	var removeElementPopin = function(){
		$('#wrapper').show();
		$('.zoomPopin').remove();
		var metaViewport = $('html').find("meta[name='viewport']");
		var saveViewport = 'width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0';
		metaViewport.attr('content', saveViewport);
	};
	
	
	var getImageZoom = function(){

		$('.zoomPopin').on('click', function(e){
			e.preventDefault();
			var imgscr = $(this).attr('hires');
			// Active le zoom 
			var imageZoom = $('.main-image');
			removeElementPopin();
			// create popin
			createElementPopin('body');
			// event close popin
			closePopin();
			
			var createImg = $(document.createElement('img')).attr('src',imgscr);
			var createImg2 = $(document.createElement('img')).attr('src',imgscr);
			createImg.appendTo('.zoomPopin');
			createImg2.appendTo('.zoomPopin');
			
			$('#wrapper').hide();
			$('body').addClass('zoomBody');
		});
	}

};

Maje.product.toggleImage = function(){
	var imgsrc;
	var backsrc;
	var frontsrc;

	$(document).on('mouseenter', '.product-tile .product-image .thumb-link, .product-tile .quick-actions',  function () {
		
		if(!$(this).parents("li").hasClass("grid-tile-rupture")){
			imgsrc = $(this).find('img').attr('src');
			backsrc= $(this).find('img').data('backsrc');
			frontsrc= $(this).find('img').data('frontsrc');
	
			if(imgsrc != frontsrc){
				$(this).find('img').attr('src', frontsrc);
			}
			else if(imgsrc != backsrc){
				$(this).find('img').attr('src', backsrc);
			}
		}
	});
	$(document).on('mouseover', '.quick-actions, .quick-actions a',  function () {
		if(!$(this).parents("li").hasClass("grid-tile-rupture")){
			backsrc= $(this).closest('.product-tile').find('.product-image').find('img').data('backsrc');
			$(this).closest('.product-tile').find('.product-image').find('img').attr('src', backsrc);	
		}
	}).on('mouseleave','.quick-actions, .quick-actions a', function(){
		if(!$(this).parents("li").hasClass("grid-tile-rupture")){
			frontsrc= $(this).closest('.product-tile').find('.product-image').find('img').data('frontsrc');
			$(this).closest('.product-tile').find('.product-image').find('img').attr('src', frontsrc);
		}
	});
	
	
	$(document).on('mouseleave', '.product-tile .product-image .thumb-link, .product-tile .quick-actions',  function (e) {		
		e.preventDefault();
		if(!$(this).parents("li").hasClass("grid-tile-rupture")){		
			imgsrc = $(this).find('img').attr('src');
			backsrc= $(this).find('img').data('backsrc');
			frontsrc= $(this).find('img').data('frontsrc');
			if(imgsrc != frontsrc){
				$(this).find('img').attr('src', frontsrc);
			}
			else if(imgsrc != backsrc){
				$(this).find('img').attr('src', backsrc);
			}
		};
	});
	
	$(document).on("mouseenter", ".product-swatches .swatch-list a.swatch", function (e) {
	//$('.product-swatches').on("mouseenter", ".swatch-list a.swatch", function (e) {
		e.preventDefault();
		var tile = $(this).closest(".grid-tile");
		var thumb = tile.find(".product-image a.thumb-link img").filter(":first");
		var swatchImg = $(this).children("img").filter(":first");
		var data = swatchImg.data("thumb");
		var current = thumb.data('current');
		var colorName = swatchImg.data('colorname');
		
		if(!current) {
		    thumb.data('current',{src:thumb[0].src, alt:thumb[0].alt, title:thumb[0].title});
		}
		
		thumb.attr({
			src : data.src,
			alt : data.alt,
			title : data.title
		});
		
		
		
		if (colorName != null) {
			tile.find('.vignette').each(function() {
				$(this).removeClass('active');
			});
			var selectedVignette = tile.find('.vignette.'+colorName);
			selectedVignette.addClass('active');
			
		}
	});
	
	$(document).on("mouseleave", ".product-swatches .swatch-list a.swatch", function (e) {
		var tile = $(this).closest(".grid-tile");
		var swatchImg = $(this).children("img").filter(":first");
		var colorName = swatchImg.data('colorname');
		if (colorName != null) {
			tile.find('.vignette').each(function() {
				if ($(this).hasClass('default')) {
					$(this).addClass('active');
				} else {
					$(this).removeClass('active');
				}
			});
		}
		
		// Check if a default vignette need to be selected
		
		
	});

}

Maje.product.toggleFilter = function (element, btn_trigger, contentFilter, mode){
	
	var parentElement = $(element);
	var btnToggle = btn_trigger;
	var content = $(this).next(contentFilter);
	
	$(document).on(mode, btnToggle, function(e){
		e.preventDefault();

		$(this).closest(element).toggleClass('active').siblings(element).removeClass('active');
		$(this).closest(element).siblings(element).find('.subFilterTri').hide();
		if ($(this).next(contentFilter).is(':hidden')){
			$(this).next(contentFilter).slideDown().addClass('active');
		}else{
			$(this).next(contentFilter).removeClass('active').hide();
			$('.search-result-content').removeAttr('style');
			if($(window).width() < 767 ){
				$('.filterListProduct').removeAttr('style');
			}
		}
		
		arrowFl = $(this).closest('.filterResult').find('.subFilterTri').find('.arrowFilterSelect');
		
		if(arrowFl.length > 0){
			var thatOff = $(this).position();
			
			cssThat = {
				'left': thatOff.left + ($(this).width() / 2) - 12
			}
			
			arrowFl.css(cssThat);
		}
		
		$(document).on('click', '.subFilterTri', function(e){
			e.stopPropagation();
		});
		
		Claudie.footer.animateElementOnScroll();
		
	});
	
	// Close the refinement bar
	$(document).on('click touchstart','.closeFilter, .textValidateFilter', function(e) {
		e.stopPropagation();
		//e.preventDefault();
		$("body").removeClass("Filter-fixed");
		if($(this).hasClass("resetFilter")){
			window.location.reload();
			$("body").removeClass("Filter-fixed");
			return true;
		};
		
		var link = $(this).attr("href");
		var refinement = $(".selectedFilter").parent().siblings("div.refinement");
		var filter = {};
		for (var i=0; i < refinement.length; i++){
			var  selectedLi = refinement.eq(i).find("ul.swatches li.selected");
			var  liLength = selectedLi.length;
			if(liLength > 0){
				var filterKey = refinement.eq(i).attr("class");
				    filterKey = filterKey.replace("refinement", "");
				    filterKey = filterKey.replace("has-filter", "");
				    filterKey = filterKey.replace("active", "");
				    filterKey = filterKey.replace(/\s*/g,"");   
				    
			    if(filterKey != null && filterKey != ""){
			    	//no selected
			    	if(liLength < 1){
			    		continue;
			    	};
			    	filter[filterKey] = "";
				    for (var j=0; j<liLength; j++){
				    	if(filter[filterKey] != ""){
				    		filter[filterKey] += ("|" + selectedLi.eq(j).find("a").attr("title"));
				    	}else{
				    		filter[filterKey] += selectedLi.eq(j).find("a").attr("title");
				    	};				    	
				    };  
			    };			
			};
		};
		var filterString = "";
	    var keys=[];   
	    var values=[];   
	    
	    for(var key in filter){   
	        if (filter.hasOwnProperty(key) === true){  
	            keys.push(key);    
	        	values.push(filter[key])
	         };  
	    };
	    
	   for (var i=0; i<keys.length; i++){
		   filterString += "&prefn" + (i+1) + "=" + keys[i] + "&prefv" + (i+1) + "=" + values[i];
		  
	   };
	   link += filterString;
	   // count
	   //link += "&start=0&sz=" + loadMoreModule.currentCount;
	   // ajax
	   link += "&format=ajax";
	   
	   plpfiltershow(link);
	   
	});
	
	$(document).on('click','.closeFilter, .sortValidateFilter', function(e) {
		e.stopPropagation();
		//e.preventDefault();
		$("body").removeClass("Filter-fixed");
		if($(this).hasClass("resetFilter")){
			window.location.reload();
			return true;
			$("body").removeClass("Filter-fixed");
		};
		
		var link = $(this).attr("href");
		var contentfilter = $(".selectedFilterSort").parent().siblings("ul.contentFilter");
		var selectedLi = contentfilter.find("a.active");
		console.log(selectedLi);
		var selectedUrl = selectedLi.attr("href");
		
		selectedUrl += "&format=ajax";
		console.log(selectedUrl);
		plpfiltershow(selectedUrl);
	});
    
	function plpfiltershow(url) {		
		function tagFilterInit() {
			var filterItem = $('.filter-marker');
			if (filterItem.length) {
				filterItem.closest('.tag-filters').addClass('has-filter');
				filterItem.each(function() {
					$(this).closest('.refinement').addClass('has-filter');
				});
				Claudie.product.toggleImage();
				var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
			        prevButton: '.swiper-button-prev',
			        uniqueNavElements: '.swiper-pagination',
			        slidesPerView: 5,
			        loop: true,
			        centeredSlides: true,
			        paginationClickable: true,
			        spaceBetween: 0
			    });
				jQuery('.vestiaire-next').on('click', function(event){
				    event.stopPropagation(); 
					   swiperCarousel.swipeNext(); 
					});
				jQuery('.vestiaire-prev').on('click', function(event){
						event.stopPropagation(); 
						swiperCarousel.swipePrev(); 
				});
					
				var swiperClaudie = new Swiper('.claudie-swiper-container',{
			        prevButton: '.swiper-button-prev',
			        uniqueNavElements: '.swiper-pagination',
			        slidesPerView: 5,
			        loop: true,
			        centeredSlides: true,
			        paginationClickable: true,
			        spaceBetween: 0
			    });
					
				jQuery('.claudie-next').on('click', function(event){
				    event.stopPropagation(); 
				    swiperClaudie.swipeNext(); 
				});
				jQuery('.claudie-prev').on('click', function(event){
					event.stopPropagation(); 
					swiperClaudie.swipePrev(); 
				});
				
				$(".size.has-filter").parent().siblings('.filterListProduct').find('.refinementColor ul').addClass('current');
			}
			Claudie.footer.animateElementOnScroll();
			
			if ($(window).width() < 769){
				 if($('.vestiaire-swiper-container').length){
					var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
					  prevButton: '.swiper-button-prev',
					  uniqueNavElements: '.swiper-pagination',
					  slidesPerView: 1,
					  loop: false,
					  centeredSlides: true,
					  paginationClickable: true,
					  spaceBetween: 0,
					  pagination : '.swiper-pagination',
					  watchActiveIndex:true
					});

					var length = jQuery('.vestiaire-swiper-container .swiper-pagination-switch').length;
					$('.vestiaire-swiper-container .ShowActiveIndex .totallength').html(length);
					function callbacks(){
						$('.vestiaire-swiper-container .ShowActiveIndex .active').html(Number(swiperCarousel.activeIndex + 1));
						return false;
					}
					swiperCarousel.wrapperTransitionEnd(callbacks,true);
				 }
				 if($('.recentlybrowse-swiper-container').length){
						var swiperClaudie = new Swiper('.recentlybrowse-swiper-container',{
							  prevButton: '.swiper-button-prev',
							  uniqueNavElements: '.recentlybrowse-pagination',
							  slidesPerView: 1,
							  loop: false,
							  centeredSlides: true,
							  paginationClickable: true,
							  spaceBetween: 0,
							  pagination: '.recentlybrowse-pagination',
							  watchActiveIndex:true
							});
						var Clengthrecently = jQuery('.recentlybrowse-swiper-container .swiper-pagination-switch').length;
						$('.recentlybrowse-swiper-container .ShowActiveIndex .totallength').html(Clengthrecently);
						function Callrecently(){
							$('.recentlybrowse-swiper-container .ShowActiveIndex .active').html(Number(swiperClaudie.activeIndex + 1));
							return false;
						}
						swiperClaudie.wrapperTransitionEnd(Callrecently ,true);
				}
			}
			
		}
		   
			$.ajax({
				url : url,
				
				success : function(response) {
					//Traitement du retour de la requete ajax
					$('#main').html(response);
					Maje.product.filters();
					Maje.product.pricePromoAlign();
					app.product.tile.init();
					/*
					if(parameterInStock === true){
						$(".parameterInStock").val(true);
						$(".linkAvailable.all").removeClass("selected");
						$(this).addClass("selected");
					}
					else if(parameterInStock === false){
						$(".parameterInStock").val(false);
					}
					if($(".infosProduct .product-pricing #soldout").length == $(".infosProduct .product-pricing").length){
						$(".refinement .linkAvailable.InStock").css({
							"color": "#dbdbdb",
							"cursor": "default",
							"text-decoration": "none"
						});
					}
					if (!isTagFilter) {
						$('.blckFilter'+secondClass).find('.btnTri').trigger('click');
					}
					*/
					tagFilterInit();
					app.searchsuggest.changeGrid();
					Maje.footer.bottomPosition();
					
					if(window.innerWidth <= 768){
						$(".subFilterTri").removeClass("active").hide();
						$(".filterResult").removeClass("active");
					}
					Claudie.plpProduct.filters.mobile();
					$(".filterListProduct .filterTri").removeClass("active");
				    $(".filterListProduct .filterTri .subFilterTri").removeClass("active");
				    $(".filterListProduct .filterTri .subFilterTri").css("display", "none");
				    
				},
		
				error : function() {
					// TO DO : Traitement d'un eventuel cas d'erreur				
				},
				
			}).done(function() {
				if ($('.tag-filters li.selected').length > 1) {
					$('.tag-filters .resetFilters').addClass('showme');
				}else {
					$('.tag-filters .resetFilters').removeClass('showme');
					Claudie.footer.animateElementOnScroll();
					Claudie.product.toggleImage();
					app.progress.show($("#main").find(".search-result-content"));
					$("#search-result-items").addClass("deleteFilter");
					var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
				        prevButton: '.swiper-button-prev',
				        uniqueNavElements: '.swiper-pagination',
				        slidesPerView: 5,
				        loop: true,
				        centeredSlides: true,
				        paginationClickable: true,
				        spaceBetween: 0
				    });
					jQuery('.vestiaire-next').on('click', function(event){
					    event.stopPropagation(); 
						   swiperCarousel.swipeNext(); 
						});
					jQuery('.vestiaire-prev').on('click', function(event){
							event.stopPropagation(); 
							swiperCarousel.swipePrev(); 
					});
						
					var swiperClaudie = new Swiper('.claudie-swiper-container',{
				        prevButton: '.swiper-button-prev',
				        uniqueNavElements: '.swiper-pagination',
				        slidesPerView: 5,
				        loop: true,
				        centeredSlides: true,
				        paginationClickable: true,
				        spaceBetween: 0
				    });
						
					jQuery('.claudie-next').on('click', function(event){
					    event.stopPropagation(); 
					    swiperClaudie.swipeNext(); 
					});
					jQuery('.claudie-prev').on('click', function(event){
						event.stopPropagation(); 
						swiperClaudie.swipePrev(); 
					});
					
					if ($(window).width() < 769){
						 if($('.vestiaire-swiper-container').length){
							var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
							  prevButton: '.swiper-button-prev',
							  uniqueNavElements: '.swiper-pagination',
							  slidesPerView: 1,
							  loop: false,
							  centeredSlides: true,
							  paginationClickable: true,
							  spaceBetween: 0,
							  pagination : '.swiper-pagination',
							  watchActiveIndex:true
							});

							var length = jQuery('.vestiaire-swiper-container .swiper-pagination-switch').length;
							$('.vestiaire-swiper-container .ShowActiveIndex .totallength').html(length);
							function callbacks(){
								$('.vestiaire-swiper-container .ShowActiveIndex .active').html(Number(swiperCarousel.activeIndex + 1));
								return false;
							}
							swiperCarousel.wrapperTransitionEnd(callbacks,true);
						 }
						 if($('.recentlybrowse-swiper-container').length){
								var swiperClaudie = new Swiper('.recentlybrowse-swiper-container',{
									  prevButton: '.swiper-button-prev',
									  uniqueNavElements: '.recentlybrowse-pagination',
									  slidesPerView: 1,
									  loop: false,
									  centeredSlides: true,
									  paginationClickable: true,
									  spaceBetween: 0,
									  pagination: '.recentlybrowse-pagination',
									  watchActiveIndex:true
									});
								var Clengthrecently = jQuery('.recentlybrowse-swiper-container .swiper-pagination-switch').length;
								$('.recentlybrowse-swiper-container .ShowActiveIndex .totallength').html(Clengthrecently);
								function Callrecently(){
									$('.recentlybrowse-swiper-container .ShowActiveIndex .active').html(Number(swiperClaudie.activeIndex + 1));
									return false;
								}
								swiperClaudie.wrapperTransitionEnd(Callrecently ,true);
						}
					}
					
					
				}
				app.progress.hide();
				var endLoadingProduct = $('.search-result-content.visible').find('div[data-loading-state="unloaded"]').length;
				var infinitScrollMode = $('.infinite-scroll-placeholder').length;
				if (endLoadingProduct == 0 && infinitScrollMode.length == 1) {
					$('.bottom-of-pages').addClass('showMe');
				}
			});
			
			
			setTimeout(function(){
					$('.filterListProduct').removeAttr('style');
					var heightFilter = ($('.subFilterTri.active .contentFilter').outerHeight(true))+20;

					$('.search-result-content').removeAttr('style');
					$('.subFilterTri.active').hide();
					
					$('.blckFilter').removeClass('active');
					Claudie.footer.animateElementOnScroll();
					
				}, 200);
			
			
			Claudie.footer.animateElementOnScroll();
	}
	

	//toggle filter item
	$(document).on('click','.refinement .titleFilter', function(e) {
		$(this).parent('.refinement').toggleClass('active');
		$(this).next('.Claudie-filter-item').find('ul').jScrollPane();
		
		if($(".refinement").hasClass("has-filter")){
			$(this).parent('.refinement').addClass('NowCurrent');
		}
		
	});
	$(document).on("click", ".wrapper-btn-changegrid > span", function() {
		if (!$(".wrapper-btn-changegrid").hasClass('active')){
			$(".wrapper-btn-changegrid").addClass('active');
			$(".wrapper-btn-changegrid ul").slideDown();
			Claudie.footer.animateElementOnScroll();
		} else {
			$(".wrapper-btn-changegrid").removeClass('active');
			$(".wrapper-btn-changegrid ul").hide().removeAttr('style');
		}
	});
	$(document).on("click", ".btnTri", function() {
		$(".wrapper-btn-changegrid ul").hide();
		Claudie.footer.animateElementOnScroll();
	}); 
	
	$(document).on("click", ".refinement", function() {
		var heightDiv = $('.contentFilter').height();
		if ( heightDiv >= screen.height) {
 			var heightMarg = heightDiv - screen.height;
			$('#footer').css('marginTop', heightMarg); 
			Claudie.footer.animateElementOnScroll();
		}
		else {
			$('#footer').css('marginTop', '45px'); 			
		}
		
		if($(".refinement").hasClass("has-filter")){
			$(this).siblings().children('ul').addClass('currently');
		}
		
	});

	Claudie.footer.animateElementOnScroll();
	
};

Maje.product.closeToggleFilter = function(){
	$(document).mouseup(function (e)
	{
		var wrapGrid = $(".wrapper-btn-changegrid");
		
		if (!wrapGrid.is(e.target) && !wrapGrid.find("> span").is(e.target) && wrapGrid.hasClass("active")){
			$(".wrapper-btn-changegrid ul").hide();
			wrapGrid.removeClass("active")
		}
		
		var container = $(".btnTri");
		var FilterContainer = $("titleFilter");

		if (!container.is(e.target)
		    && $('.subFilterTri').has(e.target).length === 0
		    && container.has(e.target).length === 0)
		{			
			$(".blckFilter").removeClass('active');
			$(".subFilterTri").hide();
			$('.search-result-content').removeAttr('style');
		}
		
		if (!FilterContainer.is(e.target)
		    && $('.clearfix.swatches').has(e.target).length === 0
		    && container.has(e.target).length === 0)
		{			
			$(".refinement").removeClass('active');
			Claudie.footer.animateElementOnScroll();
		}
		
		Claudie.footer.animateElementOnScroll();
		
	});
	Claudie.footer.animateElementOnScroll();
};

Maje.product.addSelectedClass = function (){
	$('.subFilterTri ul li').click(function(e){
		e.preventDefault();
		//$(this).removeClass('selected');
		$(this).toggleClass('selected');
	});
};

Maje.product.activeFilterClass = function (content, contentLink, link, mode){
	var btnClick = link
	var parentContent = $(content);
	var findLink = parentContent.find(link);
	
	$(document).on(mode, link, function(){
		$(this).toggleClass('active');
		$(this).closest(contentLink).siblings(contentLink).find(link).removeClass('active');
	});
	
};
Maje.product.toggleTab = function(element, trigger, contentSlide, typeBlock, mode){
	var blockTab = $(element);
	if (blockTab.length > 0){
		
		//gestion du menu depliant dans la liste produit
		var catid = $('.currentCategory').html();
		var currentCategory;
		$('.tabCategory').each(function(){
			if($(this).attr('catid') == catid){
				//currentCategory = $(this).find('.triggCat');
				$(this).find(trigger).next(contentSlide).show();
				$(this).find(trigger).addClass('active');
				
			}
		});
			
		blockTab.find(trigger).on(mode, function(e){
				e.preventDefault();
				$(this).toggleClass('active');
				$(this).closest(typeBlock).siblings(typeBlock).find(trigger).removeClass('active');
				$(this).next(contentSlide).slideToggle();
				$(this).closest(typeBlock).siblings(typeBlock).find(contentSlide).slideUp();
			});
	}
};
Maje.product.cloneElement = function(){
	var widthW = 767;
	// en dessous d'une taille de 767
	if($(window).width() < widthW){
		var productSubName = $('.productSubname');
		var soldout = $('.product-add-to-cart #soldout').clone();
		var comingsoon = $('.product-add-to-cart #comingsoon').clone();
		var btnalertshow = $('.product-add-to-cart .btnAlertShow').clone();
		var newDivProduct = $(document.createElement('div'));
		var clonePrice = $('.productPrices').clone();
		var itemBlock = $('.priceTitleProduct').length;
		
		for (var i = 0; i === itemBlock; i++){
			
			var subTitle = productSubName.clone();
		 	
			 newDivProduct
			 .addClass('priceTitleProduct')
			 .append(clonePrice)
			 .prepend(subTitle)
			 .insertBefore('.product-detail');
		
			 soldout
			 .addClass('soldMobile')
			 .insertBefore('.product-variations');
			 
			  comingsoon
			 .addClass('soldMobile')
			 .insertBefore('.product-variations');
			  
			  btnalertshow
			 .addClass('soldMobile')
			 .insertBefore('.product-variations');
		}
	}
};
// add or delete quantity quickview

Maje.product.quantity = function(){
	if($('.quickview').length){
		getQuantity = function(element){
			that = $(element);
			
			parentQty = that.closest('#QuickViewDialog').find('.quantity');
			
			nbQty = parentQty.find('#Quantity').val();
			if($(element).hasClass('lessQuantity') && parentQty.find('#Quantity').val() != 1){
				
				nbQty--;
				
				parentQty.find('#Quantity').val(nbQty);
			}else if($(element).hasClass('plusQuantity')){
				
				nbQty++;
				
				parentQty.find('#Quantity').val(nbQty);
			}
		}
		
		$('.quickview' ).on('click', '.controlQuantity', function(e){
			e.preventDefault();
			e.stopPropagation();
			getQuantity(this);
		
		});
	}
}
Maje.product.onResize = function(){
	var widthResize = 767;
	$(window).resize(function(){
		if($(window).width() > widthResize){
			return "";
		}else{
			Maje.product.cloneElement();
		}
	});
};
Maje.product.zoomMobile = function (triggerZoom){
	var viewImg = '.imgProduct';
	$(viewImg).each(function(){
	//$(document).on('click', viewImg, function(e){
		//e.preventDefault();
		for (var i = 0; $(this).find(triggerZoom).length === 0; i++){
			var buttonZoom = $(document.createElement('a')).addClass('buttonZoom').text('zoom +');
			buttonZoom.appendTo($(this))
			.css({
				'position' : 'absolute',
				'z-index' : '1',
				'top': '50%',
				'left' : '50%',
				'text-align' :'center',
				'margin-left' : -($(this).find(triggerZoom).outerWidth()/2)
			})
			;
		}
		
	});
	
	$(document).on('click tap touchstart', triggerZoom, function(e){
		e.preventDefault();
		// on verifie si la div exist qu sein de la page
		for (var i = 0; $('.zoomBlock').length === 0; i++){
			var urlImg = $('.productlargeimgdata').data("hiresimg").split('|');
			var btnClose = $(document.createElement('a')).addClass('closeZoom').text("");
			var contentZoom = $(document.createElement('div')).addClass('zoomBlock');
			var indexImgZoom = $(this).closest('.slideImg').index();
			var createImg = $(document.createElement('img')).attr('src' , urlImg[indexImgZoom]);
			
			contentZoom
			.css('height' , $(document).height())
			.append(btnClose)
			.append(createImg)
			.appendTo($('body'))
			.show();

		}
		var documentBody = (($.browser.chrome)||($.browser.safari)) ? document.body : document.documentElement;
		$(documentBody).stop().animate({
			scrollTop : $('#wrapper').offset().top
		},'1000');
		
		/*on desactive le blocage du zoom*/
		
		//Maje.product.gestureZoomActive();
	});
	
	$(document).on('click','.closeZoom', function(e){
		e.preventDefault();
		$(this).closest('.zoomBlock').remove();
		//$('.buttonZoom').remove();
		//Maje.product.gestureZoomNoActive();
	});
};
Maje.product.gestureZoomActive = function(){
	/*
var dom = (($.browser.chrome)||($.browser.safari)) ? document.body : document.documentElement,
_width = parseInt($('.zoomBlock').css('width')),
vel = 5.0,
min = 320,
max = 1500,
scale;

dom.addEventListener("gesturechange", gestureChange, false);
dom.addEventListener("gestureend", gestureEnd, false);

	function gestureChange(e) {
	
	    e.preventDefault();
	    scale = e.scale;
	    var tempWidth = _width * scale;
	
	    if (tempWidth > max) tempWidth = max;
	    if (tempWidth < min) tempWidth = min;
	
	    $('.zoomBlock').css({
	        'width': tempWidth + 'px',
	        'height': tempWidth + 'px'
	    });
	}

	function gestureEnd(e) {
	
	    e.preventDefault();
	    _width = parseInt($('.zoomBlock').css('width'));
	}
	*/
	//test gesture
	var metaViewport = $('html').find("meta[name='viewport']");
	metaViewport.attr('content','width=device-width');
}
Maje.product.gestureZoomNoActive = function(){
	var metaViewport = $('html').find("meta[name='viewport']");
	var saveViewport = 'width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0';
	metaViewport.attr('content', saveViewport);
};
Maje.product.tooltip = function(){
	var btn = '.swatches.size .unselectable .swatchanchor';
	var classTooltip ='.hoverTooltip';
	var openPopin = '.openProduct';
	var classToolError = '.toolError';
	var popinUnvailable = '.contentProductPop';
	
	function setUpContentProductPop() {
		
		// on clone les 茅l茅ments puis nous les d茅pla莽ons au sein de la popin
		$('.contentProductPop .product-name').prependTo('.contentProductPop #product-content');
		$('.contentProductPop .textAlert').prependTo('.contentProductPop .product-col-2');
		if($(window).width() < 767){
		  $('#comingsoon').prependTo('.product-variations');
		}
		$('.contentProductPop .product-tabs, .contentProductPop .productReturnNextPrev').remove();
		$('.contentProductPop .product-add-to-cart, .contentProductPop .priceTitleProduct').remove();
		$('.contentProductPop .product-actions').remove();
		$('.contentProductPop .lastProductsSeenPush').remove();
		$('.contentProductPop #send-to-friend-main').remove();
		$('.contentProductPop .sizeguide').remove()
		$('.contentProductPop .lookbookPush, .contentProductPop .cross-sell').remove()
		$('.contentProductPop a.zoomMain').remove();
		$(document).on('click', '.contentProductPop a.thumbnail-link, .contentProductPop a.product-image', function(e) {e.preventDefault(); return false;});
		$('.contentProductPop img').css('cursor','default');
		$('.contentProductPop').find('.swatches.size .emptyswatch:not(.unselectable)').remove();
		$('.contentProductPop .unselectable').removeClass('unselectable').css('cursor', 'pointer');
	}
	
	$(document).on('hover,click', btn, function(e){
		e.preventDefault();
		$(classTooltip).remove();
	}).on('mouseleave', classTooltip , function(e){
		e.preventDefault();
		$(this).remove();
	}).on('mouseleave', btn, function(e){
		setTimeout(function(){
			if($(classTooltip).is(':not(:hover)')){
				$(classTooltip).hide();
			}
		}, 500);
	});
	
	
	var initBtnAlert = false;
	
	$(document).on('click', openPopin, function(e){
		e.preventDefault();
		
		var parentAlert = $(this).parents(".product-tile.out-of-stock");
		
		if(parentAlert.length){
			$(this).parents(".product-tile.out-of-stock").addClass("activeAlert");
		}else{
			$(this).parents(".product-add-to-cart").addClass("pdpActiveAlert");
		}
	});
	
	$(document).on('mouseleave', '.product-tile.out-of-stock', function(e){
		$(this).removeClass("activeAlert");
	});
	
	//verification Email
	Maje.product.mail();
	
	// change hauteur
	setHeight();
	
$(window).resize(function(){
	if($(window).width < 767){ 
		if($('.product-set-item').length > 1){
			$('.add-sub-product').removeAttr('style');
		}
	}else{
		setHeight();
	}
});
function setHeight(){
	if($(window).width < 767){ 
		$('.product-set-item').each(function(){
			var heightBlock =  $(this).find('.product-name').height();
			var heightName = $(this).find('.product-variations').height();
			$(this).find('.add-sub-product').height(heightBlock + heightName);
		});
	}
}
};
Maje.product.moveElementPopinProduct = function(){
	// nous deplacons la div qui contient l'image du produit lorsque nous sommes en mobile
	
	var detectWindowMobile = $(window).width() < 767;
	var detectWindowDesktop = $(window).width() > 767;
	var lengthDiv = $('.contentProductPop .product-primary-image').length;
	var dataAfter =  $('.contentProductPop .product-primary-image').attr('data-after');
	  
	$(window).width() < 767 ? heightPop = '' :  heightPop = $('.contentProductPop .product-col-2').outerHeight();
	  // on centre la popin au centre de la page.
		$('.contentProductPop').css({
			'height' : heightPop,
			'top' : $(window).width() < 767 ? '65px' : '',
			'margin-left' : -($('.contentProductPop').outerWidth() / 2),
			'margin-top' : $(window).width() < 767 ? '0' : -(heightPop/2)
		});
		
	 if(detectWindowMobile && lengthDiv == 1 && dataAfter == undefined ){
		  $('.contentProductPop .product-primary-image').insertAfter($('.contentProductPop .textAlert'));
		  $('.contentProductPop .product-primary-image').attr('data-after', 'true');
	  }else if(detectWindowDesktop && lengthDiv == 1 && dataAfter == "true"){
		  $('.contentProductPop .product-primary-image').appendTo($('.contentProductPop .product-image-container'));
		  $('.contentProductPop .product-primary-image').removeAttr('data-after');
	  }
};

// chargement Ajax des filtres de la page ListProduit

Maje.product.filters = function() {
	// Convenience function, use to retrieve a parameter value in the current url query string (ex : getParameterByName('q') )
	var getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	
	$('.contentFilter .textDeleteFilter').on('click', function(e) {
		//e.stopPropagation();
	});
	
	$(document).ready(function(){
		if(($(".infosProduct .product-pricing #soldout").length == $(".infosProduct .product-pricing").length) && $(".pagination ul").length == 0){
			$(".refinement .linkAvailable.InStock").css({
				"color": "#dbdbdb",
				"cursor": "default",
				"text-decoration": "none"
			});
		}
		
		function  resizeBloc() {
			if (window.innerWidth > 1024) {
 				 jQuery('.img-asset').height((jQuery('#search-result-items .grid-tile').outerHeight()*2 + 28));
			}	
			else if (window.innerWidth < 1023) {
				
				jQuery('.img-asset').height((jQuery('#search-result-items .grid-tile').outerHeight()*2 + 18));
			}
			else {
					jQuery('.img-asset').height('auto');

				}
	
		}
		jQuery(window).resize(function() {
			resizeBloc();		
		}).resize();

	});
	function tagFilterInit() {
		var filterItem = $('.filter-marker');
		if (filterItem.length) {
			filterItem.closest('.tag-filters').addClass('has-filter');
			filterItem.each(function() {
				$(this).closest('.refinement').addClass('has-filter');
			});
			Claudie.product.toggleImage();
			var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
		        prevButton: '.swiper-button-prev',
		        uniqueNavElements: '.swiper-pagination',
		        slidesPerView: 5,
		        loop: true,
		        centeredSlides: true,
		        paginationClickable: true,
		        spaceBetween: 0
		    });
			jQuery('.vestiaire-next').on('click', function(event){
			    event.stopPropagation(); 
				   swiperCarousel.swipeNext(); 
				});
			jQuery('.vestiaire-prev').on('click', function(event){
					event.stopPropagation(); 
					swiperCarousel.swipePrev(); 
			});
				
			var swiperClaudie = new Swiper('.claudie-swiper-container',{
		        prevButton: '.swiper-button-prev',
		        uniqueNavElements: '.swiper-pagination',
		        slidesPerView: 5,
		        loop: true,
		        centeredSlides: true,
		        paginationClickable: true,
		        spaceBetween: 0
		    });
				
			jQuery('.claudie-next').on('click', function(event){
			    event.stopPropagation(); 
			    swiperClaudie.swipeNext(); 
			});
			jQuery('.claudie-prev').on('click', function(event){
				event.stopPropagation(); 
				swiperClaudie.swipePrev(); 
			});
			$(".size.has-filter").parent().siblings('.filterListProduct').find('.refinementColor ul').addClass('current');
		}
		Claudie.footer.animateElementOnScroll();
	}
	tagFilterInit();
	Claudie.footer.animateElementOnScroll();
	
	// reset filter
	if (window.screen.width > 767){	
		var resetDom = "<a href=\"javaScript:void(0)\" class=\"resetFilterAll\" title=" + app.resources.resetfilterallbutton + ">" + app.resources.resetfilterallbutton + "</a>";
			$(".filterListProduct ul").find("li.selected").parent("ul").parent("div").append(resetDom);
			$(".filterListProduct ul").find("li a.activated").parent("li").parent("ul.contentFilter").parent("div").append(resetDom);		
	};
	
	$('.tag-filters .refinement:not(.category-refinement) ul li a, .contentFilter .refinement:not(.category-refinement) ul li a, .subFilterTri ul li a, a.textDeleteFilter, a.resetFilterAll').on('click', function(e) {
		// Prevent the default behaviour of the link
		e.preventDefault();
		if (window.screen.width < 768){	
			var tagfilters = $(this).closest(".tag-filters.has-filter");
			if(tagfilters.length > 0 ){
				var deletefilterlink = $(this).attr('href');
				deletefilterlink += "&format=ajax";
				
					$.ajax({
						url : deletefilterlink,
						
						success : function(response) {
							//Traitement du retour de la requete ajax
							$('#main').html(response);
							Maje.product.filters();
							Maje.product.pricePromoAlign();
							app.product.tile.init();
							/*
							if(parameterInStock === true){
								$(".parameterInStock").val(true);
								$(".linkAvailable.all").removeClass("selected");
								$(this).addClass("selected");
							}
							else if(parameterInStock === false){
								$(".parameterInStock").val(false);
							}
							if($(".infosProduct .product-pricing #soldout").length == $(".infosProduct .product-pricing").length){
								$(".refinement .linkAvailable.InStock").css({
									"color": "#dbdbdb",
									"cursor": "default",
									"text-decoration": "none"
								});
							}
							if (!isTagFilter) {
								$('.blckFilter'+secondClass).find('.btnTri').trigger('click');
							}
							*/
							tagFilterInit();
							app.searchsuggest.changeGrid();
							Maje.footer.bottomPosition();
							
							if(window.innerWidth <= 768){
								$(".subFilterTri").removeClass("active").hide();
								$(".filterResult").removeClass("active");
							}
							Claudie.plpProduct.filters.mobile();
							$(".filterListProduct .filterTri").removeClass("active");
						    $(".filterListProduct .filterTri .subFilterTri").removeClass("active");
						    $(".filterListProduct .filterTri .subFilterTri").css("display", "none");
						    
						    if ($(window).width() < 769){
								 if($('.vestiaire-swiper-container').length){
									var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
									  prevButton: '.swiper-button-prev',
									  uniqueNavElements: '.swiper-pagination',
									  slidesPerView: 1,
									  loop: false,
									  centeredSlides: true,
									  paginationClickable: true,
									  spaceBetween: 0,
									  pagination : '.swiper-pagination',
									  watchActiveIndex:true
									});

									var length = jQuery('.vestiaire-swiper-container .swiper-pagination-switch').length;
									$('.vestiaire-swiper-container .ShowActiveIndex .totallength').html(length);
									function callbacks(){
										$('.vestiaire-swiper-container .ShowActiveIndex .active').html(Number(swiperCarousel.activeIndex + 1));
										return false;
									}
									swiperCarousel.wrapperTransitionEnd(callbacks,true);
								 }
								 if($('.recentlybrowse-swiper-container').length){
										var swiperClaudie = new Swiper('.recentlybrowse-swiper-container',{
											  prevButton: '.swiper-button-prev',
											  uniqueNavElements: '.recentlybrowse-pagination',
											  slidesPerView: 1,
											  loop: false,
											  centeredSlides: true,
											  paginationClickable: true,
											  spaceBetween: 0,
											  pagination: '.recentlybrowse-pagination',
											  watchActiveIndex:true
											});
										var Clengthrecently = jQuery('.recentlybrowse-swiper-container .swiper-pagination-switch').length;
										$('.recentlybrowse-swiper-container .ShowActiveIndex .totallength').html(Clengthrecently);
										function Callrecently(){
											$('.recentlybrowse-swiper-container .ShowActiveIndex .active').html(Number(swiperClaudie.activeIndex + 1));
											return false;
										}
										swiperClaudie.wrapperTransitionEnd(Callrecently ,true);
								}
							}
						    
						},
				
						error : function() {
							// TO DO : Traitement d'un eventuel cas d'erreur				
						},
						
					}).done(function() {
						if ($('.tag-filters li.selected').length > 1) {
							$('.tag-filters .resetFilters').addClass('showme');
						}else {
							$('.tag-filters .resetFilters').removeClass('showme');
							Claudie.footer.animateElementOnScroll();
							Claudie.product.toggleImage();
							app.progress.show($("#main").find(".search-result-content"));
							$("#search-result-items").addClass("deleteFilter");
							if($('.vestiaire-swiper-container').length){
							var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
						        prevButton: '.swiper-button-prev',
						        uniqueNavElements: '.swiper-pagination',
						        slidesPerView: 1,
						        loop: true,
						        centeredSlides: true,
						        paginationClickable: true,
						        spaceBetween: 0,
						        pagination: '.swiper-pagination',
						        watchActiveIndex:true
						    });
							var length = jQuery('.vestiaire-swiper-container .swiper-pagination-switch').length;
							$('.vestiaire-swiper-container .ShowActiveIndex .totallength').html(length);
							function callbacks(){
								$('.vestiaire-swiper-container .ShowActiveIndex .active').html(Number(swiperCarousel.activeIndex + 1));
								return false;
							}
							swiperCarousel.wrapperTransitionEnd(callbacks,true);
							}
							
							if($('.claudie-swiper-container').length){
							var swiperClaudie = new Swiper('.claudie-swiper-container',{
						        prevButton: '.swiper-button-prev',
						        uniqueNavElements: '.swiper-pagination',
						        slidesPerView: 1,
						        loop: true,
						        centeredSlides: true,
						        paginationClickable: true,
						        spaceBetween: 0,
						        pagination: '.claudie-pagination',
						        watchActiveIndex:true
						    });
								
							var Clength = jQuery('.claudie-swiper-container .swiper-pagination-switch').length;
							$('.claudie-swiper-container .ShowActiveIndex .totallength').html(Clength);
							function CallBacks(){
								$('.claudie-swiper-container .ShowActiveIndex .active').html(Number(swiperClaudie.activeIndex + 1));
								return false;
							}
							swiperClaudie.wrapperTransitionEnd(CallBacks ,true);
							}
							
						}
						app.progress.hide();
						var endLoadingProduct = $('.search-result-content.visible').find('div[data-loading-state="unloaded"]').length;
						var infinitScrollMode = $('.infinite-scroll-placeholder').length;
						if (endLoadingProduct == 0 && infinitScrollMode.length == 1) {
							$('.bottom-of-pages').addClass('showMe');
						}
					});
					
					
					setTimeout(function(){
							$('.filterListProduct').removeAttr('style');
							var heightFilter = ($('.subFilterTri.active .contentFilter').outerHeight(true))+20;

							$('.search-result-content').removeAttr('style');
							$('.subFilterTri.active').hide();
							
							$('.blckFilter').removeClass('active');
							Claudie.footer.animateElementOnScroll();
							
						}, 200);
					
					
					Claudie.footer.animateElementOnScroll();
				
			}else {
			    return true;
			}
		} else {

			// judgment if it is Reset Filter 
		var isResetFilter = $(this).hasClass("resetFilterAll");

		if(isResetFilter){			
			var isSort = $(this).parent("div").hasClass("srule");
			var link = $(this).siblings("ul").find("li a").attr("href");
			if(isSort){
				var filterKey = $(this).parent("div").attr("class");
				    filterKey = filterKey.replace("subFilterTri", "");
				    filterKey = filterKey.replace("active", "");
				    filterKey = filterKey.replace(/\s*/g,"");
				 var hostArray = link.split("?");
				 var host = hostArray[0];
				 var parameterArray = hostArray[1].split("&");
				 var parameter = "";
				 for (var i = 0; i < parameterArray.length; i++){
					 if(parameterArray[i].indexOf(filterKey) > -1){
						 continue;
					 }else if(parameterArray[i].indexOf("showPack=false") > -1){
						 continue;
					 }else if(parameter.indexOf("?") > -1){
						 parameter += "&" + parameterArray[i];
					 }else{
						 parameter += "?" + parameterArray[i];
					 };
					 if(i == parameterArray.length - 1){
						 if(parameter.indexOf("format=ajax") < 0){
							 if(parameter.indexOf("?") > -1){
								 parameter += '&format=ajax';
							 }else{
								 parameter += '?format=ajax';
							 };
						 };
					 };
				 };			    
			}else{
				var filterKey = $(this).parent("div").parent("div").attr("class");
				    filterKey = filterKey.replace("subFilterTri", "");
				    filterKey = filterKey.replace("refinement", "");
				    filterKey = filterKey.replace("has-filter", "");
				    filterKey = filterKey.replace("active", "");
				    filterKey = filterKey.replace(/\s*/g,"");
				 var hostArray = link.split("?");
				 var host = hostArray[0];
				 var parameterArray = hostArray[1].split("&");
				 var parameter = "";
				 for (var i = 0; i < parameterArray.length; i++){
					 if(parameterArray[i].indexOf(filterKey) > -1){
						 i++;
						 continue;
					 }else if(parameterArray[i].indexOf("showPack=false") > -1){
						 continue;
					 }else if(parameter.indexOf("?") > -1){
						 parameter += "&" + parameterArray[i];
					 }else{
						 parameter += "?" + parameterArray[i];
					 };
					 if(i == parameterArray.length - 1){
						 if(parameter.indexOf("format=ajax") < 0){
							 if(parameter.indexOf("?") > -1){
								 parameter += '&format=ajax';
							 }else{
								 parameter += '?format=ajax';
							 };
						 };
					 };
				 };					
			};				
		    link = host + parameter;	
		    
		}else{
			// Check if the cliked link is selectable.
			// If not, exit the function
			if($(this).parent().hasClass('unselectable')) return false;
			var isTagFilter = $(this).closest('.tag-filters').length? true:false;
			var link = $(this).attr('href');
			var queryString=link.split('?')[1] || '';
			var isOnlySelectedFilter = $(this).closest('.contentFilter').find('li.selected').length == 1 ;
			
			var isSelected = $(this).parent().hasClass('selected');
			
			if($(this).hasClass("linkAvailable")){
				if(link.indexOf("format=ajax") < 0){
					link += "&format=ajax";
				}
				
				if($(this).hasClass("all")){
					if(link.indexOf("&opOnly=false") >= 0){
						link = link.replace("&opOnly=false", "");
					}else{
						link = link.replace("&opOnly=true", "");
						link += "&opOnly=false";
						var parameterInStock = false;
					}
				}else{
					if(($(".infosProduct .product-pricing #soldout").length == $(".infosProduct .product-pricing").length) && $(".pagination ul").length == 0){
						return false;
					}
					if(link.indexOf("&opOnly=true") >= 0){
						link = link.replace("&opOnly=true", "");
						var parameterInStock = false;
					}else{
						link = link.replace("&opOnly=false", "");
						link = link.replace(/start=([^&]$|[^&]*)/i, "start=0");
						link += "&opOnly=true";
						var parameterInStock = true;
					}
				}
			}
			else{
				var parameter = "";
				if($(".parameterInStock").val() == "true" && !$(this).hasClass("textDeleteFilter")){
					var parameterInStock = true;
					parameter = "&opOnly=true";
				}
				if(!$(this).hasClass("packshotButton") && $("#currentPackView").val() == "true"){
					parameter = parameter + "&showPack=true";
				}
				if(!$(this).hasClass("packshotButton") && $("#currentFrontView").val() == "true"){
					parameter = parameter + "&showPack=false";
				}
				if(! $(this).hasClass('textDeleteFilter')) {
					if ( !(isSelected && isOnlySelectedFilter) || getParameterByName('q').length > 0 || queryString.length > 0) {
						link = $(this).attr('href') + '&format=ajax'+parameter;
					} else {
						link = $(this).attr('href') + '?format=ajax'+parameter;
					}
				} else {
					link = $(this).attr('href') + '&format=ajax'+parameter;
				}
			}
		
			var secondClass = $(this).closest('.blckFilter').hasClass('filterResult') ? '.filterResult' : '.filterTri';
		};	
			// Build the ajax call
			app.progress.show($("#main").find(".search-result-content"));
		
		
		$.ajax({
			url : link,
			
			success : function(response) {
				// Traitement du retour de la requete ajax
				$('#main').html(response);
				Maje.product.filters();
				Maje.product.pricePromoAlign();
				app.product.tile.init();
				if(parameterInStock === true){
					$(".parameterInStock").val(true);
					$(".linkAvailable.all").removeClass("selected");
					$(this).addClass("selected");
				}
				else if(parameterInStock === false){
					$(".parameterInStock").val(false);
				}
				if($(".infosProduct .product-pricing #soldout").length == $(".infosProduct .product-pricing").length){
					$(".refinement .linkAvailable.InStock").css({
						"color": "#dbdbdb",
						"cursor": "default",
						"text-decoration": "none"
					});
				}
				if (!isTagFilter) {
					$('.blckFilter'+secondClass).find('.btnTri').trigger('click');
				}
				tagFilterInit();
				app.searchsuggest.changeGrid();
				Maje.footer.bottomPosition();
				
				if(window.innerWidth <= 768){
					$(".subFilterTri").removeClass("active").hide();
					$(".filterResult").removeClass("active");
				}
				$(".filterListProduct .filterTri").removeClass("active");
			    $(".filterListProduct .filterTri .subFilterTri").removeClass("active");
			    $(".filterListProduct .filterTri .subFilterTri").css("display", "none");
			},
	
			error : function() {
				// TO DO : Traitement d'un eventuel cas d'erreur				
			},
			
		}).done(function() {
			if ($('.tag-filters li.selected').length > 1) {
				$('.tag-filters .resetFilters').addClass('showme');
			}else {
				$('.tag-filters .resetFilters').removeClass('showme');
				Claudie.footer.animateElementOnScroll();
				Claudie.product.toggleImage();
				app.progress.show($("#main").find(".search-result-content"));
				var swiperCarousel = new Swiper('.vestiaire-swiper-container',{
			        prevButton: '.swiper-button-prev',
			        uniqueNavElements: '.swiper-pagination',
			        slidesPerView: 5,
			        loop: true,
			        centeredSlides: true,
			        paginationClickable: true,
			        spaceBetween: 0
			    });
				jQuery('.vestiaire-next').on('click', function(event){
				    event.stopPropagation(); 
					   swiperCarousel.swipeNext(); 
					});
				jQuery('.vestiaire-prev').on('click', function(event){
						event.stopPropagation(); 
						swiperCarousel.swipePrev(); 
				});
					
				var swiperClaudie = new Swiper('.claudie-swiper-container',{
			        prevButton: '.swiper-button-prev',
			        uniqueNavElements: '.swiper-pagination',
			        slidesPerView: 5,
			        loop: true,
			        centeredSlides: true,
			        paginationClickable: true,
			        spaceBetween: 0
			    });
					
				jQuery('.claudie-next').on('click', function(event){
				    event.stopPropagation(); 
				    swiperClaudie.swipeNext(); 
				});
				jQuery('.claudie-prev').on('click', function(event){
					event.stopPropagation(); 
					swiperClaudie.swipePrev(); 
				});
				
			}
			app.progress.hide();
			var endLoadingProduct = $('.search-result-content.visible').find('div[data-loading-state="unloaded"]').length;
			var infinitScrollMode = $('.infinite-scroll-placeholder').length;
			if (endLoadingProduct == 0 && infinitScrollMode.length == 1) {
				$('.bottom-of-pages').addClass('showMe');
			}
		   });
		};
	});
	
	//add class to position show all and scrollToTop button 
	if ( $('.pagination.large').length ){
		$('.search-result-options.bottomPaginate').addClass('largePage');
	}

	$(document).on('click', '.tag-filters .resetFilters', function(e){
		e.preventDefault();
		$('.blockDeleteFilter .textDeleteFilter').trigger('click');
	})
}

Maje.product.pricePromoAlign = function() {
	var productPrice = $(".search-result-content .product-pricing");
	
	if(productPrice.length){
		productPrice.each(function(){
			
			if($(this).find(".reducePercent").length){
				$(this).addClass("product-pricing-promo");
			}
			
		});
	}
}
Maje.product.sizeButtonMobile = function (){
	/* When the user clicks on the button, 
	toggle between hiding and showing the dropdown content */
	$('body').on('click','.select-btn-mobile',function(){
		$('body').find(".dropdown-content").toggleClass("show");
	});

	// Close the dropdown if the user clicks outside of it
	window.onclick = function(event) {
	  if (!event.target.matches('.select-btn-mobile')) {

	    var dropdowns = $('body').find(".dropdown-content");
	    var i;
	    for (i = 0; i < dropdowns.length; i++) {
	      var openDropdown = dropdowns[i];
	      if (openDropdown.classList.contains('show')) {
	        openDropdown.classList.remove('show');
	      }
	    }
	  }
	}
}
Maje.product.mail = function (){
	var inputVm ='.alertEmail';
	var inputSubmit = '.btnAlert';
	
	
	// nous supprimons le message d'erreur au focus
    $(document).on('focus click', '.alertEmail, .divAlert .toolError, .btnAlert', function(){
    	$('.divAlert .errorEmail').remove();
    	$('.labelEmail').removeClass('errorEmailActive');
    	$('.alertEmail').removeClass('errorEmailActive');
    });    
	
	// Click on the validation button.
	$(document).on('click', inputSubmit, function(){
		
		var quickActions = $(this).parents(".quick-actions").length;
		var form, result; 
		
		if(quickActions > 0){
			form = $(this).parents(".quick-actions").find(".formEmail");
			result = $(this).parents(".quick-actions").find(".alert-result span");
			$(this).parents(".quick-actions").addClass("add-alert-in-stock");
		} else {
			form = $(".formEmail");
			result = $(".alert-result span");
		}
		
		
		converteoLayer.push({
			'event': 'eventGA', 
			'categoryGA': 'availabilityAlert', 
			'actionGA': 'availabilityAlert', 
			'labelGA' : '', 
			'valueGA' : '', 
			'nonInteraction' : 'false'
		});
		
		// Si il 
    	var classToolError = '.toolError';
    	$(classToolError).remove();
		// on verifie si le format d'Email est correct, dans ce cas nous supprimons la tooltip Error si elle est pr茅sente.
		var regxp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
    	var emailToAlert = $(this).parent().find('.alertEmail').val();
    	if (emailToAlert.match(regxp)  ) {
        	$(classToolError).remove();
        	var variationParams = '';
        	
        	if($(".search-result-items").length == 0){
	        	$(this).closest('.pdp-main').last().find('.selected a.swatchanchor').each(function() {
	        		variationParams += '&' + $(this).data('variationparameter');
	        	}); 
	        	$.ajax({
	        		url: app.urls.registerProductAlert,
	        		data: 'email=' + emailToAlert + '&pid=' + $('input#pid').val() + variationParams,
	        		success : function(response) {
						if(response.success) {
							form.css('display', 'none');
							result.html(response.message).addClass('activeResult');
						}
					}
	        	});
        	}
        	else {
	        	$.ajax({
	        		url: app.urls.registerProductAlert,
	        		data: 'email=' + emailToAlert + '&pid=' + $(this).closest('.product-tile').attr('data-itemid') + variationParams,
	        		success : function(response) {
						if(response.success) {
							form.css('display', 'none');
							result.html(response.message).addClass('activeResult');
						}
					}
	        	});
        	}
        } else {
        	// nous cr茅eons l'appel de la tooltip pour le Desktop, dans l'autre cas elle est destin茅 au mobile
			
			var label = $(this).closest('.formEmail').find('.alertEmail');
			
			// check if the label exists
			if(label.length) {
				
				// check if the label has the class 'errorEmailActive'.
				// if it doesn't, create the div that will display the error message and set the textError.
				
				if (! label.hasClass('errorEmailActive')) {
					label.addClass('errorEmailActive');
					var toolError = $(document.createElement('div')).addClass('errorEmail');
		        	var textError = app.resources.INVALID_EMAIL;
		        	var middleHeightTool = $(this).closest('body').find(classToolError).outerHeight()/2;
					var middleHeightButton = $(this).prev('.alertEmail').outerHeight()/2;
					var pos = 10;
				}
			}
		 
        	// nous cr茅eons l'appel de la tooltip pour le Desktop, dans l'autre cas elle est destin茅 au mobile
			$(this).closest('.formEmail').append(toolError);
    		$(this).closest('.formEmail').find(toolError).text(textError);
    		
        }
	});
};
Maje.product.sendtofriendpopin = function(){
	function sendTo () {
		
		  var popinUrl= $('.sendPopin').attr("data-href");
		  $.ajax({   
		   url : popinUrl
		  })
		  .done(function (response) {
		   
		   var contentresponse = $(response).find('#send-to-friend-form');
		   
		   $("#send-to-friend-main").dialog({
		    width: ($(window).width() >= 767 ? 720 : 310),
		    dialogClass: "sendTo",
		    closeText: "",
		    position: {my: "top", at: "center", of: "#header"},
		    draggable: false,
		    close: function() {
		     $('.greyLayer, form#send-to-friend-form').remove();
		    }
		   });
		  $('body:not(:has(div.greyLayer))').append('<div class="greyLayer"></div>');
		  $('.formContainer:not(:has(form#send-to-friend-form))').append(contentresponse);
		  if($(window).width() < 767){
			  $('.sendTo')
			  .find('img.product')
			  .prependTo('.sendTo .send-to-friend-product');
		  }
		    })
		    .fail(function () {
		     
		  })
		  .always(function () {    
		  });  
		  
		  return false;
		 }
		 
		$(document).on('click', '.sendPopin', function(){
			 
		  sendTo ();
		 });
		
		 $(document).on('click', '.required', function(e){
			 $(this).parent().removeClass('error');
			 $(this).find('span.error-message').remove();
		 })
		 
		 $(document).on('click', '.send-button', function(e){		 
			 	
			 	$('div.sendTo').find('.error-message').remove();
			 	
			 	var globalvalid = true;			 
				 $('div.sendTo div.required').each(function(){
					 var inputvalid = true;
					 var input=$(this).find('input[type="text"]');				 
					 
					 if(input.val().length <=0){					
						 inputvalid = false;
						 converteoLayer.push({'event': 'error', 'errorName': $(this).attr('data-required-text')});
						 if(!$(this).hasClass('error')){
						  $(this).addClass('error');
						  $(this).append('<span class="error-message" onclick="$(this).remove();">'+$(this).attr('data-required-text')+'</span>');
						 }
						
					 }
					 else if(input.hasClass('email')){
						 var emailvalue = input.val();
						 var regex={email: /^[\w.%+\-]+@[\w.\-]+\.[\w]{2,6}$/};				 
						 inputvalid = regex.email.test($.trim(emailvalue));
						 if(!inputvalid){
							 converteoLayer.push({'event': 'error', 'errorName': app.resources.EMAIL_ERROR});
							 $(this).append('<span class="error-message" onclick="$(this).remove();">'+app.resources.EMAIL_ERROR+'</span>');
						 }
						 else{
							 if(input.hasClass('confirmfriendsemail')){
								var inputfriendemail =  $('div.sendTo').find('input.friendsemail');
								var friendemail = inputfriendemail.val()
								 if(emailvalue != friendemail){
									 inputvalid = false;
									 converteoLayer.push({'event': 'error', 'errorName': app.resources.EMAIL_CONFIRM_ERROR});
									 $(this).append('<span class="error-message" onclick="$(this).remove();">'+app.resources.EMAIL_CONFIRM_ERROR+'</span>');
								 }
							 }						 
						 }				 
				 	}
					 
					 
				  if(inputvalid && $(this).hasClass('error')){
					 $(this).removeClass('error');
					 $(this).find('.error-message').remove();						 
				  }
				  
				  if(!inputvalid){
					  globalvalid=false;
				  }
			 });
			 
			 if(globalvalid){return true;}
			 else{return false;}
				 
				
			 });
		 
		 
};

Maje.product.showHidebtnZoom = function(){
	var eClass = {
			mainImg : '.zoomPup', 
			buttonZoom : '.zoomMain'
	};
	
	$(document).on('mouseleave', eClass.mainImg, function(event){
		event.preventDefault();
	}).on('mouseover', eClass.mainImg, function(event){
		event.preventDefault();
		$(eClass.buttonZoom).hide();
	}).on('mouseenter', eClass.mainImg, function(event) {
		$('.hoverTooltip, .hoverTooltip2').remove();
	});
	
		 $(document).on('click touchstart', eClass.buttonZoom, function(e){
			 e.preventDefault();
			// if((navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/iPad/i)!= null)){
				var urlImg = $('.productlargeimgdata').data("hiresimg").split('|');
				var btnClose = $(document.createElement('a')).addClass('closeZoom').text("");
				var contentZoom = $(document.createElement('div')).addClass('zoomBlock');
				var indexImgZoom = $(this).closest('.product-image-container').find('.thumb.selected').index();
				var createImg = $(document.createElement('img')).attr('src' , urlImg[indexImgZoom]);
				
				contentZoom
				.css({
					'height' : $(document).height(),
					'z-index' : '40000'
				})
				.append(btnClose)
				.append(createImg)
				.prependTo($('body'))
				.show();
				;
			//}
		 });
		 
		 // we close popin of zoom
		 $(document).on('click touchstart','.closeZoom', function(e){
				e.preventDefault();
				$(this).closest('.zoomBlock').remove();
			});
};
Maje.product.jqZoom = function(){
	var el = {
			zoomPad : '.product-image', 
			zoomWindow : '.zoomWindow',
			zoomPup : '.zoomPup'
	};
};
Maje.product.activeZoom = function(cssClass){
	  if(typeof window.orientation !== 'undefined'){
	   $(cssClass).css('display','block');
	  }else{
	   $(cssClass).css('display','none');
	  }
};
Maje.product.disable = function(){
	var el = {
			hoverTool2 : '.hoverTooltip2',
			hoverTool3 : '.hoverTooltip3',
			hoverTool4 : '.hoverTooltip4'
	}
		$(document).on('click tap touchstart', ":not(.hoverTooltip2.active)", function(){
			if($(el.hoverTool2).hasClass('active')){	
				$(el.hoverTool2).remove();
			}
		});
	$(document).on('click tap touchstart', ":not(.hoverTooltip3.active)", function(){
		if($(el.hoverTool3).hasClass('active')){	
			$(el.hoverTool3).remove();
		}
	});
	$(document).on('click tap touchstart', ":not(.hoverTooltip4.active)", function(){
		if($(el.hoverTool4).hasClass('active')){	
			$(el.hoverTool4).remove();
		}
	});
};

Maje.product.displayVideo = function () {
	$('#thumbnailsvideo.video').on({
		click: function(e) {
			e.preventDefault();
			var url_video = $(this).find('img').data('video').url;
			getMyVideo(url_video);
		}
	});
	
	$('.product-thumbnails li').on('click',function(){
		var videoCont = $('#myVideo');
		if (videoCont.length){
				videoCont.remove();
		}
	});
};

Maje.product.productSet = function () {

	$('.add-all-btn').on('click', function(e){
		e.preventDefault();
		if($('.product-list').html().length > 0){
			$(this).removeClass('empty');
			$('.product-list').addClass('show');
			$(this).hide();
			$(this).prev().toggleClass('show');
		}
	});
	$('.confirm-btn').on('click', function(e){
		e.preventDefault();
		$('.msg').addClass( "show");
		setTimeout(function(){
			$('.msg').removeClass( "show");
		 }, 3000);
	});
	$('.add-all-btn-group').on('click', function(e){
		e.preventDefault();
		$(this).closest('.product-set-details').next().find('.add-to-cart').trigger('click');
	});
	
	$('#add-all-to-cart-sticky').on('click', function(e){
		e.preventDefault();
		var totalproduct = $( "#product-set-list .product-set-item" ).length,
			totalProductSelected = 0;
		$( "#product-set-list .product-set-item" ).each(function() {
			if($(this).find('.swatches.size li').hasClass('selected')){
				totalProductSelected = totalProductSelected + 1;
			}
		});
		if(totalProductSelected == totalproduct){
			$('.ps-sticky').find('.error-message').addClass('hide');
			$(this).closest('.lookProducts').find('.product-col-1 #add-all-to-cart').trigger('click');
		} else{
			$('.ps-sticky').find('.error-message').removeClass('hide');
		}
	});

	$('.add-all-to-cart-list .iconClose').on('click', function(){
		$('.product-list').removeClass('show');
		$('.confirm').removeClass('show');
		$('.add-all-btn').show();
	})

	$('.sub-product-item.add-to-cart').on('click', function(){
		if($(this).closest('.product-set-details').find('.swatches.size li').hasClass('selected')){
		}
	});
	
	// Close the dropdown if the user clicks outside of it
	window.onclick = function(event) {
		if ($(event.target).closest('.product-list, .add-all-btn-group').length === 0) {
			$('.product-list').removeClass('show');
			$('.confirm').removeClass('show');
			$('.add-all-btn').show();
		}
		var MobileStock = $('.mobile-add-to-cart .in-Stock-add');
		if($(event.target).closest(MobileStock).length === 0){
			MobileStock.children('ul').removeClass('active');
		}else{
			MobileStock.children('ul').addClass('active');
		}
		/*
		if ($(event.target).closest('.swatches').length === 0) {
			$('.swatches.size .swatches').hide();
			$('.sub-product-item.buy').hide();
		}*/
	}
	$("#add-all-to-cart-sticky").click(function() {
		$('html, body').animate({
			scrollTop: $("#product-set-list").offset().top - 85
		}, 1000);
	});
	
}

Maje.home.vimeoplayerjs = function(){
	$('[data-controls-for-video]').each(function() {
		initPlayer($(this));
	});

	function initPlayer($controls) {
		var selector_for_players = $controls.data('controls-for-video'), 
			$vim_play = $controls.find('.vim_play'), 
			$vim_mute = $controls.find('.vim_mute'),
			$vim_pauseclik = $controls.closest('.video-wrapper');

		$( selector_for_players ).each(function() {
			var player = this;

			$(player).on('pause', function()  { $vim_play.addClass('active') });
			$(player).on('play', function()   { $vim_play.removeClass('active') });
			$(player).on('volumechange', function() {
				true === player.muted ? $vim_mute.addClass('active') :  $vim_mute.removeClass('active');
			});
		});

		$.merge($vim_play, $vim_pauseclik).on('click', function (e) {
			e.stopPropagation();
			e.preventDefault(); togglePlayback(selector_for_players);
		});
		$vim_mute.on('click', function (e) {
			e.stopPropagation();
			e.preventDefault(); toggleSound(selector_for_players);
		});
	}

	function togglePlayback(selector_for_players) {
		$( selector_for_players ).each(function() {
			var player = this;
			true === player.paused ? player.play() : player.pause();
		});
	}

	function toggleSound(selector_for_players) {
		$( selector_for_players ).each(function() {
			var player = this;
			player.muted = !player.muted;
		});
	}
};

resizeVideo = function(){
	
	    if($(window).width() < 767 && $('#myVideo').length > 0 ) { 
			jwplayer().resize(320,200); 
			if($('.product-primary-image').next('#myVideo').length !== 0){
				$('#myVideo').remove();
			}
			
	    } else if($(window).width() > 767 && $('#myVideo').length > 0){
	    	jwplayer().resize(460,472);
	    	if($('#video-dialog').find('#myVideo').length !== 0){
	    		$('.ui-dialog-titlebar-close').trigger('click');
	    	}			
	    }
	};
getMyVideo = function(urlvideo){
		var idMyVideo = $(document.createElement('div')).attr('id', 'myVideo');
		if ($(window).width() < 767){
			idMyVideo.appendTo($('#video-dialog'));
		}else{
			idMyVideo.insertAfter('.product-primary-image');
		}
		
		var heightPlayer, widthPlayer;
		
		if($(window).width() < 767 && $('#myVideo').length > 0 ) { 
		      heightPlayer = 180;
		      widthPlayer = 310;
		    } else if($(window).width() > 767 && $('#myVideo').length > 0){
		    	heightPlayer = 472;
			     widthPlayer = 460;
		    }
		
		jwplayer("myVideo").setup({
	        //file: "${URLUtils.staticURL('/upload/Costume_604327_9020_V3.mp4')}",
	        file: urlvideo,
	        width: widthPlayer,
	        height: heightPlayer,
	        autostart: true,
	        mute: true,
	        controls: false
	    });
		
		if($(window).width() < 1080){
			jwplayer().setControls(true);
		}
				
		$(window).on({
			resize : function(){
				if(!$('html').hasClass('ie8')){
					resizeVideo();
				}
			}
		});
	};
	Maje.footer.slideAssurance = function(){
		var widthW = 767;
		var blockToSlide = $('.reassuranceFooter');
		var itemVisible = $('.reassuranceFooter').find('li').not(':hidden');
		var lengthItem = itemVisible.length;
		var appendUl = $('<ul class="tapItem"></ul>');
		var classAppendUl = $('.tapItem');
		
		if($(window).width() < 767){
			var existUl = classAppendUl.length === 0;
				if(existUl){
					appendUl.insertAfter(blockToSlide);
				
				itemVisible.each(function(){
					var posItem = $(this).prev('li').outerWidth();
					$(this).css({
						'width' : $('#footer').outerWidth()
					});
				});
				
				blockToSlide.css('width', lengthItem * itemVisible.outerWidth());
				blockToSlide.addClass('swiper-wrapper').find('li').addClass('swiper-slide');
			
				var mySwiperFooter = $('.footerReassu').swiper({
					mode:'horizontal',
					pagination: '.tapItem',
					paginationClickable:false,
					loop: false
				});
			}
		}else{
			classAppendUl.remove();
			itemVisible.removeAttr('style');
			blockToSlide.removeAttr('style');
			blockToSlide.removeClass('swiper-wrapper').find('li').removeClass('swiper-slide');
			$('.reassuranceFooter').removeAttr('style'); 
		}
	};

	Maje.footer.menuHover = function(){
		
			var $footMenu = $('.menuFooter');
			var menuExpanded = false;
			var speedAnimate = 500;
			var heightExpan = 305;
			
			$footMenu.find("ul li .item-toggle").on("click", function() {
				if($(window).width() > 767){
					var that = $(this);
					var parentEl = $(this).parent("li");
					
					if(menuExpanded === false && !$(this).hasClass("hover")){
						var top = $(document).scrollTop() + heightExpan;
						$('html, body').stop(true).animate( { scrollTop: top }, speedAnimate );
							$footMenu.stop(true).animate({paddingBottom: heightExpan+'px'}, speedAnimate, function() {
							$footMenu.find("ul li").removeClass("hover");
							parentEl.addClass("hover");
							menuExpanded = true;
						});
							
					}else if(menuExpanded === true && !parentEl.hasClass("hover")){
						$footMenu.find("ul li").removeClass("hover");
						parentEl.addClass("hover");
					}else if(parentEl.hasClass("hover")){
						closeFooterMenu();
					}
				}
			});
			
			$footMenu.find("ul li .item-toggle").on("mouseenter", function() {
				if($(window).width() > 767){
					var that = $(this);
					var parentEl = $(this).parent("li");
					
					if(menuExpanded === true){
						$footMenu.find("ul li").removeClass("hover");
						parentEl.addClass("hover");
					}
				}
			});
			
			$(document).on("mouseup", function(e){
				var condition = $(e.target).parents("#footer").length;

				if(!condition){
					closeFooterMenu();
				}
			});
		
		
		function closeFooterMenu() {
			menuExpanded = false;
			$footMenu.find("ul li").removeClass("hover");
			$footMenu.stop(true).animate({paddingBottom: 0}, speedAnimate);
		}
		
		$(window).on("resize", function() {
			closeFooterMenu();
		});
	};
	

	Maje.footer.bottomPosition = function(){
		$(window).on("resize", function(){
			var windowH = $(window).height();
			var docH = $(document).height();
			var windowW = window.innerWidth;
			var bodyH = $("body").height();
			var footerH = $("#footer").height();
			
			if( bodyH <= windowH ){
				$("#footer").addClass("fixed");
				$("#wrapper").css("padding-bottom",footerH);
			}else {//if($("#footer").hasClass("fixed")){
				$("#footer").removeClass("fixed");
				$("#wrapper").css("padding-bottom",0);
			}
		}).resize();
	}

Maje.account.bindEvents = function(){
	Maje.account.hijackEnterKeyHitOnRegistrationForm();
	Maje.account.birthdateInit();
	Maje.account.moveNews();
	Maje.account.resize();
	Maje.account.tooltipError();
	Maje.account.hideLoginError();
	Maje.account.hover();
	Maje.account.click();
	Maje.account.repay();
};

Maje.account.hijackEnterKeyHitOnRegistrationForm = function(){
	var validateButtonSelector = "#RegistrationForm .apply";
	var validateButton = $(validateButtonSelector);
	if(validateButton.length > 0){
		$(document).on("keypress", function(e){
			
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13)
	        { 
				e.preventDefault();
	        	validateButton.trigger("click");
	        	e.stopPropagation();
	        }	    	
		});
	}
	
}

Maje.account.repay = function(){
	$(".order-repay-button").click(function(){
		var orderNo = $(this).attr('key');
		var dialogContainer = $(this).parent(".order-repay-button-section").find(".repaydialog");
		if($(dialogContainer).html().trim() == "") {
			
			var url = app.urls.showRepayDialog +'?orderno='+orderNo+'&format=ajax';
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'html'
			}).done(function (data) {
				$(dialogContainer).html(data);
				$(dialogContainer).show();
			});
		}
		else {
			$(dialogContainer).html("");
			$(dialogContainer).hide();
		}
		
		
	});
	
}


//function move block Newsletter
Maje.account.moveNews = function(){
	var el = {
		news : '.showNewsletterSubscription',
		account : '.pt_account',
		footer : '#footer'
	};
		

	// we move block of newsletter from homepage

		if($(window).width() < 767 && $(el.account).length === 1){
			if ($(el.footer).prev(el.news).length === 0){
				$(el.footer)
				.find(el.news)
				.clone()
				.insertBefore(el.footer);
			}
		}else{
	// we delete block of newsletter from homepage
			$('body')
			.find(el.footer)
			.prev(el.news)
			.remove();
		}
};
Maje.account.resize = function(){
	$(window).resize(function(){
		Maje.account.moveNews();
	});
};
Maje.account.birthdateInit = function(){
	
	function fillInBirthDateInput() {
		var  year = $('#birthdate-year-select').attr('value');
		var  month = $('#birthdate-month-select').attr('value');
		var  day = $('#birthdate-day-select').attr('value');
		
		if(year== "" && month == "" && day == ""){
			return;
		}
		
		if(year == ""){
			year = "1960"
		}
		if(month == ""){
			month = "1"
		}
		if(day == ""){
			day = "1"
		}
		
		var birthdate = day + "/" + month + "/" + year;
		
		if($('#dwfrm_profile_customer_birthday').length>0 && birthdate.length > 2){
			$('#dwfrm_profile_customer_birthday').val(birthdate);
		}
	};
	
	// init select when form save fail
	var monthText = $("#birthdate-month-select").text();
	var DayText   = $("#birthdate-day-select").text();
	var year = $('#dwfrm_profile_customer_smcp__year').val();
	var birthday = $('#dwfrm_profile_customer_birthday').val();
	var maps = new Array();
	maps[1] = 1948;
	maps[2] = 1952;
	maps[3] = 1956;
	maps[4] = 1964;
	maps[5] = 1968;
	maps[6] = 1972;
	maps[7] = 1976;
	maps[8] = 1984;
	maps[9] = 1988;
	maps[10] = 1992;
	maps[11] = 1996;
	maps[12] = 2004;
	
	$(document).on('change','#birthdate-year-select', function(e){
		e.preventDefault();
		
		var bys = $('#birthdate-year-select').val();
		
		$('#birthdate-month-select').empty();
		$('#birthdate-day-select').empty();	
		var month = "<option disabled value= >"+monthText+"</option>";
		var day = "<option disabled value=>"+DayText+"</option>";
		
		var j = 13;
		for (var i=1; i<j; i++){
			if(i<10){
				month += "<option value="+"0"+i+">"+i+monthText+"</option>"
			}else{
				month += "<option value="+i+">"+i+monthText+"</option>"
			}
		}

		$('#birthdate-month-select').append(month);
		$('#birthdate-day-select').append(day);
		$('#birthdate-month-select').val('');
		$('#birthdate-day-select').val('');

		
		$.each( maps, function(i, n){ 
			if( n == bys){
				$('#dwfrm_profile_customer_smcp__year').val(i);
			}
		});
		
		fillInBirthDateInput();
	});	
	
	$(document).on('change','#birthdate-month-select', function(e){
		e.preventDefault();
		var j = 29;
		var bys = $('#birthdate-year-select').val();
		var bms = $('#birthdate-month-select').val();
		var bds = $('#birthdate-day-select').val();
		
		$('#birthdate-day-select').empty();
		var day = "<option disabled value=>"+DayText+"</option>";
		
		if(bms == 1||bms == 3||bms == 5||bms == 7||bms == 8||bms == 10||bms == 12){
			j=32;
		}else if(bms == 4||bms == 6||bms == 9||bms == 11){
			j=31;
		}else if((bys%4) == 0 && bms == 2){
			j=30;
		}
		
		for (var i=1; i<j; i++){
			if(i<10){
				day += "<option value="+"0"+i+">"+i+DayText+"</option>"
			}else{
				day += "<option value="+i+">"+i+DayText+"</option>"
			}
		}
		
		$('#birthdate-day-select').append(day);
		
		$('#birthdate-day-select').val('');
		
		$.each( maps, function(i, n){ 
			if( n == bys){
				$('#dwfrm_profile_customer_smcp__year').val(i);
			}
		});
		
		fillInBirthDateInput();	
	});	
	
	$(document).on('change','#birthdate-day-select', function(e){
		e.preventDefault();					
		fillInBirthDateInput();		
	});	
	
	if(birthday != "" && birthday != undefined){
		var dateArray = new Array();
		dateArray = birthday.split('/');

		$('#birthdate-year-select option[value='+dateArray[2]+']').attr('selected','selected');
		
		$('#birthdate-year-select').change();

		$('#birthdate-month-select option[value='+dateArray[1]+']').attr('selected','selected');

		$('#birthdate-month-select').change();
		
		$('#birthdate-day-select option[value='+dateArray[0]+']').attr('selected','selected');
	}
	fillInBirthDateInput();
}

Maje.account.tooltipError = function(){
	var classE = {
		toolError : '.error-form',
		inputEmail : '#loginform .email-input'
	};
	if($(classE.toolError).length > 0){
		$(classE.toolError).css({
			'width' : $(window).width() > 767 ? '160px' : '90%',
			'margin' :$(window).width() > 767 ? '0' : '0 auto 7px',
			'padding' : '10px',
			'text-align' : 'center',
			'line-height' : '16px',
			'background' : '#b30c03',
			'color' : '#fff',
			'text-transform' : 'none',
			'height' : $(window).width() > 767 ? $(classE.toolError).outerHeight(true) : 'auto',
			'position' : $(window).width() > 767 ? 'absolute' : 'static',
			'top' : $(classE.inputEmail).position().top  - ($(classE.toolError).outerHeight(true) /2),
			'left' : $(classE.inputEmail).position().left - ($(classE.toolError).outerWidth() + 5)
		
		});
	}
	$(window).resize(function(){
		if($(classE.toolError).length > 0){
			$(classE.toolError).css({
				'width' : $(window).width() > 767 ? '160px' : '90%',
				'margin' :$(window).width() > 767 ? '0' : '0 auto 7px',
				'padding' : '10px',
				'text-align' : 'center',
				'line-height' : '16px',
				'background' : '#b30c03',
				'color' : '#fff',
				'text-transform' : 'none',
				'height' : 'auto',
				'position' : $(window).width() > 767 ? 'absolute' : 'static',
				'top' : $(classE.inputEmail).position().top  - ($(classE.toolError).outerHeight(true) /2),
				'left' : $(classE.inputEmail).position().left - ($(classE.toolError).outerWidth() + 5)
			
			});
		}
	});
};

Maje.account.hideLoginError = function() {
	$('#loginform .login-email input, #loginform .login-password input').focus(function(e) {
		$('#loginform .main-login-error').remove();
	});
}

/*
Maje.account.eventError = function(){
	var el = {
			loginEmail : '.login-email',
			errorMessage : '.error', 
			emailInput : '.email-input'
		};
		
	$("#dwfrm_login").validate({
		  invalidHandler: function(event, validator) {
		    var errors = validator.numberOfInvalids();
		    if (errors) {
		     if(errors >= 1){
		    	 if($(window).width() > 767){
		 			var offsetEmail = $(el.loginEmail).find(el.emailInput).offset();
		 			console.log(offsetEmail.top);
		 			console.log(offsetEmail.left);
		 			
		 			$(el.loginEmail).find(el.errorMessage)
		 			.css({
		 				'position' : 'absolute',
		 				'top' : offsetEmail.top + "px",
		 				'left' : offsetEmail.left + "px",
		 				'margin-left' : '0',
		 				'margin-top' : '0'
		 			});
		 		}
		     }
		    }
		    
		  }
		});
};

Maje.account.bindFocusBlurMobile = function() {
	$('.personal.create .input-text,.personal.create .input-text-pw').each(function() {
		if($(window).width() < 767 && $(this).val()) {
			$(this).closest('.tableRow').find('div:first label:first').hide();
		}
	});
	$('.personal.create .input-text,.personal.create .input-text-pw').focus(function() {
		if($(window).width() < 767) {
			$(this).closest('.tableRow').find('div:first label:first').hide();	
		}
	});
	$('.personal.create .input-text,.personal.create .input-text-pw').blur(function() {
		if($(window).width() < 767 && !$(this).val()) {
			$(this).closest('.tableRow').find('div:first label:first').css('display', 'inline');
		}
	});
};
*/
Maje.account.returnsHelper = function()
{
	var _returns = this;
	var urlReturn = "";
	var urlReturnDisplay = "";
	var msgErrorGeneric = "";
	var msgErrorQty = "";
	var msgErrorReason = "";
	var currentErrorMsg = "";
	
	this.init = function()
	{
		_returns.Items = new Array();
		
		var results = $("div.orderItems").eq(0);
		if(results.length > 0)
		{
			urlReturn = $(results).data("updatereturnurl");
			urlReturnDisplay = $(results).data("updatereturndisplayurl");
			msgErrorGeneric = $(results).data("errormessagegeneric");
			msgErrorQty = $(results).data("errormessageqty");
			msgErrorReason = $(results).data("errormessagereason");
		}
	}
	
	this.isDesktop = function()
	{
		return $(".hideinmobile-block").is(":visible");
	}
	
	this.isValid = function()
	{
		var nbZeroQties = 0;
		var qtiesAvailable = false;
		var results = this.isDesktop() ? $("div.orderItems > .infoBlock") : $("#table-order-summary .infoBlockMobile");
		if(urlReturn != "" && results.length > 0 && urlReturnDisplay != "")
		{
			for(i=0; i<results.length; i++)
			{
				var infoBlock = $(results[i]);
				var productID = infoBlock.data("productid");
				if(this.isDesktop())
				{
					if(infoBlock.next(".tableRow"))
					{
						var qtyToReturn = infoBlock.next(".tableRow").find("select.ReturnQty");
						if(qtyToReturn && qtyToReturn.length > 0)
						{
							if(qtyToReturn.val() > 0)
								qtiesAvailable = true;
							else if(qtyToReturn.val() <= 0)
								nbZeroQties++;
						}
					}
				}
				else
				{
					var qtyToReturn = infoBlock.parent().find("select.ReturnQty");
					if(qtyToReturn && qtyToReturn.length > 0)
					{
						if(qtyToReturn.val() > 0)
							qtiesAvailable = true;
						else if(qtyToReturn.val() <= 0)
							nbZeroQties++;
					}
				}
			}
			
			if((!qtiesAvailable) || (nbZeroQties == results.length))
			{
				currentErrorMsg = msgErrorQty;
				return false;
			}
		}
		
		var tmp_refundReason = this.isDesktop() ? $(".refundReason").val() : $(".refundReasonMobile").val();
		if(tmp_refundReason != "-10")
			return true;
		else if(tmp_refundReason == "-10")
			currentErrorMsg = msgErrorReason;
		else
			currentErrorMsg = msgErrorGeneric;
		
		return false;
	}
	
	this.displayErrorMessage = function()
	{
		$(".returnErrorMsg").html(currentErrorMsg);
	}
	
	this.extract = function()
	{
		var results = this.isDesktop() ? $("div.orderItems > .infoBlock") : $("#table-order-summary .infoBlockMobile");
		if(results.length > 0)
		{
			for(i=0; i<results.length; i++)
			{
				var infoBlock = $(results[i]);
				var productID = infoBlock.data("productid");
				if(this.isDesktop())
				{
					if(infoBlock.next(".tableRow"))
					{
						var qtyToReturn = infoBlock.next(".tableRow").find("select.ReturnQty");
						if(qtyToReturn && qtyToReturn.length > 0)
						{
							var obj = {};
							obj.productID = productID;
							obj.qtyToReturn = qtyToReturn.val();
							if(obj.qtyToReturn > 0)
								_returns.Items.push(obj);
						}
					}
				}
				else
				{
					var qtyToReturn = infoBlock.parent().find("select.ReturnQty");
					if(qtyToReturn && qtyToReturn.length > 0)
					{
						var obj = {};
						obj.productID = productID;
						obj.qtyToReturn = qtyToReturn.val();
						if(obj.qtyToReturn > 0)
							_returns.Items.push(obj);
					}
				}
			}
		}
	}
	
	this.update = function()
	{
		if(_returns.Items.length > 0)
		{
			var root = this;
			$.ajax({
				type : "POST",
				url: urlReturn,
				data: this.returnData(),
				datatype: "json"
			})
			.success(function(data, status, jqXHR) {
				if(data && data.Result == "OK")
					root.redirect(data.ID);
				else
					root.displayErrorMessage();
			})
			.error(function(e) {
				root.displayErrorMessage();
			});
		}
	}
	
	this.returnData = function()
	{
		var data = {};
		data.reason = this.isDesktop() ? $(".refundReason").val() : $(".refundReasonMobile").val();
		
		for(i=0; i<_returns.Items.length; i++)
		{
			data[_returns.Items[i].productID] = _returns.Items[i].qtyToReturn;
		}
		
		return data;
	}
	
	this.redirect = function(id)
	{
		if(id != null && id != "")
		{
			location.href = urlReturnDisplay + "&returnid=" + id;
		}
		else
			location.reload();
	}
	
	this.init();
	return _returns;
};

// function add maskLayer when hover My account in header
Maje.account.hover = function(){
	
	/*if(app.frontUtils.isTouchScreen){
		
		var menuTouchOpen = false
		$(".loginUserMaje").on("touchstart", function(e) {
			if(menuTouchOpen === false){
				e.preventDefault();
				menuTouchOpen = true;
			}
		});

		$(document).on("touchstart", function(e){
			var condition = $(e.target).parents(".loginUserMaje").length;

			if(!condition){
				menuTouchOpen = false
			}
		});
		
		$(document).on("touchstart", function(e){
			var condition = $(e.target).parents(".maskOnHover").length;
			
			if(!condition){
				if ($('#maskLayer').length) {
					$('#maskLayer').remove();
				}
			} else{
				if (!$('#maskLayer').length) {
					$('body').append( '<div id="maskLayer"></div>' );
				}
			}
		});
	} else {
		$('.userInfoHeader li.maskOnHover').on("mouseenter", function(){
			if (!$('#maskLayer').length) {
				$('body').append( '<div id="maskLayer"></div>' );
			}
		}).on("mouseleave", function() {
			if ($('#maskLayer').length) {
				$('#maskLayer').remove();
			}
		});
	}*/
}


//function add maskLayer when click My account in header
Maje.account.click = function(){
	
	$(document).on('click','.user-login,.user-account', function(event){
		event.stopPropagation();
		$("body").addClass("mini-login-show");
	})
	$(document).on('click','.mini-cart-total', function(event){
		event.stopPropagation();
		$("body").addClass("mini-cart-show"); 
	}) 
	/*$(".user-login,.user-account").on("hover",function(e){
		event.stopPropagation();
		$("body").addClass("mini-login-show");
	})
	$(".mini-cart-total").on("hover",function(e){
		event.stopPropagation();
		$("body").addClass("mini-cart-show");
	})*/
	
	$("#right-mask-layer").on("click",function(){
		$("body").removeClass("mini-login-show");
		$("body").removeClass("mini-cart-show");
	})
	$(".closePopContent").on("click",function(event){
		event.stopPropagation();
		$("#right-mask-layer").trigger('click');
	})

	
};

$(window).scroll(function () { 
	if ($(window).scrollTop() > 150) { 
		$("body").addClass("fixed-header");
	} 
	else { 
		$("body").removeClass("fixed-header");
	} 
}); 

Maje.home.bindMove = function(){
	Maje.home.moveNews();
};

//function move block Newsletter
Maje.home.moveNews = function(){
	var el = {
		news : '.showNewsletterSubscription',
		home : '.pt_storefront',
		push : '.smallPushes',
		homepage :'.homePage'
	};

	// we move block of newsletter from homepage

		if($(window).width() < 767){
			if (window.location.search.indexOf('newsletter=1') >= 0) {
				$('div.footerNewsletter').addClass('active');
			}
			if ($(el.homepage).children(el.news).length === 0){
				$(el.home)
				.find(el.news)
				.clone()
				.insertAfter(el.push);
			}
		}else{
	// we delete block of newsletter from homepage
			$(el.homepage)
			.find(el.news)
			.remove();
		}
};
Maje.home.resize = function(){
	$(window).resize(function(){
		Maje.home.moveNews();
	});
};

// Vimeo Player
Maje.home.VimeoPlayer = (function () {
	function VimeoPlayer(playerInDom, isBigPush) {
        this.isBigPush = isBigPush;
        this.playerInDom = playerInDom;
        this.vimeoPlayer = {
			hasResult : false,
			isDataPopulated : false,
			vimeoDataQuery : null,
			vimeoPlayerResponse : null,
			apiUrl:'https://vimeo.com/api/oembed.json'
		};
    }
	
    VimeoPlayer.prototype.getVimeoDataFromMarkup = function () {
    	var container = this.playerInDom;
    	var videoUrl = container.length > 0 ? container.attr("data-url") : "";
    	var auto = container.length > 0 ? (container.attr("data-autoplay")=="true") : false;
    	var data = {
    		url: videoUrl,
    		height : this.isBigPush ? 410 : 250,
    		width : this.isBigPush ? 960 : 470,
    		color : "cfff02",
    		title:false,
    		portrait:false,
    		autoplay:auto,
    		byline:false
    	};

    	this.vimeoPlayer.vimeoDataQuery = data;
    	this.vimeoPlayer.isDataPopulated = true;
    };
    
    VimeoPlayer.prototype.disableAutoplay = function () {
    	this.vimeoPlayer.vimeoDataQuery.autoplay=false;	
    };
    
    VimeoPlayer.prototype.getVimeoPlayer = function () {
    	var root = this;
    	if(this.vimeoPlayer.isDataPopulated){
    		$.ajax({
    			dataType: 'jsonp',
    			crossDomain: true,
    			data: root.vimeoPlayer.vimeoDataQuery,
    			url: root.vimeoPlayer.apiUrl
    		})
    		.done(function(data){
    			root.vimeoPlayer.vimeoPlayerResponse = data;
    			if(root.vimeoPlayer.vimeoPlayerResponse && root.vimeoPlayer.vimeoPlayerResponse.html){
    				root.vimeoPlayer.hasResult = true;
    				if(typeof(root.injectVimeoPlayer) === "function"){
    					root.injectVimeoPlayer(root.playerInDom, root.vimeoPlayer);
    				}						
    			}
    		})
    		.fail(function(){});
    	}
    };
    
    // CallBack
    VimeoPlayer.prototype.injectVimeoPlayer = function (playerInDom, vimeoPlayer) {
    	if(vimeoPlayer.hasResult){				
    		playerInDom.html(vimeoPlayer.vimeoPlayerResponse.html);
    	}
    };
    
    VimeoPlayer.prototype.displayVimeoPlayer = function () {
    	if(this.playerInDom.length > 0){				
			this.getVimeoDataFromMarkup();
			var root = this;
			
			$(window).resize(function(){
				
				if($('body').width() <= 767){
					if(root.isBigPush)
					{
						root.playerInDom.css({width:'310px', height:'205px'});
						root.vimeoPlayer.vimeoDataQuery.height = 205;
						root.vimeoPlayer.vimeoDataQuery.width = 310;
					}
					else
					{
						root.playerInDom.css({width:'153px', height:'126px'});
						root.vimeoPlayer.vimeoDataQuery.height = 126;
						root.vimeoPlayer.vimeoDataQuery.width = 153;
					}
				}
				else
				{
					if(root.isBigPush)
					{
						root.playerInDom.css({width:'960px', height:'410px'});
						root.vimeoPlayer.vimeoDataQuery.height = 410;
						root.vimeoPlayer.vimeoDataQuery.width = 960;
					}
					else
					{
						root.playerInDom.css({width:'470px', height:'250px'});
						root.vimeoPlayer.vimeoDataQuery.height = 250;
						root.vimeoPlayer.vimeoDataQuery.width = 470;
					}
				}
				
				root.disableAutoplay();				
				root.getVimeoPlayer();
			});
			
			if($('body').width() <= 767){
				if(this.isBigPush)
				{
					this.playerInDom.css({width:'310px', height:'205px'});
					this.vimeoPlayer.vimeoDataQuery.height = 205;
					this.vimeoPlayer.vimeoDataQuery.width = 310;
				}
				else
				{
					this.playerInDom.css({width:'153px', height:'126px'});
					this.vimeoPlayer.vimeoDataQuery.height = 126;
					this.vimeoPlayer.vimeoDataQuery.width = 153;
				}
			}
			else
			{
				if(this.isBigPush)
				{
					this.playerInDom.css({width:'960px', height:'410px'});
					this.vimeoPlayer.vimeoDataQuery.height = 410;
					this.vimeoPlayer.vimeoDataQuery.width = 960;
				}
				else
				{
					this.playerInDom.css({width:'470px', height:'250px'});
					this.vimeoPlayer.vimeoDataQuery.height = 250;
					this.vimeoPlayer.vimeoDataQuery.width = 470;
				}
			}

			this.playerInDom.show();
			this.getVimeoPlayer();
		}
    };
    
	return VimeoPlayer;
})();

/*
 * Block that load the video full screen on home page
 *  - Vimeo : Resize and adapt size
 *  - Jw Player : create player and load
 */
Maje.home.videoFullScreen = function(){
	var url_video = $("div#video").data("src-video");
	var vimeo_video = $("iframe[src^='//player.vimeo.com']");
	var _this = this;
	
	/*
	 * init events
	 */
	this.init = function() {
		
		if((url_video || vimeo_video) && $(window).width() >= 768 && $(".touch").length === 0){
			
			_this.hideBackgroundImage();
			
			if(url_video){
				_this.eventJwPlayer();
			}
			else if(vimeo_video){
				_this.resizeVideo();
			}
		}
	};

	/*
	 * Hide background image on the desktop site
	 */
	this.hideBackgroundImage = function() {
		$("div#image").css('display', 'none');
	}
	
	/*
	 * Load video with jw player
	 */
	this.eventJwPlayer = function() {
		
		jwplayer("video_fullscreen").setup({
	        file: url_video,
	        width: "auto",
	        height: "auto",
	        autostart: true,
	        mute: true,
	        controls: false,
	        repeat:true,
	        mute:true,
	        controlbar: 'none'
	    });
	};
	
	/*
	 * Resize video vimeo or youtube to adapte to user screen
	 */
	this.resizeVideo = function() {
		$(window).resize(function() {
			var height = $(window).height() - $("div#header").outerHeight();
			$('.block-homepage-video').css({
				height: height
			})
		}).resize();
	}

	this.init();
}

Maje.checkout.surchageCreditCardErrorMessage = function(){
	$.validator.messages.number = app.resources.NUMBER_ERROR;
}

Maje.checkout.shieldClicksFinalOrderButton = function() {
	$('#final-order-button').click(function(e) {
		e.preventDefault();
		
		Maje.checkout.hideShowBlockCreditCardSave(true);
		
		var domButtonElt = $(this)[0];
		if( $(domButtonElt.form).valid() ) {
			domButtonElt.disabled=true;
			domButtonElt.form.submit();
		}
	});
	
	
	$('#final-order-button-dup').click(function(e) {
		e.preventDefault();
		$('#dwfrm_billing #final-order-button').trigger('click');
	});
}

/* JQuery validate translation override */

$.extend($.validator.messages, {
	required: app.resources.VALIDATION_REQUIRED,
	email: app.resources.VALIDATION_EMAIL,
	maxlength: app.resources.VALIDATION_MAXLENGTH,
	minlength: app.resources.VALIDATION_PASSWORD
});

$.validator.addMethod("tel", function(value, element) {
	var tel = /^1\d{10}$/;
	return this.optional(element) || tel.test(value);
}, app.resources.VALIDATION_TELREGEX);

Maje.zoomProduct.bindEvents = function(){
	var el = {
		//imageZoom : '.main-image',
		closeCurrent : '.closeCurrent',
		//imgProduct : '.imgProduct',
		zoomPopin : '.zoomPopin', 
		//urlVideo : '.urlVideo a',
		zoomMain : '.zoomMain'
		//zoomAction : '.zoomAction'
	};
	var booleanZoom = false;

	$.fn.zoomProduct = function(){
		
		
		element = $(this);
		element.on('click',function(e){

			e.preventDefault();
			if($(this).closest('.thumb').hasClass('urlVideo')){
				e.stopPropagation();
			}
			
			if($(this).hasClass('zoomAction') || $(this).hasClass('zoomMain')){
				attrType = $(this).attr('class');
			}else{
				attrType = $(this).parent().attr('class');
			}
			
			booleanZoom = true;
			//console.log(booleanZoom);
			if(booleanZoom === true){
				removeElementPopin();
				// create popin
				createElementPopin('body');
				// event close popin
				closePopin();
				//getImageList Zoom
				//console.log(element);
				switch (attrType){
					case 'product-primary-image':
						getImageZoom();
						break;
					case 'zoomAction':
						getImageZoom();
					break;
					case 'imgProduct': 
						if($(this).hasClass('urlVideo')){
							var url_video = $(this).data('urlvideo');
							getMyVideo(url_video);
						}else{
							getImageZoom();
						}
						
						break;
					case 'thumb urlVideo':
						var url_video = $(this).data('urlvideo');
						getMyVideo(url_video);
						break;
					case 'zoomMain':
						var imgIndex = $(this).find('img').data('index');						
						getImageZoom(imgIndex);
					break;
				}
				// get Pinch
				if(!$('html').hasClass('ie8')){
					gesturePinch();
				}
					booleanZoom = false;
			}
		});
		
		/*
		if (!$('.touch').length){
			$('.main-image').jqzoom({
				zoomType: 'innerzoom',
				preloadImages: false,
				alwaysOn:false,
				title: false,
				xOffset: 0,
				yOffset: 0
			});
		}
		*/
		
		
	};
	
	createElementPopin = function(selectorBody){
		var parentDiv = $(document.createElement('div')).addClass('zoomPopin');
		var closeCurrent = $(document.createElement('div')).addClass('closeCurrent iconClose');	
		var metaViewport = $('html').find("meta[name='viewport']");
		var saveViewport = 'width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=2.0';
		metaViewport.attr('content', saveViewport);
		$('body').addClass('ZoomNoScroll');
		
		// create element of Popin 
		parentDiv
		.css({
			'height' :$(window).height(),
		})
		.appendTo(selectorBody)
		.append(closeCurrent);
	}
	closePopin = function(){
		$(el.closeCurrent).on('click', removeElementPopin);
		if ($(window).width() < 767){
			$(document).on('click', '.zoomPopin img', removeElementPopin);
		}else{
			$(document).on('click', '.zoomPopin img, .zoomPopin', removeElementPopin);
		}
		
	};
	
	removeElementPopin = function(){
		
		$('.zoomPopin').remove();
		$('body').removeClass('zoomPopin');
		$('body').removeClass('ZoomNoScroll');
		$('#wrapper').removeAttr('style');
		var metaViewport = $('html').find("meta[name='viewport']");
		var saveViewport = 'width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0';
		metaViewport.attr('content', saveViewport);
		$(document).scrollTop(0);
	};
	
	$('.zoomMain').on('click', function(){ 
		$('.img-product').attr('data-active', 0);
		$(this).find('.img-product').attr('data-active', 1);
	});
	
	getImageZoom = function(imgIndex){
		
 		var urlImg;
		if(window.innerWidth > 768){
			urlImg = $('.productlargeimgdata').data("zoomdesktop").split('|');
		} else {
			urlImg = $('.productlargeimgdata').data("zoommobile").split('|');
		}
		
		var swipopin =  $('<div class="Pop-swiper-container"><div class="swiper-wrapper"></div><div class="pagination"></div></div>'),
			swipopinCtl = $('<a class="arrowPop-left"></a><a class="arrowPop-right"></a>'),
			srcThumb = $('.thumb img');
			swipopinCtl.appendTo(swipopin);
			swipopin.appendTo('.zoomPopin');
		
		for(var i = 0; urlImg.length > i; i++){
			 //var createImg = $(document.createElement('img')).attr('src',urlImg[i]);
			if (urlImg[i].toLowerCase().indexOf(".mp4") === -1) {
				var createImg = $('<div class="swiper-slide noSwipingClass"><img src="'+urlImg[i]+'" id="img'+i+'" alt="sandro"/></div>');
 				createImg.appendTo('.zoomPopin .swiper-wrapper');
 				var createImg2 = $('<span class="swiper-pagination-switch"  id="img'+i+'" alt="sandro"/></span>');
			}
		}
		
		var initialIndex = imgIndex !== "undefined" ? imgIndex : 0;
		var vOrH;
		if(window.innerWidth > 768){
			vOrH = 'horizontal';
		} else {
			vOrH = 'vertical';
		}
		var PopinSwiper = new Swiper('.Pop-swiper-container',{
		    mode: vOrH,
		    loop: false,
	        initialSlide :initialIndex,
	        slidesPerView : 1,
	        pagination : '.pagination',
	        watchActiveIndex : true,
	        paginationClickable :true,
	        onInit: function(swiper){
	        	
	        	for(var i = 0; urlImg.length > i; i++){
	   			 //var createImg = $(document.createElement('img')).attr('src',urlImg[i]);
		   			if (urlImg[i].toLowerCase().indexOf(".mp4") === -1) {
		   				
		   				$('.zoomPopin .pagination span').each(function( i ) {
		   					$('.zoomPopin .pagination span').eq(i).css("background-image","url(" + urlImg[i] + ")");
		   				});
		   			}
	        	}
	        	
	        },
        	onSlideChangeEnd: function(swiper) {
 				if (swiper.activeIndex === 0) {
					$('.Pop-swiper-container .arrowPop-left').css({display: 'none'});
				} else {
					$('.Pop-swiper-container .arrowPop-left').css({display: 'block'});
				}
				if (swiper.activeIndex === swiper.slides.length - 1) {
					$('.Pop-swiper-container .arrowPop-right').css({display: 'none'});
				} else {
					$('.Pop-swiper-container .arrowPop-right').css({display: 'block'});
				}
        	},
			onFirstInit: function(swiper){
				
				if (swiper.activeIndex === 0) {
					$('.Pop-swiper-container .arrowPop-left').css({display: 'none'});
				} else {
					$('.Pop-swiper-container .arrowPop-left').css({display: 'block'});

				}
				if (swiper.activeIndex === swiper.slides.length - 1) {
					$('.Pop-swiper-container .arrowPop-right').css({display: 'none'});
				} else {
					$('.Pop-swiper-container .arrowPop-right').css({display: 'block'});
				}
        	},
			onFirstInit: function(swiper){
				
				if (swiper.activeIndex === 0) {
					$('.Pop-swiper-container .arrowPop-left').css({display: 'none'});
				} else {
					$('.Pop-swiper-container .arrowPop-left').css({display: 'block'});
				}
				if (swiper.activeIndex === swiper.slides.length - 1) {
					$('.Pop-swiper-container .arrowPop-right').css({display: 'none'});
				} else {
					$('.Pop-swiper-container .arrowPop-right').css({display: 'block'});
				}
				
	        	var newVideoButton = $('<div class="wrapper-linkVideoPlay"><span class="linkVideoPlay" data-label=""><span class="pictoPlay"></span><span class="text">播放视频</span></span></div>');
				//Show play video button
				if($('.productlargeimgdata').data('videourl')) {
					newVideoButton.appendTo('.Pop-swiper-container');
				}

			}
		});
			
			
		$('.Pop-swiper-container, #pgPop').on('click', function(event){
			event.stopPropagation();
		});
		
		$('.zoomPopin .wrapper-linkVideoPlay').on("click", function(event) {
			var idProduct = "pdpVideo";
			var idMyVideo = $('<div class="wrapper-prod-video"><div id="' + idProduct + '"></div></div>');
			var video = $(".productlargeimgdata").data("videourl");
			
			
			if (typeof video === undefined || video == '' || video == null) {
				return;
			}
			
			if($(".wrapper-prod-video").length == 0) {
				$(".Pop-swiper-container").append(idMyVideo);
				$(".Pop-swiper-container .swiper-wrapper").hide();
				$(".Pop-swiper-container .pagination").hide();
				
				jwplayer(idProduct).setup({
			        file: video,
			        aspectratio: "16:23.49",
			        width: "100%",
			        autostart: true,
			        mute: true,
			        controls: false
			    });

				if($(window).width() < 1080){
					jwplayer(idProduct).setControls(true);
				}

				$(window).on({
					resize : function(){
						if(!$('html').hasClass('ie8')){
							resizeVideo();
						}
					}
				});
				
				jwplayer(idProduct).onComplete(function() {
					$(".wrapper-prod-video").remove();
					$(".Pop-swiper-container .swiper-wrapper").show();
					$(".Pop-swiper-container .pagination").show();
		        });
				
			} else{
				
				$(".wrapper-prod-video").show();
				
				jwplayer(idProduct).play();
				
				jwplayer(idProduct).onComplete(function() {
					$(".wrapper-prod-video").remove();
		        });
			}
		});
		
		$('.zoomPopin .arrowPop-right').on('click', function(event){
			event.stopPropagation(); 
			var productName = $('.first-word').eq(0).text();
				dataLayer.push({
				    'event': 'product_page_event',
				    'pdp_event_type':'click arrow_pdp',
				    'product': productName
				});
			PopinSwiper.swipeNext();	
		});
		
		$('.zoomPopin .arrowPop-left').on('click', function(event){
			event.stopPropagation();
			var productName = $('.first-word').eq(0).text();
			dataLayer.push({
			    'event': 'product_page_event',
			    'pdp_event_type':'click arrow_pdp',
			    'product': productName
			});
			PopinSwiper.swipePrev();
		});
 
	};
	
	
	getMyVideo = function(urlvideo){
		var idMyVideo = $(document.createElement('div')).attr('id', 'myVideo');
		var myVideo = "";
		if ($(window).width() < 769 || $('.touch').length){
			idMyVideo.appendTo('.swiper-slide-active');
		}else{
			idMyVideo.appendTo('.product-primary-image');
		}
		
		if($('#myVideo').length <= 0 && $('#video-dialog').length > 0){
			var myVideo = "video-dialog";
		}else if ($('#myVideo').length > 0){
			var myVideo = "myVideo";
		}
		
		//if(myVideo !== ""){
		
			if($(window).width() < 767) { 
				heightPlayer = 200;
				widthPlayer = 320;
		    } else if($(window).width() > 767){
		    	heightPlayer = 466;
			    widthPlayer = "69%";
		    }
			
			jwplayer("myVideo").setup({
		        file: urlvideo,
		        width: widthPlayer,
		        height: heightPlayer,
		        autostart: true,
		        mute: true,
		        controls: false
		    });
			
			setTimeout(function() { 
			    jwplayer().pause();
			    jwplayer().setMute(false);
			    jwplayer().setControls(true);
				
			   	$('.zoomPopin').height($('html').height());
			
			},1000);
		//}
	}

	gesturePinch = function(){
		/*var dom = (($.support.chrome)||($.support.safari)) ? document.body : document.documentElement,
		_width = parseInt($(el.zoomPopin).css('width')),
		vel = 5.0,
		min = 320,
		max = 1500,
		scale;

		dom.addEventListener("gesturechange", gestureChange, false);
		dom.addEventListener("gestureend", gestureEnd, false);

			function gestureChange(e) {
			
			    e.preventDefault();
			    scale = e.scale;
			    var tempWidth = _width * scale;
			
			    if (tempWidth > max) tempWidth = max;
			    if (tempWidth < min) tempWidth = min;
			
			    $(el.zoomPopin).css({
			        'width': tempWidth + 'px',
			        'height': tempWidth + 'px'
			    });
			}

			function gestureEnd(e) {
			
			    e.preventDefault();
			    _width = parseInt($(el.zoomPopin).css('width'));
			}
			
			var metaViewport = $('html').find("meta[name='viewport']");
			var saveViewport = 'width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0';
			metaViewport.attr('content', saveViewport);*/
	};
	
	scrollHeight = function(){
		$(window).scroll(function(){
			//$('.zoomPopin').css('height', $('body').height());
		});
	}
	// create zoom 
	
		//$(el.imageZoom).zoomProduct();
		//$(el.urlVideo).zoomProduct();
		//$(el.zoomAction).zoomProduct();
		//$(el.imgProduct).find('img').zoomProduct();
		$(el.zoomMain).zoomProduct();
	
	
	var attrV5 = $(el.imgProduct).find('img[src*="V_5"]').length;
	var existVideo = $('#thumbnails').find('.urlVideo').length;
	var urlVideoMobile = $('#thumbnails').find('.urlVideo').find('a').attr('data-urlvideo');
	
	if(existVideo){
		if(attrV5){
			$(el.imgProduct).find('img[src*="V_5"]')
			.addClass('urlVideo')
			.attr('data-urlvideo', urlVideoMobile);
		}		
	}
	
	resizeVideo = function(){
	    if($(window).width() < 767 && $('#myVideo').length > 0 ) { 
	      jwplayer().resize(320,200); 
	    } else if($(window).width() > 767 && $('#myVideo').length > 0){
	      jwplayer().resize("69%",466);
	    }
	}

	$(window).resize(function(){
		if(!$('html').hasClass('ie8')){
			resizeVideo();
		}
	});
	scrollHeight();
	
	$('.imgProduct').on('click', function(e){
		if ($(window).width() < 767 || $('.touch').length){
			e.preventDefault();
			if ($(this).find('img').data('videourl')){
				$('#thumbnailsvideo a').trigger('click');
			}else{
				$('.zoomMain').trigger('click');
			}
			
		}
	});

};

Maje.giftpage.filters = function () {
	
	$('.gift-page-categories').on('change', function() {
		var link = ($(this).find(":selected").data('link'));
		var style = $('.gift-page-style').find(":selected").val();
		var categorySelect = $(this).find(":selected").val();
		if(categorySelect == "" && style == ""){
			window.location = $('.no-filter').attr('href');
		} else {
			var data = style != null ? {format: 'ajax', prefn1 : 'maje_gift_styles',  prefv1 : style, isGiftPage : true} : {format: 'ajax', isGiftPage : true};
			app.progress.show($("#main").find(".search-result-content")); 
			$.ajax({
				url : link,
				method: "GET",
				data: data,
				success : function(response) {
					$('.search-result-content').html(response);
					app.progress.hide();
				},
			});
		}
	});
	
	$('.gift-page-style').on('change', function() {
		var styleSelected = ($(this).find(":selected").val());
		var link = $('.gift-page-categories').find(":selected").data('link');
		var categorySelect = $('.gift-page-categories').find(":selected").val();
		if(categorySelect == "" && styleSelected == ""){
			window.location = $('.no-filter').attr('href');
		} else {
			var data = styleSelected != null ? {format: 'ajax', prefn1 : 'maje_gift_styles',  prefv1 : styleSelected, isGiftPage : true} : {format: 'ajax', isGiftPage : true};
			app.progress.show($("#main").find(".search-result-content")); 
			 $.ajax({
					url : link,
					method: "GET",
					data: data,
					success : function(response) {
						$('.search-result-content').html(response);
						app.progress.hide();
					},
				});
		}
		
	});
};

Maje.product.Share = function(){
	
	var QRUrl = encodeURI(window.location.href);

	var windowURl = encodeURIComponent(window.location.href);		
	var WbText = encodeURIComponent($('#hidetext').attr("data-Prefix")+$('.productSubname').text()+$('#hidetext').attr("data-suffix"));
	
	
	$('.wechat_share').click(function(){
		
		$('#wechat_qrcode_dialog').css('display','block');			
		$("#wechat_QR_box").empty();			
		$("#wechat_QR_box").qrcode({
			render: "canvas",
			width: 205,
			height:205,
			text: QRUrl
		});	
	});
	
	$('.weixin_popup_close').click(function(){		
		$('#wechat_qrcode_dialog').css('display','none');
		$("#wechat_QR_box").empty();			
	});
	
	$('.weibo_share').click(function(){
		var WbPic = encodeURIComponent($(".productSlide").find(".primary-image").eq(0).attr("src"));
		var weiboShareUrl = 'https://service.weibo.com/share/share.php?url='+windowURl+'&title='+WbText+'&appkey=1714730876&pic='+WbPic+'&searchPic=true';
		
		window.open(weiboShareUrl,"_blank")	
	});	
};


Maje.giftpage.bindEvents = function(){
	Maje.giftpage.filters();
};

Claudie.newsletter.livechat = function(E){
	
	var url = E.getAttribute("data-url");
	$.ajax({
		url : url,
		success : function (response) {
			var userInfo = jQuery.parseJSON(response);
			NTKF_PARAM = {siteid:"sm_1000",settingid:"sm_1003_9999",uid:userInfo.uid,uname:userInfo.uname,isvip:userInfo.isvip,userlevel:"1",erpparam:"abc"};
			NTKF.im_openInPageChat('sm_1003_1542163361758');
		},	
		error : function () {				
			NTKF_PARAM = {siteid:"sm_1000",settingid:"sm_1003_9999",uid:"",uname:"",isvip:"0",userlevel:"1",erpparam:"abc"};
			NTKF.im_openInPageChat('sm_1003_1542163361758');
		}
	});
	
};

Maje.login.bindEvents = function(){
	var date  =  new Date();
	$('#button2').click(function(){
		var lp = $(this).closest('div').find("input[name$=password]").val();
		var remembermeStatus = $(this).closest('div').find("input[name$=rememberme]").attr("checked");
		if(remembermeStatus == 'checked'){
			date.setFullYear(9999,12,30);
			var cookieDate = date.toUTCString();
			document.cookie = "signPw="+lp+";expires= "+cookieDate+"";
		}else{
			document.cookie = "signPw=;expires=" + date.toGMTString();
		}
	});
	$('#connection').click(function(){
		var lp = $(this).closest('div').siblings('.login-box').find("input[name$=password]").val();
		var remembermeStatus = $(this).closest('div').siblings('.login-box').find("input[name$=rememberme]").attr("checked");
		if(remembermeStatus == 'checked'){
			date.setFullYear(9999,12,30);
			var cookieDate = date.toUTCString();
			document.cookie = "signPw="+lp+";expires= "+cookieDate+"";
		}else{
			document.cookie = "signPw=;expires=" + date.toGMTString();
		} 
	});	
};

Claudie.product.crossSell = function(){
	
	/*var mySwiper = new Swiper('.recommendation.swiper-container', {
    	nextButton: '.recommendation-swiper-button-next',
        prevButton: '.recommendation-swiper-button-prev',
        slidesPerView: 2,
        loop: true,
        centeredSlides: true,
        spaceBetween: 0
	});*/
	
	$(".crossSell ul li ul.swatch-list li:not(.SizesTab)").click(function(){
		if($(this).hasClass("unvailable") || $(this).hasClass("SizesTab")){
			return false;
		}else{		
			var pid = $(this).data("productid")
			var data = "cartAction=add&pid="+pid;
			
			app.cart.update(data, function (response) {

				app.minicart.show(response);

				// Show message of validation in popup for the lookbook page
				if($("#popup-message-valideAddToCart").length > 0) {
					Maje.lookbook.showPopupValideAddToCart();
				}
				
				//Maje.minicart.bindEvents();
				app.progress.hide();
				if(window.innerWidth < 768){
					thisElement.closest('.product-variations').removeClass('show-size');
					thisElement.closest('.product-set-item').find('.buy').hide();
				}
			});
		};		
	});	
};

Claudie.product.advertising = function(){
	
	window.plp_advertising = window.plp_advertising || {};
	
	var mobile = $( document ).outerWidth() < 768;
	if(mobile){
		var ll = $(".for-mobile .btn-changegrid");
	}else{
		var ll = $(".for-desktop .btn-changegrid");
	};
	
	var value = -1;
	for ( var i = 0; i < ll.length; i++) {
		if($(ll[i]).hasClass("selected")){
			value = $(ll[i]).html();
			break;
		};
	};
	
	if(mobile){
		appendToLocationFive();
	}else{
		switch (value) {
			case "2": 
				appendToLocationThree();
				break;
			case "4":
				appendToLocationSix();
				break;
			case "6":
				appendToLocationNine();
				break;
		};	
	};

	function appendToLocationFive(){
		$(".grid-tile.plp_advertising").remove();
		$("#search-result-items li.grid-tile").eq(3).after(plp_advertising);
	};
	function appendToLocationThree(){
		$(".grid-tile.plp_advertising").remove();
		$("#search-result-items li.grid-tile").eq(1).after(plp_advertising);
	};
	function appendToLocationSix(){
		$(".grid-tile.plp_advertising").remove();
		$("#search-result-items li.grid-tile").eq(4).after(plp_advertising);
	};
	function appendToLocationNine(){
		$(".grid-tile.plp_advertising").remove();
		$("#search-result-items li.grid-tile").eq(7).after(plp_advertising);
	};
};

Claudie.utils.ismobile = function(){
	var width = window.screen.availWidth;
	var height = window.screen.availHeight;
	
	// 320*568 iphone 5/SE
	if(width == 320 && height == 568){
		return true;
	}else if(width == 375 && height == 667){ // 375*667 iphone 6/7/8
		return true;
	}else if(width == 414 && height == 736){ // 414*736 iphone 6/7/8 Plus
		return true;
	}else if(width == 375 && height == 812){ // 375*812 iphone X 
		return true;
	}else{
		return false;
	};
	
	return false;
};

Claudie.footer.popupSizeGuide = function(){
	
		$(document).on("click", "a.sizeguide", function(){	
			$("#sizeGrid").dialog({
				width: ($(window).width() >= 980 ? 395 : 320),
				dialogClass: "sizeGrid",
				closeText: app.resources.CLOSE,
				draggable: false,
				title: app.resources.sizeGuide,
				close: function(){$('.greyLayer').remove();}
			});		
			$('body').append('<div class="greyLayer"></div>');
		});	
};

Claudie.plpProduct.bindEvents = function(){

	Claudie.product.toggleImage();
	
	Claudie.plpProduct.switchColor();
	
	Claudie.plpProduct.switchSize();
	
	Claudie.plpProduct.addToCartPLP();
	
	Claudie.plpProduct.loadMoreProducts();

};

Claudie.plpProduct.switchColor = function(){
	
	$(".product-colors .swatch-list li").click(function(e){
		e.stopPropagation();
		e.preventDefault();
				
		var selectColor = $(this).children("a")[0].dataset.colorValue;
		var _this = $(this);

		var result = Claudie.plpProduct.replaceImage(selectColor, _this);
		//  var result = true;
		if(result){
			_this.siblings().removeClass("selected");
			_this.addClass("selected");
			//_this.parents("div.product-colors").siblings("div.product-sizes").find("li").removeClass("selected");
			
		};
		
		$(this).parents("div.product-colors").siblings("div.product-sizes").find("ul").empty();
		
		var data_products = $(this).parents("li.grid-tile").data("product");
		
		var products = [];
		for ( var i in data_products) {		
			if(selectColor == (data_products[i].color)){
				if((data_products[i].onStock) == "y"){
					var li = "<li class=\"size\"><a href=\"javascript:void(0);\" data-size-value="+data_products[i].size+" title="+data_products[i].sizeDisplayValue+">"
								+data_products[i].sizeDisplayValue+"</a></li>";
					$(this).parents("div.product-colors").siblings("div.product-sizes").find("ul").append(li);
				}else{
					var li = "<li class=\"size unavailable\"><a href=\"javascript:void(0);\" data-size-value="+data_products[i].size+" title="+data_products[i].sizeDisplayValue+">"
								+data_products[i].sizeDisplayValue+"</a></li>";
					$(this).parents("div.product-colors").siblings("div.product-sizes").find("ul").append(li);
				};			
			};
		};
		
		Claudie.product.toggleImage();
		
	});
	
}

Claudie.plpProduct.replaceImage = function(selectColor, _this){
	
	var data_products = _this.parents("li.grid-tile").data("product");
	var productImg = _this.parents("div.quick-actions").siblings("div.product-image").find("img");
	var pdpUrl = _this.parents("div.quick-actions").siblings("div.product-image").find("a.thumb-link");
	var product = {};
	for ( var i in data_products) {		
		if(selectColor == data_products[i].color){
			product = data_products[i];
			break;
		};
	};
	var images = product.imagesURL.split(',');
		productImg[0].src  = images[0];
		pdpUrl[0].href = product.pdpUrl;

	return true;
};


Claudie.plpProduct.switchSize = function (){
	
	$(document).on("click", ".product-sizes .swatch-list li", function(e){
		e.stopPropagation();
		e.preventDefault();

		var selectColor = $(this).parents("div.product-sizes").siblings("div.product-colors").find("li.selected");

		if(selectColor.length < 1){
			
			return false;
		}
		
		var notSelect = $(this).hasClass("unavailable");
		if(notSelect){
			
			return false;
		};
		
		var selectSize = $(this).find("a")[0].dataset.sizeValue;
		var _this = $(this);

		var result = true;
		
		if(result){
			_this.siblings().removeClass("selected");
			_this.addClass("selected");
			
		};
	});
	
}
	
Claudie.plpProduct.addToCartPLP = function(){
	
	$(".quick-actions .AddToCartPLP").click(function(){
		
		var selectColor = $(this).parent().siblings("div.product-colors").find("li.selected");
		var selectSize = $(this).parent().siblings("div.product-sizes").find("li.selected");
				
		if(selectColor.length < 1){
			
			return false;

		}else if(selectSize.length < 1){	

			return false;
		};

		var colorValue = selectColor.find("a")[0].dataset.colorValue;
		var sizeValue = selectSize.find("a")[0].dataset.sizeValue;

		var data_products = $(this).parents("li.grid-tile").data("product");
		
		var product = {};
		for ( var i in data_products) {	
			if((colorValue == data_products[i].color) && (sizeValue == data_products[i].size)){
				product = data_products[i];
				break;
			};
		};
		
		var pid = product.id;
		var data = "cartAction=add&pid="+pid;
		
		app.cart.update(data, function (response) {

			app.minicart.show(response);

			// Show message of validation in popup for the lookbook page
			if($("#popup-message-valideAddToCart").length > 0) {
				Maje.lookbook.showPopupValideAddToCart();
			}
			
			//Maje.minicart.bindEvents();
			app.progress.hide();
			if(window.innerWidth < 768){
				thisElement.closest('.product-variations').removeClass('show-size');
				thisElement.closest('.product-set-item').find('.buy').hide();
			}
		});
		
		
	});
		
};	

Claudie.product.toggleImage = function(){

	var imgProduct = $(".search-result-items li.grid-tile");

	if(imgProduct.length > 0){
		imgProduct.each(function() {
			
			// Filter plp_advertising
			if($(this).hasClass("plp_advertising")){
				return false;
			};
			var el = $(this);

			var imgSRC = el.find("img");
			var rolloverIndex = imgSRC.data('rolloverindex');
			var canHover = true;

			if (el.find(".vignette.backSoon").length > 0 || el.find(".vignette.soldOut").length > 0) {
				el.find(".wrapper-vignette").remove();
			}
			else {
				
				var data_products = $(this).data("product");
				var product = {};
				var selectedColor = $(this).find(".product-colors li.selected").hasClass("selected");
				if(selectedColor){
					selectColor = $(this).find(".product-colors li.selected a")[0].dataset.colorValue;
					for ( var i in data_products) {		
						if(selectColor == (data_products[i].color)){
							product = data_products[i];
							break;
						};
					};
				};

				if(Object.keys(product).length == 0){
					product = data_products[0];
				};

				if(el.find(".vignette.backSoon, .vignette.topseller, .vignette.comingsoon, .vignette.lastpiece, .vignette.new, .vignette.productBadge").length > 0){
					el.find(".0").css({"top" : 24 + "px"});
				}

				if (typeof product !== "undefined" && product !== null && product !== "") {

					var imgURL = product.imagesURL.split(",");
					var imgURLlength = imgURL.length - 1;
					var current = 0;
					var imgVideo = product.videoURL;
					var video = "";

					for (var i=0; i < imgURL.length; i++){
						//Preload image
						new Image().src = imgURL[i];
					}

					if (typeof imgVideo !== "undefined" && imgVideo !== null && imgVideo !== "") {
						video = imgVideo.replace(".jpg", ".mp4");
						el.find(".product-play-video").addClass("on");
					}else{
						el.find(".product-play-video").addClass("close");
						el.find(".wrapper-vignette").addClass("close");
					}

					if (!el.hasClass("grid-tile-rupture")) {
						if(el.find(".product-image .grid-tile-left").length < 1){
							el.find(".product-image").prepend("<span class='grid-tile-left'></span><span class='grid-tile-right'></span>");
						}
					}

					function displayArray() {
						if (el.find("#myVideo" + el.index()).length > 0) {
							el.find(".wrapper-prod-video").remove();
						}
					}
					displayArray();

					el.find(".grid-tile-left").on('click', function(){
						if(current != 0){
							current = current-1;
							imgSRC.attr("src", imgURL[current]);
							displayArray();
						} else if (current == 0){
							current = imgURLlength;
							imgSRC.attr("src", imgURL[current]);
							displayArray();
						}
					});
					el.find(".grid-tile-right").on('click', function(){
						if(current != imgURLlength){
							current = current+1;
							imgSRC.attr("src", imgURL[current]);
							displayArray();
						} else if(current == imgURLlength) {
							current = 0;
							imgSRC.attr("src", imgURL[current]);
							displayArray();
						}
					});
				}

				el.not('.grid-tile-rupture').on("mouseenter", function() {
					
					if(current == 0){
						if (rolloverIndex) {
							current = rolloverIndex;
						} else {
							current = 1;
						}
						if (imgURL && imgURL[current]) {
							imgSRC.attr("src", imgURL[current]);
						}
						displayArray();
					}
					
				});

				el.not('.grid-tile-rupture').on("mouseleave", function() {
					var  lastUrlIndex = (imgURL.length - 1);
								
					if(current != 0 && canHover === true){
						current = 0;
						imgSRC.attr("src", imgURL[current]);
						displayArray();
						canHover = true;
					}
					
				});
				
				el.find(".product-play-video.on").on("click", function() {

					$(this).siblings(".thumb-link").hide();
					
					var idProduct = "myVideo" + el.index();
					var idMyVideo = $('<div class="wrapper-prod-video"><div id="' + idProduct + '"></div></div>');

					var link = el.find(".product-image a.thumb-link").attr('href');

					setTimeout(function(){
						el.find(".wrapper-prod-video").on("click", function() {
							window.location.href = link;
						});
					}, 50);

					$(this).toggleClass("pause");

					if(el.find(".wrapper-prod-video").length == 0){

						canHover = false;
						el.find(".product-image").prepend(idMyVideo);

						jwplayer(idProduct).setup({
					        file: video,
					        aspectratio: "16:23.49",
					        width: "100%",
					        autostart: true,
					        mute: true,
					        controls: false
					    });

						if($(window).width() < 1080){
							jwplayer(idProduct).setControls(true);
						}

						$(window).on({
							resize : function(){
								if(!$('html').hasClass('ie8')){
									resizeVideo();
								}
							}
						});
						
					jwplayer(idProduct).onComplete(function() {
							el.find(".wrapper-prod-video").hide();
							$(".product-play-video.on").removeClass("pause");
							canHover = true;
							el.find(".thumb-link").show();
				        });
						
					} else{
						el.find(".wrapper-prod-video").show();
						jwplayer(idProduct).play();
						canHover = false;

						jwplayer(idProduct).onComplete(function() {
							el.find(".wrapper-prod-video").hide();
							canHover = true;
				        });
					}
				});

			}
		});
	}

	$(document).on("mouseenter", ".product-swatches .swatch-list a.swatch", function (e) {
		e.preventDefault();
		var tile = $(this).closest(".grid-tile");
		var thumb = tile.find(".product-image a.thumb-link img").filter(":first");
		var swatchImg = $(this).children("img").filter(":first");
		var data = swatchImg.data("thumb");
		var current = thumb.data('current');
		var colorName = swatchImg.data('colorname');

		if(!current) {
		    thumb.data('current',{src:thumb[0].src, alt:thumb[0].alt, title:thumb[0].title});
		}

		thumb.attr({
			src : data.src,
			alt : data.alt,
			title : data.title
		});

		if (colorName != null) {
			tile.find('.vignette').each(function() {
				$(this).removeClass('active');
			});
			var selectedVignette = tile.find('.vignette.'+colorName);
			selectedVignette.addClass('active');

		}
	});

	$(document).on("mouseleave", ".product-swatches .swatch-list a.swatch", function (e) {
		var tile = $(this).closest(".grid-tile");
		var swatchImg = $(this).children("img").filter(":first");
		var colorName = swatchImg.data('colorname');
		if (colorName != null) {
			tile.find('.vignette').each(function() {
				if ($(this).hasClass('default')) {
					$(this).addClass('active');
				} else {
					$(this).removeClass('active');
				}
			});
		}
	});

};

Claudie.footer.animateElementOnScroll = function() {
    function e() {
        $.each(t,
        function(e, t) {
            $(t).offset().top - $(window).scrollTop() < i && $(t).addClass("trigger-animation")
        })
    }
    var t = $(".product-tile").not(".annime-me"),
    i = $(window).height() - $(window).height() / 10;
    e(),
    $(window).on("scroll",
    function(t) {
        e()
    })
};

Claudie.plpProduct.loadMoreProducts = function (){
	
	$(document).off("click", ".pagination__more, .pagination__all");
	
	$(document).on("click", ".pagination__more, .pagination__all", function(){
		var gridUrl = $(this).data("new-url")+"&format=page-element";
			$.ajax({
				type: "GET",
				dataType: 'html',
				url: gridUrl,
				beforeSend:function(){
					$("body").addClass("show-loader");
				},
				success: function(response) {
					// update UI
					$(".search-result-options-loadMore").remove()
					$('div.search-result-content').append(response);					
					Claudie.plpProduct.bindEvents();
					Claudie.footer.animateElementOnScroll();
					$('.pagination__progress').css('width', loadMoreModule.styleWidth + "%");
				},
				complete:function(){
					$("body").removeClass("show-loader");
				}
			});						
	});
	$('.pagination__progress').css('width', loadMoreModule.styleWidth + "%");
};


Claudie.plpProduct.loadSearchSuggestionMoreProducts = function (){
	
	$(document).on("click", ".pagination__more", function(){
		var gridUrl = $(this).data("new-url")+"&format=page-element";
		var requestGridUrl = gridUrl.replace("Search-Show","SearchResult-SuggestionShow");
			$.ajax({
				type: "GET",
				dataType: 'html',
				url: requestGridUrl,
				beforeSend:function(){
					$("body").addClass("show-loader");
				},
				success: function(response) {
					// update UI
					$(".search-result-options-loadMore").remove()
					$('div.search-result-content').append(response);					
					Claudie.plpProduct.bindEvents();
					Claudie.footer.animateElementOnScroll();
					$('.pagination__progress').css('width', loadMoreModule.styleWidth + "%");
				},
				complete:function(){
					$("body").removeClass("show-loader");
				}
			});						
	});
	$('.pagination__progress').css('width', loadMoreModule.styleWidth + "%");
	
	$(document).on("click", ".pagination__all", function(){
		var requestUrl = $(this).data("new-url")
		window.location.href = requestUrl;
	});
};


jQuery("#HeaderSearch").find("#qA").bind("input propertychange",function(){
	var url = app.util.ajaxUrl(app.urls.searchSuggestionShow);
	
	var searchValue = $(this).val();
	if(searchValue.length != 0) {
        if(searchValue.match(/^[\u4e00-\u9fa5]+$/)){
        	var requestUrl = url + '&q=' + searchValue;
        	searchSuggestionResultShow(requestUrl);
	    } else{
	    	if(searchValue.length > 3){ 
	    	    var requestEnglishUrl = url + '&q=' + searchValue;
	        	searchSuggestionResultShow(requestEnglishUrl);  
	    	}
	    } 
	}else {
		jQuery(".search-suggestion-results").remove();
		jQuery(".no-suggestions-result").remove();
        jQuery("#main").show();
        jQuery("#footer").show();
	}
});


function searchSuggestionResultShow(url){
	$.ajax({
		url: url ,
		method: "POST",
		dataType:"html",
		beforeSend:function(){
			$("body").addClass("show-loader");
		},
	    success: function(data) {
	    	$("body").removeClass("show-loader");
	    	jQuery(".search-suggestion-results").remove();
	    	jQuery(".no-suggestions-result").remove();
	    	jQuery("#header").after(data);
            jQuery("#main").hide();
            jQuery("#footer").hide();
            jQuery(".search-suggestion-results").find(".refinement-header").hide();
                
            Claudie.footer.animateElementOnScroll();
            if(jQuery(".search-suggestion-results").length > 0){
                Claudie.plpProduct.loadSearchSuggestionMoreProducts();
            }
            Claudie.product.toggleImage();
                
            if ($(window).width() < 769){
            	$("#HeaderSearch-bg").removeClass('current');
            	$("#HeaderSearch").removeClass('current');
            }
	
	    },
	    complete:function(){
			$("body").removeClass("show-loader");
		},
	    error: function(){
	    	
	    },
	});
}




Claudie.footer.animateElementOnScroll = function() {
    function e() {
        $.each(t,
        function(e, t) {
            $(t).offset().top - $(window).scrollTop() < i && $(t).addClass("trigger-animation")
        })
    }
    var t = $(".product-tile").not(".annime-me"),
    i = $(window).height() - $(window).height() / 10;
    e(),
    $(window).on("scroll",
    function(t) {
        e()
    });
};

Claudie.home.bindEvents = function(){
	
	//Claudie.home.swiper();
	//Claudie.home.addProductToCart();
	Claudie.home.video();
};

Claudie.home.video = function(){
	$(window).load(function(){
		if($("#video-html").length){
			document.getElementById("video-html").muted = false;
		}
	})
}

Claudie.home.swiper = function(){
	
	$(".homepage-3products").find(".product-content-01").show();  
	
	
	$(".homepage-3products").find(".product-content-01 .2").show(); 
	
	
    var vestiairelength = $('.vestiaire-swiper-container .swiper-slide').length;
    
    if(vestiairelength >= 6) {
        vestiairelength = vestiairelength >=5 ? 5 : vestiairelength;
        var dom = $(".vestiaire-swiper-container").eq(0);
        var swiperCarousel = new Swiper(dom,{
            slidesPerView: vestiairelength,
            loop: true,
            centeredSlides: true,
            paginationClickable: true,
            spaceBetween: 0
        });
        /*
        jQuery('.vestiaire-next').on('click', function(event){
            event.stopPropagation(); 
	        swiperCarousel.swipeNext(); 
	    });
        jQuery('.vestiaire-prev').on('click', function(event){
		    event.stopPropagation(); 
		    swiperCarousel.swipePrev(); 
        });
        */
    }else {
    	jQuery('.vestiaire-swiper-container').addClass("unboundswiper");
    	jQuery('.vestiaire-next').hide();
    	jQuery('.vestiaire-prev').hide();
    }

	
	$(".homepage-3products .til span").on("click",function(){  
		 var index = $(this).index();  
		 $(this).parent().next().find(".product-content-01").hide().eq(index).show(); 
		 $(this).addClass("hover").siblings().removeClass("hover"); 
	}); 
	
	
};

Claudie.home.addProductToCart = function (){
	
	// home page add product to cart
	jQuery(".product-content-01 .new-product-sizes").find(".swatch-list li").on("click",function(){
		var mpid = $(this).attr("data-size-value");
		var size = $.trim( $(this).children().attr("data-size-value"));
	
		if(mpid != null && mpid != '') {
			var selectcolor = jQuery(".product-content-01 .product-listing-details").find(".color-"+mpid).val();
			var url = app.util.ajaxUrl(app.urls.productVariation);
			var variationdataurl = url+'&pid='+mpid+'&dwvar_'+mpid+'_size='+size+'&dwvar_'+mpid+'_color='+selectcolor;
			console.log(variationdataurl);
			$.ajax({
				url: variationdataurl,
				method: "POST",
				dataType:"json",
			    success: function(ProductID){
			    	var data = 'cartAction=add&pid='+ProductID;
				    console.log(data)
				    app.cart.update(data, function (response) {
					    app.minicart.show(response);
				    });
			    },
			    error: function(retour){
			    	
			    },
			});    
		}	
	});
	
};

Claudie.home.stories = function(){
	$(".new_productline .subMain-title").addClass("current");
	$(".new_productline .content-asset").addClass("active");
	$("body").on("click",".stories .subMain-title",function(e){
		event.preventDefault();
		$(this).addClass('current');
		$(this).parent().siblings().children('.subMain-title').removeClass('current');
		$(this).parent().siblings().children('.content-asset').removeClass('active');
		$(this).siblings('.content-asset').addClass("active");
	})
};


Claudie.footer.animateElementOnScroll();
Claudie.home.stories();
Maje.login.bindEvents();

$(".homepage-header-container span").on("click",function(){
	$(".homepage-header-container").hide();
	$("body").addClass('addheaderfixed');
})

$("body").on("click",".resetFilters.showme",function(){
	window.location.reload();
});

if ($(window).width() < 769){
	$("body").on("click",'.blckFilter.filterResult',function(){
		$(this).find(".refinement").addClass("active");
		$(this).find(".refinement.smcp_subFamily .titleFilter").hide();
	})
	$("body").on("click",'.M-Close-Filter',function(e){
		$(".blckFilter").removeClass('active');
		$("body").removeClass("Filter-fixed");
		$('.filterResult').show();
		$(".wrapper-btn-changegrid").css("z-index",23);
		if($(".filterListProduct").hasClass('curr')){
			$(".filterListProduct").removeClass('curr');
		}
		e.stopPropagation();
	})
	$("body").on("click",".blckFilter",function(e){
		$("body").addClass("Filter-fixed");
		$(".filterListProduct").addClass('curr');
		$(".wrapper-btn-changegrid").css("z-index",1);
	});
	
	$("body").on("click",'.JoinCart',function(e){
		$(this).siblings(".swatch-list").addClass("current");
		e.stopPropagation();
	})
	
	$("body").on("click",function(e){
		var MobileSwatch = $(".new-product-sizes");
		if (!MobileSwatch.is(e.target)
		    && MobileSwatch.has(e.target).length === 0)
		{			
			MobileSwatch.find('.swatch-list').removeClass('current');
		}
	})
	
	$("body").on('click','.basketMenu', function(){
		event.stopPropagation();
		$("body").addClass("mini-cart-show");
	})
	
}




// PDP SLIDER
Maje.product.initSlide = function(){
	var newVideoButton = $('<div class="wrapper-linkVideoPlay"><span class="linkVideoPlay" data-label=""><span class="pictoPlay"></span><span class="text">播放视频</span></span></div>');
	var newDiv = $(document.createElement('ul'));
	var newPaginate = $(document.createElement('ul'));
	
	newDiv.addClass('productSlide swiper-wrapper').appendTo('.productlargeimgdata');
	newPaginate.addClass('paginateSlideMob').appendTo('.productlargeimgdata');
	
	//Show play video button
	if($('.productlargeimgdata').data('videourl')) {
		newVideoButton.appendTo('.swiper-get-arrows');
	}
	
	var data = new Array(),
		dataHi = new Array();
	if($('.productlargeimgdata').data('lgimg')!=null){
		data = $('.productlargeimgdata').data('lgimg').split('|'),
		dataHi = $('.productlargeimgdata').data('hiresimg').split('|');
	}
	
	var nbItem = data.length - 1;
	
	$.each(data, function(index) {
		
		var imgTitle = '';
		
		if(dataHi[index].toLowerCase().indexOf(".mp4") === -1) {
			if($('.productlargeimgdata').length && $('.productlargeimgdata').data('title')){
				imgTitle = $('.productlargeimgdata').data('title');
			}
			
			if(dataHi[index].toLowerCase().indexOf("_v.jpg") !== -1) {
				var newItemList = $('<li><a href="'+dataHi[index]+'" title="' + imgTitle + '" class="zoomMain videoLink" rel="gal1"><img class="img-product primary-image" src="" /></a></li>');
				newItemList.addClass('slideImg swiper-slide').appendTo('.productSlide');
			}else{
				var newItemList = $('<li><a href="'+dataHi[index]+'" title="' + imgTitle + '" class="zoomMain" rel="gal1"><img class="img-product primary-image" src="" /></a></li>');
				newItemList.addClass('slideImg swiper-slide').appendTo('.productSlide');
			}
		}
		
	});
	
	if($('.product-main-image-container .swiper-container li').length >= 1) {
		setTimeout(function() {
			productSwiper();
		}, 500);
	}
	
	// SEO : Code allowing to add custom ALT informations
	if($('.product-main-image-container .swiper-container li').length >= 1){
		$(window).on('load', function(){
			if(typeof (customSEOalt) !== 'undefined'){
				$('.product-main-image-container .swiper-container li > img').attr('alt', customSEOalt);
			}
		});
	}
	
	if ($(window).width() > 480 && !$('.touch').length && !$('.quickview').length) {
		setTimeout(function(){ 
			$('.imgProduct').removeData('zoomPopin');
			$('.imgProduct').unbind();
			/* These are the elements that jqzoom created */
			$('.zoomPad').unbind();
			$('.zoomPup').unbind();
			$('.slideImg img').each(function( index ) {
				$('.slideImg .imgProduct').eq(index).html($( this ).clone());
			});
			$('#cursorhide').remove();
			
			
			$('.slideImg').on('mousemove mouseout', function(event){
			    if (event.type === 'mousemove'){
			    	$('#cursorhide').css({
				       display: 'block',
				       left:  event.pageX + 5,
				       top:   event.pageY
				    });
			    }else{
			    	$('#cursorhide').css({
			    	 	 display: 'none'
			    	 });
			    }
			});
		}, 800);
		
	}
	
	$('.productlargeimgdata .zoomWindow').on('mouseout', function() {
		$('.productlargeimgdata .zoomPad').removeClass('active');
	});
	
	$.each(data, function(index, url){
		$('.slideImg').eq(index).find('img').attr('src', url);
	});
	
	$('.paginateSlideMob').find('.itemPage').first().addClass('active');
	
	$(document).on('click','.itemPage', function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('.productSlide').stop().animate({
			'left' : - $('.slideImg').eq($(this).index()).position().left
		},'500');
	});
	
	//Play video
	$(document).on('click','.linkVideoPlay', function() {
		var idProduct = "pdpVideo";
		var idMyVideo = $('<div class="wrapper-prod-video"><div id="' + idProduct + '"></div></div>');
		var video = $(".productlargeimgdata").data("videourl");
		
		if (typeof video === undefined || video == '' || video == null) {
			return;
		}
		
		if($(".wrapper-prod-video").length == 0) {
			$(".arrowPr-left").hide();
			$(".arrowPr-right").hide();
			$(".productSlide").hide();
			
			$(".productlargeimgdata").append(idMyVideo);
			
			jwplayer(idProduct).setup({
		        file: video,
		        aspectratio: "16:23.49",
		        width: "100%",
		        autostart: true,
		        mute: true,
		        controls: false
		    });

			if($(window).width() < 1080){
				jwplayer(idProduct).setControls(true);
			}

			$(window).on({
				resize : function(){
					if(!$('html').hasClass('ie8')){
						resizeVideo();
					}
				}
			});
			
			jwplayer(idProduct).onComplete(function() {
				$(".wrapper-prod-video").hide();
				$(".arrowPr-left").show();
				$(".arrowPr-right").show();
				$(".productSlide").show();
	        });
			
		} else{
			$(".arrowPr-left").hide();
			$(".arrowPr-right").hide();
			$(".productSlide").hide();
			
			$(".wrapper-prod-video").show();
			
			jwplayer(idProduct).play();
			
			jwplayer(idProduct).onComplete(function() {
				$(".wrapper-prod-video").hide();
				$(".arrowPr-left").show();
				$(".arrowPr-right").show();
				$(".productSlide").show();
	        });
		}
	});
	
	$(document).on('click','.videoLink', function(event) {
		event.preventDefault();
		$('.zoomPopin').remove();
		$('.linkVideoPlay').trigger('click');
	});
	
	function productSwiper(isQuickView){
		var mySwiper,
			swiperOptions = {};
		
		if(isQuickView === 'quickview'){
			Maje.product.initSlide();
			swiperOptions = {
				mode:'horizontal',
				loop: true,
			    wrapperClass : 'product-thumbnails',
			    calculateHeight: true,
			    slideClass : 'thumb'
			}
			
			mySwiper = $('.product-main-image-container .swiper-container').swiper(swiperOptions);
			
		} else{
			
			var indexMain;
			var nbSlideThumb = 3;
			var lengthSwipe = $(".productSlide li").length;
			lengthSwipe = lengthSwipe - 1;
			var lenghtThumb = lengthSwipe - nbSlideThumb;
			var indexSwipe;
			var indexThumb;
			var hideThumbnails = $("#thumbnails");
			
			var mySwiperThumb = new Swiper('.product-thumbnails .swiper-container-thumb', {
				mode:"vertical",
				slidesPerView: "auto",
				wrapperClass: 'swiper-wrapper',
				slideClass: 'thumb',
			  	slideElement: 'li',
			  	spaceBetween: "20",
			  	calculateHeight: true,
			  	loop: true,
			  	onInit: function() {
			  		indexThumb = mySwiperThumb.activeIndex;
			  	},
			  	onSlideChangeEnd: function() {
			  		indexThumb = mySwiperThumb.activeIndex;
			  	}
			}); 
			
			if(window.innerWidth < 768){
				modeSwiper = "vertical";
				hideThumbnails.hide();
				jQuery("body").on("touchstart", function(e) {
			        //e.preventDefault();
			        startX = e.originalEvent.changedTouches[0].pageX,
			        startY = e.originalEvent.changedTouches[0].pageY;
			    });
			    jQuery("body").on("touchmove", function(e) { 
			        //e.preventDefault();                          
			        moveEndX = e.originalEvent.changedTouches[0].pageX,
			        moveEndY = e.originalEvent.changedTouches[0].pageY,
			        X = moveEndX - startX,
			        Y = moveEndY - startY;
			        if ( Y > 0 ) {
			        	var scrollTop     = $(window).scrollTop(),
			            elementOffset = $('.swiper-get-arrows').offset().top,
			            distance      = (elementOffset - scrollTop);
			        	if(distance < 1){
			        		$('.arrowPr-right').next('ul.productSlide').removeClass('eventNone');
			        		
			        	}
			        	if($(".pt_product-details .productlargeimgdata li").eq(0).hasClass("swiper-slide-active")) {
			        		$(".pt_product-details #header").removeClass('current');
				        	$(".pt_product-details #main").removeClass('current');
			        	}
			        }else{
			        	$(".pt_product-details #header").addClass('current');
			        	$(".pt_product-details #main").addClass('current');
			        }
			    });
			} else {
				modeSwiper = "vertical";
			}

			swiperOptions = {
				mode:modeSwiper,
				pagination: '.paginateSlideMob',
				paginationClickable: true,
				height:'auto',
				calculateHeight: true,
        	    simulateTouch : true,   
        	    slidesPerView:1,
				onSlideNext : function() {
					var container = $('#thumbnails');
					if (container.length) {
						var selectedLi = container.find('li.selected');
						var listLi = selectedLi.parent().find('li');
						var toselect = listLi.eq((mySwiper.activeIndex) % listLi.size() );
						if(selectedLi.length && toselect.length) {
							selectedLi.removeClass('selected');
							toselect.addClass('selected');
							
							$('.arrowPr-right').removeClass('start');
							if (mySwiper.activeIndex === (listLi.size() - 1)) {
								$('.arrowPr-right').addClass('end');
								if(window.innerWidth < 768){
									$('.arrowPr-right').next('ul.productSlide').addClass('eventNone');
								}
							}
							
						}
					}
				},
				onSlidePrev : function() {
					var container = $('#thumbnails');
					if (container.length) {
						var selectedLi = container.find('li.selected');
						var listLi = selectedLi.parent().find('li')
						var toselect = listLi.eq(mySwiper.activeIndex  % listLi.size() );
						if(selectedLi.length && toselect.length) {
							selectedLi.removeClass('selected');
							toselect.addClass('selected');
							
							$('.arrowPr-right').removeClass('end');
							if (mySwiper.activeIndex === 0) {
								$('.arrowPr-left').addClass('start');								
							}
						}
					}
				},
				onInit : function(){
					if(mySwiper.slides.length == 3){
						$('.product-main-image-container').addClass('singlePdt');
					}
					indexSwipe = mySwiper.activeIndex;
				},
				loop: false,
				onSlideChangeEnd: function() {
					indexSwipe = mySwiper.activeIndex;
					if(indexSwipe>=nbSlideThumb){
						var slideToThumb = indexSwipe - 3;
						mySwiperThumb.swipeTo(slideToThumb);
					}
				}
			}
			mySwiper = $('.product-main-image-container .swiper-container').swiper(swiperOptions);

			
			$(".productlargeimgdata.swiper-container").on("mouseenter", function() {
				$(".productlargeimgdata.swiper-container").bind('mousewheel DOMMouseScroll', function(event){
					if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0 || event.originalEvent.deltaY < 0) {
						if(indexSwipe != 0){
					    	event.preventDefault();
					        mySwiper.swipePrev();
						}
				    }
				    else {
				    	if(indexSwipe < lengthSwipe){
				    		event.preventDefault();
					    	mySwiper.swipeNext();
				    	}
				    }
				});
			});
			
			
			$(".product-thumbnails").on("mouseenter", function() {
				$(".product-thumbnails").bind('mousewheel DOMMouseScroll', function(event){
					if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0 || event.originalEvent.deltaY < 0) {
						if(indexThumb != 0){
					    	event.preventDefault();
					    	mySwiperThumb.swipePrev();
						}
				    }
				    else {
				    	if(indexThumb < lenghtThumb){
				    		event.preventDefault();
				    		mySwiperThumb.swipeNext();
				    	}
				    }
				});
			});
			
		}
		
		var arrowMode = [$(document.createElement('a')).addClass('arrowPr-left'),
		$(document.createElement('a')).addClass('arrowPr-right')];
		for (var k = 0; k < arrowMode.length; k++ ){
			arrowMode[k].insertBefore('.productSlide.swiper-wrapper');
		}
		var setSliderArrows = function () {
			
			$('.arrowPr-left').off('click');
			$('.arrowPr-left').on('click' , function(){
				var productname = $('#title').text();
				window.dataLayer = window.dataLayer || [];
				if(isajax){
					dataLayer.push({
					    'event': 'quick_shop',
					    'quick_shop_action':'click product pic',
					    'product': productname
					});
				}else{
					dataLayer.push({
					    'event': 'product_page_event',
					    'type':'click product pic',
					    'product': productname
					});				
				};
				mySwiper.swipePrev();
			});
			$('.arrowPr-right').off('click');
			$(document).on('click' ,'.arrowPr-right', function(e){
				var productname = $('#title').text();
				window.dataLayer = window.dataLayer || [];
				if(isajax){
					dataLayer.push({
					    'event': 'quick_shop',
					    'quick_shop_action':'click product pic',
					    'product': productname
					});
				}else{
					dataLayer.push({
					    'event': 'product_page_event',
					    'type':'click product pic',
					    'product': productname
					});				
				};
				mySwiper.swipeNext();
			});
		};
		
		setSliderArrows();
		
		$('.thumbnail-link').on('click', function() {
			var index = $(this).data('position');
			mySwiper.swipeTo(index-1);
		});
		
	}
};

Claudie.plpProduct.filters.mobile = function (){
	
	
	//filter select add "selected" Class
	$(".filterResult .contentFilter div.refinement li").click(function (){
		if($(this).hasClass("selected")){
			$(this).removeClass("selected");
		}else{
			$(this).addClass("selected")
		};
	});
	// Sort select add "activated" Class
	$(".filterTri .contentFilter div.refinement li a").click(function (){
		
		console.log($(!this))
		/*
		if($(this).hasClass("activated")){
			$(this).removeClass("activated");
		}else{
			$(this).addClass("activated")
		};
		*/
	});
		
};

Claudie.cart.Recommended = function (){
		
	$(document).on("click", ".cart-impulse-sell ul.swatch-list li", function(){
		if($(this).hasClass("unvailable") || $(this).hasClass("SizesTab")){
			return false;
		}else{		
			var pid = $(this).data("productid")
			var data = "cartAction=add&pid="+pid;
			
			app.cart.update(data, function (response) {
				location.reload();
			});
		};		
	});	
			
};

if ($(window).width() > 769){
	$(function(){
		$('.mini-cart-products').jScrollPane();
		//$(".Claudie-filter-item").jScrollPane();
	});
	$(function(){
		$('#wrapper.pt_product-details  .swiper-get-arrows #thumbnails').jScrollPane();
	});
};

Claudie.cart.modifyProduct = function(){
	
	$(document).on("click", ".cart-item-edit-details a.modify", function(e){
		e.preventDefault();
		Expansion.init();
		
		if($(this).siblings("a.confirm").length > 0){
			return true;
		};
		$(this).parents(".item-list").addClass("openActive");
		$(this).css("display", "none");
		if(window.screen.width < 767){
			$(this).siblings("button.remove").css("display", "none");
		};
		$(this).parent("div.cart-item-edit-details").append("<a class=\"confirm\" href=\"javascript:void(0);\" title=\"AGRIPINA\">"+ app.resources.checkout_cart_confirm +"</a>")
		
		var selectedColor = $(this).parents("div.item-list").find(".product-list-item").find(".attribute-color")[0].dataset.color;
		var selectedSize = $(this).parents("div.item-list").find(".it_item-actions").find(".attribute-size")[0].dataset.size;
		var selectedQuantity = $(this).parents("div.item-list").find(".item-quantity").find(".lineItem-qty")[0].dataset.quantity;
		
		var productArray = $(this).parents(".cart-row").data("product");
		var colorsArray = [];
		var sizesArray = [];
		
		for (var i = 0; i < productArray.length; i++) {
			var product = productArray[i];
			//var colorDisplayValue = product.colorDisplayValue;
			var color = {};
				color.colorUrl = product.colorUrl;
				color.color = product.color;
				color.colorDisplayValue = product.colorDisplayValue;
			var size = {};
				size.size = product.size;
				size.sizeDisplayValue = product.sizeDisplayValue;
				
			if(product.onStock == "y"){
				size.onStock = "y"
			}else{
				size.onStock = "n"
			};
						
			// Does not exist Add
			if(!colorsArray.findObject(color)){			
				colorsArray.push(color);				
			};
			// Add only the currently selected color
			if(selectedColor == product.color){
				// Does not exist Add
				if(!sizesArray.findObject(size)){				
					sizesArray.push(size);				
				};			
			};
		};
		
		sizesArray.SortObject("size");
		
		var colorDom = "<ul class=\"swatch-list\">";
		for (var i = 0; i < colorsArray.length; i++) {
			if(colorsArray[i].color == selectedColor){
				colorDom += "<li class=\"color selected\" data-color="+ colorsArray[i].color +"><span style=\"background: url("+ colorsArray[i].colorUrl +") repeat;\"></span><span>" + colorsArray[i].colorDisplayValue + "</span></li>";				
			}else{
				colorDom += "<li class=\"color\" data-color="+ colorsArray[i].color +"><span style=\"background: url("+ colorsArray[i].colorUrl +") repeat;\"></span><span>" + colorsArray[i].colorDisplayValue + "</span></li>";				
			};
			
		};
		    colorDom += "</ul>";
		    						
		var sizeDom = "<ul class=\"swatch-list\">";    
		for (var i = 0; i < sizesArray.length; i++) {
			if(sizesArray[i].size == selectedSize){
				if(sizesArray[i].onStock == "y"){
					sizeDom += "<li class=\"size selected\" data-size=" + sizesArray[i].size + "><span>" + sizesArray[i].sizeDisplayValue + "</span></li>";
				}else{
					sizeDom += "<li class=\"size selected unvailable\" data-size=" + sizesArray[i].size + "><span>" + sizesArray[i].sizeDisplayValue + "</span></li>";
				};
			}else{
				if(sizesArray[i].onStock == "y"){
					sizeDom += "<li class=\"size\" data-size=" + sizesArray[i].size + "><span>" + sizesArray[i].sizeDisplayValue + "</span></li>";
				}else{
					sizeDom += "<li class=\"size unvailable\" data-size=" + sizesArray[i].size + "><span>" + sizesArray[i].sizeDisplayValue + "</span></li>";
				}
			};
		};
		sizeDom += "</ul>";
		
		var quantity = 3;
		var quantityDom = "<ul>"
			
		for (var i = 0; i < quantity; i++) {
			if((i+1) == selectedQuantity){
				quantityDom += "<li class=\"selected\" data-quantity=" + (i+1) + ">" + (i+1) + "</li>";
			}else{
				quantityDom += "<li data-quantity=" + (i+1) + ">" + (i+1) + "</li>";
			};
		};
			quantityDom += "</ul>";
		
		if(window.screen.width > 767){
			$(this).parents(".cart-row").find(".attribute-color").append(colorDom);				
			$(this).parents(".cart-row").find(".it_item-actions .attribute-size").append(sizeDom);		    
			$(this).parents(".cart-row").find(".item-quantity .hideinmobile-block").append(quantityDom);
		}else{
			$(this).parents(".cart-row").find(".attribute-color").append(colorDom);
			$(this).parents(".item-list").find(".item-details").find(".attribute-size").append(sizeDom);
			$(this).parents(".item-list").find(".item-details").find(".item-quantity").append(quantityDom);
		};

	});
	
	// choose the color
	$(document).on("click", ".attribute-color ul li.color", function(){
		$(this).parents( ".attribute-color" ).toggleClass( "highlight" );
		$(this).parents(".item-list").find( ".attribute-size" ).removeClass( "highlight" );
		// Already selected, no processing
		if($(this).hasClass("selected")){
			return true;
		};
		
		var productArray = $(this).parents(".cart-row").data("product");
		var currentColor = $(this)[0].dataset.color;
		var sizesArray = [];	
		
		for (var i = 0; i < productArray.length; i++) {
			var product = productArray[i];

			if(currentColor !=  product.color){
				continue;
			};
			
			var size = {};
				size.size = product.size;
				size.sizeDisplayValue = product.sizeDisplayValue;
			if(product.onStock == "y"){
				size.onStock = "y"
			}else{
				size.onStock = "n"
			};	
			// Add only the currently selected color
			if(currentColor == product.color){
				// Does not exist Add
				if(!sizesArray.findObject(size)){				
					sizesArray.push(size);				
				};				
			};
		};
		
		sizesArray.SortObject("size");
				
		var sizeDom = "<ul class=\"swatch-list\">";    
		for (var i = 0; i < sizesArray.length; i++) {
			if(sizesArray[i].onStock == "y"){
				sizeDom += "<li class=\"size\" data-size=" + sizesArray[i].size + "><span>" + sizesArray[i].sizeDisplayValue + "</span></li>";
			}else{
				sizeDom += "<li class=\"size unvailable\" data-size=" + sizesArray[i].size + "><span>" + sizesArray[i].sizeDisplayValue + "</span></li>";
			};
		};
			sizeDom += "</ul>";	
			
		if(window.screen.width > 767){	
			$(this).parents(".cart-row").find(".it_item-actions .attribute-size ul").remove();		
			$(this).parents(".cart-row").find(".it_item-actions .attribute-size").append(sizeDom);
			for (var i = 0; i < sizesArray.length; i++) {
				if(sizesArray[i].onStock == 'n'){
					$(this).parents(".cart-row").find(".attribute-size ul").addClass('AllUnvailable');
				}else{
					$(this).parents(".cart-row").find(".attribute-size ul li").eq(0).addClass('selected');
				}
			}
		}else{
			$(this).parents("div.attribute-color").siblings("span.attribute-size").find("ul").remove();	
			$(this).parents("div.attribute-color").siblings("span.attribute-size").append(sizeDom);
			for (var i = 0; i < sizesArray.length; i++) {
				if(sizesArray[i].onStock == 'n'){
					$(this).parents("div.attribute-color").siblings("span.attribute-size").find("ul").addClass('AllUnvailable');
				}else{
					$(this).parents("div.attribute-color").siblings("span.attribute-size").find("ul li").eq(0).addClass('selected');
				}
			}
		};
		
		$(this).siblings("li").removeClass("selected");
		$(this).addClass("selected");
		
	});
	
	// choose the size
	
	$(document).on("click", ".attribute-size ul li.size", function(){	
		$(this).parents( ".attribute-size" ).toggleClass( "highlight" );
		//Already selected, or not available, no processing
		if($(this).hasClass("unvailable")){
			$(this).parents( ".attribute-size" ).removeClass( "highlight" );
		};
		if($(this).hasClass("selected") || $(this).hasClass("unvailable")){
			return true;
		};
		
		
		
		$(this).siblings("li").removeClass("selected");
		$(this).addClass("selected");
	});
	
	$(document).on("click",".swatch-list.AllUnvailable",function(e){
		$(this).toggleClass('NoUnvailable');
		e.preventDefault();
	})
	
	// choose the Quantity
	$(document).on("click", ".item-quantity ul li", function(){
		$(this).parents( ".item-quantity" ).toggleClass( "highlight" );
		$(this).siblings("li").removeClass("selected");
		$(this).addClass("selected");
		
	});
	
	// Confirm the changes
	$(document).on("click", ".item-list a.confirm", function(e){
		e.stopPropagation();
		$(this).parents(".item-list").removeClass("openActive");
		$(".pt_cart #primary .loader").show();
		try {
			var productArray = $(this).parents(".cart-row").data("product");
			var uuid = $(".confirm").parents(".item-list")[0].dataset.itemUuid;
			var selectedColor = $(this).parents(".item-list").find(".item-details ul li.selected")[0].dataset.color;
			if(window.screen.width < 767){
				var selectedSize = $(this).parents(".item-list").find(".product-list-item .attribute-size ul li.selected")[0].dataset.size;
				var selectedQuantity = $(this).parents(".item-list").find(".item-details .item-quantity ul li.selected")[0].dataset.quantity;
			}else{
				var selectedSize = $(this).parents(".item-list").find(".it_item-actions ul li.selected")[0].dataset.size;
				var selectedQuantity = $(this).parents(".item-list").find(".item-quantity ul li.selected")[0].dataset.quantity;
				
			};
			var pid = "";
			for (var i = 0; i < productArray.length; i++) {
				var product = productArray[i];
				if((product.color == selectedColor) && (product.size == selectedSize)){
					pid = product.id;
					break;
				};			
			};
			
			var postData = {};
				postData.uuid = uuid;
				postData.pid = pid;
				postData.Quantity = selectedQuantity;
				postData.source = "cart";
				postData.cartAction = "update";
			app.cart.update(postData);
			$(this).parents(".item-list").removeClass("openActive");
		} catch (e) {
			console.log(e);
		};		
	});
};

Claudie.product.init = function(){	
	Claudie.product.bindEvents();	
};

Claudie.product.bindEvents = function(){
	
	Claudie.product.addProductToCart();
};

Claudie.product.addProductToCart = function(){
	
	$(document).on("click", ".mobile-add-to-cart .in-Stock-add ul li", function(){	
		if($(this).hasClass("no-stock-add")){
			return false;
		};
		var pid = $(this).data("productid");
		var data = "cartAction=add&pid="+pid;
		
		app.cart.update(data, function (response) {

			app.minicart.show(response);

			// Show message of validation in popup for the lookbook page
			if($("#popup-message-valideAddToCart").length > 0) {
				Maje.lookbook.showPopupValideAddToCart();
			}
			
			//Maje.minicart.bindEvents();
			app.progress.hide();

		});	
	});
	
	$(document).on("click", ".mobile-add-to-cart .in-Stock-add", function(){
		$(this).children("ul").addClass('active');
	})
	
};

Claudie.cart.miniCartAddCoupon = function(){
	
	$(".coupon-box button").click(function(e){
		e.stopPropagation();
		e.preventDefault();		
		
		var val = $(".coupon-box input").val();
		if(val.replace(" ","") == ""){
			return false;
		};		
		var data = new Object();
			data.couponCode = val;
			data.format = "ajax";
		$.ajax({
			type : "POST",
			dataType : "json",
			cache	: false,
			url : app.urls.addCoupon,
			data : data
		}).done(function (response) {
			if(response.success != true){
				$(".coupon-box span").text(response.message);
			}else{
				window.location.reload();
			};
		}).fail(function (xhr, textStatus) {
			window.alert(textStatus);
		})
		
	});
	
	$(".coupon-box span").click(function(){
		$(".coupon-box span").text("");
	});
	$(".coupon-box input").focus(function(){
		$(".coupon-box span").text("");
	});	
};







