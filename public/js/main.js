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
         $('.autoclick').html('AutoCode (✔)');
         let t = this;
         t.playerAutoClick = setInterval(function() {
            t.addPoint();
            appendMessage(t, "Lines of code: <strong>" + t.points + "</strong>");
         }, 250);
      } else if (newAutoClick == false) {
         $('.autoclick').html('AutoCode');
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
   saveToLocal() {
      localStorage.setItem("player", JSON.stringify(this));
      console.log(localStorage.getItem("player"));
      console.log("Session saved.");
   }
   loadFromLocal() {
      if(localStorage.player) {
         console.log("Loading previous session.");
         let p = JSON.parse(localStorage.getItem("player"));
         console.log(p);
         this.adjective = p.playerAdjective;
         this.noun = p.playerNoun;
         this.points = p.playerPoints;
         this.level = p.playerLevel;
         this.autoClick = p.playerAutoClickStatus;
         return true;
      } else {
         console.log("Cannot load from localStorage.");
         return false;
      }
   }
}

$(document).ready(function() {
   // Main
   let p = new Player();
   init(p, "Hello, World!");

   // Events
   $('.click-region').click(function() {
      p.addPoint();
      appendMessage(p, "Lines of code: <strong>" + p.points + "</strong>");
   });

   $('.new').click(function(e) {
      e.preventDefault();

      // create new player object and flush cache
      localStorage.removeItem("player");
      p = new Player();

      // prepare new window
      $('#messages').html("");
      init(p, "Hello, World!");
   });

   $('.save').click(function(e) {
      e.preventDefault();
      p.saveToLocal();
   });

   $('.clear').click(function(e) {
      e.preventDefault();
      clearMessages(p);
   });

   $('.autoclick').click(function() {
      if(p.autoClick) {
         p.autoClick = false;
         appendMessage(p, "<span class='red'>Disabling AutoCode</span>");
      } else {
         p.autoClick = true;
         appendMessage(p, "<span class='green'>Enabling AutoCode</span>");
      }
   })

});

function init(p, welcome) {
   console.log("Running...");
   if(p.loadFromLocal()) {
      appendMessage(p, "Welcome back, " + p.adjective + p.noun + ".");
   } else {
      appendMessage(p, welcome);
   }
   appendMessage(p, "Click to start programming...");
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