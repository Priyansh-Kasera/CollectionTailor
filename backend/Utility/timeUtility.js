const getDatefromUTC = (d)=>{
    const date = new Date(d)
let currentDay= String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth()+1).padStart(2,"0");

let currentYear = date.getFullYear();

// we will display the date as DD-MM-YYYY 

return `${currentDay}-${currentMonth}-${currentYear}`;
}

module.exports = getDatefromUTC;