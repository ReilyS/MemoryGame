/*
    Name: Reily Stanford & Enrique Tejeda
    Date: 3/1/2021
    File: mem.js
*/
    let time = 0;
    let timerStarted = false;
    let timer = new Number;

class MemGame {
    constructor(bDivId, bSize) {
        this.bDivId = bDivId;
        this.bDiv = document.getElementById(bDivId);
        this.bDiv.innerHTML = "<h1>Loading...</h1>";
        this.bSize = bSize;
        this.mainMenu();
    }

    mainMenu(){
        document.getElementById("header2").innerHTML = "Choose Difficulty";
        this.bDiv.className = "";
        this.bDiv.innerHTML = `<form>\n
                                <input type="radio" id="easy" name="difficulty" value="easy">\n
                                <label for="easy">Easy</label><br>\n
                                <input type="radio" id="medium" name="difficulty" value="medium">\n
                                <label for="medium">Medium</label><br>\n
                                <input type="radio" id="hard" name="difficulty" value="hard">\n
                                <label for="hard">Hard</label><br>\n
                                <button id="difficulty" type="button" onclick="m1.startGame(difficulty.value)">Start Game</button>
                                <button type="button" onclick="m1.highScore()">Highscore</button>`;
    }

    highScore(){
        document.getElementById("header2").innerHTML = "Highscore:";
        this.bDiv.className = "";
        let easy = localStorage.getItem("easyhighscore");
        let medium = localStorage.getItem("mediumhighscore");
        let hard = localStorage.getItem("hardhighscore");
        if(easy == null)
            easy = "N/A";
        if(medium == null)
            medium = "N/A";
        if(hard == null)
            hard = "N/A";   
        this.bDiv.innerHTML = `<p>Easy: ${easy}s</p>\n
                                <p>Medium: ${medium}s</p>\n
                                <p>Hard: ${hard}s</p>\n
                                <button type="button" onclick="m1.mainMenu()">Main Menu</button>`;
    }

    startGame(difficulty) {
        //Places images in cards on board
        this.initImages();
        //Setting time to 0 since game is just starting
        time = 0;
        //Marking the timer as not started
        timerStarted = false;
        //Deciding how many cards should be placed as well as storing 
        //the difficulty based on the user selected difficulty
        switch(difficulty){
            case "easy":
                this.bSize = 5;
                this.difficulty = "easy";
                break;
            case "medium":
                this.bSize = 10;
                this.difficulty = "medium";
                break;
            case "hard":
                this.bSize = 15;
                this.difficulty = "hard";
                break;
            default:
                return;
        }
        this.makeList(this.bSize);
        this.shuffle();
        this.genList();
        this.matchedCount = 0;
    }

    shuffle(){
        //Helper Array
        let temp = new Array();
        //Looping through all list items
        for(let i = 0; i < this.list.length; i++){
            //Generating a random index from 0 - 9
            let index = Math.floor(Math.random() * this.list.length);
            //Generating a new index if temp has value at the given index
            while(temp[index] !== undefined)
                index = Math.floor(Math.random() * this.list.length);
            //Changing the value at the random index in temp to 
            //the value held in the given list at i
            temp[index] = this.list[i];
        }
        //Changing the list's value to the new list's value
        this.list = temp;
    }

    makeList(aSize) {
        this.list = [];
        for (let i = 1; i <= aSize; i++) {
            let obj1 = { val: i };
            this.list.push(obj1);
            let obj2 = { val: i };
            this.list.push(obj2);
        }
        this.count = aSize;
    }

    genCard(id) {
        this.bDiv.classList.add("board");
        let card = document.createElement("div");
        card.classList.add("card");

        if (this.TXT_MODE)
            card.innerHTML = "<div>?</div>";
        else
            card.innerHTML = "<img class='img' src='" + this.card_back + "' />";

        card.addEventListener("click", (e) => { this.click(id) } , false);

        return card;
    }

    genList() {
        document.getElementById("header2").innerHTML = `Timer: ${time}`;
        this.bDiv.innerHTML = "";
        for (let i = 0; i < this.list.length; i++) {
            let c = this.genCard(i);
            this.bDiv.appendChild(c);
            this.list[i].el = c;
        }
    }

    click(id) {
        let item = this.list[id];

        if (this.card_id_1 != null && this.card_id_2 != null)
            return;

        if (item.showFlag)
            return;

        if (this.card_id_1 == null) {
            this.card_id_1 = id;
            console.log("First: " + item.val);
            if(timerStarted == false){
                timerStarted = true;
                timer = setInterval(this.startTimer, 1000);
            }
            this.showCard(id, true);
            return;
        } else if (this.card_id_2 == null) {
            this.card_id_2 = id;
            console.log("Second: " + item.val);
            this.showCard(id, true);
        }
        let matched = this.list[this.card_id_1].val == this.list[this.card_id_2].val;
        console.log(matched);
        if (matched) {
            console.log("Matched!");
            this.card_id_1 = null;
            this.card_id_2 = null;

            setTimeout(() => {
                if (++this.matchedCount == this.count) {
                    //Stopping the timer when the game is done
                    clearInterval(timer);
                    //Updating the highscore in local storage if it is better than the previously 
                    //stored score or there is no score for the current difficulty
                    if(time < localStorage.getItem(`${this.difficulty}highscore`) || localStorage.getItem(`${this.difficulty}highscore`) == null)
                        localStorage.setItem(`${this.difficulty}highscore`, time);
                    alert("You Win!");
                    //Returning to main menu
                    this.mainMenu();
                }
            }, 1000);
        } else {
            setTimeout(() => {
                console.log("Not matched: Reset them");
                this.showCard(this.card_id_1, false);
                this.showCard(this.card_id_2, false);

                this.card_id_1 = null;
                this.card_id_2 = null;
            }, 500);
        }
    }

    showCard(id, showFlag) {
        let item = this.list[id];
        let itemEl = item.el;
        itemEl.classList.add("closed");

        setTimeout(() => {
            this.showCard1(id, showFlag);
        }, 250);
    }

    showCard1(id, showFlag) {
        let item = this.list[id];
        let itemEl = item.el;
        let txtEl = itemEl.firstChild;
        item.showFlag = showFlag;
        if (this.TXT_MODE) {
            if (showFlag)
                txtEl.innerHTML = item.val;
            else
                txtEl.innerHTML = "?"; 
        }
        else {
            if (showFlag)
                txtEl.src = "./pics/" + this.images[item.val - 1];
            else 
                txtEl.src = this.card_back;
        }

        console.log("HI");
        itemEl.classList.remove("closed");
        itemEl.classList.add("open");
    }

    startTimer(){
        document.getElementById("header2").innerHTML = `Timer: ${++time}s`;
    }

    initImages() {
        this.images = [];

        this.images.push("370Z.jpg");
        this.images.push("AE86.jpg");
        this.images.push("CELICAGT4.jpg");
        this.images.push("CIVIC.jpg");
        this.images.push("E30.jpg");
        this.images.push("EVO.jpg");
        this.images.push("HELLCAT.jpg");
        this.images.push("IMPREZA.jpg");
        this.images.push("MR2.jpg");
        this.images.push("NSX.jpg");
        this.images.push("R32.jpg");
        this.images.push("RX7.jpg");
        this.images.push("S14.jpg");
        this.images.push("SUPRA.jpg");
        this.images.push("VIPER.jpg");

        this.card_back = "./pics/CAR.png"

        let c = "";
        for(let url of this.images) {
            c += "<img src='./pics/" + url + "' /><br>\r\n";
        }
        document.getElementById("board1").innerHTML = c;
    }
}