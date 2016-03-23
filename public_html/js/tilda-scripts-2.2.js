$(function() {
	$isMobile=false,
    isWidthLimited = $(window).width() <= 1024;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$isMobile=true;
	}

	if($("body").height() < $(window).height()){
		$("#tildacopy").css("display","none");
	}
	
    if($isMobile == true){
        var correctHeight = function(){
        	//covers
            var coverCarries = document.body.querySelectorAll('.cover_carrier'),
                viewPortHeight = $(window).height(),
                factor = 0;
            for(var i= 0, l = coverCarries.length, cc , ccStyle, newHeight, parent, opacityLayer, textBox; i < l; i++){
                cc = coverCarries[i];
                ccStyle = cc.style;
                if(ccStyle.height.indexOf('vh') > -1){
                    factor = parseInt(ccStyle.height) / 100;
                    newHeight = viewPortHeight + 'px';
                    parent = $(cc).parent('.cover');
                    if(parent && (parent = parent[0])){
                    opacityLayer = parent.querySelector('.filteropacity');
                    textBox = parent.querySelector('.centeredVerticallyBlock');
                        opacityLayer.style.height = textBox.style.height = ccStyle.height = parent.style.height = newHeight;
                    }
                }
            }
            //others
            var elCarries = document.body.querySelectorAll('[data-height-correct-vh]'),
                viewPortHeight = $(window).height(),
                factor = 0;
            for(var i= 0, l = elCarries.length, cc , ccStyle, newHeight, parent, opacityLayer, textBox; i < l; i++){
                cc = elCarries[i];
                ccStyle = cc.style;                
                if(ccStyle.height.indexOf('vh') > -1){
                    factor = parseInt(ccStyle.height) / 100;
                    newHeight = viewPortHeight + 'px';
                    parent = $(cc).parent('.cover');
                    ccStyle.height = newHeight;
                }                 
            }
        };
        $(document).ready(function(){
        	correctHeight();
        });
        $(window).load(function(){
        	correctHeight();
        });
        //if(window.readyState != "complete")
        //    window.addEventListener('load', correctHeight);
        //else
        //    correctHeight();
                    
        correctHeight();              
    }
    
    if($isMobile == true){
    	if($(window).width() < 480){    
	    	$("div[data-customstyle=yes]").each(function(index) {
				if($(this).css('font-size').replace('px','')>26){
					$(this).css('font-size','');
					$(this).css('line-height','');		
				}
			});
	    	$("[field]").find("span").each(function(index) {
				if($(this).css('font-size').replace('px','')>26){
					$(this).css('font-size','');
				}
			});
			$(window).load(function(){
				var window_width=$(window).width();
				$(".r").each(function(){
					var el=$(this);
					$(this).find("div").each(function(){
						var r_div_width=$(this).outerWidth(true);
						if(r_div_width>window_width){
							el.css("overflow","auto");
							el.css("word-break","break-all");							
						}
					});
				});
			});
		}else if($(window).width() < 900){
	    	$("div[data-customstyle=yes]").each(function(index) {
				if($(this).css('font-size').replace('px','')>30){
					$(this).css('font-size','');
					$(this).css('line-height','');		
				}
			});
	    	$("[field]").find("span").each(function(index) {
				if($(this).css('font-size').replace('px','')>30){
					$(this).css('font-size','');
				}
			});							
		}
    }    

});


(function(){
    /**
     * @constructor
     */
    function VideoLoadProcessor(){
        this.setScrollListener();
    }

    VideoLoadProcessor.prototype.videoTags = [];
    VideoLoadProcessor.prototype.defaultConfig = {
        isNeedStop : false
    };
    VideoLoadProcessor.prototype.videoConfigs = [];
    /**
     * @param {HTMLVideoElement} video
     * @param {{} | Undefined} config
     */
    VideoLoadProcessor.prototype.registerNewVideo = function(video, config){
        if(!(video instanceof HTMLVideoElement)){
            throw new Error("Wrong tag passed into registerNewVideo");
        }
        if(this.videoTags.indexOf(video) == -1){
            this.videoTags.push(video);
            this.videoConfigs.push(typeof config == "undefined" ? this.defaultConfig : config);
            this.scrollCb();
            return true;
        }
        return false;
    }
    /**
     * @param {HTMLVideoElement} video
     */
    VideoLoadProcessor.prototype.unergisterVideo = function(video){
        if(!(video instanceof HTMLVideoElement)){
            throw new Error("Wrong tag passed into unregisterNewVideo");
        }
        var index;
        if((index = this.videoTags.indexOf(video)) > -1){
            if(typeof video.remove == "function"){
                video.remove();
            }else{
                if(video.parentNode){
                    video.parentNode.removeChild(video);
                }
            }
            this.pauseVideo(video, this.videoConfigs[index]);
            this.videoTags.splice(index, 1);
            this.videoConfigs.splice(index, 1);
            return true;
        }
        return false;
    }

    VideoLoadProcessor.prototype.pauseVideo = function(video, config){
        if(!config){
            throw new Error("Wrong config type!");
        }
        video.pause();
        if(config.isNeedStop){
            video.load();
        }
    }

    VideoLoadProcessor.prototype.setScrollListener = function(){
        $(window).bind('scroll', this.scrollCb.bind(this));
    }

    VideoLoadProcessor.prototype.scrollCb = function(){
        var windowHeight = $(window).height(),
            _shift = 0,
            _v = null;
	        for(var i= 0, l = this.videoTags.length; i < l; i++){
	            _v = this.videoTags[i], _vrect = this.getVideoBoundingRect(_v, false);
	            //set fade volume
	            if(Math.abs(_vrect.top) < windowHeight && Math.abs(_vrect.top) > windowHeight/2){
	                var vol = 1 - (Math.abs(_vrect.top)-windowHeight/2)/(windowHeight/2) - 0.2;
	                if(vol>0 && vol<=1 && _v.volume!=0)_v.volume=vol;
	            }
	            //then pause              
	            if(Math.abs(_vrect.top) > windowHeight || _vrect.height == 0 /*display : none*/){
	                this.pauseVideo(_v, this.videoConfigs[i]);
	                continue;
	            }
	            if(_v.paused){
	                _v.play();
	            }
	        }
    };

    VideoLoadProcessor.prototype.getVideoObject = function(video){
        for(var i= 0, l = this.videoTags.length; i > l; i++){
            var vo = this.videoTags[i];
            if(vo.v === video)
                return vo;
        }
        return null;
    }

    VideoLoadProcessor.prototype.getVideoBoundingRect = function(video, isNeedParent){
        if(typeof isNeedParent == "undefined"){
            isNeedParent = true;
        }
        var parent = null;
        if(isNeedParent){
            parent = $(video).parents('.r')[0];
            if(!parent){
                parent = video;
            }
        }else{
            parent = video;
        }
        return parent.getBoundingClientRect();
    }
    window.videoLoadProcessor = new VideoLoadProcessor();
})();

(function(){
    function SequenceController(){
        this.setScrollCb();
        this.itemHeight = screen.availHeight;//document.documentElement.clientHeight || window.innerHeight || screen.availHeight;
        var itemTransitionItemRelation = 0.25;
        this.itemTransitionTop = this.itemHeight * itemTransitionItemRelation;
        this.activeItemIndex = null;
        this.windowHeight = document.documentElement.clientHeight || window.innerHeight || screen.availHeight;
        this.topOffsetShift = -150;
        $(window).bind('resize', this.recalculateAllSequencesOffsets.bind(this));
        this._resizeInterval = setInterval(function(){
            this.scrollCb();
        }.bind(this),500);
    }

    SequenceController.prototype.defaultConfig = {
        orientation : "vertical",
        speedFactor : 1,
        automated : false
    };

    SequenceController.prototype.sequenceObjects = [];
    /**
     * @param {{}} sO
     */
//    SequenceController.prototype.calculateSequenceOffsets = function(sO){
//        var height = 0;
//        var items = sO.items;
//        for(var i= 0, l = items.length; i < l; i++){
//            items[i].offsetTop = this.getAbsoluteTopOffset(items[i].node.querySelector('.txt-holder')) - this.topOffsetShift;
//            height+= this.getItemHeight(items[i].node);
//        }
//        sO.sequenceTopOffset = this.getAbsoluteTopOffset(sO.sequenceHolder);
//        sO.sequenceHeight = height;
//    }

    SequenceController.prototype.recalculateAllSequencesOffsets = function(){
        if(this._resizeTimeout)
            clearTimeout(this._resizeTimeout);

        if(this._resizeInterval){
            clearInterval(this._resizeInterval);
        }

        this._resizeTimeout = setTimeout(function(){
            this.scrollCb();
            this._resizeInterval = setInterval(function(){
                this.scrollCb();
            }.bind(this),500);
        }.bind(this),10);
    }

    SequenceController.prototype.registerNewBlock = function(node){
        if(!(node instanceof HTMLElement)){
            throw new Error("Wrong node type in registerNewBlock");
        }
        for(var i= 0, l = this.sequenceObjects.length; i < l; i++){
            if(this.sequenceObjects[i].sequenceBlock === node)
            return false;
        }
        var sequenceHolder = node.querySelector('[data-hook="sequence-holder"]'),
            sequenceHeight = 0,
            sequenceOffsetTop = this.getAbsoluteTopOffset(sequenceHolder),
            items = (function(){
                var _items = Array.prototype.slice.call(node.querySelectorAll('[data-hook="sequence-item"]'), 0), __items = [];
                _items.forEach(function(el, i, array){
                    var elHeight = this.getItemHeight(el),
                        backgroundHolder = el.querySelector('[data-hook="item-background"]');
                    el.style.height = elHeight + 'px';
                    backgroundHolder.style.height = this.itemHeight + 'px';
                    if(i<array.length-1)
                        sequenceHeight+=elHeight;
                    __items.push({
                        node : el,
                        height : elHeight,
                        topOffset : this.getAbsoluteTopOffset(el.querySelector('.txt-holder')) - (i == array.length - 1 ? 0 : this.topOffsetShift),
                        backgroundHolder : backgroundHolder
                    });
                }.bind(this));
                return __items;
            }).call(this),
            h = this.itemHeight,
            sequenceObject = {
                sequenceBlock : node,
                sequenceHolder: sequenceHolder,
                sequenceHolderTopOffset : sequenceOffsetTop,
                sequenceHeight : sequenceHeight,
                items : items,
                started: false,
                prevBackgroundColor : ''
            };
        this.sequenceObjects.push(sequenceObject);

        this.scrollCb();
        return true;
    }

    SequenceController.prototype.getItemHeight = function (el){
        var txtBlock = el.querySelector("[data-hook='item-text']"),
            backgroundHolder = el.querySelector("[data-hook='item-background']");
        st = el.style;
        var computedTop = parseFloat(getComputedStyle(txtBlock).top);
        txtBlock.style.top = computedTop + 'px';
        var totalHeight = Math.max(txtBlock.clientHeight + computedTop, this.itemHeight);
        return totalHeight;
    }

    SequenceController.prototype.fixTextBlocksPosition = function(node){
        txtBlocks = Array.prototype.slice.call(node.querySelectorAll('[data-hook="item-text"]'), 0);
        txtBlocks.forEach(function(el, i , array){
            var backgroundSibling = el.parentNode.querySelector("[data-hook='item-background']");
            backgroundSibling.style.top = '-' + el.clientHeight + 'px';
        });
    }

    SequenceController.prototype.unergisterBlock = function(node){
        for(var i= 0, l = this.sequenceObjects.length, index = null; i < l; i++){
            if(this.sequenceObjects[i].sequenceBlock === node){
                index = i;
                break;
            }
        }
        if(index !== null){
            this.sequenceObjects.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * @param {HTMLElement} el
     * @returns {Number|number}
     */
    SequenceController.prototype.getAbsoluteTopOffset = function(el){
        var topOffset = el.offsetTop;
        el = el.offsetParent;
        while(el != null){
            topOffset+= el.offsetTop;
            el = el.offsetParent;
        }
        return topOffset;
    }
    /**
     * @param {Boolean} direction
     * 1 - from top to bottom
     * 0 - from bottom to top
     */
    SequenceController.prototype.processSequence = function(sequenceObject){
        if(sequenceObject.started == false){
            sequenceObject.prevBackgroundColor = document.body.style.backgroundColor;
            document.body.style.backgroundColor = 'rgb(0, 0, 0)';
            sequenceObject.started = true;
        }
        var sequenceBlock = sequenceObject.sequenceBlock,
            sequenceHolder = sequenceObject.sequenceHolder,
            sequenceItems = sequenceObject.items,
            currentItemIndex = null,
            node, backgroundHolder, backgroundHolderStyle, textBlock, opacity;
        for(var i= 0, l = sequenceItems.length, nodeRect, txtBlockRect; i < l; i++){
             node = sequenceItems[i].node,
             txtBlockRect = node.querySelector('.txt-holder')
             nodeRect = node.getBoundingClientRect();
             if(nodeRect.top < this.itemTransitionTop && (nodeRect.bottom < nodeRect.height + this.itemTransitionTop) && nodeRect.bottom > this.itemTransitionTop){
                 currentItemIndex = i;
                 break;
             }
        }
        if(currentItemIndex == null){
            return;
        }
        opacity = nodeRect.top / this.itemTransitionTop;
        if(opacity > 1){
            opacity = 1;
        }else if(opacity < 0){
            opacity = 0;
        }
        for(var i= 0, l = sequenceItems.length; i < l; i++){
            node = sequenceItems[i].node,
            backgroundHolderStyle = sequenceItems[i].backgroundHolder.style;
            if(backgroundHolderStyle.position != "fixed"){
                backgroundHolderStyle.position = "fixed";
            }
            if(i == currentItemIndex){ // transitted already
                backgroundHolderStyle.opacity = 1 - opacity;
                node.querySelector('.txt-holder').style.opacity = 1 - opacity;
            }else if(i == currentItemIndex - 1){
                backgroundHolderStyle.opacity = opacity;
                node.querySelector('.txt-holder').style.opacity = opacity;
            }else{
                backgroundHolderStyle.opacity = 0;
                node.querySelector('.txt-holder').style.opacity = 0;
            }
        }
    }

    SequenceController.prototype.stopSequence = function(sequenceObject){
        if(sequenceObject.started == false){
            return;
        }
        sequenceObject.items.forEach(function(el, i, array){
            el.backgroundHolder.style.position = 'relative';
            el.backgroundHolder.style.display = 'block';
            el.backgroundHolder.style.opacity = 1;
        });
        document.body.style.backgroundColor = sequenceObject.prevBackgroundColor;
        sequenceObject.started = false;
    }

    SequenceController.prototype.scrollCb = function(){
        var scrollTop = $(window).scrollTop();
        for(var i= 0, l = this.sequenceObjects.length, sO, top; i < l; i++){
            sO = this.sequenceObjects[i];
            var boundingRect = sO.sequenceHolder.getBoundingClientRect();
            if(boundingRect.top < 0 && boundingRect.bottom > 0 && boundingRect.bottom > boundingRect.height - sO.sequenceHeight - 100){
                this.processSequence(sO);
            }else{
                this.stopSequence(sO);
            }
        }
    }

    SequenceController.prototype.setScrollCb = function(){
        this._scrollCb = this.scrollCb.bind(this);
        window.addEventListener('scroll', this._scrollCb);
    }

    window.sequenceController = new SequenceController();
    
    window.processVideo = function(v){
        mp4Src = $(v).attr('data-content-video-url-mp4');
        webmSrc = $(v).attr('data-content-video-url-webm');
        $(v).css("background-color", "transparent");
        $(v).css("background-image", "");
        var options = {
            mp4: mp4Src,
            webm: webmSrc,
            //poster: "",
            preload: "none",
            autoplay : false,
            loop: true,
            scale:true,
            zIndex:0,
            width: "100%"
        };
        // Initializing the videos
        vid = $(v).videoBG(options);
        videoLoadProcessor.registerNewVideo(vid, {
            isNeedStop : false
        });
    }


	window.cover_init = function(id){
	
        $(document).ready(function(){
            var cover_carrier = document.body.querySelector('#coverCarry' + id);
            var el = $(cover_carrier);
            
            var backgroundurl=el.attr('data-content-cover-bg');
            var height=el.attr('data-content-cover-height');
            var parallax=el.attr('data-content-cover-parallax');
            var videomp4=el.attr('data-content-video-url-mp4');
            var videowebm=el.attr('data-content-video-url-webm');
            var youtubeid=el.attr('data-content-video-url-youtube');
            var noloop=el.attr('data-content-video-noloop');
            var nomute=el.attr('data-content-video-nomute');
            var bgbase64=el.attr('data-content-bg-base64');
            
            if(!backgroundurl)backgroundurl="";
            if(!height)height="";
            if(!parallax)parallax="";
            if(!videomp4)videomp4="";
            if(!videowebm)videowebm="";
            if(!youtubeid)youtubeid="";            
            if(!noloop)noloop="";
            if(!nomute)nomute="";
            if(!youtubeid)youtubeid="";
            if(!bgbase64)bgbase64="";
            
            if($isMobile && (videowebm!="" || videomp4!="" || youtubeid!="")){
                el.css('background-image', "url('" + backgroundurl + "')");
            }
            
            //fix content height
            var hcover=$("#rec" + id).find(".cover").height();
            var hcontent=$("#rec" + id).find("div[data-hook-content]").height();
            if(hcontent>300 && hcover<hcontent){
            	var hcontent=hcontent+100;            
            	$("#rec" + id).find(".cover").height(hcontent);
            	$("#rec" + id).find(".filteropacity").height(hcontent);
            	$("#rec" + id).find(".cover_carrier").height(hcontent);
            	$("#rec" + id).find(".centeredVerticallyBlock").height(hcontent);
            }   
            
            // if set video
	        if (videomp4!=="" || videowebm!=="" || youtubeid!==""){
	            if($isMobile==false){
	                // Initializing the videos
	                if (youtubeid == "" && (videomp4 != "" || videowebm != ""))
	                {
		                el.css("background-color", "#000000");
		                el.css("background-image", "url('http://tilda.ws/img/spinner-white.gif')");
		                el.css("background-size", "auto");
	                	if(noloop!=""){var loop=false;}else{var loop=true;}
	                	if(nomute!=""){var volume=1;}else{var volume='';}
	                    
	                	var height_more_vh="";
	                	if(parallax=="fixed"){
			                if(height.indexOf('vh') > -1){
			                    if( parseInt(height) > 100 ){
			                    	el.css("height","100vh");
			                    	height_more_vh="yes";
			                    }
			                }	                		
			                if(height.indexOf('px') > -1){
			                    if( parseInt(height) > $(window).height() ){
			                    	el.css("height","100vh");
			                    	height_more_vh="yes";
			                    }
			                }	                					                
	                	}
	                		                    
						var cotimer;
						var flagprocessed="";
						var wnd=$(window);
						var prnt=el.parent();						
	                    
						wnd.scroll(function() {
						    if(cotimer) {
						        window.clearTimeout(cotimer);
						    }
						
						    cotimer = window.setTimeout(function() {
							      if(!(flagprocessed>0)){
							          var a,b,c,d,s;
							              
									  a = el.offset().top;
								      b = el.height();
								      		  
								      c = wnd.scrollTop();
								      d = wnd.height();
								      
								      if(((c+d) > a-500) && (c <= (a+b+500))){
					                    var vid = el.videoBG({
					                        mp4: videomp4,
					                        webm: videowebm,
					                        poster: '',
					                        preload: 'none',
					                        autoplay : false,
					                        loop: loop,
					                        volume:volume,
					                        scale:true,
					                        zIndex:0,
					                        width: "100%"
					                    });								      
								      	videoLoadProcessor.registerNewVideo(vid);
								      	flagprocessed=1;
								      }
							      }
						    }, 100);
						    
							if(parallax=="fixed" && height_more_vh=="yes"){
								  var aa,bb,cc,dd,ss;
								      
								  aa = prnt.offset().top;
								  bb = prnt.height();
								  		  
								  cc = wnd.scrollTop();
								  dd = wnd.height();
								  
								  if(cc>=aa+bb-dd){
								      el.css("position","absolute");
								      el.css("bottom","0px");
								      el.css("top","auto");
								      //el.css("vertical-align","bottom");
								  }			  
								  else if(cc>=aa){
								      el.css("position","fixed");
								      el.css("top","0px");
								  }
								  else if(cc<aa){
								      el.css("position","relative");
								      el.css("top","auto");									      
								  }							  
							}
												    
						});        
						
						wnd.scroll(); 	            

	                // Initializing youtube video
	                }else if (youtubeid != ""){	 
		                el.css("background-color", "#000000");	                               	                    	                    	                
		                el.css("background-image", "");
						var cotimer;
						var flagprocessed=0;
						var wnd=$(window);
						
						wnd.scroll(function() {
						    if(cotimer) {
						        window.clearTimeout(cotimer);
						    }
						
						    cotimer = window.setTimeout(function() {
						    	  flagprocessed=el.find("iframe").length;
							      if(!(flagprocessed>0)){
							          var a,b,c,d,s;
							              
									  a = el.offset().top;
								      b = el.height();
								      		  
								      c = wnd.scrollTop();
								      d = wnd.height();
								      
								      if(((c+d) > a-500) && (c <= (a+b+500))){
								      	processYoutubeVideo(cover_carrier, height);
								      	//flagprocessed=1;
								      }
							      }
						    }, 100);
						});        
						
						wnd.scroll();           
	                    
	                }
	            }
	        }                    
	        
	        if (parallax=="dynamic"){
	            if($isMobile == false)el.parallax("50%",0.2,true);
	        }    
	        
	        if (bgbase64=="yes" && backgroundurl!="" && videomp4=="" && videowebm=="" && youtubeid==""){
	            var bg_already="";
				$('<img/>').attr('src', backgroundurl).load(function() {
				    $(this).remove();
					el.css('background-image', "url('"+backgroundurl+"')");	   			   
					el.css("opacity","1");
					var bg_already="yes";
				});
				if(bg_already!="yes"){
					el.css('background-image','');
		            el.css("opacity","0");
					el.css("transition","opacity 25ms");
				}
	        }
	        
        });
                
	}
	
    $(document).ready(function(){	
    	$(".cover_carrier").each(function() {
			var id=$(this).attr('data-content-cover-id');
			if(id>0)cover_init(id);
		});	
    });	

    function processSrc(src,nocover){
        if(src.indexOf('https://www.youtube.com/embed') == -1){
            src = "https://www.youtube.com/embed" + (src[0] == '/' ? src : '/' + src);
        }
        var extractVideoId = function(src){
          var parts = src.split('/'), neededPart = null;
          for(var i=0, l = parts.length; i < l; i++){
            if(parts[i] == "embed"){
              neededPart = parts[i+1];
            }
          }
          return neededPart;
        }
        var currentLocation = location.protocol+'//'+location.host;
        
        if(nocover!="yes"){   
	        src = (src[src.length-1] == '/' ? src : src) + '?autoplay=1&loop=1&enablejsapi=1&&playerapiid=featuredytplayer&controls=0&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&theme=light&wmode=transparent&origin='+currentLocation+'&playlist='+extractVideoId(src);
	    }else{
	        src = (src[src.length-1] == '/' ? src : src) + '?autoplay=0&loop=0&enablejsapi=1&&playerapiid=featuredytplayer&controls=1&modestbranding=1&rel=0&showinfo=0&color=black&iv_load_policy=3&theme=dark&wmode=transparent&origin='+currentLocation;		    
	    }
        return src;
    }

    function onYouTubePlayerReady_do(div,player,nomute){
        var timer;
        var wnd = $(window);
        var frame = $(div);
		var timer_count=0;
		
		wnd.scroll(function() {
		    if(timer) {
		        window.clearTimeout(timer);
		        if(timer_count>=15){
		        	timer_player_do(frame,wnd,player,nomute);
		        	timer_count=0;
		        }
		        timer_count++;
		    }
		
		    timer = window.setTimeout(function() {
			      timer_player_do(frame,wnd,player,nomute);
		    	  timer_count=0;    
		    }, 100);
		});        
		
		wnd.scroll();           
    }
    
    function timer_player_do(frame,wnd,player,nomute){
          var a,b,c,d,s;
              
		  a = frame.offset().top;
	      b = frame.height();
	      		  
	      c = wnd.scrollTop();
	      d = wnd.height();
	      
	      s = player.getPlayerState();
	      
	      if(((c+d) > a) && (c <= (a+b))){
			  if(s !== 1)player.playVideo();	      	
	          if(nomute=="yes"){
		          if(c>a+b-100){
	              	player.setVolume(30);
		          }else if(c>a+b-200){
			        player.setVolume(70);		          
		          }else if(c+d<a+200){
			        player.setVolume(30);		          			        
		          }else{
	                player.setVolume(100);
		          }
		      }else{
			      //console.log("no");
		      }
	      }else if((c+d) < a && (c+d) > (a-500)){
	      	  if(s !== 2){
		      	 player.playVideo();		      	  
	      	  	 player.pauseVideo();
	      	  }
	      }else if(c > (a+b) && c < (a+b+500)){
	      	  if(s !== 2){
	      	  	 player.pauseVideo();
	      	  }	      	  
	      }else{
	      	  if(s !== 2){
	      	  	 player.pauseVideo();	      	  
	      	  }		      
	      }	      
    }
    
    var def = $.Deferred();

    window.processYoutubeVideo = function(div, height){
        var defFunc = function(){
        
         console.log("youtube iframe processed");
         var src = $(div).attr('data-content-video-url-youtube');
         var nomute = $(div).attr('data-content-video-nomute');
         var noloop = $(div).attr('data-content-video-noloop');
         var nocover = $(div).attr('data-content-video-nocover');         
         
         var iframe = document.createElement('iframe');

         iframe.src = processSrc(src,nocover);
	     iframe.frameBorder = 0;         
         
         if(nocover!="yes"){         
	         if(!height){
	             height = "100vh";
	         }         
	         if(height.indexOf('vh') > -1){ 
	             var div_height = Math.floor((window.innerHeight * (parseInt(height) / 100)));
	         }else{
	             var div_height = parseInt(height);		         
	         }
	         var div_width = Math.floor (parseInt(window.innerWidth));
	         
	         var video_width = div_width;
	         var video_height = video_width * 0.5625;
	         
	                  
	         var vw2 = video_width;	                  
	         var vh2 = video_height + 110 + 110;
	         var delta_coef=1;	         
	         
	         if((video_height-220) < div_height){
		         if(video_height<div_height){
			     	var delta_coef = ( div_height / video_height ) + 0.02;	       
		         }else{
			     	var delta_coef = (video_height / div_height ) + 0.02;
		         }
	         }

	     	 var zoom_video_width = Math.floor( vw2 * delta_coef );
	     	 var zoom_video_height = Math.floor( vh2 * delta_coef );	         
	               	         
	         var heightDelta = zoom_video_height - div_height;
	         var widthDelta = zoom_video_width - div_width;
	             
	         iframe.height = zoom_video_height + 'px';
	         iframe.width = zoom_video_width + 'px';
	         
	         if(heightDelta > 0){
	             iframe.style.marginTop = - Math.floor(heightDelta / 2 ) + 'px';
	         }
	         if(widthDelta > 0){
	             iframe.style.marginLeft = - Math.floor(widthDelta / 2) + 'px';
	         }
	     }else{
	     	 var video_height;
	         if(!height){
	         	 video_height = Math.floor ( $(div).width() * 0.5625 );
	         }       
	         if(height && height.indexOf('vh') > -1){ 
	             video_height = Math.floor((window.innerHeight * (parseInt(height) / 100)));
	         }else if(height){
	             video_height = parseInt(height);		         
	         }
	         
		     iframe.width="100%";	         		     
		     iframe.height=video_height + 'px';	     
	     }
	              
         var playtimer;                       
         div.appendChild(iframe);
         if($isMobile == false){
		         var player = new YT.Player(iframe,{
		          events:{
		            'onReady': function(e){
		              onYouTubePlayerReady_do(div,e.target,nomute);
		              if(e.target.setVolume && nomute!="yes"){
		                e.target.setVolume(0);
		              }
		              e.target.setLoop(true);
		            },
		            'onStateChange': function(e){
		              if(e.target.setVolume && nomute!="yes"){
		                e.target.setVolume(0);
		              }          
		
		              if(e.data === -1){
		              	  var sp=window.fix_scrolltop_beforestop_youtube;
			              if(sp>=0){
				              $('html, body').scrollTop(sp);
				              delete window.fix_scrolltop_beforestop_youtube;
				          }
		              }
					  if(e.data === YT.PlayerState.PLAYING){
					    playtimer = window.setInterval(function() {
						    var a=e.target.getCurrentTime();
						    var b=e.target.getDuration();
						    if(a+1>b && b!==0){
							    e.target.seekTo(0);				    
						    	if(noloop==="yes"){
								    e.target.stopVideo();
								    e.target.clearVideo();							
								}
						    }			    	
					    }, 1000);			    
					  }else{
						window.clearTimeout(playtimer);  
					  }
		            }
		          }
		         });
		 }
        }
        def.then(defFunc);
    }
    
    
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function(){
       def.resolve(); 
    }
    
})();

(function(){
    /**
	  * Global object that implements the event model.
      * The essence of it is that he is one and is global, it all podpisyvayutsya
      * Amity and ask him the same way
      * (Instead of each object was emitterom = /)
      *constructor
      *version 0.0.1
     */
    function Observer(){
        this.callbacks = {};
    }

    Observer.prototype.defaultConfig = {
        single : false,
        context : null
    };

    Observer.prototype.addEventListener = function(name, callback, config){
        evtCallbacks = this._getEventCallbacks(name);
        if(!evtCallbacks){
            evtCallbacks = this.callbacks[name] = [];
        }

        evtCallbacks.push({
            callback : callback,
            config : (typeof config == "object" ? config : this.defaultConfig)
        });
    }

    Observer.prototype._getEventCallbacks = function(name){
        return this.callbacks[name];
    }

    Observer.prototype.removeEventListener = function(name, callback){
        var cbs = this._getEventCallbacks(name);
        if(!cbs){
            return false;
        }

        for(var i= 0, l = cbs.length, cbObj; i < l; i++){
            cbObj = cbs[i];
            if(callback === cbObj.callback){
                cbs.splice(i,1);
                return true;
            }
        }
        return false;
    }

    Observer.prototype.emitEvent = function(name, data){
        var cbs = [];
        extend(cbs,this._getEventCallbacks(name));
        for(var i= 0, l = cbs.length, cbObj, cb, config; i < l; i++){
            cbObj = cbs[i];
            cb = cbObj.callback;
            config = cbObj.config;
            if(config.context){
                cb.call(config.context, data);
            }else{
                cb(data);
            }

            if(config.single){
                this.removeEventListener(name, cb);
            }
        }
    }

    window.observer = new Observer();
})();