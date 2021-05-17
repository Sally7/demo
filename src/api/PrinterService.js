const PrinterService = {
  initPrintCmd(printJson, url) {
  var iCurLine=20;
  var fontSize = 9;
  var styleIndex = 1;
  for(var pitemIndex in printJson) {
    var pitem = printJson[pitemIndex];
    if(pitem.items) {
      for(var itemIndex in pitem.items) {
        var item = pitem.items[itemIndex];
        var itemWidth = 250/pitem.items.length;
        if(item.type == "qrcode") {
          LODOP.ADD_PRINT_IMAGE(iCurLine,50,"100%","100%", url);
          LODOP.SET_PRINT_STYLEA(styleIndex,"Alignment",2);
          console.log("styleIndex:"+styleIndex+",text:"+item.text);
          iCurLine+=160;
          styleIndex++;
          console.log("styleIndex:"+styleIndex+",text:"+"怕过号，微信扫一扫！");
          LODOP.ADD_PRINT_TEXT(iCurLine,0,"100%",20,"怕过号，微信扫一扫！");
          LODOP.SET_PRINT_STYLEA(styleIndex,"FontSize",9);
          LODOP.SET_PRINT_STYLEA(styleIndex,"Alignment",2);
        } else {
          if(item.text && item.text != "null") {
            /*if(item.size >2) {
                item.size = 2;
            }*/
            if(!item.size) {
              item.size = 1;
            }
            item.size = Number(item.size);
            if(item.size == 1) {
              fontSize = 9;
            } else {
              fontSize = 6;
            }
            if(item.align == "center") {
              console.log("styleIndex:"+styleIndex+",text:"+item.text+",iCurLine:"+iCurLine+",itemWidth*itemIndex:"+itemWidth*itemIndex+",20*item.size:"+20*item.size);
              LODOP.ADD_PRINT_TEXT(iCurLine,itemWidth*itemIndex,"100%",20*item.size,item.text);
              LODOP.SET_PRINT_STYLEA(styleIndex,"FontSize",fontSize*item.size);
              LODOP.SET_PRINT_STYLEA(styleIndex,"Alignment",2);
              if(item.size>1) {
                iCurLine+=10*item.size;
                LODOP.SET_PRINT_STYLEA(styleIndex,"Bold",1);
              }
            } else {
              console.log("styleIndex:"+styleIndex+",text:"+item.text+",iCurLine:"+iCurLine+",itemWidth*itemIndex:"+itemWidth*itemIndex+",20*item.size:"+20*item.size);
              var height = item.text.length/15*20*item.size;
              console.log("height:"+height);
              LODOP.ADD_PRINT_TEXT(iCurLine,itemWidth*itemIndex,itemWidth,height, item.text);
              LODOP.SET_PRINT_STYLEA(styleIndex,"FontSize",fontSize*item.size);
              var lineCount = (item.text.length*item.size)/30;
              if(item.size>1) {
                iCurLine+=10*item.size*lineCount;
                LODOP.SET_PRINT_STYLEA(styleIndex,"Bold",1);
              } else {
                iCurLine+=10*lineCount;
              }
            }
          }
        }
        if(item.text && item.text != "null") {
          styleIndex++;
        }
      }

    } else {
      if(pitem.type=="line") {
        console.log("styleIndex:"+styleIndex+",text:--------------");
        //LODOP.ADD_PRINT_LINE(101+25*j,14,102+25*j,510,0,1);
        LODOP.ADD_PRINT_TEXT(iCurLine,itemWidth*itemIndex,"100%",20*item.size, "---------------------------------------");
        LODOP.SET_PRINT_STYLEA(styleIndex,"Alignment",2);

        styleIndex++;
        iCurLine+=10;
      }
      //LODOP.ADD_PRINT_TEXT(iCurLine,15,100,20,"");
    }
    iCurLine+=10;
  }
},
print(printData) {
  //return;
  if(LODOP == null) {
   var LODOP = getCLodop();
  }
  var printJson="";
  for(var key in printData) {
    for(var key1 in printData[key]) {
      console.log(typeof printData[key][key1]);
      if(typeof printData[key][key1] == "string") {
        printJson = JSON.parse(printData[key][key1]);
      } else {
        printJson = printData[key][key1];
      }
    }
  }

  LODOP.SET_PRINT_PAGESIZE(3,800,45,"");
  var qrcodeContent = null;
  for(var pitemIndex in printJson) {
    var pitem = printJson[pitemIndex];
    if(pitem.items) {
      for(var itemIndex in pitem.items) {
        var item = pitem.items[itemIndex];
        if(item.type == "qrcode") {
          qrcodeContent = item.text;
        }
      }
    }
  }
    this.initPrintCmd(printJson, null);
    LODOP.PRINT();
},
  genPrintData(printTemplet, printModel) {
  var newLines = [];
  for(var i=0; i<printTemplet.lines.length; i++) {
    var line = printTemplet.lines[i];
    var lineType = line.type;
    if(lineType == "text") {
      for(var j=0; j<line.items.length; j++) {
        var lineItem = line.items[j];
        if(lineItem.type == "cp") {
          lineItem.type = "var";
        }
        if(lineItem.type == "var") {
          lineItem.text = lineItem.text.replace("%s",printModel[lineItem.key]);
          if(lineItem.text && lineItem.text != "undefined") {
            console.log("");
          } else {
            continue;
          }
        } else if(lineItem.type == "qrcode"){
          if(printModel[lineItem.key]) {
            lineItem.text = lineItem.text.replace("%s",printModel[lineItem.key]);
          } else{
            continue
          }
        }
        newLines.push(line)
      }
    } else if(lineType == "line") {
      newLines.push(line);
    }
  }
  return {"bluetoothprinter":{"0":newLines}};
}

}
export default PrinterService
