/*
    Name: Reily Stanford
    Date: 2/22/2021
    File: mem.js
*/
class MemGame {

    constructor(bDivId, bSize) {
        this.bDivId = bDivId;
        this.bDiv = document.getElementById(bDivId);
        this.bDiv.innerHTML = "<h1>Loading...</h1>";
        this.bSize = bSize;
        
        this.startGame();
    }

    startGame() {
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
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = "<div>?</div>";
        card.addEventListener("click", (e) => { this.click(id) } , false);

        return card;
    }

    genList() {
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
                    alert("You Win!");
                    this.startGame();
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
}