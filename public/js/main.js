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
      this.playerAutoClick = false;
      this.playerAutoClickInterval; // interval container

      // set playerskills
      // ordered by price, low to high
      this.playerSkills = {
         "HTML": true,        // always true, base skill
         "CSS": false,
         "JavaScript": false,
         "Python": false,
         "R": false,
         "SQL": false,
         "PHP": false,
         "C++": false,
         "Java": false,
         "Ruby": false,
         "Assembly": false,   // ugh 🙄
         "Fortran": false,
      }
   }

   // getters & setters
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
      return this.playerAutoClick;
   }
   set autoClick(newAutoClick) {
      if(newAutoClick == true && this.playerAutoClick == false) {
         $('.autoclick').html('AutoCode (✔)');
         let p = this;
         p.playerAutoClickInterval = setInterval(function() {
            p.addPoint();
            printLines(p);
            updateMoney(p);
         }, 5000);
      } else if (newAutoClick == false) {
         $('.autoclick').html('AutoCode');
         clearInterval(this.playerAutoClickInterval);
      }
      this.playerAutoClick = newAutoClick;
   }

   get skills() {
      return this.playerSkills;
   }
   set skills(newSkills) {
      this.playerSkills = newSkills;
   }

   numSkills() {
      let length = 0;
      let skills = this.skills;
      for(let key in skills) {
         if(skills[key] == true) {
            length += 1;
         }
      }
      return length;
   }

   // Save & Load
   load(p) {
      console.log(this);

      Object.keys(p).forEach(function(key) {
         // for each property in the save file, instantiate it in
         //   the player object if the property exists
         let basicKey = key.replace("player", "");
         basicKey = basicKey.charAt(0).toLowerCase() + basicKey.slice(1);
         console.log(basicKey + ", " + key);
         if(this.hasOwnProperty(key)) {
            console.log(this[basicKey] + ", " + p[key]);
            this[basicKey] = p[key];
         }
      }, this);

      this.saveToLocal();

      console.log(this);
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
      // create file with json payload for download
      let save = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(this));
      return save;
   }

   addPoint() {
      // increment points and money
      this.points += this.clickRate;
      this.money += (this.clickRate/100) * this.skillModifier();

      // level = constant * sqrt(xp)
      let newLevel = .42/2 * Math.sqrt(this.points);
      if(newLevel > this.level) {
         this.addLevel();
      }
   }
   addLevel() {
      // increment level
      this.level += 1;
      appendMessage(this, "<span class='green'>You leveled up! Level: " + this.level + "</span>");
   }
   addClickRate() {
      // incremement clickrate
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

   // click event
   $clickregion.click(function() {
      p.addPoint();
      printLines(p);
      updateMoney(p);
      updateSkills(p);
   });

   // create new game
   $new.click(function() {
      let c = confirm("Starting a new game will delete your current progress.")

      if(c) {
         // create new player object and flush cache
         if(p.autoClick) {
            p.autoClick = false;
         }
         localStorage.removeItem("player");
         p = new Player();

         // prepare new window
         clearMessages(p);
         appendMessage(p, "<span class='green'>New game started.</span>");
         init(p, autoSave, "Hello, World!");
      }
   });

   // save progress to browser
   $save.click(function() {
      p.saveToLocal();
      appendMessage(p, "<span class='green'>Game saved.</span>");
   });

   // download save file
   $export.click(function() {
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

   // load save file on file selection
   $(document).on('change', '#import', function() {
      let file = this.files[0];
      if(!file) {
         return false;
      }

      let fr = new FileReader();

      fr.onload = function(e) {
         let result = JSON.parse(e.target.result);
         p.load(result);

         // prepare new window
         clearMessages(p);
         init(p, autoSave, "Welcome back, " + p.adjective + p.noun + ".");
         modal.close('#import-modal');
      }

      fr.readAsText(file);
   })

   // buy skill
   $(document).on('click', '.skill', function(){
      if($(this).attr('disabled') != "disabled") {
         let skill = $(this).attr('data-skill');
         if(skill) {
            let skills = p.skills;
            skills[skill] = true;
            p.skills = skills;
            appendMessage(p, "You have unlocked " + skill + "! Your pay per click is multiplied by " + p.numSkills() + ".");
            updateSkills(p);
            p.money -= $(this).attr('data-price');
            updateMoney(p);
         }
      }
   });

   // autocode button
   $('#autocode').click(function() {
      if(p.autoClick) {
         p.autoClick = false;
         $(this).attr('disabled', true);
         appendMessage(p, "<span class='red'>Disabling AutoCode</span>");
      } else {
         p.autoClick = true;
         $(this).removeAttr('disabled');
         appendMessage(p, "<span class='green'>Enabling AutoCode</span>");
      }
   });
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
   clearInterval(autoSave);
   autoSave = setInterval(function() {
      p.saveToLocal();
   }, 30000);

   // initialize skills
   updateSkills(p);

   // initialize autoclick
   if(p.autoClick) {
      $('#autocode').removeAttr('disabled');
   } else {
      $('#autocode').attr('disabled', true);
   }

   console.log("Running...");
   appendMessage(p, "Click to start programming...");
}

function appendMessage(p, message, window = $('#messages')) {
   let parentNode = document.getElementById("messages");
   if(parentNode.hasChildNodes()) {
      // for each line appended, remove a line if we have printed more than 150
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
   $('.money-multiplier').html(p.numSkills() + "x");
}

function updateSkills(p) {
   let i = 1;
   $('#skills').html('');
   for(let key in p.skills) {
      let price = (Math.log(i)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      let disabled = (p.money < price) || p.skills[key];
      if(disabled) {
         // disabled
         $('#skills').append('<li><a href="#" class="skill" disabled data-skill="' + key + '" data-price="' + price + '">' + key + ' ($' + price + ')</a></li>');
      } else {
         $('#skills').append('<li><a href="#" class="skill" data-skill="' + key + '" data-price="' + price + '">' + key + ' ($' + price + ')</a></li>');
      }
      i++;
   }
}