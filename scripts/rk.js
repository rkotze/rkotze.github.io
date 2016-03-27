$(document).ready(function(){ 
    
    $(".menu-btn").on("click touchstart", function(){
        var rkNav = $(".rk-nav");
        if(rkNav.css("display") == "none"){
            rkNav.addClass("open");
        }else{
            rkNav.removeClass("open");
        }
        return false;
    });
    
});