//JavaScript Document
//lytebox by (c) jay ramirez

/*
@params
params   =  string /object;
			params.top				: int (position top of the lytebox content)
			params.width			: int (width lytebox content)
			params.title			: string
			params.message			: string
			params.url				: url (external page/content)
			params.data				: object #if params has url 
			params.align			: string
			params.type 			: 'alert','confirm', default=blank.
			params.closeButton 		: boolean
			params.buttonAlign	 	: 'center/left/right'
			params.okCaption		: string, default='Ok'.
			params.cancelCaption	: string, default='Cancel'.
			params.onConfirm		: function ( callback function alter pressing confirm)
			params.onCancel			: function ( callback function alter pressing cancel)
			params.escButton		: boolean, (to close with esc button)
			params.blurClose		: boolean, (to close when the transparent bg is clicked, default is true)
			params.addClass			: add class attr to lytebox content to add a style
			params.fadeOut			: int, popup will auto close after the given time (mili seconds)
			params.onOpen			: callback function on open
			params.onClose			: callback function on close

width  	  = int;
*/

function Lytebox(container){
	
	var thisClass = this;
	var onCloseCallback	= false;
	var Options;

	var Lightbox;
	var Container;

	var Document = $(document);
	var isPage;

	thisClass.open	= function(params,width){

		var Body = container ? $(container) : $('body');
			Options   = params;
			isPage    = false;
			Lightbox  = createElement()
							.addClass('lytebox');
			Container = createElement()
							.addClass('lytebox-content')
							.appendTo(Lightbox);

		if( !params.url ){
			createElement()
				.addClass('lytebox-close')
				.html('&times;')
				.appendTo(Container);
		}		

		//append to body
		if( Body.find(Lightbox) ) thisClass.close();


		Lightbox.appendTo(Body);
		//Lightbox.css({ height : Document.height() });
		
		if(width) Container.css({ width : width });
		if(params.width) Container.css({ width : params.width });
		if(params.addClass) Container.addClass(params.addClass);
		if(params.fadeOut) setTimeout(popup.close,params.fadeOut);
	
		//append content	
		if(params instanceof Object){
			if(params.url){
				isPage = true;
				//iframe popup
				//thisClass.preload();
				if(params.data){
					$.get(params.url, params.data, function(result){
						  Container.append(result);
						  thisClass.display();
						  centerize();
					   }
					);
				}else{
					 Container.load(params.url,function(){
						thisClass.display();
						centerize();
					 });
				}
			}else{
				//message with parameters
				var Buttons = false;
					content  = params.title   	  ? '<h2 class="lytebox-title">' + params.title + '</h2>' : '';
					content += params.message 	  ? params.message 			 	: '';
					align 	 = params.align   	  ? 'txt'+params.align 			: '';
				
				if(params.closeButton==false || params.type=='alert' || params.type=='confirm'){
					$('.lytebox-close').remove();
				}

				if(params.type=='alert' || params.type=='confirm'){	
					var okCaption = params.okCaption ? params.okCaption : 'Ok';
					var cancelCaption = params.cancelCaption ? params.cancelCaption : 'Cancel';
					
						btnAlign  =	params.buttonAlign ? 'txt'+params.buttonAlign : 'txtright';

						Buttons   = createElement()
										.addClass('lytebox-buttons')
										.addClass(btnAlign);

					//Buttons.append('<input type="button" value="'+okCaption+'" class="lytebox-ok"/>');
					Buttons.append('<button class="lytebox-ok"><i>'+okCaption+'</i></button>');
					
					if(params.type=='confirm') Buttons.append('<input type="button" value="'+cancelCaption+'" class="lytebox-cancel" />');
					 
				}
				
				Container.append(content);
				Container.append(Buttons);
				Container.wrapInner('<div class="content"></div>')
				Container.addClass(align);
				thisClass.display();
				
			}
		}else{
			//simple string message
			content	= params;
			Container.append('<div class="content">'+content+'</div>');
			thisClass.display();
		}
	}

	
	thisClass.close = function(callback)
	{
		if( $('body').find('.lytebox') )
		{
			$('.lytebox').fadeOut(100,function()
			{
				$(this).remove();		
				if(callback){
					callback();
				}
			});
		}
	}
	
	thisClass.display = function()
	{

		if(!Options.url){
			Container.addClass('lytebox-message');
		}else{
			Container.removeClass('lytebox-message');
		}
		
		Container.css({display : 'none'}); 
		$('.lytebox').fadeIn(100);
		Container.show(0);

		centerize();
		enableButtons();

		if(Options.onOpen){
			Options.onOpen();
		}
	}

	thisClass.preload = function(){

	}

	function centerize(){

		var ch = Container.outerHeight();
		var wh = $(window).height();
		var cw = Container.outerWidth();

		var posTop = Options.top!==false && Options.top!=undefined ? Options.top : ((ch-100)/2);
		var marLeft = (cw/2) * (-1);

		Container.css({
				top : posTop,
				marginLeft: marLeft}) ;

		if( !isDesktop && isPage ){
			posTop = Options.top!==false && Options.top!=undefined ? Options.top : 0;
			Container.css({
				position : 'relative',
				top : posTop
			});
			//Lightbox.css({height:Container.height()})
		}
	}

	function createElement(element){
		element = element==undefined ? 'div' : element;
		return $('<'+element+'></'+element+'>');
	}

	function isDesktop(){
		if( $(window).width() < 992 ){
			return  false;
		}
		return true;
	}

	function enableButtons(){
		/********** START LYTEBOX CONTROL ************/	
		var btnOkay	  = $('.lytebox-ok');
		var btnCancel = $('.lytebox-cancel');
		var btnClose  = $('.lytebox-close, .popup-close');
		

		btnOkay.unbind('click');
		btnCancel.unbind('click');
		Lightbox.unbind('click');
		btnClose.unbind('click'); 
		Document.unbind('keydown');

		if(Options.onConfirm){
			btnOkay.bind('click',function(){
				thisClass.close(Options.onClose);
				Options.onConfirm()
			});
		}else{
			btnOkay.bind('click',function(){
				thisClass.close(Options.onClose);
			})
		}
		
		if(Options.onCancel){
			btnCancel.bind('click',function(){
				thisClass.close(Options.onClose);
				Options.onCancel();
			});
		}else{
			btnCancel.bind('click',function(){
				thisClass.close(Options.onClose);
			})
		}
		
		if(Options.blurClose!==false){
			Lightbox.bind('click',function(e){
				if($(e.target).hasClass('lytebox')){
					if(Options.closeButton!=false && Options.type!='alert' && Options.type!='confirm')
					thisClass.close(Options.onClose);
				}
			});
		}
		
		if(Options.escButton!==false){
			Document.bind('keydown',function(e){
					if (e.keyCode == 27) {
						if(Options.closeButton!=false && Options.type!='alert' && Options.type!='confirm')
						thisClass.close(Options.onClose);
				}
			});
		}

		btnClose.bind('click',function(){
			thisClass.close(Options.onClose);
		});
		/********** END LYTEBOX CONTROL ************/
	}

	thisClass.alert = function(data, title, callback){
		
		if(data instanceof Object){
			var params = data;
				params.type = 'alert';
		}
		else{
			var params = {};
				params.message = data;
				params.type	= 'alert';
				params.onConfirm = callback;
				params.title = title;
		}

		popup.open(params);
		
	}

	thisClass.confirm = function(data, title, onConfirm, onCancel){
		
		if(data instanceof Object){
			var params = data;
				params.type= 'confirm';
		}
		else{
			var params = {};
				params.message = data;
				params.type	= 'confirm';
				params.onConfirm = onConfirm;
				params.onCancel = onCancel;
				params.title = title;
		}

		popup.open(params);
		
	}

	thisClass.load = function(url,data){
		var params = {};
			params.url = url;
			params.data = data;
		popup.open(params);
	}
}

var popup = new Lytebox();