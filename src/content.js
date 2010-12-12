chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {  	    	
        switch(request.action) {
            case 'clear':
                clearZendCookies();               
                break;
            default:
            	setZendCookies(request);
        }        
        sendResponse({message: request.action + " done."});
    }
)

function getCookie(cookieName)
{
    if(document.cookie.length > 0)
    {
        cookieStart = document.cookie.indexOf(cookieName + "=");
        if(cookieStart != -1)
        {
            cookieStart = cookieStart + cookieStart.length+1;
            cookieEnd = document.cookie.indexOf(";",cookieStart);
            if(cookieEnd == -1) cookieEnd = document.cookie.length;
            return unescape(document.cookie.substring(cookieStart,cookieEnd));
        }
    }
    return "";
}

function setCookie(c_name,value,expiredays)
{
//    console.log("Setting cookie : " + c_name + " = " + value);
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);

    var cookie = c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());

    document.cookie = cookie;
}


function clearZendCookies() {
    setCookie("_bm", "", -1)
	setCookie("debug_line_bp", "", -1);
	setCookie("debug_file_bp", "", -1);
	setCookie("debug_port", "", -1);
	setCookie("send_debug_header", "", -1);
	setCookie("debug_host", "", -1);
	setCookie("start_debug", "", -1);
	setCookie("debug_stop", "", -1);
	setCookie("start_profile", "", -1);
	setCookie("debug_coverage", "", -1);
	setCookie("send_sess_end", "", -1);
	setCookie("debug_jit", "", -1);
	setCookie("debug_start_session", "", -1);
	setCookie("original_url", "", -1);
	setCookie("ZendDebuggerCookie", "", -1);
	setCookie("use_ssl", "", -1);
	setCookie("debug_fastfile", "", -1);
	setCookie("debug_protocol", "", -1);
	setCookie("debug_session_id", "", -1);
	setCookie("no_remote", "", -1);
	setCookie("use_remote", "", -1);
}

function setZendCookies(request) {
	var action = request.action;
	var reload = request.reload;
	var data = request.data;
	
	// Always clear cookies first.    
    clearZendCookies();
    
    // Set up connection parameters
    if(data.port.length > 0) setCookie("debug_port", data.port, 1);
    if(data.ip.length > 0)   setCookie("debug_host", data.ip, 1);
    if(data.ssl == 1)        setCookie("use_ssl", "1", 1);
    
    // Set up debug parameters
	setCookie("send_debug_header", "1", 1);
	setCookie("start_debug", "1", 1);
	setCookie("send_sess_end", "1", 1);
	setCookie("debug_jit", "1", 1);
	setCookie("original_url", document.location, 1);	
	setCookie("debug_session_id", (Math.floor(Math.random() * 147483648) + 2000), 1);
	
	// Only if automatic
	if(data.connecttype == 'automatic') {
		if(data.fastfile == 1) setCookie("debug_fastfile", "1", 1);
		if(data.protocol != null && data.protocol != "null") setCookie("debug_protocol", data.protocol, 1);
	}
	
	if(action == 'profile') {
		// Profiler settings
	    setCookie("start_profile", "1", 1);
	    setCookie("debug_coverage", "1", 1);	    
	} else {
		// Debugger settings
	    if(data.localcopy == 1) {
        	setCookie("use_remote", "1", 1);
    	} else {
        	setCookie("no_remote", "1", 1);
    	}
    	if(data.breakfirstline == 1) {
    		setCookie("debug_stop", "1", 1);
    	}
	}
	
	// Reload page if necessary
	if(reload) {
	    document.location.reload();
	}
}

// Always clear zend cookies on request.
chrome.extension.sendRequest({action: "clearnext"}, function(response) {});
clearZendCookies();	