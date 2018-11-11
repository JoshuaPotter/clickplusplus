// Player object
class Player {
   constructor() {
      // set name
      this.playerAdjective = adj[Math.floor(Math.random() * Math.floor(adj.length))];
      this.playerNoun = noun[Math.floor(Math.random() * Math.floor(noun.length))];

      // set points
      this.playerPoints = 0;

      // set level
      this.playerLevel = 1;

      // set click rate
      this.playerClickRate = 1;

      // set money
      this.playerMoney = 0;  

      // set autoclick
      this.playerAutoClickStatus = false;
      this.playerAutoClick; // interval container

      // set playerskills
      // ordered by price, low to high
      this.playerSkills = {
         "HTML": true, // always true, base skill
         "CSS": false,
         "JavaScript": false,
         "Python": false,
         "PHP": false,
         "MySQL": false,
         "C++": false, 
         "Java": false,
      }
   }

   // Getters & Setters
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

   get points() {
      return this.playerPoints;
   }
   set points(newPoints) {
      this.playerPoints = newPoints;
   }

   get level() {
      return this.playerLevel;
   }
   set level(newLevel) {
      this.playerLevel = newLevel;
   }

   get clickRate() {
      return this.playerClickRate;
   }
   set clickRate(newClickRate) {
      this.playerClickRate = newClickRate;
   }

   get money() {
      return this.playerMoney;
   }
   set money(newMoney) {
      this.playerMoney = newMoney;
   }

   get autoClick() {
      return this.playerAutoClickStatus;
   }
   set autoClick(newAutoClick) {
      if(newAutoClick == true && this.playerAutoClickStatus == false) {
         $('.autoclick').html('AutoCode (✔)');
         let p = this;
         p.playerAutoClick = setInterval(function() {
            p.addPoint();
            printLines(p);
            updateMoney(p);
         }, 5000);
      } else if (newAutoClick == false) {
         $('.autoclick').html('AutoCode');
         clearInterval(this.playerAutoClick);
      }
      this.playerAutoClickStatus = newAutoClick;
   }

   get skills() {
      return this.playerSkills;
   }
   set skills(newSkills) {
      this.playerSkills = newSkills;
   }

   // Save & Load
   load(p) {
      this.adjective = p.playerAdjective;
      this.noun = p.playerNoun;
      this.points = p.playerPoints;
      this.level = p.playerLevel;
      this.clickRate = p.playerClickRate;
      this.money = p.playerMoney;
      this.autoClick = p.playerAutoClickStatus;
      this.skills = p.playerSkills;
      this.saveToLocal();
      console.log('load', this);
   }
   saveToLocal() {
      // convert player object to string and save to localStorage
      // optimize: only save if there are changes
      localStorage.setItem("player", JSON.stringify(this));
      console.log("Session saved.");
   }
   loadFromLocal() {
      if(localStorage.player) {
         // found previous session in localStorage
         console.log("Loading previous session.");
         let p = JSON.parse(localStorage.getItem("player"));
         this.load(p);
         return true;
      } else {
         // no previous session found
         return false;
      }
   }
   exportSave() {
      let save = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(this));
      return save;
   }

   // Increment Functions
   addPoint() {
      this.points += this.clickRate;
      this.money += (this.clickRate/100) * this.skillModifier();

      // level = constant * sqrt(xp)
      let newLevel = .42/2 * Math.sqrt(this.points);
      if(newLevel > this.level) {
         this.addLevel();
      }
   }
   addLevel() {
      this.level += 1;
      appendMessage(this, "<span class='green'>You leveled up! Level: " + this.level + "</span>");
   }
   addClickRate() {
      this.clickRate += 1;
      appendMessage(this, "<span class='green'>Click rate increased! +" + this.clickRate + " per click.</span>")
   }
   skillModifier() {
      // store modifier as member data when adding skill to increase efficiency
      // instead of calculating it every time
      let modifier = 0;
      for(let key in this.skills) {
         if(this.skills[key] == true) {
            modifier++;
            // console.log(key + " " + this.skills[key]);
         }
      }
      return modifier;
   }
}

// Main
$(document).ready(function() {
   // create player object and autosave interval container
   let p = new Player();
   let autoSave;

   // elements
   let $clickregion = $('.click-region');
   let $new = $('#new');
   let $save = $('#save');
   let $export = $('#export');

   // start game
   init(p, autoSave, "Hello, World!");

   // user initialized events
   $clickregion.click(function() {
      p.addPoint();
      printLines(p);
      updateMoney(p);
      updateSkills(p);
   });

   $new.click(function(e) {
      e.preventDefault();
      let c = confirm("Starting a new game will delete your current progress.")

      if(c) {
         // create new player object and flush cache
         localStorage.removeItem("player");
         p = new Player();

         // prepare new window
         clearMessages(p);
         appendMessage(p, "<span class='green'>New game started.</span>");
         init(p, autoSave, "Hello, World!");
      }
   });

   $save.click(function(e) {
      e.preventDefault();
      p.saveToLocal();
      appendMessage(p, "<span class='green'>Game saved.</span>");
   });

   $export.click(function(e) {
      e.preventDefault();
      p.saveToLocal();

      // setup file
      let exportSave = document.createElement('a');
      exportSave.style.visibility = "hidden";
      exportSave.setAttribute('href', p.exportSave());
      exportSave.setAttribute('download', 'code-clicker-save.json');

      // execute download
      document.body.appendChild(exportSave);
      exportSave.click();
      document.body.removeChild(exportSave);

      appendMessage(p, "<span class='green'>Downloading save file.</span>");
   });

   $('#import-input').on('change', function() {
      let file = this.files[0];
      if(!file) {
         return false;
      }

      let fr = new FileReader();

      fr.onload = function(e) {
         let result = JSON.parse(e.target.result);
         console.log("imported file", result);
         p.load(result);

         // prepare new window
         clearMessages(p);
         init(p, autoSave, "Welcome back, " + p.adjective + p.noun + ".");
         modal.close('#import-modal');
      }

      fr.readAsText(file);
   })

   $('#autocode').click(function(e) {
      e.preventDefault();
      if(p.autoClick) {
         p.autoClick = false;
         appendMessage(p, "<span class='red'>Disabling AutoCode</span>");
      } else {
         p.autoClick = true;
         appendMessage(p, "<span class='green'>Enabling AutoCode</span>");
      }
   });
   
   // $('.clickrate').click(function(e) {
   //    e.preventDefault();
   //    p.addClickRate();
   // });

   // $('.clear').click(function(e) {
   //    e.preventDefault();
   //    clearMessages(p);
   //    appendMessage(p, "<span class='green'>Window cleared.</span>");
   // });

});

function init(p, autoSave, welcome) {
   // load previous save if found
   if(p.loadFromLocal()) {
      appendMessage(p, "Welcome back, " + p.adjective + p.noun + ".");
   } else {
      appendMessage(p, welcome);
   }

   // set money
   updateMoney(p);

   // initialize autosave and run every 30 sec
   if(autoSave) {
      clearInterval(autoSave);
   }
   autoSave = setInterval(function() {
      p.saveToLocal();
   }, 30000);

   // initialize store
   updateSkills(p);

   console.log("Running...");
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
   window.append("<p><span class='yellow'>$" + p.adjective + p.noun + "</span> <span class='output'>>></span> " + message + "</p>");
   window.scrollTop(window.prop("scrollHeight"));
}

function clearMessages(p, window = $('#messages')) {
   window.html("");
}

function printLines(p) {
   appendMessage(p, "Lines of code: <strong>" + p.points.toLocaleString() + "</strong>");
}

function updateMoney(p) {
   $('.money').html("$" + p.money.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
}

function updateSkills(p) {
   $('#skills').html('');
   let i = 1;
   for(let key in p.skills) {
      if(p.skills.hasOwnProperty(key)) {
         let price = (Math.log(i)/2*400).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
         let canAfford = (p.money < price) || p.skills[key];
         $('#skills').append('<li><a href="#" disabled="' + canAfford +'" skill="' + key + '">' + key + ' ($' + price + ')</a></li>')
         i++;
      }
   }
}