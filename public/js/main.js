// Player object
class Player {
   constructor() {
      this.playerAdjective = adj[Math.floor(Math.random() * Math.floor(adj.length))];
      this.playerNoun = noun[Math.floor(Math.random() * Math.floor(noun.length))];
      this.playerPoints = 0;
      this.playerLevel = 1;
      this.playerAutoClickStatus = false;
      this.playerAutoClick;
   }
   get adjective() {
      return this.playerAdjective;
   }
   set adjective(newAdj) {
      this.playerAdjective = newAdj;
   }
   get noun() {
      return this.playerNoun;
   }
   set noun(newNoun) {
      this.playerNoun = newNoun;
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
         appendMessage(this, "<span class='green'>Enabling AutoCode</span>");
         let t = this;
         t.playerAutoClick = setInterval(function() {
            t.addPoint();
            appendMessage(t, "Lines of code: <strong>" + t.points + "</strong>");
         }, 250);
      } else if (newAutoClick == false) {
         appendMessage(this, "<span class='red'>Disabling AutoCode</span>");
         clearInterval(this.playerAutoClick);
      }
      this.playerAutoClickStatus = newAutoClick;
   }
   addLevel() {
      this.level += 1;
      appendMessage(this, "<span class='green'>You leveled up! Level: " + this.level + "</span>");
   }
   addPoint() {
      this.points += 1;

      // level = constant * sqrt(xp)
      let newLevel = .42/2 * Math.sqrt(this.points);
      if(newLevel > this.level) {
         this.addLevel();
      }
   }
}

$(document).ready(function() {
   // Main
   let p = new Player();
   init(p, "Hello, World!");
   appendMessage(p, "Click to start programming...");

   // Events
   $('.click-region').click(function() {
      p.addPoint();
      appendMessage(p, "Lines of code: <strong>" + p.points + "</strong>");
   });

   $('.clear').click(function(e) {
      e.preventDefault();
      clearMessages(p);
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
   console.log("Running...");
   appendMessage(p, welcome);
}

function appendMessage(p, message, window = $('#messages')) {
   let parentNode = document.getElementById("messages");
   if(parentNode.hasChildNodes()) {
      // start removing messages at the top of stack
      if(parentNode.childNodes.length > 150) {
         parentNode.removeChild(parentNode.childNodes[0]);
      }
   }
   window.append("<p><!--<span class='output'>&gt;&gt;</span> --><span class='yellow'>$" + p.adjective + p.noun + "</span> <span class='output'>>></span> " + message + "</p>");
   window.scrollTop(window.prop("scrollHeight"));
}

function clearMessages(p, window = $('#messages')) {
   window.html("");
   appendMessage(p, "clear()");
}