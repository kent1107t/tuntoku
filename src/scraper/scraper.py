from operator import mod
from time import sleep
import json
from turtle import update
from urllib import request
from urllib.parse import urljoin
from bs4 import BeautifulSoup

fp_url_of_all_contest = 'url_of_all_contest.json'
fp_url_of_all_problem = 'url_of_all_problem.json'
fp_title_and_statement_of_all_problem = 'title_and_statement_of_all_problem.json'

root_url = 'https://atcoder.jp'
crawl_delay = 1

def get_title_and_problem_statement_from_problem_url(problem_url):
    ''' 個別の問題のページから、その問題のタイトルと問題文を辞書にして返す '''
    info = {}
    soup = BeautifulSoup(request.urlopen(problem_url), 'html.parser')
    # タイトル
    info['title'] = soup.find('title').text
    # 問題文（一個目のh3と並んで入ってる）
    try:
        problem_statement = soup.find('h3', text='問題文').parent.get_text(strip=True)
        problem_statement = problem_statement[3:]  # 最初に"問題文"の三文字が入ってるのでそれを除く
    except:  problem_statement = ''  # AHC とかだと問題分が空でこうなることがある
    info['problemStatement'] = problem_statement
    return info

def get_problem_urls_from_contest_url(contest_url):
    ''' 個別の問題のURLをリストで返す (対象のコンテストのURLは引数でもらったもの) '''
    html = request.urlopen(f'{contest_url}/tasks')
    table_body_elem = BeautifulSoup(html, 'html.parser').find('table').find('tbody')
    return [f"{root_url}{tr_elem.find('a').get('href')}" for tr_elem in table_body_elem.find_all('tr')]

def get_all_contest_urls():
    ''' 過去コンテスト一覧のページを見ていって、全コンテストのURLをリストで返す '''
    base_url_show_past_contest = f'{root_url}/contests/archive?page='
    page_count = 1
    all_contest_urls = []
    while page_count <= 60 * 3:
        print(f'page = {page_count}  in get_all_contest_urls')
        url_show_past_contest = f'{base_url_show_past_contest}{page_count}'
        html = request.urlopen(url_show_past_contest)
        # コンテスト一覧が載ってるテーブル要素（想定は一つだけ）
        table_elems = BeautifulSoup(html, 'html.parser').find_all('table')
        if len(table_elems) == 0:  break  # なければ終了
        # コンテストの左にあるカレンダー？のリンクもヒットするのでフィルターかける（そのままだと相対パスになってるのでついでに絶対パスにする）
        contest_urls = [urljoin(root_url, a_elem.get('href')) for a_elem in table_elems[0].find_all('a') if 'contest' in a_elem.get('href')]
        all_contest_urls.extend(contest_urls)
        page_count += 1
        sleep(crawl_delay)
    return all_contest_urls


def get_all_problem_urls():
    ''' 全問題の(全コンテストの)URLをリストで返す '''
    # 過去コンテストの全ページについてまわって、全問題のURLを取得
    print('start collecting  all contest urls ...')
    all_contest_urls = get_all_contest_urls()
    print('done')
    # 全コンテストのURLについてまわって、全問題のURLを取得
    print('start collecting  all problem urls ...')
    all_problem_urls = []
    for i, contest_url in enumerate(all_contest_urls):
        print(f'    {i} / {len(all_contest_urls)}      contest url : {contest_url}')
        all_problem_urls.extend(get_problem_urls_from_contest_url(contest_url))
        sleep(crawl_delay)
    # with open(fp_url_of_all_problem, mode='w') as f:  json.dump(all_problem_urls, f, ensure_ascii=False)
    print('done')
    return all_problem_urls

def get_all_problem_url2title_and_problem_statement(all_problem_urls):
    ''' 全コンテストの全問題それぞれに関して、URLをキーに、値をタイトルと問題文の辞書とした辞書を返す '''
    # 全問題のページについて回って、それぞれのタイトル・問題文を取得
    print('start collectiong   problem title and statement  about  all problem url')
    info = {}
    for i, problem_url in enumerate(all_problem_urls):
        print(f'    {i} / {len(all_problem_urls)}      problem url : {problem_url}')
        info[problem_url] = get_title_and_problem_statement_from_problem_url(problem_url)
        sleep(crawl_delay)
    #print(info)
    #with open(fp_title_and_statement_of_all_problem, mode='w') as f:  json.dump(info, f, ensure_ascii=False)
    print('done')
    return info
    # 全URLをキーとして、そのタイトルと問題文の辞書を値とした辞書を取得
    problem_url2info = {problem_url: get_title_and_problem_statement_from_problem_url(problem_url) for problem_url in problem_urls}
    return problem_url2info

def update_json_files(ignore_urls_exists_as_key=True):
    '''
    全問題に関して、新しいものがあればデータとして追加する 
    ignore_urls_exists_as_key : コンテストページのURL、もしくは個別の問題のページのURLが保存されてるオブジェクトにキーとして存在する場合に更新をしないかどうか
    '''
    # 今のコンテストのURLのファイルを読み込んで、リストから集合を作る
    with open(fp_url_of_all_contest, mode='r') as f:  url_of_all_contest = set(json.load(f))
    # 今の、各問題の情報のファイルを読み込む
    with open(fp_title_and_statement_of_all_problem, mode='r') as f: title_and_statement_of_all_problem = json.load(f)
    # 全コンテストのURLについてまわる
    current_url_of_all_contest = get_all_contest_urls()
    for i, url_of_contest in enumerate(current_url_of_all_contest, 1):
        # すでにファイル内に存在してるURLの場合、無視するように引数で指定されてれば、スキップする
        if ignore_urls_exists_as_key and url_of_contest in url_of_all_contest:  continue;
        print(f'{i} / {len(current_url_of_all_contest)}      url_of_contest : {url_of_contest}')
        # とりあえず今回のも加えておく
        url_of_all_contest.add(url_of_contest)
        sleep(crawl_delay)
        # 全問題（コンテスト内の）のURLについてまわる
        current_url_of_problems = get_problem_urls_from_contest_url(url_of_contest)
        for j, url_of_problem in enumerate(current_url_of_problems, 1):
            # すでにファイル内に存在しててかつ、無視するよう引数で指定されてれば、スキップする
            if ignore_urls_exists_as_key and url_of_problem in title_and_statement_of_all_problem:  continue
            print(f'    {j} / {len(current_url_of_problems)}      url_of_problem : {url_of_problem}')
            title_and_statement_of_all_problem[url_of_problem] = get_title_and_problem_statement_from_problem_url(url_of_problem)
            sleep(crawl_delay)
    # 全コンテストのURLを、集合のままだと保存できないのでリストに変換して保存
    with open(fp_url_of_all_contest, mode='w') as f:
        json.dump(list(url_of_all_contest), f, ensure_ascii=False, indent=2)
    with open(fp_title_and_statement_of_all_problem, mode='w') as f:
        json.dump(title_and_statement_of_all_problem, f, ensure_ascii=False, indent=2)
    return

def main():
    update_json_files()

if __name__ == '__main__':
    main()
