/* Skript för webbsidan, som hämtar vem som har pentryansvar. Ganska simpelt. Jag är dock en kung ändå. Mvh Albin. */
/* Senaste uppdatering 2020-12-25@21:01: Lagt till fallback ifall värden blir null/undefined.*/
console.log("%cVem har pentryansvar?", "font-size:250%;font-weight:bold")
console.log("%cEn snabb liten grej utvecklad av Albin i Te20a.", "font-size:120%")
function onError(){
  /* onError-funktionen körs om ett fel uppstår någonstans i koden. */
  console.log("Ett fel inträffade och hanteras just nu...")
  $(".alert").removeAttr("hidden")
}
function getPentryAnsvar() {
  /*Funktion för att hämta vem som har pentryansvar. Den bästa blandningen av svenska och engelska i en funktion that you'll ever see.*/
  var url = "https://api.ssis.nu/cal/?room=Hela%20skolan"; /*URL för att hämta pentryansvar. För att vara snäll mot David och hans datorer kommer vi endast göra en förfrågan per sidvisning, och uppdatera detta en gång per två timmar, ifall någon skulle få för sig att besöka sidan i två timmar i sträck. */
  console.log("Skickar en AJAX-förfrågning till SSIS API...");
  $.getJSON({
    url: url, success: function(result){
      console.log("Förfrågning skickad! Hanterar svar..."); 
      handlePentryAnsvar(result)
    }
    }
    /* Gör förfrågningen, och skicka den vidare till hanteringsfunktionen för pentryansvar. Denna funktion fungerar som en enkel parser kring pentryansvar. */
  )
};

function handlePentryAnsvar(result) {
  /* Funktion för att parsea och hantera pentryansvar. Returnerar ett JSON-objekt. */
  console.log("Tog emot svaret: ")
  console.log("Haterar svar från server...");
  var resultjson = result /*$.parseJSON(result); /* Konvertera resultatet till JSON */
  var pentryjson = {
    "pentry1": {
      "responsibleclass": null,
      "extraresponsiblestudents": null
    },
    "pentry2": {
      "responsibleclass": null,
      "extraresponsiblestudents": null
    }
  } /*Skapa en JSON som innehåller info om pentryansvar */
  for (var i = 0; i < resultjson.length; i++) {
    console.log("Är inne i loopen och partajar...");
    /* Loopa igenom listan med entries */
    var subject = resultjson[i].subject; /* Hämta ämnet specifierat i JSON-filen */ ;
    /* Kan vi då lita på formatet? Jag quotar David Karlström: "Det ska vara det.... men då det är människor som fyller i så kanske det blir fel någon vecka". Fair enough. Vi litar på det. Annars tar vi det då */
    if (subject == null){ /* Alla sätt att lösa problem på är inte bra men detta verkar ju funka. */
      subject = "Inget" /* Så att vi ska kunna använda indexOf("Pentry") sen */
    }
    var originalsubject = subject;
    subject = subject.toLowerCase();
    console.log("Subject: " + subject)
    if (subject.indexOf("pentry") > -1) {
      /* Om eventet innehåller ordet pentry, behandla det */
      console.log("Ooh... detta entry verkar vara relaterat till ett pentry...")
      var pentryName = originalsubject.split(":")[0]; /* Hämta pentrynamnet. Det som kommer finnas kvar nu att hämta är klassen och ansvarande elever */
      var className = originalsubject.split(":")[1].split("-")[0]; /* Hämta klassnamnet */
      var studentNames = originalsubject.split("-")[1]; /* Hämta ansvarande elever */
      console.log("Behandlad data: Pentrynamn: " + pentryName, " Klassnamn:" + className, " Elevnamn: " + studentNames)
      /* Uppdatera JSON-objekt: */
      var toUpdate = null /*Spara vilket JSON-objekt som ska uppdateras */
      if (pentryName.indexOf("1") > 0) {
        /* Om 1 finns i pentrynamnet => Pentry 1 */
        toUpdate = pentryjson.pentry1;
      } else if (pentryName.indexOf("2") > 0) {
        /* Om 2 finns i pentrynamnet => Pentry 2 */
        toUpdate = pentryjson.pentry2;
      }
      if (toUpdate != null) {
        toUpdate.responsibleclass = className;
        toUpdate.extraresponsiblestudents = studentNames;
      }
      }
  }

  function updatePentryAnsvar() {
   /*Funktion för att uppdatera pentryansvar i HTML-filen. Detta ligger i en separat version ifall du vill göra en fork och spinoff av mitt projekt. Glöm inte heller att all info finns i ett JSON-objekt, det är användbart :) */
    console.log("Uppdaterar pentryansvar enligt JSON " + JSON.stringify(pentryjson) + "...")
    if (pentryjson.pentry1.responsibleclass != null && pentryjson.pentry1.responsibleclass != undefined){
    pentry1_responsibleclass = pentryjson.pentry1.responsibleclass    
    }
    else { /* Fallback ifall värdena inte hittats */
    pentry1_responsibleclass = "Hittades ej"
    }
    if (pentryjson.pentry1.extraresponsiblestudents != null && pentryjson.pentry1.extraresponsiblestudents != undefined){
    pentry1_extraresponsiblestudents = pentryjson.pentry1.extraresponsiblestudents   
    }
    else { /* Fallback ifall värdena inte hittats */
    pentry1_extraresponsiblestudents = "Hittades ej"
    }
    if (pentryjson.pentry2.responsibleclass != null && pentryjson.pentry2.responsibleclass != undefined){
    pentry2_responsibleclass = pentryjson.pentry2.responsibleclass    
    }
    else { /* Fallback ifall värdena inte hittats */
    pentry2_responsibleclass = "Hittades ej"
    }
    if (pentryjson.pentry2.extraresponsiblestudents != null && pentryjson.pentry2.extraresponsiblestudents != undefined){
    pentry2_extraresponsiblestudents = pentryjson.pentry2.extraresponsiblestudents   
    }
    else { /* Fallback ifall värdena inte hittats */
    pentry2_extraresponsiblestudents = "Hittades ej"
    }
    /* Uppdatera element på sidan */
    document.getElementById("pentry1_class").innerHTML = pentry1_responsibleclass;
    document.getElementById("pentry1_students").innerHTML = pentry1_extraresponsiblestudents;
    document.getElementById("pentry2_class").innerHTML = pentry2_responsibleclass;
    document.getElementById("pentry2_students").innerHTML = pentry2_extraresponsiblestudents;
  };
  updatePentryAnsvar();
};
try { /* Testa att köra koden */
  setInterval(getPentryAnsvar(), 3600000); /*Uppdatera pentryansvar en gång i timmen ifall användaren är kvar på sidan. */
}
catch(e){ /* Fånga upp eventuella fel */
  onError();
}

