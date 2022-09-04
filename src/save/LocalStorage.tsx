import { group } from "console";
import { GroupName2problems, GroupName2setUrls, initialGroupName, initialGroupName2Problems, initialGroupName2setUrls } from "./TypesAndInitialData";

type GroupName2listUrls = {[groupName: string]: string[]};


//type KEYS = "GROUPNAME2PROBLEMS" | "GROUPNAME2SETURLS";
export enum KEYS {
    GROUPNAME2PROBLEMS = "GROUPNAME2PROBLEMS",
    GROUPNAME2SETURLS  = "GROUPNAME2SETURLS",
    CURRENTGROUPNAME   = "CURRENTGROUPNAME",
}


function makeValueForSet(key: KEYS, value: any) {
    /* setLocalStorage で値をセットするための前処理 */
    if (key == KEYS.CURRENTGROUPNAME)  return value;
    if (key === KEYS.GROUPNAME2PROBLEMS)  return JSON.stringify(value);
    if (key === KEYS.GROUPNAME2SETURLS) {
        // Setから配列に変換して入れる
        //const groupName2setUrls: {[groupName: string]: Set<string>} = value;
        const groupName2setUrls: GroupName2setUrls = value;
        let groupName2listUrls: GroupName2listUrls = {};
        for (const [groupName, setUrls] of Object.entries(groupName2setUrls))
            groupName2listUrls[groupName] = Array.from(setUrls);
        return JSON.stringify(groupName2listUrls);
    }
}

function makeValueForGet(key: KEYS, value: any) {
    /* getLocalStorage で値を返すための前処理 */
    if (key === KEYS.CURRENTGROUPNAME)
      return value === null ? initialGroupName : value;
    if (key === KEYS.GROUPNAME2PROBLEMS)
      return value === null ? initialGroupName2Problems : JSON.parse(value);
    if (key === KEYS.GROUPNAME2SETURLS) {
        if (value === null)  return initialGroupName2setUrls;
        // parse時は配列で入ってるからそれをSetに変換して返す
        const groupName2listUrls: GroupName2listUrls = JSON.parse(value);
        let groupName2setUrls: GroupName2setUrls = {};
        for (const [groupName, ListUrls] of Object.entries(groupName2listUrls))
            groupName2setUrls[groupName] = new Set(ListUrls);
        return groupName2setUrls;
    }
}


export function setLocalStrage(key: KEYS, value: any) {
    localStorage.setItem(key, makeValueForSet(key, value));
}

export function getLocalStorage(key: KEYS) {
    return makeValueForGet(key, localStorage.getItem(key));
    /*
    const value = localStorage.getItem(key);
    if (value !== null)  return JSON.parse(value);
    return null;
    */
}

export function removeLocalStorage(key: KEYS) {
    localStorage.removeItem(key);
}

export function clearLocalStorage() {
    Object.entries(KEYS).forEach(([_, value]) => {
        removeLocalStorage(value);
    })
}