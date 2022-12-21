const getMonth = (i) => {
  let temp = "";

  switch (i) {
    case 1:
      temp = "Jan";
      break;

    case 2:
      temp = "Feb";
      break;

    case 3:
      temp = "Mar";
      break;

    case 4:
      temp = "Apr";
      break;

    case 5:
      temp = "May";
      break;

    case 6:
      temp = "Jun";
      break;

    case 7:
      temp = "July";
      break;

    case 8:
      temp = "Aug";
      break;

    case 9:
      temp = "Sep";
      break;

    case 10:
      temp = "Oct";
      break;

    case 11:
      temp = "Nov";
      break;

    case 12:
      temp = "Dec";
      break;
    }
    
    return temp;
};

export {getMonth};
