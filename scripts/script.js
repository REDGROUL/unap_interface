var host = window.location.host;
console.log(host);
var protocol = window.location.protocol;
console.log(protocol);

var full_site_path = protocol+'//'+host+'/';

function auth() 
{
    let login = document.getElementById("login").value;
    let pass = document.getElementById("userpass").value;
   
    if(login != "" && pass != ""){
        $.ajax({
            url: 'http://api.unmessenger.com/login',
            method: 'post',
            dataType: 'html',
            data: {login: login, password: pass},
            success: function(data){
                jsondata = JSON.parse(data);
                console.log(jsondata);
                if(jsondata['status'] == true){
                    token = jsondata['payload']['token'];
                    nick = jsondata['payload']['nick'];
                    photo = jsondata['payload']['photo'];
                    role = jsondata['payload']['role'];
                    id = jsondata['payload']['id'];
                    localStorage.setItem('token', token);
                    localStorage.setItem('nick', nick);
                    localStorage.setItem('photo', photo);
                    localStorage.setItem('role', role);
                    localStorage.setItem('id',id)
                    document.location.href = "mess.html";
                }else{
                   
                }
            }
        });
    }else{
        console.log('empty');
    }
}
let token = localStorage.getItem('token');

function setUserData(){
    let userphoto = document.getElementById("userphoto");
    //  console.log(userphoto);
    userphoto.setAttribute('src', localStorage.getItem('photo'));
}

function getDialogs()
{
    
    let list = document.getElementById('friend-list');
    $.ajax({
        url: 'http://api.unmessenger.com/getDialogs',
        method: 'get',
        dataType: 'html',
        headers: {
            "token":token
        },
        success: function(data){
            jsondata = JSON.parse(data);
  //          console.log(jsondata);
            let status = jsondata['status'];
            if(status == true){
               // console.log(jsondata['payload']);
                let tmp = jsondata['payload'];
                let len = tmp.length;
              //  console.log(len);
                
                if(len == undefined){
                    let list = document.getElementById('friend-list');
                    list.innerHTML = "";
                    list.innerHTML += 'Тут будет отображаться переписка';
                }else{
                    list.innerHTML ="";
                    for(i = 0; i<len; i++){
                      let detail_user_info = getInfo(jsondata['payload'][i]['secnod_user']);
                      console.log(detail_user_info);
                      let get_last_mess = getMessage(jsondata['payload'][i]['dialog_id']);
                      console.log(get_last_mess);
                      var sender ="";
                      var who ="";
                        if(get_last_mess['payload']['noti'] == 'no mess'){
                            sender = "Система";
                            mess = "Напишите первым! :)";
                        }else{
                            
                            tmps = get_last_mess['payload']['length']-1;
                            if( get_last_mess['payload'][tmps]['message_text'] == "" &  get_last_mess['payload']['noti'] != 'no mess'){
                                mess = "Вложение"
                            }else{
                                mess = get_last_mess['payload'][tmps]['message_text']; 
                                localStorage.setItem('lastmess_'+jsondata['payload'][i]['dialog_id'],get_last_mess['payload'][tmps]['message_text'] );
                                localStorage.setItem('lastmess_id_'+jsondata['payload'][i]['dialog_id'],get_last_mess['payload'][tmps]['message_id'] );
                            }
                            who = get_last_mess['payload'][tmps]['sender']; 
                            
                        }
                        
                        tmps = get_last_mess['payload']['length']-1;
                        if(who == localStorage.getItem('id')){
                            sender = "Вы";
                        }else{
                            
                            sender = "Сообщение";

                        }
                        
                        
                      //  console.log(detail_user_info);
                        

                       
                        
                        
                         
                    list.innerHTML += '<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><i class=" mdl-list__item-avatar">'
                            +'<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+detail_user_info['payload']['photo']+'">'+
                            
                        '</i>'+
                        '<a href="/dialog.html?/dialog_id='+jsondata['payload'][i]['dialog_id']+'&user_id='+jsondata['payload'][i]['secnod_user']+'">'+
                  '<span>'+jsondata['payload'][i]['nick']+'</span>'+
                    '</a>'+" "+detail_user_info['payload']['status']+
                  '<span class="mdl-list__item-text-body">'+
                  
                  sender+ ': '+mess+   
                  '</span>'+
                '</span>'+
                '<span class="mdl-list__item-secondary-content">'+
                   
                '</span>'+
                              '</li>';
                       // console.log(mess);
                    
                   // let detail_user_info = getInfo(jsondata['payload'][i]['secnod_user']);


                  }

                }

                
               // console.log(list);
               
              /* for(let i=0; i<len; i++){
                    
                    if(get_last_mess == 0){
                        get_last_mess == 'начните общение';
                    }
                    console.log(jsondata);
                    var lm;
                    var mess;
                    var who;
                    var sender;
                    if(get_last_mess['status'] == true){
                       // console.log(get_last_mess);
                       // console.log(get_last_mess['payload'][i]['dialog_id']);
                     //   console.log(get_last_mess['payload']['length']-1);
                        lm = get_last_mess['payload']['length']-1;
                        mess = get_last_mess['payload'][lm]['message_text'];
                        who = get_last_mess['payload'][lm]['sender'];
                     //   console.log('sender'+ who);

                        if(who == localStorage.getItem('id')){
                            sender = 'Вы';
                        }else{
                            sender = 'Сообщение';
                        }
                    }else{
                        mess = 'Начните ваш диалог';
                    }
                  //  console.log(get_last_mess);
                    
                    list.innerHTML ="";
                    list.innerHTML += '<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><i class=" mdl-list__item-avatar">'
                            +'<img style="border-radius:  30px;" width="40px" height ="40px" src="/test-img/ava.jpg">'+
                            
                        '</i>'+
                        '<a href="/dialog.html?/dialog_id='+get_last_mess['payload'][i]['dialog_id']+'&user_id='+jsondata['payload'][i]['secnod_user']+'">'+
                  '<span>'+jsondata['payload'][i]['nick']+'</span>'+
                    '</a>'+" "+detail_user_info['payload']['status']+
                  '<span class="mdl-list__item-text-body">'+
                  
                   sender+': '+mess+   
                  '</span>'+
                '</span>'+
                '<span class="mdl-list__item-secondary-content">'+
                   
                '</span>'+
                              '</li>';
                }*/
            }
        }
        
    });
        
}
var megadata = "";

function logOut(token)
{
    
    $.ajax({
        url: 'http://api.unmessenger.com/logOut/',
        method: 'post',
        async: false,
        dataType: 'html',
        headers: {
            "token":token
        },
        success : function(text)
         {
             response = text;
            }
            
        }).responseText;
        localStorage.setItem('token', '');
        document.location = 'auth.html';
}

function searchFriend(name){
    
    var response =  $.ajax({
        url: 'http://api.unmessenger.com/userSearch/'+name,
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":token
        },
        success : function(text)
         {
             response = text;
            }
            
        }).responseText;
        var list = document.getElementById("user-list");
    response = JSON.parse(response);    
    len = response['payload']['length'];
    for(i= 0; i<len; i++){
        list.innerHTML += '<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><i class=" mdl-list__item-avatar">'
                            +'<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+response['payload'][i]['photo']+'">'+
                            
                        '</i>'+
                        '<a>'+
                  '<span>'+response['payload'][i]['nick']+'</span>'+
                    '</a>'+
                  '<span class="mdl-list__item-text-body">'+
                  '<a href="add.html?id='+response['payload'][i]['id']+'">Добавить</a>'+
                   
                  '</span>'+
                '</span>'+
                '<span class="mdl-list__item-secondary-content">'+
                   
                '</span>'+
                              '</li>';
    }
    console.log(response);
}

function setOffline()
{
    $.ajax({
        url: 'http://api.unmessenger.com/setOffline',
        method: 'post',
        dataType: 'html',
        headers: {
            "token":localStorage.getItem('token')
        },
        data: {message: message},
        success: function(data){
           alert('статус: offline')
        }
    });
}

function getInfo(id)
{

   var response =  $.ajax({
        url: 'http://api.unmessenger.com/getInfo/'+id,
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":token
        },
        success : function(text)
         {
             response = text;
         }
        
    }).responseText;

    return JSON.parse(response);
   
}
function getMessage(id)
{

   var response =  $.ajax({
        url: 'http://api.unmessenger.com/getMessageOld/'+id,
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":token
        },
        success : function(text)
         {
             response = text;
         }
        
    }).responseText;
    console.log(JSON.parse(response))   
    return JSON.parse(response);
   
}

function getFiles(token)
{
    var response =  $.ajax({
        url: 'http://api.unmessenger.com/getAllFiles/',
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":token
        },
        success : function(text)
         {
             response = text;
         }
        
    }).responseText;

    return JSON.parse(response);
}

function getcanals()
{
    var response =  $.ajax({
        url: 'http://api.unmessenger.com/getsub/',
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":localStorage.getItem('token')
        },
        success : function(text)
         {
             response = text;
         }
        
    }).responseText;

    return JSON.parse(response);
}

function renderMess(){
    var gets = (function() {
        var a = window.location.search;
        var b = new Object();
        a = a.substring(1).split("&");
        for (var i = 0; i < a.length; i++) {
          c = a[i].split("=");
            b[c[0]] = c[1];
        }
        return b;
    })();
   

        console.log(gets);
        var dialog_id = gets['/dialog_id'];
        //console.log(dialog_id);
    
        var getter = gets['user_id'];


   var messages = getMessage(dialog_id );
    var id = messages;

    var chel1 = getInfo(getter);
   
   
    che1_photo = chel1['payload']['photo'];
    che1_nick = chel1['payload']['nick'];

    console.log(che1_photo)
    //console.log(chel2_photo)
    
     
    var chat = document.getElementById('messchat');
   //    console.log(chat);

    var len = messages['payload']['length'];
    console.log(len);
    chat.innerHTML = "";
    user = localStorage.getItem('id');
    for(i=0; i<len; i++){
        var user = localStorage.getItem('id');
        console.log(messages);
        if(messages['payload'][i]['message_file'] !=""){
            if(messages['payload'][i]['type'] == 'image'){
                mages = messages['payload'][i]['message_text']
                mail = mages+ '<br><img  style="max-width:270px; max-height:400px"  src='+'http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'>'
                
            }
            if(messages['payload'][i]['type'] == 'audio' || messages['payload'][i]['type'] == 'sound' || messages['payload'][i]['type'] == 'music' ){
                mages = messages['payload'][i]['message_text']
                
             



                mail = mages+
                '<br><audio controls=""  name="media"><source src="http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'" type="audio/mpeg"></audio>'
                
                
            }  
            if(messages['payload'][i]['type'] == 'video' ){
                mages = messages['payload'][i]['message_text']
                
             



                mail = mages+
                '<br><video style="max-width:250px" controls="" name="media"><source src="http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'"type="video/mp4"></video>'
                
                
            }
            
            if(messages['payload'][i]['type'] == 'file' ){
                mages = messages['payload'][i]['message_text']
                
             



                mail = mages+
                '<br><a href="http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'">Вложение '+messages['payload'][i]['type']+'</a>'
                
                
            }
            

        }else{
            mail = messages['payload'][i]['message_text']
        }
        console.log('234234234'+mages); 
        if(messages['payload'][i]['sender'] == user){
         
            var jarr = getInfo(messages['payload'][i]['sender']);
            var ph = jarr['payload']['photo']
            var nicks = jarr['payload']['nick']
            var mages= '';
          
            
            chat.innerHTML +=
            ' <div class="chat__item chat__item--responder" >'+
            '<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+ph+'">'+
                    
            ' <div class="chat__messages ">'+
               '<div class="chat__message">'+
               '<div class="chat__message-content"><div class="chat__message-time"><a>'+nicks+'</a></div>'+mail+

             
               '<br><div class="chat__message-time lt">['+messages['payload'][i]['data_send']+']</div>'+'</div>'+
               '</div>'+ 
               '</div>'+
               
               
             '</div>'+
           '</div><br>';
        /*chat.innerHTML +='<tr>'+
        '<td class="mdl-data-table__cell--non-numeric"></td><td>'+messages['payload'][i]['message_text']+'  ['+messages['payload'][i]['data_send']+'] </td>'+
    
        '</tr>';*/
        }else{
            var text = "<b>"
            var text1 = "</b>"

            
       // console.log(imgpath);
        chat.innerHTML +=
       ' <div class="chat__item " style="max-width:50%">'+
                      '<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+che1_photo+'">'+
                    
                     ' <div class="chat__messages ">'+
                        '<div class="chat__message">'+
                        '<div class="chat__message-content"><div class="chat__message-time"><a>'+che1_nick+'</a></div>'+mail+

                      
                        '<br><div class="chat__message-time lt">['+messages['payload'][i]['data_send']+']</div>'+'</div>'+
                        '</div>'+ 
                        '</div>'+
                        
                        
                      '</div>'+
                    '</div><br>';
        
        //'<tr>'+
       /* '<td class="mdl-data-table__cell--non-numeric">['+messages['payload'][i]['data_send']+'] '+messages['payload'][i]['message_text']+'</td>'
        +'<td></td>'+
    
        '</tr>';*/
        }
    
    }
    console.log('call');

}


function modMess()
{
    var gets = (function() {
        var a = window.location.search;
        var b = new Object();
        a = a.substring(1).split("&");
        for (var i = 0; i < a.length; i++) {
            c = a[i].split("=");
            b[c[0]] = c[1];
        }
        return b;
    })();
    var lm = localStorage.getItem('lastmess_'+gets['/dialog_id']);
    var last_id = localStorage.getItem('lastmess_id_'+gets['message_id']);
    var usr = gets['user_id'];
    
    let get_last_mess = getMessage(gets['/dialog_id']);
    var ln = get_last_mess['payload']['length']-1;
    var lastmes_text = get_last_mess['payload'][ln]['message_text'];
    var lastmes_text_id = get_last_mess['payload'][ln]['message_id'];
    var lastmes_file = get_last_mess['payload'][ln]['message_file'];
    if(lastmes_text != lm && last_id != lastmes_text_id){
        console.log("moded");
    //  let get_last_mess = getMessage(gets['/dialog_id']);
        var ln = get_last_mess['payload']['length']-1;
        var lastmes_text = get_last_mess['payload'][ln]['message_text'];
        var messages = getMessage(gets['/dialog_id']);
        var getter = gets['user_id'];
        var id = messages;
    
        var chel1 = getInfo(getter);
       
       
        che1_photo = chel1['payload']['photo'];
        che1_nick = chel1['payload']['nick'];
        console.log(che1_photo)
        //console.log(chel2_photo)
        
         
        var chat = document.getElementById('messchat');
       //    console.log(chat);
    
        var len = messages['payload']['length'];
        console.log(len);
      //  chat.innerHTML = "";
        user = localStorage.getItem('id');
        for(i = ln; i<get_last_mess['payload']['length']; i++){
            var user = localStorage.getItem('id');
            console.log(messages);
            if(messages['payload'][i]['message_file'] !=""){
                if(messages['payload'][i]['type'] == 'image'){
                    mages = messages['payload'][i]['message_text']
                    mail = mages+ '<br><img  style="max-width:270px; max-height:400px"  src='+'http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'>'
                    
                }
                if(messages['payload'][i]['type'] == 'audio' || messages['payload'][i]['type'] == 'sound' || messages['payload'][i]['type'] == 'music' ){
                    mages = messages['payload'][i]['message_text']
                    
                 
    
    
    
                    mail = mages+
                    '<br><audio controls=""  name="media"><source src="http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'" type="audio/mpeg"></audio>'
                    
                    
                }  
                if(messages['payload'][i]['type'] == 'video' ){
                    mages = messages['payload'][i]['message_text']
                    
                 
    
    
    
                    mail = mages+
                    '<br><video style="max-width:250px" controls="" name="media"><source src="http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'"type="video/mp4"></video>'
                    
                    
                }
                
                if(messages['payload'][i]['type'] == 'file' ){
                    mages = messages['payload'][i]['message_text']
                    
                 
    
    
    
                    mail = mages+
                    '<br><a href="http://api.unmessenger.com/'+messages['payload'][i]['message_file']+'">Вложение '+messages['payload'][i]['type']+'</a>'
                    
                    
                }
                
    
            }else{
                mail = messages['payload'][i]['message_text']
            }
            console.log('234234234'+mages); 
            if(messages['payload'][i]['sender'] == user){
             
                var jarr = getInfo(messages['payload'][i]['sender']);
                var ph = jarr['payload']['photo']
                var nicks = jarr['payload']['nick']
                var mages= '';
              
                
                chat.innerHTML +=
                ' <div class="chat__item chat__item--responder" >'+
                '<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+ph+'">'+
                        
                ' <div class="chat__messages ">'+
                   '<div class="chat__message">'+
                   '<div class="chat__message-content"><div class="chat__message-time"><a>'+nicks+'</a></div>'+mail+
    
                 
                   '<br><div class="chat__message-time lt">['+messages['payload'][i]['data_send']+']</div>'+'</div>'+
                   '</div>'+ 
                   '</div>'+
                   
                   
                 '</div>'+
               '</div><br>';
            /*chat.innerHTML +='<tr>'+
            '<td class="mdl-data-table__cell--non-numeric"></td><td>'+messages['payload'][i]['message_text']+'  ['+messages['payload'][i]['data_send']+'] </td>'+
        
            '</tr>';*/
            }else{
                var text = "<b>"
                var text1 = "</b>"
    
                
           // console.log(imgpath);
            chat.innerHTML +=
           ' <div class="chat__item " style="max-width:50%">'+
                          '<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+che1_photo+'">'+
                        
                         ' <div class="chat__messages ">'+
                            '<div class="chat__message">'+
                            '<div class="chat__message-content"><div class="chat__message-time"><a>'+che1_nick+'</a></div>'+mail+
    
                          
                            '<br><div class="chat__message-time lt">['+messages['payload'][i]['data_send']+']</div>'+'</div>'+
                            '</div>'+ 
                            '</div>'+
                            
                            
                          '</div>'+
                        '</div><br>';
            
            //'<tr>'+
           /* '<td class="mdl-data-table__cell--non-numeric">['+messages['payload'][i]['data_send']+'] '+messages['payload'][i]['message_text']+'</td>'
            +'<td></td>'+
        
            '</tr>';*/
            }

       /* for(i = ln; i<get_last_mess['payload']['length']; i++){
            console.log(get_last_mess['payload'][i]['message_text']);
            var chat = document.getElementById('messchat');
            
            chat.innerHTML +=
            ' <div class="chat__item chat__item--responder" >'+
            '<img style="border-radius:  30px;" width="40px" height ="40px" src="'+'http://api.unmessenger.com/'+'">'+
                    
            ' <div class="chat__messages ">'+
               '<div class="chat__message">'+
               '<div class="chat__message-content"><div class="chat__message-time"><a>'+'</a></div>'+get_last_mess['payload'][i]['message_text']+

             
               '<br><div class="chat__message-time lt">['+']</div>'+'</div>'+
               '</div>'+ 
               '</div>'+
               
               
             '</div>'+
           '</div><br>';
        }*/


        console.log(lastmes_text);
        localStorage.setItem('lastmess_'+gets['/dialog_id'],lastmes_text);
        
        //renderMess();
        
    }    
}

}


function checkAuth()
{
    var response =  $.ajax({
        url: 'http://api.unmessenger.com/checkAuth',
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":token
        },
        success : function(text)
         {
             response = text;
         }
        
    }).responseText;
    resp = JSON.parse(response);
    console.log(response);
    if(resp['status'] == false){

        document.location.href = "auth.html";

    }else{
        //window.location.href = 'mess.html';
    }
}


function sendMessage(dialog_id, user_id, form){
    $.ajax({
        url: 'http://api.unmessenger.com/sendMessage/'+dialog_id+'/'+user_id+'',
        method: 'post',
        dataType: 'html',
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            "token":token
        },
        data: form,
        success: function(data){
          // renderMess();
        }
    });
}
function sendMessageCh(id, form){
    $.ajax({
        url: 'http://api.unmessenger.com/messageChannel/'+id+'',
        method: 'post',
        dataType: 'html',
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            "token":localStorage.getItem('token')
        },
        data: form,
        success: function(data){
            js = JSON.parse(data);
            if(js['status'] == false){
                alert('Вы не можите писать')
            }else{
                alert('Пост создан!')
                window.location = 'channell.html?id='+id
            }
          // renderMess();
        }
    });
}



function createDialog(id){
    $.ajax({
        url: 'http://api.unmessenger.com/createDialog',
        method: 'post',
        dataType: 'html',
        headers: {
            "token":token
        },
        data: {'user_id': id},
        success: function(data){
           document.location.href="invite.html";
        }
    });
    
}

function createChannel(name, description)
{
    $.ajax({
        url: 'http://api.unmessenger.com/createChannel',
        method: 'post',
        dataType: 'html',
        headers: {
            "token":localStorage.getItem('token')
        },
        data: {cname: name, description: description},
        success: function(data){
           
        }
    });
}

function getmesschan(id)
{
    var response =  $.ajax({
        url: 'http://api.unmessenger.com/getMessChann/'+id,
        method: 'get',
        async: false,
        dataType: 'html',
        headers: {
            "token":localStorage.getItem('token')
        },
        success : function(text)
         {
             response = text;
         }
        
    }).responseText;

    return JSON.parse(response);
}


function sub(id){
    $.ajax({
        url: 'http://api.unmessenger.com/sub/'+id,
        method: 'post',
        dataType: 'html',
        headers: {
            "token":localStorage.getItem('token')
        },
        
        success: function(data){
           
        }
    });
}




