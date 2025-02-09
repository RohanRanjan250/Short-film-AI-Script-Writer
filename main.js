document.getElementById("flipButton").addEventListener("click", function () {
    document.getElementById("flipCard").classList.toggle("flipped");
});

document.querySelector(".Submit").addEventListener("click", async function () {
    const genre = document.getElementById("Genre").value;
    const duration = document.getElementById("Duration").value;
    const maleCount = document.querySelector(".character select").value;
    const femaleCount = document.querySelectorAll(".character select")[1].value;
    const theme = document.querySelector("textarea[placeholder='Theme']").value;
    const openingLine = document.querySelector("textarea[placeholder='Opening Line']").value;
    const location = document.querySelector("textarea[placeholder='Restriction']").value;
    const plot = document.querySelector("textarea[placeholder='Describe Plot']").value;

    if (genre === "Select" || duration === "Select" || !theme || !plot) {
        alert("Please fill in all required fields.");
        return;
    }

    const prompt = `Create a short film script based on the following details:
    - Genre: ${genre}
    - Duration: ${duration} minutes
    - Male Characters: ${maleCount}
    - Female Characters: ${femaleCount}
    - Theme: ${theme}
    - Opening Line: ${openingLine || "None provided"}
    - Location Restrictions: ${location || "No restriction"}
    - Plot: ${plot}
    
    Provide a well-structured script format.`;

    document.querySelector(".returnreply").innerHTML = "<p class='loading'>Generating script... Please wait.</p>";

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDPaT2EHafket-3AxdLS-K89xWECWK5r_o", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        console.log("API Response:", data);

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        console.log("Extracted Reply:", reply);

        document.querySelector(".returnreply").innerHTML = reply.replace(/\n/g, "<br>");

        addTypingBox();

        let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
        drafts.push(reply);
        localStorage.setItem("drafts", JSON.stringify(drafts));

    } 
    catch (error) {
        console.error("Error:", error);
        document.querySelector(".returnreply").innerHTML = "<p>Failed to generate script. Please try again.</p>";
    }

});

function addTypingBox() {
    const typingBoxHTML = `
        <div class="typing-box">
            <textarea placeholder="Type your feedback or edits here..."></textarea>
            <button class="submit-feedback">Submit Feedback</button>
        </div>
    `;

    document.querySelector(".returnreply").innerHTML += typingBoxHTML;

    document.querySelector(".submit-feedback").addEventListener("click", function () {
        handleSubmitFeedback();
    });
}

document.querySelector(".CheckDrafts").addEventListener("click", function () {
    let draftsContainer = document.querySelector(".drafted");
    let checkDraftsButton = document.querySelector(".CheckDrafts");

    if (draftsContainer.style.display === "block") {
        draftsContainer.style.display = "none";
        checkDraftsButton.textContent = "Check Drafts"; 
        return;
    }

    let drafts = JSON.parse(localStorage.getItem("drafts")) || [];

    if (drafts.length === 0) {
        alert("No drafts available!");
        return;
    }

    let draftHTML = drafts.map((draft, index) => `
        <div class="draft-item">
            <h3>Draft ${index + 1}</h3>
            <p>${draft.replace(/\n/g, "<br>")}</p>
            <button class="deleteDraft" data-index="${index}">Delete</button>
        </div>
    `).join("");

    draftsContainer.innerHTML = draftHTML;
    draftsContainer.style.display = "block"; 
    checkDraftsButton.textContent = "Close Drafts"; 

    document.querySelectorAll(".deleteDraft").forEach(button => {
        button.addEventListener("click", function () {
            let indexToDelete = this.getAttribute("data-index");
            deleteDraft(indexToDelete);
        });
    });
});

function deleteDraft(index) {
    let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
    drafts.splice(index, 1); 
    localStorage.setItem("drafts", JSON.stringify(drafts));
    document.querySelector(".CheckDrafts").click(); 
}

function handleSubmitFeedback() {
    const feedback = document.querySelector(".typing-box textarea").value;
    const script = document.querySelector(".returnreply").innerText.trim();

    if (!feedback.trim()) {
        alert("Please enter your feedback before submitting.");
        return;
    }

    const combinedPrompt = `Please regenerate the following script with the feedback provided:
    Script:
    ${script}

    Feedback:
    ${feedback}`;

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDPaT2EHafket-3AxdLS-K89xWECWK5r_o", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: combinedPrompt }] }] })
    })
    .then(response => response.json())
    .then(data => {
        const newScript = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not regenerate the script.";
        updateScript(newScript);
    })
    .catch(error => console.error("Error:", error));
}


function updateScript(newScript) {
    document.querySelector(".returnreply").innerHTML = newScript.replace(/\n/g, "<br>");

    addTypingBox();
}