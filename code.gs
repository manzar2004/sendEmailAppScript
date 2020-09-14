  function doGet(e) {
 return HtmlService.createHtmlOutputFromFile("page"); 
}


function sendEmailNow(name,title,detailed,filename)
{
  var email = Session.getActiveUser().getEmail();
  var detail = detailed.replace( /\n/g, "<br>");
  var message = "Dear All,<br/><br/>We have received the following details on WebForm from <b>:"+name+"("+email+")</b>. <br/><br/>Please find the details below:-<br/><br/>";
  message = message + "<b>Suggestion Regarding:</b> "+title+"<br/><b>Suggestion in detail:</b> "+detail+"<br/><br/>";
  
  if(filename.length > 0 )
  {
    message = message + "Please find the file attached.<br>"+filename+"<br/><br/>";
  }
  
  message = message + "Regards<br/>Live Class Team";
  
  var date=Utilities.formatDate(new Date(), "GMT+05:30", "dd-MMM-yy");
  
  var sub = "Suggestion Received: "+date+"--"+name;

  var updateData = [date,email,sub,title,detailed,filename];
  
  //This function will update the data on your choosen Google Sheet
  updateSheet(updateData);
  
  //This function will send the data in the email
  MailApp.sendEmail({
        to: "manzarXXXXXX@gmail.com",
        cc: "firstemail@gmail.com,secondemail@gmail.com",
        subject: sub,
        name: "Your Name",
        htmlBody: message
      });
    
  return "success";
}

//This function will upload the data on Google Sheet
function updateSheet(data)
{
  var url="https://docs.google.com/spreadsheets/d/1NDZkoVlNSmLSTYSBGshnLM5LlIQPQdMifuhSV7DujHI/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(url);
  var sheet = ss.getSheetByName("suggestions");
  sheet.appendRow(data);
}

//This function will upload the data on Google Drive in your Choosen Folder
function uploadFileToDrive(base64Data, fileName) {
  try{
    var splitBase = base64Data.split(','),
      type = splitBase[0].split(';')[0].replace('data:','');

    var byteCharacters = Utilities.base64Decode(splitBase[1]);
    var ss = Utilities.newBlob(byteCharacters, type);
    ss.setName(fileName);

    var dropbox = "uploadfile"; // Folder Name
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    var file = folder.createFile(ss);

    return file.getUrl();
  }catch(e){
    return 'Error: ' + e.toString();
  }
}
