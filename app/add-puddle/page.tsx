import Link from 'next/link';
import AddPuddleForm from './AddPuddleForm';
import styles from './page.module.css';

export const metadata = {
  title: '水たまりを追加 | AquaStep',
  description: '水たまりの写真や深さ、大きさを登録します'
};

export default function AddPuddlePage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← マップへ戻る
          </Link>
          <p className={styles.eyebrow}>NEW PUDDLE REPORT</p>
          <h1>水たまりを追加</h1>
          <p className={styles.intro}>
            現地の写真と状態を登録すると、AquaStepのデータベースへ送信されます。
          </p>
        </header>

        <AddPuddleForm />
      </div>
    </main>
  );
}
