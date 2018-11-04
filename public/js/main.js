
// Player object
class Player {
   constructor() {
      this.playerPoints = 0;
      this.playerLevel = 1;
      this.playerAutoClickStatus = false;
      this.playerAutoClick;
   }
   get level() {
      return this.playerLevel;
   }
   set level(newLevel) {
      this.playerLevel = newLevel;
   }
   get points() {
      return this.playerPoints;
   }
   set points(newPoints) {
      this.playerPoints = newPoints;
   }
   get autoClick() {
      return this.playerAutoClickStatus;
   }
   set autoClick(newAutoClick) {
      if(newAutoClick == true && this.playerAutoClickStatus == false) {
         appendMessage("<span class='green'>Enabling AutoCode</span>");
         let t = this;
         this.playerAutoClick = setInterval(function() {
            t.addPoint();
            appendMessage("Lines of code: <strong>" + t.points + "</strong>");
         }, 1000);
      } else if (newAutoClick == false) {
         appendMessage("<span class='red'>Disabling AutoCode</span>");
         clearInterval(this.playerAutoClick);
      }
      this.playerAutoClickStatus = newAutoClick;
   }
   addLevel() {
      this.level += 1;
      appendMessage("You leveled up! Level: " + this.level);
   }
   addPoint() {
      this.points += 1;

      // level = constant * sqrt(xp)
      let newLevel = .42 * Math.sqrt(this.points);
      if(newLevel > this.level) {
         this.addLevel();
      }
   }
}

$(document).ready(function() {
   // Main
   let p = new Player();

   init(p, "Lines of code: <strong>" + p.points + "</strong>");

   $('.click-region').click(function() {
      p.addPoint();
      
      // Enable autoclick at level 4
      // if(p.level == 3) {
      //    $('.autoclick').show()
      //    p.autoClick = true;
      // }
      appendMessage("Lines of code: <strong>" + p.points + "</strong>");
   });

   $('.clear').click(function(e) {
      e.preventDefault();
      clearMessages();
   });

   $('.autoclick').click(function() {
      if(p.autoClick) {
         p.autoClick = false;
         $('.autoclick').html('AutoCode');
      } else {
         p.autoClick = true;
         $('.autoclick').html('AutoCode (✔)');
      }
   })

});

function init(p, welcome) {
   // Player object, welcome message
   console.log("Running...");
   appendMessage(welcome);
}

function appendMessage(message, window = $('#messages')) {
   window.append("<p><span class='output'>&gt;&gt;</span> " + message + "</p>");
   $('#messages').scrollTop($('#messages').prop("scrollHeight"));
}

function clearMessages(window = $('#messages')) {
   window.html("");
   appendMessage("clear()");
}