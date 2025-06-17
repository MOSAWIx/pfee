import { saveDataToLocalStorage } from "./LocalStorage";


const resetAuth=()=>{
    saveDataToLocalStorage("token","");
    saveDataToLocalStorage("user","");
}
export default resetAuth;