// Select Elements
let countSpan = document.querySelector(".count span")
let bullets = document.querySelector(".bullets");
let bulletsSpnaContainer = document.querySelector(".bullets .spans")
let questoinTitle = document.querySelector(".quiz-app .quiz-area")
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".quiz-app .submit-button");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".bullets .countdwon");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let questoinsJsObject = JSON.parse(this.responseText)
            qCount = questoinsJsObject.length;
            // Create Bullets + Set Questoins Count
            createBullets(qCount);

            // Add Questoin Data
            addQuestionData(questoinsJsObject[currentIndex], qCount)

            // Start countDown
            clearInterval(countdownInterval);
            countdown(3, qCount);
            
            submitButton.onclick = () => {
                // Get Right Answer
                let therightAnswer = questoinsJsObject[currentIndex].right_answer;
                // Increase Index
                currentIndex++;

                // Check The Answer
                checkAnswers(therightAnswer, qCount);

                // Remove Previous Question
                questoinTitle.innerHTML = "";
                answersArea.innerHTML = "";

                // Add Question Data
                addQuestionData(questoinsJsObject[currentIndex], qCount);

                // Handle Bullets Class
                handleBullets();

                // Start countDown
                clearInterval(countdownInterval);
                countdown(3, qCount);
                
                // Show Results            
                showResult(qCount);
            }
            
        }
    }
    myRequest.open("GET","questoins.json",true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num

    // Create Spans 
    for(let i = 0; i < num; i++) {
        let theBullets = document.createElement("span");
        bulletsSpnaContainer.appendChild(theBullets);
        // check if it's the first span
        if(i=== 0) {
            theBullets.className = "on"
        }
    }
}

function addQuestionData(obj, count) {
    if(currentIndex < count) {
        // create H2 Question Title
        let questoinTitleH2 = document.createElement("h2");

        // create Text title question 
        let questoinTitleH2Text = document.createTextNode(obj.title);

        // Append Text To H2
        questoinTitleH2.appendChild(questoinTitleH2Text);

        // Append The H2 To The Quiz Area
        questoinTitle.appendChild(questoinTitleH2);

        // Create The Answers
        for(let i =1; i <= 4; i++) {
            // Create The Main Div
            let answerDiv = document.createElement("div");

            // Add Class To The Main Div
            answerDiv.className = "answer";

            // Create The Radio Input
            let radioInput = document.createElement("input");

            // Add Name + Type + Id + Data-Attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id  = `answer_${i}`
            radioInput.dataset.answer = obj[`answer_${i}`];

            // Create Label
            let theLabel = document.createElement("label");
            
            // Add For Attribute 
            theLabel.htmlFor = `answer_${i}`;

            // Add Text To The Label
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // Make First Optoin Selected
            if(i === 1) {
                radioInput.checked = true;
            }
            
            // Add Input + Label To Main Div
            theLabel.appendChild(theLabelText);
            answerDiv.appendChild(radioInput);

            // Append All Divs To Answers Area
            answerDiv.appendChild(theLabel);
            answersArea.appendChild(answerDiv);
        }
    }
}

function checkAnswers(rAnswer, count) {

    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer
        }
    }
    if(theChoosenAnswer === rAnswer) {
        rightAnswers++;
    }
    
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span, index) => {
        if(currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResult(qCount) {
    let theResult;
    if(currentIndex === qCount) {
    questoinTitle.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    
        if(rightAnswers > qCount / 2 && rightAnswers < qCount) {
            theResult = `<span class="good">Good</spna>, ${rightAnswers} From ${qCount}`;
        } else if(rightAnswers === qCount) {
            theResult = `<span class="perfect">Perfect</spna>, ALL Answers Is Right`;
        } else {
            theResult = `<span class="bad">Bad</spna>, ${rightAnswers} From ${qCount}`;
        }

        resultContainer.innerHTML = theResult;
    }
}

function countdown(duration, qCount) {
    if(currentIndex < qCount) {
        let minutes, seconds;
        countdownInterval = setInterval( function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000)
    }
}