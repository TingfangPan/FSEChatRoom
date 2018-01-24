    
    window.onload = function() {
        var hichat = new HiChat();
        hichat.init();
    };
    
    var HiChat = function() {
        this.socket = null;
    };
    
    HiChat.prototype = {
        init: function() {
            var that = this;
            var userName;
            this.socket = io.connect();
            that.socket.emit('login', "He");
            this.socket.on('system', function(msg) {
            
                for(var i = 0; i < msg.length; i++)
                {
                    that._displayNewMsg(msg[i].hMsg);
                }
                
            });
            that.socket.emit('getName',"He");
            this.socket.on('receiveName',function(msg){
                //document.write("jfidsning");
                userName = msg;
            })
            this.socket.on('newMessage', function(msg){
                that._displayNewMsg(msg, 'black')
            });
            var sendMsg = document.getElementById("sendmsg");
            sendMsg.onclick = function()
            {
                var msgBox = document.getElementById("msgbox");
                date = new Date().toLocaleString();
               
                //document.write(userName + "  " + date + "  " + msgBox.value);
                that.socket.emit('sendMsg',userName + "  " + date + "  <br>" + msgBox.value);
                msgBox.value = "";

            }
            
        },
        _displayNewMsg: function(msg, color) {
            var container = document.getElementById('historyMsg'),
                msgToDisplay = document.createElement('p');
                
            msgToDisplay.style.height = '60px';
            msgToDisplay.style.backgroundColor = '#EEEEE0';
            msgToDisplay.style.color = color || '#000';
            msgToDisplay.innerHTML = msg;
            container.appendChild(msgToDisplay);
            container.scrollTop = container.scrollHeight;
        }
        
    };
    
    
