import { Problem } from "../components/ProblemCards";


export const initialGroupName: string = "initialGroup"; // 最初のグループ
export const allGroupName    : string = "AllGroup";     // 全体のグループ 
export const solvedGroupName : string = "SolvedGroup"   // 解いた問題が行くグループ


export type GroupName2problems = {[GroupName: string]: Problem[]};
export type GroupName2setUrls  = {[GroupName: string]: Set<string>};

export const initialGroupName2Problems : GroupName2problems = {[allGroupName]: [], [solvedGroupName]: [], [initialGroupName]: []};
export const initialGroupName2setUrls  : GroupName2setUrls  = {[allGroupName]: new Set(), [solvedGroupName]: new Set(), [initialGroupName]: new Set()};