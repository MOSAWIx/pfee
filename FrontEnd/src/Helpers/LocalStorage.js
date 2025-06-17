// get Data From Local Storage
const getDataFromLocalStorage = (key) => {
    return  JSON.parse(localStorage.getItem(key))||false;
}

// Save Data To Local Storage
const saveDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
}




// export functions
export {
    getDataFromLocalStorage,
    saveDataToLocalStorage
}