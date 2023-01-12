var imageTag = false;
var theSelection = false;

// Check for Browser & Platform for PC & IE specific bits
// More details from: http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
var clientPC = navigator.userAgent.toLowerCase(); // Get client info
var clientVer = parseInt(navigator.appVersion); // Get browser version

var is_ie = ((clientPC.indexOf("msie") != -1) && (clientPC.indexOf("opera") == -1));
var is_nav = ((clientPC.indexOf('mozilla')!=-1) && (clientPC.indexOf('spoofer')==-1)
                && (clientPC.indexOf('compatible') == -1) && (clientPC.indexOf('opera')==-1)
                && (clientPC.indexOf('webtv')==-1) && (clientPC.indexOf('hotjava')==-1));
var is_moz = 0;

var is_win = ((clientPC.indexOf("win")!=-1) || (clientPC.indexOf("16bit") != -1));
var is_mac = (clientPC.indexOf("mac")!=-1);

br_help = 'Break Lines: text<br> (alt+x)';
b_help = 'Bold text: <b>text</b>  (alt+b)';
i_help = 'Italic text: <i>text</i>  (alt+i)';
u_help = 'Underline text: <u>text</u>  (alt+u)';
q_help = 'Quote text: <quote>text</quote>  (alt+q)';
c_help = 'Code display: <code>code</code>  (alt+c)';
l_help = 'List: <list>text</list> (alt+l)';
o_help = 'Ordered list: <list=>text</list>  (alt+o)';
p_help = 'Insert image: <img>http://image_url</img>  (alt+p)';
w_help = 'Insert URL: <url>http://url</url> or <url=http://url>URL text</url>  (alt+w)';
a_help = 'Close all open bbCode tags';
s_help = 'Font color: <color=red>text</color>  Tip: you can also use color=#FF0000';
f_help = 'Font size: <size=x-small>small text</size>';

// Define the bbCode tags
bbcode = new Array();
bbtags = new Array('<b>','</b>','<i>','</i>','<u>','</u>','<quote>','</quote>','<code>','</code>','<list>','</list>','<list=>','</list>','<img>','</img>','<url>','</url>','<br>','<br>');
imageTag = false;
function getarraysize(thearray) {
    for (i = 0; i < thearray.length; i++) {
        if ((thearray[i] == "undefined") || (thearray[i] == "") || (thearray[i] == null))
            return i;
        }
    return thearray.length;
}

// Replacement for arrayname.push(value) not implemented in IE until version 5.5
// Appends element to the array
function arraypush(thearray,value) {
    thearray[ getarraysize(thearray) ] = value;
}

// Replacement for arrayname.pop() not implemented in IE until version 5.5
// Removes and returns the last element of an array
function arraypop(thearray) {
    thearraysize = getarraysize(thearray);
    retval = thearray[thearraysize - 1];
    delete thearray[thearraysize - 1];
    return retval;
}
function checkForm() {

    formErrors = false;    

    if (document.memo.descr.value.length < 2) {
        formErrors = "Please Fill Your Messages";
    }

    if (formErrors) {
        alert(formErrors);
        return false;
    } else {
        bbstyle(-1);
        //formObj.preview.disabled = true;
        //formObj.submit.disabled = true;
        return true;
    }
}
function helpline(help) {
    document.memo.helpbox.value = eval(help + "_help");
}

function bbfontstyle(bbopen, bbclose) {
    var txtarea = document.memo.descr;

    if ((clientVer >= 4) && is_ie && is_win) {
        theSelection = document.selection.createRange().text;
        if (!theSelection) {
            txtarea.value += bbopen + bbclose;
            txtarea.focus();
            return;
        }
        document.selection.createRange().text = bbopen + theSelection + bbclose;
        txtarea.focus();
        return;
    }
    else if (txtarea.selectionEnd && (txtarea.selectionEnd - txtarea.selectionStart > 0))
    {
        mozWrap(txtarea, bbopen, bbclose);
        return;
    }
    else
    {
        txtarea.value += bbopen + bbclose;
        txtarea.focus();
    }
    //storeCaret(txtarea);
}


function bbstyle(bbnumber) {
    var txtarea = document.memo.descr;

    txtarea.focus();
    donotinsert = false;
    theSelection = false;
    bblast = 0;

    if (bbnumber == -1) { // Close all open tags & default button names
        while (bbcode[0]) {
            butnumber = arraypop(bbcode) - 1;
            txtarea.value += bbtags[butnumber + 1];
            buttext = eval('document.memo.addbbcode' + butnumber + '.value');
            eval('document.memo.addbbcode' + butnumber + '.value ="' + buttext.substr(0,(buttext.length - 1)) + '"');
        }
        imageTag = false; // All tags are closed including image tags :D
        txtarea.focus();
        return;
    }

    if ((clientVer >= 4) && is_ie && is_win)
    {
        theSelection = document.selection.createRange().text; // Get text selection
        if (theSelection) {
            // Add tags around selection
            document.selection.createRange().text = bbtags[bbnumber] + theSelection + bbtags[bbnumber+1];
            txtarea.focus();
            theSelection = '';
            return;
        }
    }
    else if (txtarea.selectionEnd && (txtarea.selectionEnd - txtarea.selectionStart > 0))
    {
        mozWrap(txtarea, bbtags[bbnumber], bbtags[bbnumber+1]);
        return;
    }
    
    // Find last occurance of an open tag the same as the one just clicked
    for (i = 0; i < bbcode.length; i++) {
        if (bbcode[i] == bbnumber+1) {
            bblast = i;
            donotinsert = true;
        }
    }

    if (donotinsert) {      // Close all open tags up to the one just clicked & default button names
        while (bbcode[bblast]) {
                butnumber = arraypop(bbcode) - 1;
                txtarea.value += bbtags[butnumber + 1];
                buttext = eval('document.memo.addbbcode' + butnumber + '.value');
                eval('document.memo.addbbcode' + butnumber + '.value ="' + buttext.substr(0,(buttext.length - 1)) + '"');
                imageTag = false;
            }
            txtarea.focus();
            return;
    } else { // Open tags
    
        if (imageTag && (bbnumber != 14)) {     // Close image tag before adding another
            txtarea.value += bbtags[15];
            lastValue = arraypop(bbcode) - 1;   // Remove the close image tag from the list
            document.memo.addbbcode14.value = "Img";    // Return button back to normal state
            imageTag = false;
        }
        
        // Open tag
        txtarea.value += bbtags[bbnumber];
        if ((bbnumber == 14) && (imageTag == false)) imageTag = 1; // Check to stop additional tags after an unclosed image tag
        arraypush(bbcode,bbnumber+1);
        eval('document.memo.addbbcode'+bbnumber+'.value += "*"');
        txtarea.focus();
        return;
    }
    //storeCaret(txtarea);
}

