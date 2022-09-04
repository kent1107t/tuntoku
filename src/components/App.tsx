import { Component, useState } from 'react';
import * as React from 'react';
import OverallStructure from './OverallStructure';
import Form from './Form';
import {Problem, ProblemCards} from './ProblemCards';
import { clear, group } from 'console';
import {initialGroupName, allGroupName, solvedGroupName,
        GroupName2problems, GroupName2setUrls, 
        initialGroupName2Problems, initialGroupName2setUrls
        } from '../save/TypesAndInitialData';
import {KEYS, setLocalStrage, getLocalStorage, removeLocalStorage, clearLocalStorage} from '../save/LocalStorage';


// TODO: AllGroup で削除をしたときにもとの属するグループでも消すかどうか


export default function App() {
  const [currentGroupName, setCurrentGroupName] = useState<string>(initialGroupName);
  // グループ名をキーとして、そのグループの問題の問題リストを値とした辞書
  const [groupName2problems, setGroupName2Problems] = useState<GroupName2problems>(initialGroupName2Problems);
  // グループ名をキーとして、そのグループの問題の問題の集合を値とした辞書 (ProblemCardでkeyにURLを使ってるので、かぶらないかを確認するのに使ってる)
  const [groupName2setUrls, setGroupName2setUrls] = useState<GroupName2setUrls>(initialGroupName2setUrls);

  console.log(groupName2problems);

  React.useEffect(() => {
    // ページをロードした最初に一度だけ呼ばれる ローカルストレージに保存されてる問題を読み込む
    //clearLocalStorage();
    setCurrentGroupName(getLocalStorage(KEYS.CURRENTGROUPNAME));
    setGroupName2Problems(getLocalStorage(KEYS.GROUPNAME2PROBLEMS));
    setGroupName2setUrls(getLocalStorage(KEYS.GROUPNAME2SETURLS));
  }, []);
  
  function saveStates({newGroupName2problems = groupName2problems,
                       newGroupName2setUrls  = groupName2setUrls,
                       newCurrentGroupName = currentGroupName
                      }) {
    /* 新しい状態をstateとローカルストレージに保存する */
    setGroupName2Problems(newGroupName2problems);
    setGroupName2setUrls(newGroupName2setUrls);
    setCurrentGroupName(newCurrentGroupName);
    setLocalStrage(KEYS.GROUPNAME2PROBLEMS, newGroupName2problems);
    setLocalStrage(KEYS.GROUPNAME2SETURLS, newGroupName2setUrls);
    setLocalStrage(KEYS.CURRENTGROUPNAME, newCurrentGroupName);
  }

  
  function checkAndAlertIfUrlExists(url: string, groupName: string) : boolean {
    if (groupName2setUrls[groupName].has(url)) {
      alert('入力されたURLはすでに存在しています!');
      return true;
    }
    return false;
  }

  const pileUpProblem = (urlForPiledUp: string, groupNameForPileUp: string = currentGroupName) => {   
    /* もらったグループに、もらったurlを追加する */
    //  Form の submit 関数が走るときに、その入力値を引数としてこの関数が呼ばれるようになってる
    // すでに追加してないか確認（今は戻るようにしてるけど、あとで先頭に追加し直すようにするかも）
    if (checkAndAlertIfUrlExists(urlForPiledUp, groupNameForPileUp))  return;
    // 今のグループと全体グループの問題の集合に、今回の問題を追加する
    groupName2setUrls[groupNameForPileUp].add(urlForPiledUp);
    groupName2setUrls[allGroupName].add(urlForPiledUp);
    // イテレータの機能をオンにする必要があったので、問題の集合は変更を検知してrenderしなおす必要がないから上のようにそのまま追加することにした
    // まず、今回追加する単体のProblemを作る
    const problemForPiledUp: Problem = {url: urlForPiledUp};
    // 今のグループの問題のリストに、今回の問題を追加する
    // 今あるオブジェクトを展開し、↓でcurrentGroupNameの部分だけ新しい値をセット(キー名の部分を[]で囲まないと変数名がそのままキーになるので注意)
    // セットする新しい値も、今ある配列を展開して、それに追加する形で今回の問題を後ろにつける
    saveStates({newGroupName2problems: { ...groupName2problems,
                                        [groupNameForPileUp]: [ problemForPiledUp, ...groupName2problems[groupNameForPileUp] ],
                                        [allGroupName]      : [ problemForPiledUp, ...groupName2problems[allGroupName]]
                                       },
                newGroupName2setUrls:  groupName2setUrls});
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
    // urlの集合に関して、もとのグループと全体の集合から消去し、解決済みのグループに追加し、更新する
    groupName2setUrls[groupNameForSolve].delete(urlForSolve);
    groupName2setUrls[allGroupName].delete(urlForSolve);
    groupName2setUrls[solvedGroupName].add(urlForSolve);
    // 問題のリストに関して、それぞれを消去・追加し更新する
    const problemForSolve: Problem = {url: urlForSolve};
    saveStates({newGroupName2problems: { ...groupName2problems, 
                                         [groupNameForSolve] : groupName2problems[groupNameForSolve].filter((problem, index) => (problem.url !== urlForSolve)),
                                         [allGroupName]      :      groupName2problems[allGroupName].filter((problem, index) => (problem.url !== urlForSolve)),
                                         [solvedGroupName]   : [ problemForSolve, ...groupName2problems[solvedGroupName] ]
                                        },
                newGroupName2setUrls:  groupName2setUrls});
  }

  const laterProblem = (urlForLater: string, groupNameForLater: string) => {
    /* 指定したurlを、そのグループ内での末尾に移動 */
    const problemForLater: Problem = {url: urlForLater};
    saveStates({newGroupName2problems: { ...groupName2problems,
                                         [groupNameForLater]: [ ...groupName2problems[groupNameForLater].filter((problem, _) => (problem.url !== urlForLater)), problemForLater ]}});
  }

  const deleteProblem = (urlForDelete: string, groupNameForDelete: string) => {
    /* 引数のurlを、引数のグループの問題から削除する */
    // solvedグループでこの関数が呼ばれた時、allGroupには入ってない可能性があるけど、無い要素をdeleteしようとしてもエラーにはならないみたいなので確認はしない今の所
    groupName2setUrls[groupNameForDelete].delete(urlForDelete);
    groupName2setUrls[allGroupName].delete(urlForDelete);
    saveStates({newGroupName2problems: { ...groupName2problems,
                                         [groupNameForDelete]: groupName2problems[groupNameForDelete].filter((problem, index) => (problem.url !== urlForDelete)),
                                               [allGroupName]: groupName2problems[allGroupName].filter((problem, index) => (problem.url !== urlForDelete))},
                newGroupName2setUrls: groupName2setUrls});
  }
  
  return (
    OverallStructure(
      <Form pileUpProblem={pileUpProblem} />,
      <ProblemCards
        groupName={currentGroupName}
        problems={groupName2problems[currentGroupName]}
        handleSolve={solveProblem}
        handleLater={laterProblem}
        handleDelete={deleteProblem}
      />
    )
  );
}