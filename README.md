# AquaStep Frontend Rough Prototype

水たまりを地図上に表示し、クリックすると靴との比較・浸水リスク・スリップリスクなどを表示する、フロントだけの仮ラフです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 今回入っているもの

- Next.js App Router
- React Leaflet 地図UI
- 仮データによる水たまりスポット表示
- 水たまり詳細の下部シート
- 靴との比較ビジュアル
- リスクバッジ
- ADD用の仮フォーム画面
- SPOT / NAVI / ADD の下部ナビ

## 次にGAS接続するとき

`components/mockPuddles.ts` を廃止して、geojsonサーバーとのAPI連携に差し替える想定です。

