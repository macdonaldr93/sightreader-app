import styles from './NoteRenderer.module.css';

export function NoteRendererSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.skeleton} />
    </div>
  );
}
