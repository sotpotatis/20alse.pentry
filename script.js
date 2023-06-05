/* Skript för webbsidan, som hämtar vem som har pentryansvar. Ganska simpelt. Jag är dock en kung ändå. Mvh Albin. */
/* Senaste uppdatering 2020-12-25@21:01: Lagt till fallback ifall värden blir null/undefined.*/
console.log("%cVem har pentryansvar?", "font-size:250%;font-weight:bold")
console.log("%cEn snabb liten grej utvecklad av Albin i Te20a.", "font-size:120%")
console.log("%cMin email är: 20alse@stockholmscience.se", "font-size: 'Comic Sans MS'") // "alla har väl Comic Sans installerat? :grin:
function onError(){
  /* onError-funktionen körs om ett fel uppstår någonstans i koden. */
  console.log("Ett fel inträffade och hanteras just nu...")
  $(".alert").removeAttr("hidden")
}
function getPentryAnsvar() {
  /* Funktion för att hämta vem som har pentryansvar. Den bästa blandningen av svenska och engelska i en funktion that you'll ever see. */
  var url = "https://pentryansvar.albins.website/api/pentryansvar/"; // URL för att hämta pentryansvar. För att vara snäll mot den som har API:et (jag) kommer vi endast göra en förfrågan per sidvisning, och uppdatera detta en gång per timme, ifall någon skulle få för sig att besöka sidan i timmar i streck.
  console.log("Skickar en AJAX-förfrågning till SSIS API...");
  $.getJSON({
    url: url, success: function(result){
      console.log("Förfrågning skickad! Hanterar svar..."); 
      handlePentryAnsvar(result)
    }
    } // Gör förfrågningen, och skicka den vidare till hanteringsfunktionen för pentryansvar. Denna funktion fungerar som en enkel parser kring pentryansvar.
  )
};

let pentryjson = {}; // (används nedan för att konvertera resultatet till en JSON)
function handlePentryAnsvar(result) {
  /* Funktion för att parsea och hantera pentryansvar. Returnerar ett JSON-objekt. */
  console.log("Tog emot svaret: ")
  console.log("Haterar svar från server...");
  // Konvertera resultatet till JSON
  // Skapa en JSON som innehåller info om pentryansvar
  for (i=0; i<result.length; i++){
	  var current_pentry = result[i];
	  pentryjson["pentry" + current_pentry.pentry_number] = current_pentry; // Lägg till alla pentrts i JSON
  }
  function updatePentryAnsvar() {
   /*Funktion för att uppdatera pentryansvar i HTML-filen. Detta ligger i en separat version ifall du vill göra en fork och spinoff av mitt projekt. Glöm inte heller att all info finns i ett JSON-objekt, det är användbart :) */
    console.log("Uppdaterar pentryansvar enligt JSON " + JSON.stringify(pentryjson) + "...")
    if (typeof pentryjson.pentry1.responsible_class == "string"){
    pentry1_responsible_class = pentryjson.pentry1.responsible_class    
    }
    else { // Fallback ifall värdena inte hittats
    pentry1_responsible_class = "Hittades ej"
    }
    if (typeof pentryjson.pentry1.responsible_persons == "array"){
    pentry1_responsible_persons = pentryjson.pentry1.responsible_persons.join(",")
    }
    else { // Fallback ifall värdena inte hittats */
    pentry1_responsible_persons = "Hittades ej"
    }
    if (typeof pentryjson.pentry2.responsible_class == "string"){
    pentry2_responsible_class = pentryjson.pentry2.responsible_class    
    }
    else { // Fallback ifall värdena inte hittats */
    pentry2_responsible_class = "Hittades ej"
    }
    if (typeof pentryjson.pentry2.responsible_persons == "array"){
    pentry2_responsible_persons = pentryjson.pentry2.responsible_persons.join(",")
    }
    else { // Fallback ifall värdena inte hittats */
    pentry2_responsible_persons = "Hittades ej"
    }
    // Uppdatera element på sidan */
    document.getElementById("pentry1_class").innerHTML = pentry1_responsible_class;
    document.getElementById("pentry1_students").innerHTML = pentry1_responsible_persons;
    document.getElementById("pentry2_class").innerHTML = pentry2_responsible_class;
    document.getElementById("pentry2_students").innerHTML = pentry2_responsible_persons;
  };
  updatePentryAnsvar();
};
try { /* Testa att köra koden */
  setInterval(getPentryAnsvar(), 3600000); /*Uppdatera pentryansvar en gång i timmen ifall användaren är kvar på sidan. */
}
catch(e){ /* Fånga upp och hantera eventuella fel */
  console.log("Ett fel inträffade!");
  onError(); // Hantera fel (se kod ovan)
}

