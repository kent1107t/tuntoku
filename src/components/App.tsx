import { Component, useState } from 'react';
import * as React from 'react';
import OverallStructure from './OverallStructure';
import Form from './Form';
import {Problem, ProblemCards} from './ProblemCards';
import { group } from 'console';


const initialGroupName: string = "InitialGroup"; // 最初にセットされてるグループ
const solvedGroupName:  string = "SolvedGroup"   // 解いた問題が行くグループ

export default function App() {
  const [currentGroupName, setCurrentGroupName] = useState<string>(initialGroupName);
  // グループ名をキーとして、そのグループの問題の問題リストを値とした辞書
  const [groupName2problems, setGroupName2Problems] = useState<{[GroupName: string]: Problem[]}>({[initialGroupName]: [], [solvedGroupName]: []});
  // グループ名をキーとして、そのグループの問題の問題の集合を値とした辞書
  const [groupName2setUrls, setGroupName2setUrls] = useState<{[GroupName: string]: Set<string>}>({[initialGroupName]: new Set(), [solvedGroupName]: new Set()});
  //const [ProblemCards, setProblemCards] = useState<ProblemCards[]>([]);
  //const [ProblemCardsReal, setProblemCardsReal] = useState<React.FC>(ProblemCards);

  function checkAndAlertIfUrlExists(url: string, groupName: string) : boolean {
    if (groupName2setUrls[groupName].has(url)) {
      alert('入力されたURLはすでに存在しています!');
      return true;
    }
    return false;
  } 

  const pileUpProblem = (urlForPiledUp: string, groupNameForPileUp: string = currentGroupName) => {   
    // もらったグループに、もらったurlを追加する
    //  Form の submit 関数が走るときに、その入力値を引数としてこの関数が呼ばれるようになってる
    console.log("called pileUpProblem", urlForPiledUp, groupNameForPileUp);
    // すでに追加してないか確認（今は戻るようにしてるけど、あとで先頭に追加し直すようにするかも）
    if (checkAndAlertIfUrlExists(urlForPiledUp, groupNameForPileUp))  return;
    // まず、今回追加する単体のProblemを作る
    const problemForPiledUp: Problem = {url: urlForPiledUp};
    // 今のグループの問題のリストに、今回の問題を追加する
    // 今あるオブジェクトを展開し、↓でcurrentGroupNameの部分だけ新しい値をセット(キー名の部分を[]で囲まないと変数名がそのままキーになるので注意)
    // セットする新しい値も、今ある配列を展開して、それに追加する形で今回の問題を後ろにつける
    setGroupName2Problems({ ...groupName2problems,
      [groupNameForPileUp]: [ problemForPiledUp, ...groupName2problems[groupNameForPileUp] ] });
    console.log({[groupNameForPileUp]: [ problemForPiledUp, ...groupName2problems[groupNameForPileUp] ]});
    // 今のグループの問題の集合に、今回の問題を追加する
    groupName2setUrls[groupNameForPileUp].add(urlForPiledUp);
    setGroupName2setUrls(groupName2setUrls);
    /*  イテレータの機能をオンにする必要があったので、問題の集合は変更を検知してrenderしなおす必要がないから上のようにそのまま追加することにした
    setGroupName2setProblems({ ...groupName2setProblems,
      [currentGroupName]: new Set([ ...groupName2setProblems[currentGroupName], problemForPiledUp ])})
    */
  }

  const solveProblem = (urlForSolve: string, groupNameForSolve: string) => {
    // 引数のurlを解答済みにする
    // 解答済みのグループから呼ばれてたらすることはない
    if (groupNameForSolve === solvedGroupName)  return;
    // 解答済みにすでに問題が存在してれば、もともとのグループから消すだけにする
    if (groupName2setUrls[solvedGroupName].has(urlForSolve)) {
      deleteProblem(urlForSolve, groupNameForSolve);
      return;
    }
    // urlの集合に関して、もとのグループの集合から消去し、解決済みのグループに追加し、更新する
    groupName2setUrls[groupNameForSolve].delete(urlForSolve);
    groupName2setUrls[solvedGroupName].add(urlForSolve);
    setGroupName2setUrls(groupName2setUrls);
    // 問題のリストに関して、それぞれを消去・追加し更新する
    const problemForSolve: Problem = {url: urlForSolve};
    setGroupName2Problems({ ...groupName2problems, 
      [groupNameForSolve] : groupName2problems[groupNameForSolve].filter((problem, index) => (problem.url !== urlForSolve)),
      [solvedGroupName] : [ problemForSolve, ...groupName2problems[solvedGroupName] ]
    });
  }

  const deleteProblem = (urlForDelete: string, groupNameForDelete: string) => {
    // 引数のurlを、今のグループの問題から削除する
    // まずは問題のリストから削除
    console.log("called  deleteProblem", urlForDelete, groupNameForDelete);
    setGroupName2Problems({ ...groupName2problems,
      [groupNameForDelete]: groupName2problems[groupNameForDelete].filter((problem, index) => (problem.url !== urlForDelete))});
    // 次に問題の集合から削除
    groupName2setUrls[groupNameForDelete].delete(urlForDelete);
    setGroupName2setUrls(groupName2setUrls);
  }
  
  return (
    OverallStructure(
      <Form pileUpProblem={pileUpProblem} />,
      <ProblemCards
        groupName={currentGroupName}
        problems={groupName2problems[currentGroupName]}
        handleSolve={solveProblem}
        handleDelete={deleteProblem}
      />
    )
  );
}