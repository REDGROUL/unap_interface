function getContent(timestamp)
{
  
    $.ajax(
        {
            type: 'GET',
            url: 'http://api.unmessenger.com/longPullMessage',
            headers:{
                "token":'74ac76b244a84e4d34bb63b2d180b2c7aead61b3ad536fa4ae663add85d0c4b1'
            },
            
            success: function(data){
                // put result data into "obj"
                console.log(data);
                
              
            }
        }
    );
}

// initialize jQuery
$(function() {
    getContent();
});