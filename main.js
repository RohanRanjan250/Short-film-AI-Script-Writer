document.getElementById("flipButton").addEventListener("click", function () {
    document.getElementById("flipCard").classList.toggle("flipped");
});

// document.querySelector(".Submit").addEventListener("click", async function () {
//     const genre = document.getElementById("Genre").value;
//     const duration = document.getElementById("Duration").value;
//     const maleCount = document.querySelector(".character select").value;
//     const femaleCount = document.querySelectorAll(".character select")[1].value;
//     const theme = document.querySelector("textarea[placeholder='Theme']").value;
//     const openingLine = document.querySelector("textarea[placeholder='Opening Line']").value;
//     const location = document.querySelector("textarea[placeholder='Restriction']").value;
//     const plot = document.querySelector("textarea[placeholder='Describe Plot']").value;

//     if (genre === "Select" || duration === "Select" || !theme || !plot) {
//         alert("Please fill in all required fields.");
//         return;
//     }

//     const prompt = `Create a short film script based on the following details:
//     - Genre: ${genre}
//     - Duration: ${duration} minutes
//     - Male Characters: ${maleCount}
//     - Female Characters: ${femaleCount}
//     - Theme: ${theme}
//     - Opening Line: ${openingLine || "None provided"}
//     - Location Restrictions: ${location || "No restriction"}
//     - Plot: ${plot}
    
//     Provide a well-structured script format.`;

//     try {
//         const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDPaT2EHafket-3AxdLS-K89xWECWK5r_o", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
//         });

//         const data = await response.json();
//         console.log("API Response:", data);

//         const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
//         console.log("Extracted Reply:", reply);

//         document.querySelector(".returnreply").innerHTML = reply.replace(/\n/g, "<br>");
//     } catch (error) {
//         console.error("Error:", error);
//         document.querySelector(".returnreply").innerHTML = "<p>Failed to generate script. Please try again.</p>";
//     }
// });

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

        let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
        drafts.push(reply);
        localStorage.setItem("drafts", JSON.stringify(drafts));

    } catch (error) {
        console.error("Error:", error);
        document.querySelector(".returnreply").innerHTML = "<p>Failed to generate script. Please try again.</p>";
    }
});

document.querySelector(".CheckDrafts").addEventListener("click", function () {
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

    document.querySelector(".drafted").innerHTML = draftHTML;

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



