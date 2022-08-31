import { Component, useState } from 'react';
import * as React from 'react';
import OverallStructure from './OverallStructure';
import Form from './Form';
import {Problem, ProblemCards} from './ProblemCards';
import { group } from 'console';


const initialGroupName: string = "Initial Group"; // はじめにあるグループ

export default function App() {
  const [currentGroupName, setCurrentGroupName] = useState<string>(initialGroupName);
  // グループ名をキーとして、そのグループの問題の問題リストを値とした辞書
  const [groupName2problems, setGroupName2Problems] = useState<{[GroupName: string]: Problem[]}>({[initialGroupName]: []});
  // グループ名をキーとして、そのグループの問題の問題の集合を値とした辞書
  const [groupName2setUrls, setGroupName2setUrls] = useState<{[GroupName: string]: Set<string>}>({[initialGroupName]: new Set()});
  //const [ProblemCards, setProblemCards] = useState<ProblemCards[]>([]);
  //const [ProblemCardsReal, setProblemCardsReal] = useState<React.FC>(ProblemCards);


  type CheckAndAlertIfUrlExists = (url: string) => boolean;
  const checkAndAlertIfUrlExists: CheckAndAlertIfUrlExists = (url: string) => {
    if (groupName2setUrls[currentGroupName].has(url)) {
      alert('入力されたURLはすでに存在しています!');
      return true;
    }
    return false;
  } 

  const pileUpProblem = (urlForPiledUp: string) => {   
    //  Form の submit 関数が走るときに、その入力値を引数としてこの関数が呼ばれるようになってる
    if (checkAndAlertIfUrlExists(urlForPiledUp))  return;
    // まず、今回追加する単体のProblemを作る
    const problemForPiledUp: Problem = {url: urlForPiledUp};
    // 今のグループの問題のリストに、今回の問題を追加する
    // 今あるオブジェクトを展開し、↓でcurrentGroupNameの部分だけ新しい値をセット(キー名の部分を[]で囲まないと変数名がそのままキーになるので注意)
    // セットする新しい値も、今ある配列を展開して、それに追加する形で今回の問題を後ろにつける
    setGroupName2Problems({ ...groupName2problems,  
      [currentGroupName]: [ ...groupName2problems[currentGroupName], problemForPiledUp ] });
    // 今のグループの問題の集合に、今回の問題を追加する
    groupName2setUrls[currentGroupName].add(urlForPiledUp);
    setGroupName2setUrls(groupName2setUrls);
    /*  イテレータの機能をオンにする必要があったので、問題の集合は変更を検知してrenderしなおす必要がないから上のようにそのまま追加することにした
    setGroupName2setProblems({ ...groupName2setProblems,
      [currentGroupName]: new Set([ ...groupName2setProblems[currentGroupName], problemForPiledUp ])})
    */
    return;
  }

  const removeProblem = (groupNameForRemove: string, urlForRemove: string) => {
    // 引数のurlを、今のグループの問題から削除する
    // まずは問題のリストから削除
    setGroupName2Problems({ ...groupName2problems,
      [groupNameForRemove]: groupName2problems[groupNameForRemove].filter((problem, index) => (problem.url !== urlForRemove))});
    // 次に問題の集合から削除
    groupName2setUrls[groupNameForRemove].delete(urlForRemove);
    setGroupName2setUrls(groupName2setUrls);
  }
  
  return (
    OverallStructure(
      <Form pileUpProblem={pileUpProblem} />,
      <ProblemCards groupName={currentGroupName} problems={groupName2problems[currentGroupName]} handleRemove={removeProblem} />
    )
  );
}