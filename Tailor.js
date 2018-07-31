window.onload = function(){
  document.getElementById('keyWords').addEventListener('click', keyWordSearch);
  document.getElementById('buzzWords').addEventListener('click', buzzWordSearch);
  document.getElementById('properNouns').addEventListener('click', properNounSearch);
  document.getElementById('abbreviations').addEventListener('click', abbreviationSearch);
}

function keyWordSearch(){
  deleteOldTable();
  keyWords = packageArray(true);
  keyWords = findMostUsed(keyWords);
  keyWords = filterArray(keyWords);
  generateTable(keyWords);
}

function buzzWordSearch(){
  deleteOldTable();
  buzzWords = packageArray(true);
  buzzWords = findHyphens(buzzWords);
  buzzWords = filterArray(buzzWords);
  generateTable(buzzWords);
}

function properNounSearch(){
  deleteOldTable();
  properNouns = packageArray(false);
  properNouns = findPropNouns(properNouns);
  properNouns = filterArray(properNouns);
  generateTable(properNouns);
}

function abbreviationSearch(){
  deleteOldTable();
  abbreviations = packageArray(false);
  abbreviations = findUppers(abbreviations);
  abbreviations = filterArray(abbreviations);
  generateTable(abbreviations);
}

function findMostUsed(array){
  //find duplicate words
  results=[];
  for (var i = 0; i < array.length; i++){
    var checked = 0;
    for(var j = 0; j < array.length; j++){
      if (array[j] != array[i]){
        checked++; //words don't match
      } else {
        checked--; //words do match
      }
    }
    if (checked == (array.length - 2)){
      //if the entire array is checked with no matches, the word is removed
      remove(array, array[i]);
      i--; //subtracts after the array becomes 1 index smaller
    }
  }
  for (var j = 0; j < array.length; j++){
    results.push(array[j]); //the remaining words are added to the search results
  }
  return results;
}

//function to remove array at specific index
function remove(array, element){
  index = array.indexOf(element);
  array.splice(index, 1);
}

//finds words that only consist of uppercase letters
function findUppers(array){
  results = [];
  for(var i = 0; i < array.length; i++){
    var chars = array[i].split(""); //splits to characters
    var check = 0;
    for(var j = 0; j < chars.length; j++){
      if(chars[j]==","||chars[j]=="."){
        //allow this and address while filtering array
      } else if(chars[j] == chars[j].toLowerCase()){
        check --; //if a lowercase is found, the word is not all caps
      }
    }
    if (check == 0){
      results.push(array[i]); //if check never decrements, it was all caps
    }
  }
  return results;
}

//finds phrases with multiple words with capitalized first letters in succession
function findPropNouns(array){
  results=[];
  chars = [];
  uppercase = 0;
  lowercase = 0;
  for(var i = 0; i < array.length; i++){
    chars = array[i].split(""); //splits to characters
    period = findPeriod(chars); //returns true if there is a period
    phrase = [];
    try{
      if(chars[0] == chars[0].toUpperCase()){ //checks for a capital letter
        uppercase ++; //might be a proper noun
        lowercase = 0;
      } else {
        lowercase ++; //not a proper noun
      }
      if (period == true){
        lowercase ++; //end of proper noun
        uppercase --;
      }
    } catch(err) {
      uppercase = 0; //restart
    }
    if (lowercase > 0 && uppercase > 1){ //found the end of the phrase
      //the amount of uppercase letters becomes the length of the phrase
      length = uppercase;
      for (j = 0; j < length; j++){ //lasts for the length of the phrase
        phrase.push(array[i - uppercase]);
        uppercase--; //decreases to get the element in the next index
      }
    } else if (lowercase > 0){
      uppercase = 0; //restarts
    }
    if (phrase.length > 0){
      propNoun = phrase.join(" ");
      results.push(propNoun);
    }
  }
  return results;
}

//prepares the array to be used by the search functions
function packageArray(changeCase){
  input = document.getElementById('inputText').value;
  if (changeCase == true){
    input = input.toLowerCase();
  }
  input = input.split("\n"); //catch line breaks
  input = input.join(); //string with no line breaks
  input = input.split(" "); //array with all words in string
  return input;
}

//prepares teh array for output after the search functions
function filterArray(array){
  array = removeCommonWords(array);
  array = removeTrailingPunctuation(array);
  array = filterDuplicates(array);
  return array;
}

//gets rid of punctuation at the end of words
function removeTrailingPunctuation(array){
  for (var i = 0; i < array.length; i++){
    chars = array[i].split("");
    lastChar = (chars.length - 1);
    if(chars[lastChar]=="," || chars[lastChar]=="." ||
    chars[lastChar]=="?" || chars[lastChar]==":"){
      remove(chars, chars[lastChar]);
      array[i] = chars.join("");
    }
  }
  return array;
}

//removes duplicate words within the array
function filterDuplicates(array){
  for (var i = 0; i < array.length; i++){
    for(var j = 0; j < array.length; j++){
      if (array[j] == array[i] && i != j){
        remove(array,array[i]);
        i--;
      }
    }
  }
  return(array);
}

//finds words that are hyphenated
function findHyphens(array){
  var array1 = [];
  results=[];
  for(var i = 0; i < array.length; i++){
    var chars = array[i].split("");
    for(var j = 0; j < chars.length; j++){
      if(chars[j]=="-"){
        results.push(array[i]);
      }
    }
  }
  return results;
}

function findPeriod(array){
  var period = false;
  for(var j = 0; j < array.length; j++){
    if(array[j]=="."){
      period = true;
    }
  }
  return period;
}

function deleteOldTable(){
  document.getElementById("output").innerHTML = "";
}

//generates the output table
function generateTable(array){
  tableElement = document.getElementById("output");
  table = document.createElement("table");
  table.setAttribute("id", 'outputTable');
  tableBody = document.createElement("body")
  index = 0;
  if (array.length > 1){
    for (var i = 0; i < (array.length/5); i++){
      row = document.createElement("tr");
      for (var j=0; j < 5; j++){
        cell = document.createElement("td");
        if (array[index]==undefined){
          cellText = document.createTextNode("");
        } else {
          cellText = document.createTextNode(array[index]);
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
        index ++;
      }
      tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    tableElement.appendChild(table);
  } else {
    tableElement.innerHTML= "No results";
  }
}

function removeCommonWords(array){
  for (var j = 0; j < array.length; j ++){
    switch (array[j]) {
      //single words
      case "a": remove(array, array[j]); j--;
        break;
      case "and": remove(array, array[j]); j--;
        break;
      case "is": remove(array, array[j]); j--;
        break;
      case "the": remove(array, array[j]); j--;
        break;
      case "of": remove(array, array[j]); j--;
          break;
      case "our": remove(array, array[j]); j--;
          break;
      case "some": remove(array, array[j]); j--;
        break;
      case "to": remove(array, array[j]); j--;
        break;
      case "as": remove(array, array[j]); j--;
        break;
      case "an": remove(array, array[j]); j--;
        break;
      case "at": remove(array, array[j]); j--;
          break;
      case "in": remove(array, array[j]); j--;
          break;
      case "this": remove(array, array[j]); j--;
          break;
      case "we're": remove(array, array[j]); j--;
          break;
      case "are": remove(array, array[j]); j--;
        break;
      case "for": remove(array, array[j]); j--;
        break;
      case "on": remove(array, array[j]); j--;
        break;
      case "other": remove(array, array[j]); j--;
        break;
      case "you": remove(array, array[j]); j--;
        break;
      case "we": remove(array, array[j]); j--;
        break;
      case "that": remove(array, array[j]); j--;
        break;
      case "can": remove(array, array[j]); j--;
        break;
      case "do": remove(array, array[j]); j--;
        break;
      case "about": remove(array, array[j]); j--;
        break;
      case "or": remove(array, array[j]); j--;
        break;
      case "all": remove(array, array[j]); j--;
        break;
      case "have": remove(array, array[j]); j--;
        break;
      case "with": remove(array, array[j]); j--;
        break;
      case "be": remove(array, array[j]); j--;
        break;
      case "will": remove(array, array[j]); j--;
        break;
      case "it": remove(array, array[j]); j--;
        break;
      case "by": remove(array, array[j]); j--;
        break;
      case "new": remove(array, array[j]); j--;
        break;
      case "us": remove(array, array[j]); j--;
        break;
      case "from": remove(array, array[j]); j--;
        break;
      case "get": remove(array, array[j]); j--;
        break;
      case "while": remove(array, array[j]); j--;
        break;
      case "every": remove(array, array[j]); j--;
        break;
      case "more": remove(array, array[j]); j--;
        break;
      case "than": remove(array, array[j]); j--;
        break;
      case "ways": remove(array, array[j]); j--;
        break;
      case "you’ll": remove(array, array[j]); j--;
        break;


      //Hyphenated words
      case "day-to-day": remove(array, array[j]); j--;
        break;
      case "full-time": remove(array, array[j]); j--;
        break;
    }
  }
  return array;
}
