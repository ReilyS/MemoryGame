/*
    Name: Reily Stanford
    Date: 2/22/2021
    File: mem.js
*/
    let time = 0;
    let timerStarted = false;
    let timer = new Number;

class MemGame {
    constructor(bDivId) {
        this.bDivId = bDivId;
        this.bDiv = document.getElementById(bDivId);
        this.bDiv.innerHTML = "<h1>Loading...</h1>";
        this.mainMenu();
    }

    mainMenu(){
        document.getElementById("header2").innerHTML = "Choose Difficulty";
        this.bDiv.className = "";
        this.bDiv.innerHTML = `<form>\n
                                <input type="radio" id="easy" name="difficulty" value="easy">\n
                                <label for="easy">Easy</lable><br>\n
                                <input type="radio" id="medium" name="difficulty" value="medium">\n
                                <label for="medium">Medium</lable><br>\n
                                <input type="radio" id="hard" name="difficulty" value="hard">\n
                                <label for="hard">Hard</lable><br>\n
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
        console.log(difficulty);
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

        card.innerHTML = "<div>?</div>";
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
                    clearInterval(timer);
                    if(time > localStorage.getItem(`${this.difficulty}highscore`) && localStorage != null)
                        localStorage.setItem(`${this.difficulty}highscore`, time);
                    else 
                        localStorage.setItem(`${this.difficulty}highscore`, time);
                    alert("You Win!");
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
        let txtEl = itemEl.firstChild;
        item.showFlag = showFlag;
        if (showFlag)
            txtEl.innerHTML = item.val;
        else
            txtEl.innerHTML = "?";
    }

    startTimer(){
        document.getElementById("header2").innerHTML = `Timer: ${++time}s`;
    }
}