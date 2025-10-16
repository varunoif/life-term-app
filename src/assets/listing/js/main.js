$(document).ready(function(evt) {
	$('input').attr('autocomplete', 'off');
	$(".close-gb").click(function() {
			$(this).parent('div.gb-modal').hide();
		});
	if($(window).width() < 767) {
		$(".prev-insurer-desktop",).hide();	
		$(".state-list-desktop").hide();	
		$(".city-list-desktop").hide();	
		$(".city2-list-desktop").hide();	
			$('.city-mobile,.state-mobile').click(function() {
				var curr_id=$(this).attr("id");
				alert(curr_id);
				var curr=this;
				$(this).closest("div").find(".gb-modal").show();
				$(".navbar-full,#footer_area").hide();
				$("html, body").animate({
					scrollTop: 0
				}, 600);
				$(".wrap-contact100").removeClass("pull-right");
				$(this).closest("div").find("select").on("select2:select", function(evt) {
					var optionValue = evt.params.data.text;
					$(curr).closest("div").find(".gb-modal").closest(".gb-modal").hide();
					$("#"+curr_id).val(optionValue);
					$(".wrap-contact100").addClass("pull-right");
				});
			}).change();
	}

   $("#step1_form,#footer_area").removeClass('hide-me');
   
   $(".js-select2").each(function(){
			$(this).select2({
				dropdownPosition: 'below'
				//minimumResultsForSearch: 20,
				//dropdownParent: $(this).next('.dropDownSelect2')
			});
			$(".js-select2").each(function(){
				$(this).on('select2:close', function (e){
					if($(this).val() == "Please chooses") {
						$('.js-show-service').slideUp();
					}
					else {
						$('.js-show-service').slideUp();
						$('.js-show-service').slideDown();
					}
				});
			});
		})
});
$("#personalDetail").click(function(){
	$("#personal-detail").show();
	$("#address-detail").hide();
	$("#car-detail").hide();
	$("#nominee-detail").hide();
	
	$("#personalDetail").addClass("active");
	$("#carDetail").removeClass("active");
    $("#nomineeDetail").removeClass("active");
    $("#addressDetail").removeClass("active");
	
	$("#personalDetail").removeClass("complete");
    $("#carDetail").removeClass("complete");
    $("#nomineeDetail").removeClass("complete");
    $("#addressDetail").removeClass("complete");
});
$("#carDetail").click(function(){
	$("#perionalDetailBtn").click();
});

$("#nomineeDetail").click(function(){
	$("#carDetailBtn").click();
});
$("#addressDetail").click(function(){
	$("#nomineeDetailBtn").click();
});
function back_to_personal_detail()
{
	$("#personalDetail").click();
}
function back_to_car_detail()
{
	$("#carDetail").click();
}
function back_to_nominee_detail()
{
	$("#nomineeDetail").click();
}
(function ($) {
    "use strict";
    /*==================================================================
    [ Validate after type ]*/
	$("#perionalDetailBtn").click(function(){
		var stat='1';
		$('#personal-detail .input100').each(function(){
			if(validate(this) == false){
                showValidate(this);
				stat='0';
            }
        });
		var dob_dd=$("#dob_dd").val();
		var dob_mm=$("#dob_mm").val();
		var dob_yy=$("#dob_yy").val();
		
		if(dob_dd > 0 && dob_mm > 0 && dob_yy > 0)
		{
			$("#dobvalidate").hide();
			
		}
		else
		{
			$("#dobvalidate").show();
			stat='0';
		}
		
		if(stat=='1')
		{
			$("#personal-detail").hide();
			$("#address-detail").hide();
			$("#car-detail").show();
			$("#nominee-detail").hide();
			
			$("#personalDetail").removeClass("active");
			$("#carDetail").addClass("active");
			$("#nomineeDetail").removeClass("active");
			$("#addressDetail").removeClass("active");
			
			$("#carDetail").removeClass("complete");
			$("#nomineeDetail").removeClass("complete");
			$("#addressDetail").removeClass("complete");
			$("#personalDetail").addClass("complete");
			$("#carDetail").click();
		}
	});
	$("#carDetailBtn").click(function(){
		var stat='1';
		$('#car-detail .input100').each(function(){
			if(validate(this) == false){
                showValidate(this);
				stat='0';
			}
        });
		var previousInsurer=$("#previousInsurer").val();
		if(previousInsurer=="")
		{
			$("#previnsurerValidate").show();
			stat='0';
		}
		else
		{
			$("#previnsurerValidate").hide();
		}
		
		if(stat=='1')
		{
			$("#personal-detail").hide();
			$("#address-detail").hide();
			$("#car-detail").hide();
			$("#nominee-detail").show();
			
			$("#personalDetail").removeClass("active");
			$("#carDetail").removeClass("active");
			$("#nomineeDetail").addClass("active");
			$("#addressDetail").removeClass("active");
			
			$("#nomineeDetail").removeClass("complete");
			$("#addressDetail").removeClass("complete");
			$("#carDetail").addClass("complete");
			$("#nomineeDetail").click();
		}
	});
	$("#nomineeDetailBtn").click(function(){
		var stat='1';
		$('#nominee-detail .input100').each(function(){
			if(validate(this) == false){
                showValidate(this);
				stat='0';
			}
        });
		if(stat=='1')
		{
			$("#personal-detail").hide();
			$("#address-detail").show();
			$("#car-detail").hide();
			$("#nominee-detail").hide();
			
			$("#personalDetail").removeClass("active");
			$("#carDetail").removeClass("active");
			$("#nomineeDetail").removeClass("active");
			$("#addressDetail").addClass("active");
			
			$("#addressDetail").removeClass("complete");
			$("#nomineeDetail").addClass("complete");
			$("#addressDetail").click();
		}
	});
	$("#addressDetailBtn").click(function(){
		var stat='1';
		$('#address-detail .input100').each(function(){
			if(validate(this) == false){
                showValidate(this);
				stat='0';
			}
        });
		if(stat=='1')
		{
			$("#addressDetail").addClass("complete");
			
		}
	});
    $('.validate-input .input100').each(function(){
        $(this).on('blur', function(){
            if(validate(this) == false){
				showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })    
    })
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-input .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
           $(this).parent().removeClass('true-validate');
        });
    });

})(jQuery);
function validate (input) {
	if($(input).hasClass('full-name')) {
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Full name can not be blank.");
			return false;
		}
	}
	if($(input).hasClass('pan-card')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Pan number can not be blank.");
			return false;
		}
		if($(input).val().trim().match(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/) == null)
		{
			$(input).parent().attr("data-validate", "Oops! That doesn\'t look like a valid pan no.");
			return false;
		}
	}
	if($(input).hasClass('contact-no')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Mobile number can not be blank.");
			return false;
		}
		if($(input).val().trim().match(/^\d{10}$/) == null)
		{
			$(input).parent().attr("data-validate", "Oops! That doesn\'t look like a valid mobile no.");
			return false;
		}
	}
	if($(input).hasClass('email-address')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Email address can not be blank.");
			return false;
		}
		if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null)
		{
			$(input).parent().attr("data-validate", "Oops! That doesn\'t look like a valid email address.");
			return false;
		}
	}
	if($(input).hasClass('registration-no')) {
		
		var rto=$("#RTO").val();
		var reg_val = rto+""+$(input).val();
		if(reg_val.trim() == ''){
			$(input).parent().attr("data-validate", "Registration number can not be blank.");
			return false;
		}
		if(reg_val.trim().match(/^([a-zA-Z]{2})(\d{1,2})([a-zA-Z]{0,3})(\d{4})$/) == null)
		{
			$(input).parent().attr("data-validate", "That doesn\'t look like a valid registration no.");
			return false;
		}
	}
	if($(input).hasClass('policy-no')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Policy number can not be blank.");
			return false;
		}
	}
	if($(input).hasClass('engine-no')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Engine number can not be blank.");
			return false;
		}
		if($(input).val().trim().length < 6)
		{
			$(input).parent().attr("data-validate", "That doesn\'t look like a valid engine no.");
			return false;
		}
	}
	if($(input).hasClass('chassis-no')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Chassis number can not be blank.");
			return false;
		}
		if($(input).val().trim().length < 6)
		{
			$(input).parent().attr("data-validate", "That doesn\'t look like a valid Chassis no.");
			return false;
		}
	}
	else {
		if($(input).val().trim() == ''){
			return false;
		}
	}
	if($(input).hasClass('nominee-name')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Nominee name can not be blank.");
			return false;
		}
		if($(input).val().trim().match(/^[a-zA-Z]+$/) == null)
		{
			$(input).parent().attr("data-validate", "That doesn\'t look like a valid Nominee name.");
			return false;
		}
	}
	if($(input).hasClass('nominee-age')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "Nominee age can not be blank.");
			return false;
		}
		if($(input).val().trim().match(/^\d+$/) == null)
		{
			$(input).parent().attr("data-validate", "That doesn\'t look like a valid Nominee age.");
			return false;
		}
	}
	if($(input).hasClass('user-state')) {
		
		if($(input).val().trim() == ''){
			$(input).parent().attr("data-validate", "State can not be blank.");
			return false;
		}
		
	}
	else {
		if($(input).val().trim() == ''){
			return false;
		}
	}
	}

	function showValidate(input) {
	var thisAlert = $(input).parent();

	$(thisAlert).addClass('alert-validate');
	$(thisAlert).addClass('red-border');
	//$(thisAlert).append('<span class="btn-hide-validate">&#xf136;</span>')
	$('.btn-hide-validate').each(function(){
		$(this).on('click',function(){
		   hideValidate(this);
		});
	});
	}

	function hideValidate(input) {
		var thisAlert = $(input).parent();
		$(thisAlert).removeClass('alert-validate');
		$(thisAlert).removeClass('red-border');
		$(thisAlert).find('.btn-hide-validate').remove();
	}
	
	function check_DOB()
	{
		var dob_dd=$("#dob_dd").val();
		var dob_mm=$("#dob_mm").val();
		var dob_yy=$("#dob_yy").val();
		
		if(dob_dd > 0 && dob_mm > 0 && dob_yy > 0)
		{
			$("#dobvalidate").hide();
			
		}
		else
		{
			$("#dobvalidate").show();
		}
	}