# 顧客管理ダッシュボード

このプロジェクトは、ReactとViteを使用して構築された顧客管理ダッシュボードです。

## セットアップ手順

1. リポジトリをクローンします。
   ```
   git clone git@github.com:weichengliao220/customer-dashboard.git
   cd customer-dashboard
   ```
2. 依存関係をインストールします。
   ```
   npm install
   ```
3. 開発サーバーを起動します。
   ```
   npm run dev
   ```
4. ブラウザでローカルホストを開きます。
   ```
   http://localhost:5173/
   ```

## 使用した技術

- React
- Vite
- React Router
- Material-UI
- Faker.js

## 実装した機能の説明

- ログイン機能: ユーザーIDとパスワードを入力してログインします。ログインに成功すると、顧客リストページにリダイレクトされます。
  - バリデーション: ユーザーIDとパスワードの入力が必須であることを確認します。
- ダッシュボード: 顧客リストを表示するダッシュボードページがあります。
- 顧客リスト: 顧客のリストを表示し、検索、並び替え、追加、削除ができます。
  - 検索: 顧客名で検索できます。
  - 並び替え: 登録日や名前で並び替えができます。
  - 追加: 新しい顧客を追加できます。
    - バリデーション: 顧客名やその他の必須フィールドの入力が必須であることを確認します。
  - 削除: 顧客を削除できます。

## 動作確認方法

1. ログインページでユーザーIDとパスワードを入力してログインします。
2. 顧客リストページで顧客を検索、並び替え、追加、削除します。
3. ログアウトボタンをクリックしてログアウトします。

## ディレクトリ構造

```
.
├── .gitignore
├──
├──
├──
├──
├──
├──
├──
├── public/
│   └── vite.svg
└── src/
    ├──
    ├──
    ├──
    ├──
    ├── assets/
    │   └── react.svg
    ├── components/
    │   ├──
    │   ├──
    │   └──
    └── pages/
        ├──
        └──
```
